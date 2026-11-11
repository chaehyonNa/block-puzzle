// 판 화면: 칸 그리기, 놓기/삭제 애니메이션, 드래그 미리보기
import { BOARD_SIZE as N, TIMING } from '../config.js';
import { fullLines, lineIndexes, pieceIndexes } from '../core/board.js';

export function createBoardView(boardEl, wrapEl) {
  const cellEls = [];
  for (let i = 0; i < N * N; i++) {
    const d = document.createElement('div');
    d.className = 'cell';
    boardEl.appendChild(d);
    cellEls.push(d);
  }

  let clearTimer = null;
  let lastGrid = null;
  let previewKey = null;

  function render(grid) {
    lastGrid = grid;
    if (clearTimer) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const el = cellEls[r * N + c];
        const v = grid[r][c];
        el.className = v ? 'cell filled' : 'cell';
        if (v) el.style.setProperty('--c', v);
        else el.style.removeProperty('--c');
      }
    }
  }

  // 방금 놓은 블록 '톡' 효과
  function playPlace(piece, r, c) {
    pieceIndexes(piece, r, c).forEach(k => cellEls[k].classList.add('pop'));
  }

  // 지워지는 칸 애니메이션 (cleared: Map<칸 번호, 색>)
  function playClear(cleared) {
    cleared.forEach((color, k) => {
      const el = cellEls[k];
      el.className = 'cell filled clearing';
      el.style.setProperty('--c', color);
    });
    clearTimer = setTimeout(() => {
      clearTimer = null;
      if (lastGrid) render(lastGrid);
    }, TIMING.clear);
  }

  function clearPreview() {
    previewKey = null;
    cellEls.forEach(el => el.classList.remove('preview', 'hl'));
  }

  function showPreview(grid, piece, r, c) {
    const key = `${r},${c}`;
    if (key === previewKey) return;
    clearPreview();
    previewKey = key;
    boardEl.style.setProperty('--pc', piece.color);
    const extra = pieceIndexes(piece, r, c);
    extra.forEach(k => cellEls[k].classList.add('preview'));
    const { rows, cols } = fullLines(grid, extra);
    lineIndexes(rows, cols).forEach(k => cellEls[k].classList.add('hl'));
  }

  // 칸 크기/위치 측정: 애니메이션(scale) 영향을 받지 않도록 offset 값(레이아웃 크기) 사용
  function metrics() {
    const a = cellEls[0];
    const b = cellEls[1];
    const wrap = wrapEl.getBoundingClientRect();
    return {
      ox: wrap.left + a.offsetLeft,
      oy: wrap.top + a.offsetTop,
      cell: a.offsetWidth,
      step: b.offsetLeft - a.offsetLeft,
    };
  }

  return { render, playPlace, playClear, showPreview, clearPreview, metrics };
}
