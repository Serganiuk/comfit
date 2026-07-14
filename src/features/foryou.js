// Екран «For You»: калькулятор калорій + персональні поради з профілю та здоров'я.
// Числа рахує спільний модуль calc.js (той самий, що й у інших місцях).
import { D, saveD } from '../state.js';
import { val, esc } from '../ui.js';
import { t } from '../i18n.js';
import { targets } from '../calc.js';

let CALC_GENDER = 'male';
let _calcVals = null;

// ─── Калькулятор ──────────────────────────────────────────
export function calcGender(g) {
  CALC_GENDER = g;
  document.getElementById('cg-male').classList.toggle('on', g === 'male');
  document.getElementById('cg-female').classList.toggle('on', g === 'female');
  runCalc();
}

export function calcPrefill() {
  const p = D().profile;
  if (p.gender) calcGender(p.gender);
  if (p.age) document.getElementById('c-age').value = p.age;
  if (p.weight) document.getElementById('c-weight').value = p.weight;
  if (p.height) document.getElementById('c-height').value = p.height;
  if (p.act) document.getElementById('c-act').value = p.act;
  if (p.goal) document.getElementById('c-goal').value = p.goal;
  runCalc();
}

export function runCalc() {
  const a = +val('c-age'), w = +val('c-weight'), h = +val('c-height');
  const el = document.getElementById('calc-result');
  if (!a || !w || !h) { el.innerHTML = '<div class="empty" style="padding:24px"><p>' + t('calcFill') + '</p></div>'; _calcVals = null; return; }
  const r = targets(CALC_GENDER, a, w, h, val('c-act'), val('c-goal'));
  _calcVals = { kcal: r.tk, prot: r.pr, fat: r.fa, carb: r.ca };
  el.innerHTML =
    '<div class="prog-stats" style="margin-top:16px">' +
      '<div class="prog-box" style="--accent:var(--muted)"><div class="pb-label">' + t('calcBmr') + '</div><div class="pb-val">' + r.bmr + '</div><div class="pb-sub">kcal</div></div>' +
      '<div class="prog-box" style="--accent:var(--amber)"><div class="pb-label">' + t('calcMaint') + '</div><div class="pb-val">' + r.tdee + '</div><div class="pb-sub">kcal</div></div>' +
      '<div class="prog-box" style="--accent:var(--coral)"><div class="pb-label">' + t('calcTarget') + '</div><div class="pb-val">' + r.tk + '</div><div class="pb-sub">kcal</div></div>' +
    '</div>' +
    '<div class="stat-row" style="grid-template-columns:repeat(3,1fr);margin-top:12px;margin-bottom:0">' +
      '<div class="statc" style="--accent:var(--amber)"><div class="sc-label">' + t('calcProt') + '</div><div class="sc-val">' + r.pr + '<small> g</small></div></div>' +
      '<div class="statc" style="--accent:var(--orange)"><div class="sc-label">' + t('calcFat') + '</div><div class="sc-val">' + r.fa + '<small> g</small></div></div>' +
      '<div class="statc" style="--accent:var(--green)"><div class="sc-label">' + t('calcCarb') + '</div><div class="sc-val">' + r.ca + '<small> g</small></div></div>' +
    '</div>' +
    '<button class="add-btn amber full" style="margin-top:16px" data-action="applyCalc">' + t('calcApply') + '</button>';
}

// поля калькулятора перераховують результат на льоту (раніше — інлайнові oninput/onchange)
export function init() {
  ['c-age', 'c-weight', 'c-height'].forEach(id => document.getElementById(id).addEventListener('input', runCalc));
  ['c-act', 'c-goal'].forEach(id => document.getElementById(id).addEventListener('change', runCalc));
}

export function applyCalc() {
  if (!_calcVals) return;
  const d = D();
  d.goals = { kcal: _calcVals.kcal, prot: _calcVals.prot, fat: _calcVals.fat, carb: _calcVals.carb };
  saveD(d);
  document.dispatchEvent(new Event('cf:goals-changed'));
  alert(t('goalsUpdated'));
}

