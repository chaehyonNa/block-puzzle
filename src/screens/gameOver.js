// 게임 오버 화면
export function createGameOverScreen({ root, scoreEl, bestEl, newBestEl, restartBtn, homeBtn, onRestart, onHome }) {
  function show({ score, best, isNewBest }) {
    scoreEl.textContent = score;
    bestEl.textContent = best;
    newBestEl.hidden = !isNewBest;
    root.hidden = false;
  }

  const hide = () => { root.hidden = true; };

  restartBtn.addEventListener('click', onRestart);
  homeBtn.addEventListener('click', onHome);

  return { show, hide };
}
