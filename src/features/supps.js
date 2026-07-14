// Екран «Supplements»: вітаміни / спортивне харчування + автопошук по локальному списку.
import { D, saveD } from '../state.js';
import { val, esc, dayStr, flash } from '../ui.js';
import { t } from '../i18n.js';
import { SUPPS } from '../data/supps.js';

const SV_LBL = { vitamin: 'svV', protein: 'svP', mineral: 'svM', amino: 'svA', other: 'svO' };
const SW_LBL = { morning: 'swM', noon: 'swN', evening: 'swE', bed: 'swB', pre: 'swPre', post: 'swPost' };

let suppTimer = null;

export function add() {
  const name = val('s-name').trim();
  if (!name) { flash('s-name'); return; }
  const d = D();
  d.supps.push({ id: Date.now(), date: dayStr(0), type: val('s-type'), name, dose: val('s-dose'), time: val('s-time'), note: val('s-note') });
  saveD(d);
  ['s-name', 's-dose', 's-note'].forEach(i => { document.getElementById(i).value = ''; });
  render();
}

export function del(id) {
  if (!confirm(t('deleteQ'))) return;
  const d = D();
  d.supps = d.supps.filter(s => s.id !== id);
  saveD(d);
  render();
}

export function render() {
  const items = D().supps || [];
  const body = document.getElementById('supp-body');
  if (!items.length) { body.innerHTML = '<tr><td colspan="5"><div class="empty"><div class="e-ico">💊</div><p>' + t('noSupp') + '</p></div></td></tr>'; return; }
  body.innerHTML = items.map(s =>
    '<tr><td><span class="pill ' + (s.type === 'amino' ? 'amino' : s.type) + '">' + t(SV_LBL[s.type] || 'svO') + '</span></td>' +
    '<td><b>' + esc(s.name) + '</b></td><td>' + esc(s.dose || '') + '</td><td>' + t(SW_LBL[s.time] || 'swM') + '</td>' +
    '<td><button class="del" data-action="delSupp" data-id="' + s.id + '">✕</button></td></tr>'
  ).join('');
}

export function search(q) {
  clearTimeout(suppTimer);
  const box = document.getElementById('s-ac');
  if (q.length < 2) { box.style.display = 'none'; return; }
  const local = SUPPS.filter(s => s.toLowerCase().indexOf(q.toLowerCase()) >= 0).slice(0, 7);
  if (local.length) {
    box.innerHTML = local.map(s => '<div class="ac-item" data-action="pickSupp" data-name="' + esc(s) + '"><b>' + esc(s) + '</b></div>').join('');
    box.style.display = 'block';
  } else { box.style.display = 'none'; }
}

export function pick(name) {
  document.getElementById('s-name').value = name;
  document.getElementById('s-ac').style.display = 'none';
}

export function init() {
  document.getElementById('s-name').addEventListener('input', e => search(e.target.value));
}
