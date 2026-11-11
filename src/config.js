// 게임 전체 설정값 — 밸런스 조정은 이 파일에서

export const BOARD_SIZE = 8;
export const PIECES_PER_ROUND = 3;
export const BEST_SCORE_KEY = 'blockPuzzleBest';

export const COLORS = ['#ff5e7e', '#ff9f43', '#ffd23f', '#3ddc84', '#2ec4ff', '#5b7cff', '#b06cff', '#ff6bd6'];

// 점수 규칙
export const SCORING = {
  perCell: 1,                                   // 블록 놓을 때 칸당 점수
  lineScore: lines => 10 * lines * lines,       // 줄 삭제: 1줄 10, 2줄 40, 3줄 90 ...
};

// 아래 대기 블록 크기 (판 칸 크기 대비 비율)
export const TRAY_SCALE = 0.5;

// 애니메이션 시간 (ms)
export const TIMING = {
  clear: 340,
  gameOverDelay: 700,
  dragReturn: 200,
  titleLeave: 340,
  popup: 950,
};

// 블록 모양 정의 — 기본 모양만 적으면 회전한 모양은 자동 생성
// weight: 등장 확률 가중치 (클수록 자주 나옴)
const line = n => Array.from({ length: n }, (_, i) => [0, i]);
const rect = (h, w) => {
  const out = [];
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out.push([r, c]);
  return out;
};

export const SHAPE_FAMILIES = [
  { name: '1칸',     weight: 1, cells: [[0, 0]] },
  { name: '2칸 일자', weight: 2, cells: line(2) },
  { name: '3칸 일자', weight: 2, cells: line(3) },
  { name: '4칸 일자', weight: 2, cells: line(4) },
  { name: '5칸 일자', weight: 1, cells: line(5) },
  { name: '2x2',     weight: 2, cells: rect(2, 2) },
  { name: '3x3',     weight: 1, cells: rect(3, 3) },
  { name: '2x3',     weight: 1, cells: rect(2, 3) },
  { name: '작은 L',   weight: 2, cells: [[0, 0], [1, 0], [1, 1]] },
  { name: 'L',       weight: 2, cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
  { name: 'J',       weight: 2, cells: [[0, 1], [1, 1], [2, 1], [2, 0]] },
  { name: 'T',       weight: 2, cells: [[0, 0], [0, 1], [0, 2], [1, 1]] },
  { name: 'S',       weight: 1, cells: [[0, 1], [0, 2], [1, 0], [1, 1]] },
  { name: 'Z',       weight: 1, cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { name: '큰 L',     weight: 1, cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]] },
];
