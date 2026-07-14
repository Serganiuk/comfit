// Дрібні DOM/утиліти, спільні для всіх фіч.
import { t } from './i18n.js';

export function val(id) { return document.getElementById(id).value; }

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function pad(n) { return n < 10 ? '0' + n : '' + n; }

// Дата з відступом у днях від сьогодні → 'YYYY-MM-DD'.
export function dayStr(off) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d.toISOString().slice(0, 10);
}
export function fmtDate(s) { const p = s.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }

// Заповнення <select> зі збереженням поточного значення.
export function fillSel(id, opts) {
  const el = document.getElementById(id);
  if (!el) return;
  const cur = el.value;
  el.innerHTML = opts.map(o => '<option value="' + o.v + '">' + o.l + '</option>').join('');
  if (cur) el.value = cur;
}

// Коротка червона підсвітка порожнього обов'язкового поля.
export function flash(id) {
  const e = document.getElementById(id);
  e.style.borderColor = 'var(--coral)';
  setTimeout(() => { e.style.borderColor = ''; }, 1200);
  e.focus();
}

// «Saved ✓» під формою на 2 секунди.
export function msg(id) {
  const e = document.getElementById(id);
  e.textContent = t('saved');
  setTimeout(() => { e.textContent = ''; }, 2000);
}
