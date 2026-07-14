// Екран «Workout»: денний список тренувань + сумарні хвилини й спалені калорії.
import { D, saveD } from '../state.js';
import { val, esc, dayStr, flash } from '../ui.js';
import { t } from '../i18n.js';

const WO_LBL = { cardio: 'wC', strength: 'wS', flexibility: 'wF', sports: 'wSp', hiit: 'wH', other: 'wO' };
const INT_LBL = { low: 'iL', medium: 'iM', high: 'iH' };

let WO_DAY = 0;

export function setDay(off, btn) {
  WO_DAY = off;
  document.querySelectorAll('#w-dates button').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  render();
}

export function add() {
  const name = val('w-name').trim();
  if (!name) { flash('w-name'); return; }
  const d = D();
  d.workouts.push({
    id: Date.now(), date: dayStr(WO_DAY), type: val('w-type'), name,
    dur: +val('w-dur') || 0, kcal: +val('w-kcal') || 0, intensity: val('w-int'), note: val('w-note')
  });
  saveD(d);
  ['w-name', 'w-dur', 'w-kcal', 'w-note'].forEach(i => { document.getElementById(i).value = ''; });
  render();
}

export function del(id) {
  if (!confirm(t('deleteQ'))) return;
  const d = D();
  d.workouts = d.workouts.filter(w => w.id !== id);
  saveD(d);
  render();
}

export function render() {
  const items = D().workouts.filter(w => w.date === dayStr(WO_DAY));
  const min = items.reduce((s, w) => s + w.dur, 0), kc = items.reduce((s, w) => s + w.kcal, 0);
  document.getElementById('wo-stats').innerHTML =
    '<div class="statc" style="--accent:var(--coral)"><div class="sc-label">' + t('sessions') + '</div><div class="sc-val">' + items.length + '</div></div>' +
    '<div class="statc" style="--accent:var(--amber)"><div class="sc-label">' + t('minutes') + '</div><div class="sc-val">' + min + '</div></div>' +
    '<div class="statc" style="--accent:var(--orange);grid-column:span 2"><div class="sc-label">' + t('burned') + '</div><div class="sc-val">' + kc + '<small> kcal</small></div></div>';
  const body = document.getElementById('wo-body');
  if (!items.length) { body.innerHTML = '<tr><td colspan="6"><div class="empty"><div class="e-ico">💪</div><p>' + t('noWo') + '</p></div></td></tr>'; return; }
  body.innerHTML = items.map(w =>
    '<tr><td><span class="pill ' + w.type + '">' + t(WO_LBL[w.type] || 'wO') + '</span></td>' +
    '<td><b>' + esc(w.name) + '</b></td><td>' + w.dur + '</td><td><b>' + w.kcal + '</b></td>' +
    '<td>' + t(INT_LBL[w.intensity] || 'iM') + '</td>' +
    '<td><button class="del" data-action="delWo" data-id="' + w.id + '">✕</button></td></tr>'
  ).join('');
}
