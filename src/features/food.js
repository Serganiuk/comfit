// Екран «Food»: денний список їжі, макроси, форма додавання + автопошук
// (локальна база миттєво + OpenFoodFacts як мережевий фолбек).
import { D, saveD } from '../state.js';
import { val, esc, dayStr } from '../ui.js';
import { t } from '../i18n.js';
import { FOODS } from '../data/foods.js';

export const MEAL_LBL = { breakfast: 'mB', lunch: 'mL', dinner: 'mD', snack: 'mS', extra: 'mE' };

let FOOD_DAY = 0;
let acTimer = null, _searchSeq = 0;
let _foodBase = null; // per-100g значення обраного продукту, щоб масштабувати під кількість

export function setDay(off, btn) {
  FOOD_DAY = off;
  document.querySelectorAll('#food-dates button').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  render();
}

export function add() {
  const name = val('f-name').trim();
  if (!name) { flashName(); return; }
  const d = D();
  d.food.push({
    id: Date.now(), date: dayStr(FOOD_DAY), meal: val('f-meal'), name,
    qty: +val('f-qty') || 0, kcal: +val('f-kcal') || 0, prot: +val('f-prot') || 0,
    fat: +val('f-fat') || 0, carb: +val('f-carb') || 0, note: val('f-note')
  });
  saveD(d);
  _foodBase = null;
  ['f-name', 'f-qty', 'f-kcal', 'f-prot', 'f-fat', 'f-carb', 'f-note'].forEach(i => { document.getElementById(i).value = ''; });
  render();
}

export function del(id) {
  if (!confirm(t('deleteQ'))) return;
  const d = D();
  d.food = d.food.filter(f => f.id !== id);
  saveD(d);
  render();
}

export function render() {
  const items = D().food.filter(f => f.date === dayStr(FOOD_DAY));
  const g = D().goals, tot = { kcal: 0, prot: 0, fat: 0, carb: 0 };
  items.forEach(f => { tot.kcal += f.kcal; tot.prot += f.prot; tot.fat += f.fat; tot.carb += f.carb; });
  const macros = [
    { l: t('kcal'), v: tot.kcal, goal: g.kcal, u: '', c: 'var(--coral)' },
    { l: t('prot'), v: tot.prot, goal: g.prot, u: 'g', c: 'var(--amber)' },
    { l: t('fat'), v: tot.fat, goal: g.fat, u: 'g', c: 'var(--orange)' },
    { l: t('carb'), v: tot.carb, goal: g.carb, u: 'g', c: 'var(--green)' }
  ];
  document.getElementById('food-macros').innerHTML = macros.map(m => {
    const pct = Math.min(m.v / m.goal * 100, 100);
    return '<div class="statc" style="--accent:' + m.c + '"><div class="sc-label">' + m.l + '</div>' +
      '<div class="sc-val">' + (+m.v.toFixed(1)) + '<small> ' + m.u + '</small></div>' +
      '<div class="sc-goal">/ ' + m.goal + '</div>' +
      '<div class="bar"><i style="width:' + pct + '%;background:' + m.c + '"></i></div></div>';
  }).join('');
  const body = document.getElementById('food-body');
  if (!items.length) { body.innerHTML = '<tr><td colspan="8"><div class="empty"><div class="e-ico">🍽</div><p>' + t('noFood') + '</p></div></td></tr>'; return; }
  body.innerHTML = items.map(f =>
    '<tr><td><span class="pill ' + f.meal + '">' + t(MEAL_LBL[f.meal] || 'mS') + '</span></td>' +
    '<td><b>' + esc(f.name) + '</b></td><td>' + f.qty + '</td><td><b>' + f.kcal + '</b></td>' +
    '<td>' + f.prot + '</td><td>' + f.fat + '</td><td>' + f.carb + '</td>' +
    '<td><button class="del" data-action="delFood" data-id="' + f.id + '">✕</button></td></tr>'
  ).join('');
}

function flashName() {
  const e = document.getElementById('f-name');
  e.style.borderColor = 'var(--coral)';
  setTimeout(() => { e.style.borderColor = ''; }, 1200);
  e.focus();
}

// ─── Пошук ───────────────────────────────────────────────
// ранжування: збіг на початку назви > на початку слова > будь-де
function localFoodMatches(q) {
  q = q.toLowerCase().trim();
  if (!q) return [];
  const scored = [];
  FOODS.forEach(f => {
    const n = f[0].toLowerCase();
    const idx = n.indexOf(q);
    if (idx < 0) return;
    const score = idx === 0 ? 0 : (n.indexOf(' ' + q) >= 0 ? 1 : 2);
    scored.push({ score, item: { name: f[0], kcal: f[1], prot: f[2], fat: f[3], carb: f[4], src: 'db' } });
  });
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, 8).map(s => s.item);
}