// ─── Поради ───────────────────────────────────────────────
export function render() {
  const p = D().profile, h = D().health || {}, el = document.getElementById('fy-content');
  if (!p.age || !p.weight || !p.height) { el.innerHTML = '<div class="rec"><div class="empty"><div class="e-ico">🤖</div><p>' + t('noProfile') + '</p></div></div>'; return; }
  const a = +p.age, w = +p.weight, ht = +p.height;
  const r = targets(p.gender, a, w, ht, p.act, p.goal);
  const bmi = +(w / Math.pow(ht / 100, 2)).toFixed(1);
  const bl = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
  const bodyAdv = {
    ectomorph: '🔥 Fast metabolism — prioritize calories & carbs. Heavy strength 4-5×/week.',
    mesomorph: '⚖️ You respond well to training. Balanced macros, mix strength + cardio.',
    endomorph: '🥗 Slower metabolism — lower carbs, higher protein, regular cardio.',
    lean: '💪 Maintain with strength + moderate cardio.', athletic: '🏆 Keep progressive overload & recovery.',
    average: '📈 Steady, consistent training brings results.',
    overweight: '🚶 Start with walking + a calorie deficit, build habits gradually.',
    underweight: '🍽 Focus on a caloric surplus with quality protein.'
  }[p.body] || '';
  const wrec = {
    lose: ['🏃 Cardio 3-4×/week (40 min)', '💪 Strength 2-3×/week', '🧘 Daily stretching'],
    gain: ['💪 Strength 4-5×/week', '🏃 Light cardio 2×/week', '😴 Prioritize rest & recovery'],
    maintain: ['💪 Strength 3×/week', '🏃 Cardio 2×/week', '🧘 Mobility 2×/week'],
    recomp: ['💪 Strength 4×/week', '🏃 HIIT 2×/week', '🧘 Mobility 1×/week'],
    health: ['🚶 Walk 30+ min daily', '💪 Full body 2-3×/week', '🧘 Yoga or stretching']
  }[p.goal || 'maintain'];
  const frec = {
    lose: ['🥗 Lean protein each meal', '🥦 Half plate vegetables', '🚫 Cut sugar & processed food'],
    gain: ['🍚 Rice, oats, pasta for energy', '🥩 Red meat, eggs, dairy', '🥑 Nuts, avocado, olive oil'],
    maintain: ['⚖️ Balanced protein+carbs+veggies', '🍎 2-3 fruit servings/day', '💧 2-3L water/day'],
    recomp: ['🥩 High protein every meal', '🥦 Veggies + complex carbs', '💧 Stay well hydrated'],
    health: ['🫐 Berries & colorful veg', '🐟 Fatty fish 2×/week', '🥜 Nuts & seeds daily']
  }[p.goal || 'maintain'];
  const lines = arr => arr.map(r2 => '<div class="rec-line"><span class="rl-ico">' + r2.split(' ')[0] + '</span><p>' + r2.substring(r2.indexOf(' ') + 1) + '</p></div>').join('');
  let warn = '';
  if (h.injuries) warn += '<div class="rec-line"><span class="rl-ico">🦴</span><p><b>Injuries:</b> ' + esc(h.injuries) + '</p></div>';
  if (h.exrest) warn += '<div class="rec-line"><span class="rl-ico">⛔</span><p><b>Restrictions:</b> ' + esc(h.exrest) + '</p></div>';
  if (h.foodallergy) warn += '<div class="rec-line"><span class="rl-ico">🚨</span><p><b>Food allergies:</b> ' + esc(h.foodallergy) + '</p></div>';
  if (h.suppallergy) warn += '<div class="rec-line"><span class="rl-ico">💊</span><p><b>Supplement limits:</b> ' + esc(h.suppallergy) + '</p></div>';
  if (h.conditions) warn += '<div class="rec-line"><span class="rl-ico">🩺</span><p><b>Conditions:</b> ' + esc(h.conditions) + '</p></div>';
  el.innerHTML =
    '<div class="rec amber"><h3>' + t('yourStats') + '</h3>' +
      '<div class="rec-line"><span class="rl-ico">⚖️</span><p>BMI: <b>' + bmi + '</b> — ' + bl + '</p></div>' +
      '<div class="rec-line"><span class="rl-ico">🔥</span><p>Daily burn (TDEE): <b>' + r.tdee + ' kcal</b></p></div>' +
      '<div class="rec-line"><span class="rl-ico">🎯</span><p>Target calories: <b>' + r.tk + ' kcal</b></p></div>' +
      (bodyAdv ? '<div class="rec-line"><span class="rl-ico">🏋️</span><p>' + bodyAdv + '</p></div>' : '') + '</div>' +
    '<div class="rec"><h3>' + t('recMacros') + '</h3>' +
      '<div class="rec-line"><span class="rl-ico">🥩</span><p>Protein: <b>' + r.pr + 'g</b></p></div>' +
      '<div class="rec-line"><span class="rl-ico">🧈</span><p>Fat: <b>' + r.fa + 'g</b></p></div>' +
      '<div class="rec-line"><span class="rl-ico">🍚</span><p>Carbs: <b>' + r.ca + 'g</b></p></div>' +
      '<button class="add-btn amber" style="margin-top:6px" data-action="applyRec" data-k="' + r.tk + '" data-p="' + r.pr + '" data-f="' + r.fa + '" data-c="' + r.ca + '">' + t('applyGoals') + '</button></div>' +
    '<div class="rec amber"><h3>' + t('recWo') + '</h3>' + lines(wrec) + '</div>' +
    '<div class="rec"><h3>' + t('recFood') + '</h3>' + lines(frec) + '</div>' +
    (warn ? '<div class="rec amber"><h3>' + t('healthNotes') + '</h3>' + warn + '</div>' : '');
}

export function applyRec(k, p, f, c) {
  const d = D();
  d.goals = { kcal: k, prot: p, fat: f, carb: c };
  saveD(d);
  document.dispatchEvent(new Event('cf:goals-changed'));
  alert(t('goalsUpdated'));
}
