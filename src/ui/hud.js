// 상단 점수 표시 (현재 점수 + 최고 점수)
import { bump } from './effects.js';

export function createHud(scoreEl, bestEl) {
  function update(score, best, animate = false) {
    scoreEl.textContent = score;
    bestEl.textContent = best;
    if (animate) bump(scoreEl);
  }
  return { update };
}
