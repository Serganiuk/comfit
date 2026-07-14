// Переклади й перемикання мови. Модуль-лист: залежить лише від даних.
// setLang не рендерить сам — кидає подію 'cf:langchange', яку ловить main.js.
import { TR } from './data/translations.js';

export let LANG = localStorage.getItem('cf_lang') || 'en';

export function t(k) { return (TR[LANG] && TR[LANG][k]) || TR.en[k] || k; }

export function setLang(l) {
  LANG = l;
  localStorage.setItem('cf_lang', l);
  document.dispatchEvent(new CustomEvent('cf:langchange', { detail: l }));
}
