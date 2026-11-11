// 게임 진행: 상태, 블록 지급, 점수, 게임 오버 판정 (화면과 무관)
import { BOARD_SIZE as N, PIECES_PER_ROUND, SCORING } from '../config.js';
import { randomPiece } from './shapes.js';
import { createGrid, canPlace, fitsAnywhere, fullLines, lineIndexes, placePiece } from './board.js';
import { loadBest, saveBest } from '../storage.js';

export function createGame() {
  const state = {
    grid: createGrid(),
    pieces: [],
    score: 0,
    best: loadBest(),
    startBest: 0,   // 이번 판 시작 시점의 최고 점수 (신기록 판정용)
    over: false,
  };

  function deal() {
    state.pieces = Array.from({ length: PIECES_PER_ROUND }, randomPiece);
  }

  function reset() {
    state.grid = createGrid();
    state.score = 0;
    state.over = false;
    state.startBest = state.best;
    deal();
  }

  const isPlayable = piece => fitsAnywhere(state.grid, piece);
  const canPlaceAt = (piece, r, c) => canPlace(state.grid, piece, r, c);

  // i번째 대기 블록을 (r, c)에 놓기. 화면 연출에 필요한 결과를 돌려줌
  function place(i, r, c) {
    const piece = state.pieces[i];
    placePiece(state.grid, piece, r, c);
    state.pieces[i] = null;

    const { rows, cols } = fullLines(state.grid);
    const lines = rows.length + cols.length;

    // 지워질 칸의 색을 기억해 둔 뒤 판에서 비움 (삭제 애니메이션용)
    const cleared = new Map();
    lineIndexes(rows, cols).forEach(k => {
      const rr = Math.floor(k / N);
      const cc = k % N;
      cleared.set(k, state.grid[rr][cc]);
      state.grid[rr][cc] = null;
    });

    const lineScore = lines > 0 ? SCORING.lineScore(lines) : 0;
    const gained = piece.cells.length * SCORING.perCell + lineScore;
    state.score += gained;
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.best);
    }

    if (state.pieces.every(p => !p)) deal();

    const remaining = state.pieces.filter(Boolean);
    state.over = remaining.length > 0 && !remaining.some(isPlayable);

    return { piece, r, c, lines, lineScore, gained, cleared, over: state.over };
  }

  const isNewBest = () => state.score > state.startBest && state.score > 0;

  return { state, reset, place, canPlaceAt, isPlayable, isNewBest };
}
