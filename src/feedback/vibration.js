// 진동 — 앱에서는 Capacitor Haptics, 브라우저에서는 navigator.vibrate 사용
import { Haptics } from '@capacitor/haptics';
import { settings } from '../settings.js';

export function vibrateLineClear(lines) {
  if (!settings.vibration) return;
  const duration = Math.min(40 + (lines - 1) * 30, 150); // 여러 줄일수록 조금 길게
  Haptics.vibrate({ duration }).catch(() => {
    // 진동 미지원 기기는 무시
  });
}
