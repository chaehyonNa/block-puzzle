// 저장소 — 나중에 클라우드 저장(Play 게임즈 등)으로 바꿀 때 이 파일만 수정
import { BEST_SCORE_KEY } from './config.js';

export function loadBest() {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY), 10) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(value) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(value));
  } catch {
    // 저장 불가 환경(시크릿 모드 등)은 무시
  }
}
