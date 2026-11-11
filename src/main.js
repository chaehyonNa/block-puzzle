// 시작점: 게임 로직과 화면 모듈을 연결
import './styles/base.css';
import './styles/game.css';
import './styles/screens.css';

import { TIMING } from './config.js';
import { createGame } from './core/game.js';
import { createBoardView } from './ui/boardView.js';
import { createTrayView } from './ui/trayView.js';
import { createHud } from './ui/hud.js';
import { setupDrag } from './ui/drag.js';
import { showScorePopup } from './ui/effects.js';
import { unlockAudio, playLineClear } from './feedback/sound.js';
import { vibrateLineClear } from './feedback/vibration.js';
import { createTitleScreen } from './screens/title.js';
import { createPauseScreen } from './screens/pause.js';
import { createGameOverScreen } from './screens/gameOver.js';

const $ = id => document.getElementById(id);

// ---------- 모듈 생성 ----------
const game = createGame();
const { state } = game;

const boardWrap = document.querySelector('.board-wrap');
const board = createBoardView($('board'), boardWrap);
const slots = [...document.querySelectorAll('.slot')];
const tray = createTrayView(slots, board.metrics);
const hud = createHud($('score'), $('best'));

const title = createTitleScreen({
  root: $('title'),
  logoEl: $('logo'),
  bestEl: $('titleBest'),
  startBtn: $('startBtn'),
  onStart: startGame,
});

const pause = createPauseScreen({
  root: $('pause'),
  resumeBtn: $('resume'),
  restartBtn: $('pauseRestart'),
  homeBtn: $('pauseHome'),
  toggles: { sound: $('soundToggle'), vibration: $('vibrationToggle') },
  onRestart: newGame,
  onHome: goHome,
  // 켤 때 미리 들어/느껴볼 수 있게 한 번 재생
  onToggle: (key, on) => {
    if (!on) return;
    if (key === 'sound') playLineClear(1);
    if (key === 'vibration') vibrateLineClear(1);
  },
});

const gameOver = createGameOverScreen({
  root: $('over'),
  scoreEl: $('finalScore'),
  bestEl: $('finalBest'),
  newBestEl: $('newbest'),
  restartBtn: $('restart'),
  homeBtn: $('overHome'),
  onRestart: newGame,
  onHome: goHome,
});

const drag = setupDrag({
  slots,
  getPiece: i => state.pieces[i],
  getPieceEl: i => tray.pieceEl(i),
  canStart: () => !state.over && !pause.isVisible() && !title.isVisible(),
  metrics: board.metrics,
  canPlace: game.canPlaceAt,
  onHover: (p, r, c) => board.showPreview(state.grid, p, r, c),
  onLeave: board.clearPreview,
  onDrop: handleDrop,
});

// ---------- 흐름 ----------
let gameId = 0; // 판이 바뀌면 이전 판의 지연된 게임 오버 표시를 무시하기 위함

function refreshTray() {
  tray.render(state.pieces, game.isPlayable);
}

function newGame() {
  gameId++;
  game.reset();
  gameOver.hide();
  pause.hide();
  board.render(state.grid);
  refreshTray();
  hud.update(state.score, state.best);
}

function startGame() {
  newGame();
  title.hide();
}

function goHome() {
  gameOver.hide();
  pause.hide();
  title.show(state.best);
}

function handleDrop(i, r, c) {
  const result = game.place(i, r, c);

  board.render(state.grid);
  board.playPlace(result.piece, r, c);
  if (result.lines > 0) {
    board.playClear(result.cleared);
    showScorePopup(boardWrap, result.lineScore, result.lines);
    playLineClear(result.lines);
    vibrateLineClear(result.lines);
  }
  hud.update(state.score, state.best, true);
  refreshTray();

  if (result.over) {
    const id = gameId;
    setTimeout(() => {
      if (id !== gameId || title.isVisible()) return;
      gameOver.show({ score: state.score, best: state.best, isNewBest: game.isNewBest() });
    }, TIMING.gameOverDelay);
  }
}

// ---------- 기타 이벤트 ----------
$('pauseBtn').addEventListener('click', () => {
  if (drag.isDragging() || state.over) return;
  pause.show();
});
// 첫 터치 때 오디오 준비 (브라우저/앱 자동재생 제한 때문)
window.addEventListener('pointerdown', unlockAudio, { capture: true });
document.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('resize', () => {
  if (!drag.isDragging()) refreshTray();
});

// ---------- 시작 ----------
newGame();
title.show(state.best);
