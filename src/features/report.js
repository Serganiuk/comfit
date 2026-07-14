// Екран «Report»: прогрес ваги, тижнева зведена, стрічка історії з фільтром.
import { D } from '../state.js';
import { esc, fmtDate, dayStr } from '../ui.js';
import { t } from '../i18n.js';
import { MEAL_LBL } from './food.js';

let REPORT_FILTER = 'all';

export function setFilter(f, btn) {
  REPORT_FILTER = f;
  document.querySelectorAll('#rt-seg button').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  render();
}

export function render() {
  const d = D(), p = d.profile || {};
  const last7 = [];
  for (let i = 6; i >= 0; i--) last7.push(dayStr(-i));
  let kc = 0, sess = 0, min = 0;
  last7.forEach(date => {
    kc += d.food.filter(f => f.date === date).reduce((s, f) => s + f.kcal, 0);
    const wi = d.workouts.filter(w => w.date === date);
    sess += wi.length; min += wi.reduce((s, w) => s + w.dur, 0);
  });
  // прогрес ваги
  const startW = parseFloat(p.startWeight) || parseFloat(p.weight) || 0, curW = parseFloat(p.weight) || 0;
  const goalW = p.goal === 'lose' ? Math.max(curW - 5, 40) : p.goal === 'gain' ? curW + 5 : curW;
  const pct = startW && curW && startW !== goalW ? Math.min(Math.abs(curW - startW) / Math.abs(goalW - startW) * 100, 100) : 0;
  let ph = '';
  if (p.weight) {
    ph = '<div class="prog-card"><h3>📈 ' + t('progress') + '</h3><div class="prog-stats">' +
      '<div class="prog-box" style="--accent:var(--muted)"><div class="pb-label">' + t('startW') + '</div><div class="pb-val">' + startW + '<small> kg</small></div><div class="pb-sub">' + (p.startDate ? fmtDate(p.startDate) : '—') + '</div></div>' +
      '<div class="prog-box" style="--accent:var(--amber)"><div class="pb-label">' + t('currentW') + '</div><div class="pb-val">' + curW + '<small> kg</small></div><div class="pb-sub">now</div></div>' +
      '<div class="prog-box" style="--accent:var(--green)"><div class="pb-label">' + t('goalW') + '</div><div class="pb-val">' + (+goalW.toFixed(1)) + '<small> kg</small></div><div class="pb-sub">target</div></div>' +
      '</div><div class="prog-track"><div class="prog-fill" style="width:' + pct.toFixed(0) + '%"></div></div>' +
      '<div class="prog-pct">' + pct.toFixed(0) + '% ' + t('towardGoal') + '</div></div>';
  }
  document.getElementById('r-progress').innerHTML = ph;
  document.getElementById('r-week').innerHTML =
    '<div class="statc" style="--accent:var(--coral)"><div class="sc-label">' + t('wkKcal') + '</div><div class="sc-val">' + kc + '</div></div>' +
    '<div class="statc" style="--accent:var(--amber)"><div class="sc-label">' + t('wkAvg') + '</div><div class="sc-val">' + Math.round(kc / 7) + '</div></div>' +
    '<div class="statc" style="--accent:var(--green)"><div class="sc-label">' + t('wkSess') + '</div><div class="sc-val">' + sess + '</div></div>' +
    '<div class="statc" style="--accent:var(--orange)"><div class="sc-label">' + t('wkMin') + '</div><div class="sc-val">' + min + '</div></div>';
  // стрічка
  const all = [], pi = d.planItems || [];
  if (REPORT_FILTER === 'plan') {
    pi.filter(x => x.completed).forEach(x => all.push({ type: 'plan', date: x.completedAt ? x.completedAt.slice(0, 10) : x.date, name: x.title, detail: 'Plan completed ✓', id: x.id }));
  } else {
    if (REPORT_FILTER !== 'workout') d.food.forEach(f => all.push({ type: 'food', date: f.date, name: f.name, detail: f.kcal + ' kcal · ' + t(MEAL_LBL[f.meal] || 'mS'), id: f.id }));
    if (REPORT_FILTER !== 'food') d.workouts.forEach(w => all.push({ type: 'workout', date: w.date, name: w.name, detail: w.dur + ' min · ' + w.kcal + ' kcal', id: w.id }));
    if (REPORT_FILTER === 'all') pi.filter(x => x.completed).forEach(x => all.push({ type: 'plan', date: x.completedAt ? x.completedAt.slice(0, 10) : x.date, name: x.title, detail: 'Plan ✓', id: x.id }));
  }
  all.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const tl = document.getElementById('r-timeline');
  if (!all.length) { tl.innerHTML = '<div class="empty"><div class="e-ico">📊</div><p>' + t('noHistory') + '</p></div>'; return; }
  tl.innerHTML = all.slice(0, 60).map(x => {
    const ico = { food: '🍽', workout: '💪', plan: '✅' }[x.type] || '📌';
    return '<div class="tl-item' + (x.type === 'plan' ? ' done' : '') + '"><div class="tl-ico">' + ico + '</div>' +
      '<div class="tl-body"><h4>' + esc(x.name) + '</h4><p>' + esc(x.detail) + '</p><div class="tl-date">' + fmtDate(x.date) + '</div></div></div>';
  }).join('');
}
