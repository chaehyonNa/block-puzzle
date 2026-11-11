// 효과음 — 음원 파일 없이 Web Audio로 합성
import { settings } from '../settings.js';

let ctx = null;

// 브라우저/앱은 사용자가 화면을 한 번 터치한 뒤에만 소리를 낼 수 있으므로
// 첫 터치 때 오디오를 준비해 둠
export function unlockAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    ctx = null;
  }
}

// 종소리 같은 음 하나
function bell(freq, start, volume) {
  const t = ctx.currentTime + start;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(volume, t + 0.008);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  out.connect(ctx.destination);

  // 기본음 + 살짝 높은 배음을 섞어 맑은 '띵' 소리
  [[1, 1], [2.01, 0.25], [3.02, 0.08]].forEach(([mult, amp]) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * mult;
    g.gain.value = amp;
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.5);
  });
}

// 줄 삭제 '띠링' — 여러 줄이면 음이 더 이어짐
const NOTES = [1318.5, 1760, 2093, 2637]; // E6, A6, C7, E7

export function playLineClear(lines) {
  if (!settings.sound || !ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const count = Math.min(NOTES.length, lines + 1);
  for (let i = 0; i < count; i++) bell(NOTES[i], i * 0.075, 0.22);
}
