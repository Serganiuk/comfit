// Екран «Plan»: календар, майбутні плани, модалка додавання, чек-ін «як пройшло».
import { D, saveD } from '../state.js';
import { val, esc, fmtDate, dayStr, pad } from '../ui.js';
import { t, LANG } from '../i18n.js';
import * as report from './report.js';

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};
const DOW = { en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'] };
const ICO = { food: '🍽', workout: '💪', supp: '💊', other: '📌' };

let CAL_Y, CAL_M;

export function setCalToday(now) { CAL_Y = now.getFullYear(); CAL_M = now.getMonth(); }

export function calMove(dir) {
  CAL_M += dir;
  if (CAL_M < 0) { CAL_M = 11; CAL_Y--; }
  if (CAL_M > 11) { CAL_M = 0; CAL_Y++; }
  renderCalendar();
}

export function renderCalendar() {
  document.getElementById('cal-title').textContent = MONTHS[LANG][CAL_M] + ' ' + CAL_Y;
  const items = D().planItems || [], today = dayStr(0);
  let html = DOW[LANG].map(d => '<div class="cal-dow">' + d + '</div>').join('');
  const first = new Date(CAL_Y, CAL_M, 1), startDow = (first.getDay() + 6) % 7;
  const dim = new Date(CAL_Y, CAL_M + 1, 0).getDate(), dimPrev = new Date(CAL_Y, CAL_M, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) html += '<div class="cal-cell out"><span class="cd-num">' + (dimPrev - i) + '</span></div>';
  for (let day = 1; day <= dim; day++) {
    const ds = CAL_Y + '-' + pad(CAL_M + 1) + '-' + pad(day);
    const its = items.filter(p => p.date === ds);
    const cls = 'cal-cell' + (ds === today ? ' today' : '');
    const dots = its.slice(0, 4).map(p => '<span class="cd-dot ' + (p.completed ? 'done' : p.type) + '"></span>').join('');
    html += '<div class="' + cls + '" data-action="openPlan" data-date="' + ds + '"><span class="cd-num">' + day + '</span><div class="cd-dots">' + dots + '</div></div>';
  }
  const total = startDow + dim, rem = (7 - total % 7) % 7;
  for (let j = 1; j <= rem; j++) html += '<div class="cal-cell out"><span class="cd-num">' + j + '</span></div>';
  document.getElementById('cal-grid').innerHTML = html;
}

export function renderUpcoming() {
  const items = D().planItems || [], today = dayStr(0), map = {};
  items.forEach(p => { if (p.date >= today) { (map[p.date] = map[p.date] || []).push(p); } });
  const dates = Object.keys(map).sort().slice(0, 10);
  const el = document.getElementById('plan-upcoming');
  if (!dates.length) { el.innerHTML = '<div class="empty"><div class="e-ico">📅</div><p>' + t('noUpcoming') + '</p></div>'; return; }
  el.innerHTML = dates.map(date => {
    const its = map[date], lbl = date === today ? '📌 ' + t('tday') + ' · ' + fmtDate(date) : fmtDate(date);
    const rows = its.map(p => {
      const done = p.completed;
      return '<div class="plan-item' + (done ? ' done' : '') + '"><div class="pi-name">' + (ICO[p.type] || '📌') + ' ' + esc(p.title) + '</div>' +
        '<div class="pi-right">' + (done ? '<span class="pi-done-badge">' + t('ciDone') + '</span>' : '<button class="pi-do" data-action="completePlan" data-id="' + p.id + '">' + t('ciDone') + '</button>') +
        '<button class="pi-del" data-action="deletePlan" data-id="' + p.id + '">✕</button></div></div>';
    }).join('');
    return '<div class="plan-day"><h4>' + lbl + '</h4>' + rows + '</div>';
  }).join('');
}

export function open(ds) {
  document.getElementById('m-date').value = ds || dayStr(0);
  document.getElementById('m-name').value = '';
  document.getElementById('m-desc').value = '';
  document.getElementById('m-type').value = 'food';
  document.getElementById('modal-title').textContent = ds ? t('planDate') + ' ' + fmtDate(ds) : t('addPlanItem');
  document.getElementById('plan-modal').classList.add('show');
}
export function close() { document.getElementById('plan-modal').classList.remove('show'); }

export function save() {
  const title = val('m-name').trim();
  if (!title) { const e = document.getElementById('m-name'); e.style.borderColor = 'var(--coral)'; setTimeout(() => { e.style.borderColor = ''; }, 1200); e.focus(); return; }
  const d = D();
  if (!d.planItems) d.planItems = [];
  d.planItems.push({ id: Date.now(), date: val('m-date') || dayStr(0), type: val('m-type'), title, desc: val('m-desc'), completed: false, completedAt: null });
  saveD(d); close(); renderCalendar(); renderUpcoming();
}

export function complete(id) {
  const d = D();
  d.planItems.forEach(p => { if (p.id === id) { p.completed = true; p.completedAt = new Date().toISOString(); } });
  saveD(d); renderCalendar(); renderUpcoming(); report.render(); checkCheckin();
}

export function remove(id) {
  if (!confirm(t('deleteQ'))) return;
  const d = D();
  d.planItems = d.planItems.filter(p => p.id !== id);
  saveD(d); renderCalendar(); renderUpcoming();
}

// ─── Чек-ін ───────────────────────────────────────────────
export function checkCheckin() {
  const d = D(), today = dayStr(0), yest = dayStr(-1);
  const pend = (d.planItems || []).filter(p => !p.completed && (p.date === today || p.date === yest));
  const banner = document.getElementById('checkin');
  if (!pend.length) { banner.style.display = 'none'; return; }
  banner.style.display = 'block';
  document.getElementById('ci-list').innerHTML = pend.map(p =>
    '<div class="ci-row"><div class="ci-name">' + (ICO[p.type] || '📌') + ' ' + esc(p.title) + ' <span style="color:var(--dim);font-size:11px">(' + fmtDate(p.date) + ')</span></div>' +
    '<div class="ci-actions"><button class="ci-yes" data-action="completePlan" data-id="' + p.id + '">' + t('ciDone') + '</button>' +
    '<button class="ci-no" data-action="skipCheckin" data-id="' + p.id + '">' + t('ciSkip') + '</button></div></div>'
  ).join('');
}

export function skip(id) {
  const d = D();
  d.planItems = d.planItems.filter(p => p.id !== id);
  saveD(d); checkCheckin(); renderCalendar(); renderUpcoming();
}

export function init() {
  document.getElementById('plan-modal').addEventListener('click', function (e) { if (e.target === this) close(); });
}
