// Сховище й модель даних — усе в localStorage, сервера нема.
// Ключі: cf_users {user: btoa(pass)}, cf_d_<user> (дані), cf_sess, cf_lang.

export function getUsers() { return JSON.parse(localStorage.getItem('cf_users') || '{}'); }
export function setUsers(u) { localStorage.setItem('cf_users', JSON.stringify(u)); }

export function blankData() {
  return {
    food: [], workouts: [], supps: [],
    goals: { kcal: 2000, prot: 120, fat: 65, carb: 250 },
    profile: { gender: 'male', age: '', weight: '', height: '', act: 'moderate', goal: 'maintain', body: 'mesomorph', startWeight: '', startDate: '' },
    health: { injuries: '', surgeries: '', conditions: '', exrest: '', foodallergy: '', suppallergy: '' },
    planItems: []
  };
}

export function getData(u) {
  const d = JSON.parse(localStorage.getItem('cf_d_' + u) || 'null');
  if (!d) return blankData();
  const b = blankData();
  for (const k in b) if (d[k] === undefined) d[k] = b[k];
  for (const k in b.profile) if (d.profile[k] === undefined) d.profile[k] = b.profile[k];
  if (!d.health) d.health = b.health;
  return d;
}
export function setData(u, d) { localStorage.setItem('cf_d_' + u, JSON.stringify(d)); }

// Поточний користувач тримаємо в модулі (замість глобальної змінної).
let CU = null;
export function currentUser() { return CU; }
export function setCurrentUser(u) { CU = u; }
export function D() { return getData(CU); }
export function saveD(d) { setData(CU, d); }
