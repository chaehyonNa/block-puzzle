// 연출 효과: 점수 팝업, 숫자 튀기기
import { TIMING } from '../config.js';

export function showScorePopup(container, points, lines) {
  const el = document.createElement('div');
  el.className = 'popup';
  el.innerHTML =
    (lines > 1 ? `<div class="combo">${lines}줄 콤보!</div>` : '') +
    `<div class="pts">+${points}</div>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), TIMING.popup);
}

export function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // 애니메이션 재시작
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 150);
}
