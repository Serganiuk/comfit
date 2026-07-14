// Екран «Settings»: профіль, анкета здоров'я, денні цілі.
import { D, saveD } from '../state.js';
import { val, msg, dayStr } from '../ui.js';
import * as food from './food.js';
import * as foryou from './foryou.js';
import * as report from './report.js';

let GENDER = 'male';

export function setGender(g) {
  GENDER = g;
  document.getElementById('g-male').classList.toggle('on', g === 'male');
  document.getElementById('g-female').classList.toggle('on', g === 'female');
}

export function loadProfile() {
  const p = D().profile;
  setGender(p.gender || 'male');
  ['age', 'weight', 'height'].forEach(k => { document.getElementById('p-' + k).value = p[k] || ''; });
  if (p.act) document.getElementById('p-act').value = p.act;
  if (p.goal) document.getElementById('p-goal').value = p.goal;
  if (p.body) document.getElementById('p-body').value = p.body;
}

export function saveProfile() {
  const d = D(), first = !d.profile.startWeight && !d.profile.startDate;
  d.profile = {
    gender: GENDER, age: val('p-age'), weight: val('p-weight'), height: val('p-height'),
    act: val('p-act'), goal: val('p-goal'), body: val('p-body'),
    startWeight: first ? val('p-weight') : (d.profile.startWeight || val('p-weight')),
    startDate: first ? dayStr(0) : (d.profile.startDate || dayStr(0))
  };
  saveD(d); msg('msg-profile'); foryou.render(); report.render();
}

export function loadHealth() {
  const h = D().health || {};
  ['injuries', 'surgeries', 'conditions', 'exrest', 'foodallergy', 'suppallergy'].forEach(k => {
    const e = document.getElementById('q-' + k); if (e) e.value = h[k] || '';
  });
}

export function saveHealth() {
  const d = D();
  d.health = { injuries: val('q-injuries'), surgeries: val('q-surgeries'), conditions: val('q-conditions'), exrest: val('q-exrest'), foodallergy: val('q-foodallergy'), suppallergy: val('q-suppallergy') };
  saveD(d); msg('msg-health'); foryou.render();
}

export function loadGoals() {
  const g = D().goals;
  ['kcal', 'prot', 'fat', 'carb'].forEach(k => { document.getElementById('g-' + k).value = g[k]; });
}

export function saveGoals() {
  const d = D();
  d.goals = { kcal: +val('g-kcal') || 2000, prot: +val('g-prot') || 120, fat: +val('g-fat') || 65, carb: +val('g-carb') || 250 };
  saveD(d); food.render(); msg('msg-goals');
}
