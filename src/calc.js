// Спільний рушій розрахунків (Mifflin-St Jeor).
// РАНІШЕ цей код був продубльований у калькуляторі та в «For You» —
// тепер один модуль, обидва місця кличуть targets().

const ACT = { sedentary: 1.2, desk: 1.3, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9, athlete: 2.05, manual: 1.8 };

export function bmr(gender, weight, height, age) {
  return gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

// Повертає повний набір цілей: BMR, підтримка (tdee), цільові калорії (tk) та макроси.
export function targets(gender, age, weight, height, act, goal) {
  const b = bmr(gender, weight, height, age);
  const tdee = Math.round(b * (ACT[act] || 1.55));
  const tk = goal === 'lose' ? Math.round(tdee * 0.85)
    : goal === 'gain' ? Math.round(tdee * 1.1) : tdee;
  const pr = Math.round(weight * (goal === 'gain' ? 2.2 : goal === 'lose' ? 2 : 1.8));
  const fa = Math.round(tk * 0.28 / 9);
  const ca = Math.round((tk - pr * 4 - fa * 9) / 4);
  return { bmr: Math.round(b), tdee, tk, pr, fa, ca };
}
