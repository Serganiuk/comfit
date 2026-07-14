// Плаваючі SVG-іконки на фоні екрана логіну (декор).
import { FLOAT_ICONS } from '../data/floatIcons.js';

export function buildFloating() {
  const wrap = document.getElementById('fiWrap');
  if (!wrap) return;
  wrap.innerHTML = FLOAT_ICONS.map((svg, i) => '<div class="fi fi' + (i + 1) + '">' + svg + '</div>').join('');
}
