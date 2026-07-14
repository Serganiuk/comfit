// Перемикання сторінок нижньої навігації. Кидає 'cf:nav' — main.js добудовує
// потрібні рендери для тієї сторінки, на яку перейшли.
export const WM = { food: '🍽', workout: '💪', plan: '📅', report: '📊', supps: '💊', foryou: '🤖', settings: '⚙️' };

export function go(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('on'));
  document.getElementById('p-' + page).classList.add('on');
  const btn = document.querySelector('.nav-btn[data-page="' + page + '"]');
  if (btn) btn.classList.add('on');
  document.getElementById('pageWm').textContent = WM[page] || '🍽';
  document.dispatchEvent(new CustomEvent('cf:nav', { detail: page }));
  window.scrollTo(0, 0);
}