export function search(q) {
  _foodBase = null; // новий пошук → скидаємо попередню базу
  clearTimeout(acTimer);
  const box = document.getElementById('f-ac');
  if (q.trim().length < 1) { box.style.display = 'none'; return; }
  const local = localFoodMatches(q);
  if (q.trim().length < 2) { renderAC(local, false); return; } // для 1 символу — лише локально
  renderAC(local, true); // миттєво локальні + підказка «шукаю онлайн»
  const seq = ++_searchSeq;
  acTimer = setTimeout(() => { fetchFood(q, local, seq); }, 350);
}

function fetchFood(q, local, seq) {
  const url = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(q) +
    '&search_simple=1&action=process&json=1&page_size=40&sort_by=unique_scans_n' +
    '&fields=product_name,product_name_en,generic_name,nutriments,brands';
  fetch(url).then(r => r.json()).then(data => {
    if (seq !== _searchSeq) return; // новіший пошук уже стартував — ігноруємо стале
    const prods = (data && data.products) || [];
    const seen = {};
    local.forEach(l => { seen[l.name.toLowerCase()] = 1; });
    const online = [];
    prods.forEach(p => {
      const n = p.nutriments || {};
      let kcal = n['energy-kcal_100g'];
      if (kcal == null && n['energy_100g'] != null) kcal = n['energy_100g'] / 4.184; // kJ→kcal
      if (kcal == null || kcal <= 0) return;
      const name = (p.product_name || p.product_name_en || p.generic_name || '').trim();
      if (!name || name.length > 60) return;
      const full = name + (p.brands ? ' (' + p.brands.split(',')[0].trim() + ')' : '');
      const key = full.toLowerCase();
      if (seen[key]) return; seen[key] = 1;
      online.push({
        name: full, kcal: Math.round(kcal),
        prot: +(n.proteins_100g || 0).toFixed(1), fat: +(n.fat_100g || 0).toFixed(1),
        carb: +(n.carbohydrates_100g || 0).toFixed(1), src: 'web'
      });
    });
    renderAC(local.concat(online.slice(0, 12)), false);
  }).catch(() => {
    if (seq !== _searchSeq) return;
    renderAC(local, false); // лишаємо те, що є локально
  });
}

function renderAC(items, loading) {
  const box = document.getElementById('f-ac');
  box._data = items;
  let html = items.map((it, i) => {
    const badge = it.src === 'db'
      ? '<em style="font-style:normal;color:var(--green);font-size:10px;margin-left:6px">• DB</em>'
      : '<em style="font-style:normal;color:var(--teal);font-size:10px;margin-left:6px">• web</em>';
    return '<div class="ac-item" data-action="pickFood" data-i="' + i + '"><b>' + esc(it.name) + badge + '</b>' +
      '<span>' + it.kcal + ' kcal · P ' + it.prot + ' · F ' + it.fat + ' · C ' + it.carb + ' / 100g</span></div>';
  }).join('');
  if (loading) html += '<div class="ac-loading">🔍 ' + t('searchingWeb') + '</div>';
  else if (!items.length) html = '<div class="ac-loading">' + t('noFoodFound') + '</div>';
  box.innerHTML = html;
  box.style.display = 'block';
}

export function pick(i) {
  const it = document.getElementById('f-ac')._data[i];
  document.getElementById('f-name').value = it.name;
  _foodBase = { kcal: it.kcal, prot: it.prot, fat: it.fat, carb: it.carb };
  const qtyEl = document.getElementById('f-qty');
  if (!(+qtyEl.value > 0)) qtyEl.value = 100;
  document.getElementById('f-ac').style.display = 'none';
  recalc();
}

// масштабуємо ккал/макроси з бази per-100g за введеною кількістю
export function recalc() {
  if (!_foodBase) return;
  let qty = +val('f-qty');
  if (!(qty > 0)) qty = 100;
  const k = qty / 100;
  document.getElementById('f-kcal').value = Math.round(_foodBase.kcal * k);
  document.getElementById('f-prot').value = +(_foodBase.prot * k).toFixed(1);
  document.getElementById('f-fat').value = +(_foodBase.fat * k).toFixed(1);
  document.getElementById('f-carb').value = +(_foodBase.carb * k).toFixed(1);
}

export function init() {
  document.getElementById('f-name').addEventListener('input', e => search(e.target.value));
  document.getElementById('f-qty').addEventListener('input', recalc);
}
