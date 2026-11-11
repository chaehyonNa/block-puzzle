// 아래 대기 블록 3개 표시
import { TRAY_SCALE } from '../config.js';

// 블록 모양을 절대 위치 칸들로 그림 (트레이 / 드래그 고스트 공용)
export function drawPiece(container, piece, cell, step) {
  container.style.width = `${(piece.w - 1) * step + cell}px`;
  container.style.height = `${(piece.h - 1) * step + cell}px`;
  for (const [r, c] of piece.cells) {
    const d = document.createElement('div');
    d.style.cssText = `left:${c * step}px;top:${r * step}px;width:${cell}px;height:${cell}px;--c:${piece.color}`;
    container.appendChild(d);
  }
}

export function createTrayView(slotEls, getMetrics) {
  function render(pieces, isPlayable) {
    const m = getMetrics();
    slotEls.forEach((slot, i) => {
      slot.innerHTML = '';
      const piece = pieces[i];
      if (!piece) return;
      const el = document.createElement('div');
      el.className = 'piece';
      if (!isPlayable(piece)) el.classList.add('blocked');
      drawPiece(el, piece, m.cell * TRAY_SCALE, m.step * TRAY_SCALE);
      slot.appendChild(el);
    });
  }

  const pieceEl = i => slotEls[i].querySelector('.piece');

  return { render, pieceEl };
}
