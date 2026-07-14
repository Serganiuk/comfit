// Композиційний корінь: імпортує все, будує реєстр дій, вішає ОДИН делегований
// обробник кліків (замість сотень інлайнових onclick) і зшиває фічі через події.
import './styles/base.css';
import './styles/auth.css';
import './styles/app.css';

import { getUsers, currentUser } from './state.js';
import { LANG, t, setLang } from './i18n.js';
import { buildSelects } from './selects.js';
import { buildFloating } from './features/floating.js';
import * as auth from './features/auth.js';
import * as nav from './features/nav.js';
import * as food from './features/food.js';
import * as workout from './features/workout.js';
import * as supps from './features/supps.js';
import * as report from './features/report.js';
import * as plan from './features/plan.js';
import * as foryou from './features/foryou.js';
import * as settings from './features/settings.js';

// ─── Реєстр дій: data-action="ім'я" → функція(el, event) ──────────────
const ACTIONS = {
  setLang: el => setLang(el.dataset.lang),
  authTab: el => auth.authTab(el.dataset.tab),
  peek: el => auth.peek(el.dataset.target, el),
  authSubmit: () => auth.submit(),
  logout: () => auth.logout(),
  goHome: () => nav.go('food'),
  nav: el => nav.go(el.dataset.page),
  setFoodDay: el => food.setDay(+el.dataset.off, el),
  addFood: () => food.add(),
  pickFood: el => food.pick(+el.dataset.i),
  delFood: el => food.del(+el.dataset.id),
  setWoDay: el => workout.setDay(+el.dataset.off, el),
  addWorkout: () => workout.add(),
  delWo: el => workout.del(+el.dataset.id),
  addSupp: () => supps.add(),
  pickSupp: el => supps.pick(el.dataset.name),
  delSupp: el => supps.del(+el.dataset.id),
  calMove: el => plan.calMove(+el.dataset.dir),
  openPlan: el => plan.open(el.dataset.date || null),
  closePlan: () => plan.close(),
  savePlanItem: () => plan.save(),
  completePlan: el => plan.complete(+el.dataset.id),
  deletePlan: el => plan.remove(+el.dataset.id),
  skipCheckin: el => plan.skip(+el.dataset.id),
  setReport: el => report.setFilter(el.dataset.filter, el),
  calcGender: el => foryou.calcGender(el.dataset.gender),
  applyCalc: () => foryou.applyCalc(),
  applyRec: el => foryou.applyRec(+el.dataset.k, +el.dataset.p, +el.dataset.f, +el.dataset.c),
  setGender: el => settings.setGender(el.dataset.gender),
  saveProfile: () => settings.saveProfile(),
  saveHealth: () => settings.saveHealth(),
  saveGoals: () => settings.saveGoals(),
};

function wireDispatcher() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const fn = ACTIONS[el.dataset.action];
    if (fn) fn(el, e);
  });
  // клік поза автокомплітом — ховаємо всі списки
  document.addEventListener('click', e => {
    if (!e.target.closest('.ac')) document.querySelectorAll('.ac-list').forEach(b => { b.style.display = 'none'; });
  });
}

