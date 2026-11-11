// 블록 드래그 (마우스 + 터치 공용, Pointer Events)
import { TRAY_SCALE, TIMING } from '../config.js';
import { drawPiece } from './trayView.js';

/**
 * @param {object} o
 * @param {HTMLElement[]} o.slots       대기 블록 슬롯
 * @param {(i:number)=>object|null} o.getPiece
 * @param {(i:number)=>HTMLElement} o.getPieceEl
 * @param {()=>boolean} o.canStart      드래그 시작 가능 여부
 * @param {()=>object} o.metrics        판 칸 크기/위치
 * @param {(p,r,c)=>boolean} o.canPlace
 * @param {(p,r,c)=>void} o.onHover     놓을 수 있는 위치 위
 * @param {()=>void} o.onLeave          놓을 수 없는 위치
 * @param {(i,r,c)=>void} o.onDrop      놓기 확정
 */
export function setupDrag(o) {
  let drag = null;

  o.slots.forEach((slot, i) => {
    slot.addEventListener('pointerdown', e => {
      const piece = o.getPiece(i);
      if (drag || !piece || !o.canStart()) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();

      const m = o.metrics();
      const ghost = document.createElement('div');
      ghost.className = 'ghost';
      drawPiece(ghost, piece, m.cell, m.step);
      document.body.appendChild(ghost);

      const pieceEl = o.getPieceEl(i);
      pieceEl.classList.add('hidden');

      const gw = ghost.offsetWidth;
      const gh = ghost.offsetHeight;
      drag = {
        i, piece, m, ghost, gw, gh, pieceEl,
        id: e.pointerId,
        // 터치일 때는 손가락에 가리지 않도록 블록을 위로 띄움
        lift: e.pointerType === 'mouse' ? 0 : m.cell * 1.4 + gh / 2,
        target: null,
        done: false,
      };
      onMove(e);
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onCancel);
    });
  });

  function onMove(e) {
    if (!drag || drag.done || e.pointerId !== drag.id) return;
    e.preventDefault();
    const { m, gw, gh, lift, piece } = drag;
    const x = e.clientX - gw / 2;
    const y = e.clientY - gh / 2 - lift;
    drag.ghost.style.transform = `translate(${x}px, ${y}px)`;
    const c = Math.round((x - m.ox) / m.step);
    const r = Math.round((y - m.oy) / m.step);
    if (o.canPlace(piece, r, c)) {
      drag.target = { r, c };
      o.onHover(piece, r, c);
    } else {
      drag.target = null;
      o.onLeave();
    }
  }

  function detach() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
  }

  function onUp(e) {
    if (drag && e.pointerId === drag.id) finish(true);
  }

  function onCancel(e) {
    if (drag && e.pointerId === drag.id) finish(false);
  }

  function finish(allowPlace) {
    detach();
    o.onLeave();
    const d = drag;
    d.done = true;

    if (allowPlace && d.target) {
      d.ghost.remove();
      drag = null;
      o.onDrop(d.i, d.target.r, d.target.c);
      return;
    }

    // 원래 자리로 되돌리기
    const rect = d.pieceEl.getBoundingClientRect();
    d.ghost.style.transition = `transform ${TIMING.dragReturn}ms ease-out`;
    d.ghost.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(${TRAY_SCALE})`;
    setTimeout(() => {
      d.ghost.remove();
      d.pieceEl.classList.remove('hidden');
      drag = null;
    }, TIMING.dragReturn + 10);
  }

  return { isDragging: () => drag !== null };
}
