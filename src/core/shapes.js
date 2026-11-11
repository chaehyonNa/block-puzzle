// 블록 모양: 회전 형태 생성 + 랜덤 블록 뽑기
import { SHAPE_FAMILIES, COLORS } from '../config.js';

function normalize(cells) {
  const minR = Math.min(...cells.map(c => c[0]));
  const minC = Math.min(...cells.map(c => c[1]));
  return cells
    .map(([r, c]) => [r - minR, c - minC])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

const rotate = cells => normalize(cells.map(([r, c]) => [c, -r]));

// 90도씩 4번 돌려서 중복 없는 형태 목록 생성
function orientations(base) {
  const seen = new Set();
  const out = [];
  let cur = normalize(base);
  for (let i = 0; i < 4; i++) {
    const key = JSON.stringify(cur);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(cur);
    }
    cur = rotate(cur);
  }
  return out;
}

const POOL = SHAPE_FAMILIES.map(f => ({ forms: orientations(f.cells), weight: f.weight }));
const TOTAL_WEIGHT = POOL.reduce((s, f) => s + f.weight, 0);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export function randomPiece() {
  let x = Math.random() * TOTAL_WEIGHT;
  let family = POOL[0];
  for (const f of POOL) {
    if ((x -= f.weight) < 0) {
      family = f;
      break;
    }
  }
  const cells = pick(family.forms);
  return {
    cells,
    h: Math.max(...cells.map(c => c[0])) + 1,
    w: Math.max(...cells.map(c => c[1])) + 1,
    color: pick(COLORS),
  };
}
