// 일시정지 화면 (+ 소리/진동 설정)
import { settings, setSetting } from '../settings.js';

export function createPauseScreen({ root, resumeBtn, restartBtn, homeBtn, toggles, onRestart, onHome, onToggle }) {
  // toggles: { 설정키: 버튼 요소 }
  function syncToggles() {
    Object.entries(toggles).forEach(([key, btn]) => {
      btn.setAttribute('aria-pressed', String(settings[key]));
    });
  }

  Object.entries(toggles).forEach(([key, btn]) => {
    btn.addEventListener('click', () => {
      setSetting(key, !settings[key]);
      syncToggles();
      if (onToggle) onToggle(key, settings[key]);
    });
  });

  const show = () => {
    syncToggles();
    root.hidden = false;
  };
  const hide = () => { root.hidden = true; };

  resumeBtn.addEventListener('click', hide);
  restartBtn.addEventListener('click', onRestart);
  homeBtn.addEventListener('click', onHome);

  return { show, hide, isVisible: () => !root.hidden };
}
