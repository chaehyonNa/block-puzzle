// 일시정지 화면
export function createPauseScreen({ root, resumeBtn, restartBtn, homeBtn, onRestart, onHome }) {
  const show = () => { root.hidden = false; };
  const hide = () => { root.hidden = true; };

  resumeBtn.addEventListener('click', hide);
  restartBtn.addEventListener('click', onRestart);
  homeBtn.addEventListener('click', onHome);

  return { show, hide, isVisible: () => !root.hidden };
}
