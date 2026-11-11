// 시작 화면
import { COLORS, TIMING } from '../config.js';

// 5x5 장식용 로고 (0 = 빈칸, 숫자 = COLORS 인덱스 + 1)
const LOGO_PATTERN = [
  1, 1, 0, 5, 5,
  1, 0, 0, 0, 5,
  0, 0, 3, 0, 0,
  7, 0, 3, 3, 4,
  7, 7, 0, 4, 4,
];

export function createTitleScreen({ root, logoEl, bestEl, startBtn, onStart }) {
  function buildLogo() {
    logoEl.innerHTML = '';
    let n = 0;
    LOGO_PATTERN.forEach(v => {
      const d = document.createElement('div');
      if (v) {
        d.className = 'on';
        d.style.setProperty('--c', COLORS[v - 1]);
        const dropDelay = (n++ * 0.06).toFixed(2);
        const bobDelay = (0.6 + n * 0.12).toFixed(2);
        d.style.animationDelay = `${dropDelay}s, ${bobDelay}s`;
      }
      logoEl.appendChild(d);
    });
  }

  function show(best) {
    bestEl.textContent = best;
    root.classList.remove('leaving');
    root.hidden = false;
    buildLogo();
  }

  function hide() {
    root.classList.add('leaving');
    setTimeout(() => {
      root.hidden = true;
      root.classList.remove('leaving');
    }, TIMING.titleLeave);
  }

  startBtn.addEventListener('click', onStart);

  return { show, hide, isVisible: () => !root.hidden };
}
