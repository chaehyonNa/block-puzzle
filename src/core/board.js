// 판 규칙: 놓기 가능 여부, 꽉 찬 줄 판정 (화면과 무관한 순수 함수)
import { BOARD_SIZE as N } from '../config.js';

export const createGrid = () => Array.from({ length: N }, () => Array(N).fill(null));

export const cellIndex = (r, c) => r * N + c;

export function canPlace(grid, piece, r, c) {
  for (const [dr, dc] of piece.cells) {
    const rr = r + dr;
    const cc = c + dc;
    if (rr < 0 || cc < 0 || rr >= N || cc >= N || grid[rr][cc]) return false;
  }
  return true;
}

export function fitsAnywhere(grid, piece) {
  for (let r = 0; r <= N - piece.h; r++) {
    for (let c = 0; c <= N - piece.w; c++) {
      if (canPlace(grid, piece, r, c)) return true;
    }
  }
  return false;
}

export function pieceIndexes(piece, r, c) {
  return new Set(piece.cells.map(([dr, dc]) => cellIndex(r + dr, c + dc)));
}

// 꽉 찬 가로/세로 줄 찾기. extra: 아직 놓지 않았지만 채워졌다고 가정할 칸(미리보기용)
export function fullLines(grid, extra = null) {
  const filled = (r, c) => !!grid[r][c] || (extra !== null && extra.has(cellIndex(r, c)));
  const rows = [];
  const cols = [];
  for (let i = 0; i < N; i++) {
    let rowFull = true;
    let colFull = true;
    for (let j = 0; j < N; j++) {
      if (!filled(i, j)) rowFull = false;
      if (!filled(j, i)) colFull = false;
    }
    if (rowFull) rows.push(i);
    if (colFull) cols.push(i);
  }
  return { rows, cols };
}

export function lineIndexes(rows, cols) {
  const set = new Set();
  rows.forEach(r => { for (let j = 0; j < N; j++) set.add(cellIndex(r, j)); });
  cols.forEach(c => { for (let j = 0; j < N; j++) set.add(cellIndex(j, c)); });
  return set;
}

export function placePiece(grid, piece, r, c) {
  for (const [dr, dc] of piece.cells) grid[r + dr][c + dc] = piece.color;
}