// ─── Переклади: мапа id елемента → ключ перекладу ─────────────────────
const TR_MAP = {
  tagline: 'tagline',
  'tab-login': 'login', 'tab-reg': 'register', 'lbl-user': 'username', 'lbl-pass': 'password', 'lbl-conf': 'confirmPwd',
  'n-food': 'nFood', 'n-workout': 'nWorkout', 'n-plan': 'nPlan', 'n-report': 'nReport', 'n-supps': 'nSupps', 'n-foryou': 'nForyou', 'n-settings': 'nSettings',
  't-food': 'tFood', 's-food': 'sFood', 't-workout': 'tWorkout', 's-workout': 'sWorkout',
  't-plan': 'tPlan', 's-plan': 'sPlan', 't-report': 'tReport', 's-report': 'sReport',
  't-supps': 'tSupps', 's-supps': 'sSupps', 't-foryou': 'tForyou', 's-foryou': 'sForyou',
  't-settings': 'tSettings', 's-settings': 'sSettings',
  fdy: 'yday', fdt: 'tday', fdtm: 'tmrw', wdy: 'yday', wdt: 'tday', wdtm: 'tmrw',
  'ct-addmeal': 'addMeal', 'l-meal': 'meal', 'l-fname': 'food', 'l-qty': 'qty', 'l-kcal': 'kcal',
  'l-prot': 'prot', 'l-fat': 'fat', 'l-carb': 'carb', 'l-fnote': 'notes', 'b-addf': 'addMealBtn',
  'th-meal': 'meal', 'th-food': 'food',
  'ct-addwo': 'addWo', 'l-wtype': 'wtype', 'l-wname': 'wname', 'l-wdur': 'wdur', 'l-wkcal': 'wkcal',
  'l-wint': 'wint', 'l-wnote': 'notes', 'b-addw': 'addWoBtn', 'th-wtype': 'wtype', 'th-wname': 'wname', 'th-wint': 'wint',
  'sl-upcoming': 'upcoming', 'b-addplan': 'addPlan',
  'rt-all': 'all',
  'ct-addsupp': 'addSupp', 'l-stype': 'stype', 'l-sname': 'sname', 'l-sdose': 'sdose', 'l-stime': 'stime',
  'l-snote': 'notes', 'b-adds': 'addSuppBtn', 'th-stype': 'stype', 'th-sname': 'sname', 'th-sdose': 'sdose', 'th-stime': 'stime',
  'ct-profile': 'profile', 'l-gender': 'gender', 'g-male': 'male', 'g-female': 'female',
  'l-age': 'age', 'l-weight': 'weight', 'l-height': 'height', 'l-life': 'lifestyle', 'l-goal': 'goal', 'l-body': 'body',
  'b-savep': 'saveProfile', 'ct-health': 'health', 'b-saveh': 'saveHealth', 'ct-goals': 'goals',
  'l-gkcal': 'kcal', 'l-gprot': 'prot', 'l-gfat': 'fat', 'l-gcarb': 'carb', 'b-saveg': 'saveGoals',
  'ci-title': 'ciTitle', 'modal-title': 'addPlanItem', 'ml-date': 'dateL', 'ml-name': 'titleL',
  'ml-desc': 'detailsL', 'b-saveplan': 'savePlanItem',
  'ct-calc': 'calc', 'cl-age': 'cAge', 'cl-weight': 'cWeight', 'cl-height': 'cHeight', 'cl-act': 'cAct', 'cl-goal': 'cGoal',
  'cg-male': 'male', 'cg-female': 'female',
};

function applyTr() {
  for (const id in TR_MAP) {
    const el = document.getElementById(id);
    if (el) el.textContent = t(TR_MAP[id]);
  }
  document.getElementById('au-submit').textContent = t(auth.getMode() === 'login' ? 'loginBtn' : 'regBtn');
  const ph = document.getElementById('f-name');
  if (ph) ph.placeholder = t('searchFood');
}

function updateLangButtons() {
  ['lf', 'lm'].forEach(p => {
    const en = document.getElementById(p + '-en'), es = document.getElementById(p + '-es');
    if (en) en.classList.toggle('on', LANG === 'en');
    if (es) es.classList.toggle('on', LANG === 'es');
  });
}

function renderAll() {
  food.render(); workout.render(); supps.render(); report.render();
  foryou.render(); plan.renderCalendar(); plan.renderUpcoming();
}

function initApp() {
  plan.setCalToday(new Date());
  buildSelects();
  settings.loadProfile(); settings.loadHealth(); settings.loadGoals();
  renderAll();
  applyTr();
  plan.checkCheckin();
  foryou.calcPrefill();
}

// ─── Події ────────────────────────────────────────────────────────────
document.addEventListener('cf:langchange', () => {
  updateLangButtons();
  applyTr();
  if (currentUser()) { buildSelects(); renderAll(); }
});
document.addEventListener('cf:login', initApp);
document.addEventListener('cf:nav', e => {
  const page = e.detail;
  if (page === 'report') report.render();
  if (page === 'foryou') { foryou.render(); foryou.runCalc(); }
  if (page === 'plan') { plan.renderCalendar(); plan.renderUpcoming(); }
});
document.addEventListener('cf:goals-changed', () => { settings.loadGoals(); food.render(); });

// ─── Boot ─────────────────────────────────────────────────────────────
buildFloating();
wireDispatcher();
auth.init(); food.init(); supps.init(); plan.init(); foryou.init();
updateLangButtons();
applyTr();

const sess = localStorage.getItem('cf_sess');
if (sess && getUsers()[sess]) auth.doLogin(sess);
