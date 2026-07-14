// Логін / реєстрація. Дуже проста «автентифікація» для навчального проєкту:
// паролі зберігаються як btoa (base64) — це НЕ безпека, лише розділення профілів.
import { getUsers, setUsers, setCurrentUser } from '../state.js';
import { t } from '../i18n.js';
import { val } from '../ui.js';

let authMode = 'login';
export function getMode() { return authMode; }

export function peek(id, btn) {
  const i = document.getElementById(id);
  i.type = i.type === 'password' ? 'text' : 'password';
  btn.textContent = i.type === 'password' ? '👁' : '🙈';
}

export function authTab(m) {
  authMode = m;
  document.getElementById('tab-login').classList.toggle('on', m === 'login');
  document.getElementById('tab-reg').classList.toggle('on', m === 'register');
  document.getElementById('conf-field').style.display = m === 'register' ? '' : 'none';
  document.getElementById('au-submit').textContent = t(m === 'login' ? 'loginBtn' : 'regBtn');
  document.getElementById('au-err').textContent = '';
}

export function submit() {
  const u = val('au-user').trim().toLowerCase(), p = val('au-pass'), c = val('au-conf');
  const err = document.getElementById('au-err');
  if (!u || !p || (authMode === 'register' && !c)) { err.textContent = t('eEmpty'); return; }
  const us = getUsers();
  if (authMode === 'register') {
    if (p !== c) { err.textContent = t('eMatch'); return; }
    if (us[u]) { err.textContent = t('eTaken'); return; }
    us[u] = btoa(p); setUsers(us); doLogin(u);
  } else {
    if (!us[u]) { err.textContent = t('eNotFound'); return; }
    if (us[u] !== btoa(p)) { err.textContent = t('eWrong'); return; }
    doLogin(u);
  }
}

export function doLogin(u) {
  setCurrentUser(u);
  localStorage.setItem('cf_sess', u);
  document.getElementById('auth').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('langFloat').style.display = 'none';
  document.getElementById('tb-user').textContent = u;
  document.dispatchEvent(new CustomEvent('cf:login', { detail: u }));
}

export function logout() {
  setCurrentUser(null);
  localStorage.removeItem('cf_sess');
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth').style.display = 'flex';
  document.getElementById('langFloat').style.display = 'flex';
  ['au-user', 'au-pass', 'au-conf'].forEach(i => { document.getElementById(i).value = ''; });
  authTab('login');
}

export function init() {
  ['au-pass', 'au-conf'].forEach(id =>
    document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
}
