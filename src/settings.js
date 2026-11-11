// 사용자 설정 (소리/진동) — 앱 데이터에 저장
const SETTINGS_KEY = 'blockPuzzleSettings';

const DEFAULTS = {
  sound: true,
  vibration: true,
};

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export const settings = load();

export function setSetting(key, value) {
  settings[key] = value;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // 저장 불가 환경은 무시
  }
}
