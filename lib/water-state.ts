// ═══════════════════════════════════════════════════════════════
// Shared water state — read every frame by WaterRippleCanvas,
// written by onboarding/practice views. No React re-renders.
// ═══════════════════════════════════════════════════════════════

// ── Color presets by language ──
export const languageColors: Record<string, { deep: [number, number, number]; highlight: [number, number, number] }> = {
  en: {
    deep: [0.039, 0.098, 0.184],     // #0a192f — deep blue
    highlight: [0.392, 1.0, 0.855],   // #64ffda — cyan
  },
  es: {
    deep: [0.098, 0.055, 0.157],     // #190e28 — deep purple
    highlight: [1.0, 0.647, 0.176],   // #ffa52d — warm amber
  },
  pt: {
    deep: [0.039, 0.122, 0.063],     // #0a1f10 — deep forest
    highlight: [0.204, 0.867, 0.600], // #34dd99 — emerald
  },
};

// ── Internal state ──
let _colorDeep: [number, number, number] = [0.039, 0.098, 0.184];
let _colorHighlight: [number, number, number] = [0.392, 1.0, 0.855];
let _waveSpeed = 1.0;
let _waveIntensity = 1.0;

// Audio
let _analyser: AnalyserNode | null = null;
let _dataArray: Uint8Array<ArrayBuffer> | null = null;
let _audioLevel = 0;
let _directAudioLevel: number | null = null;

// ── Color setters ──
export function setWaterColors(deep: [number, number, number], highlight: [number, number, number]) {
  _colorDeep = deep;
  _colorHighlight = highlight;
}

export function setWaterColorsByLanguage(lang: string) {
  const colors = languageColors[lang] || languageColors.en;
  _colorDeep = [...colors.deep];
  _colorHighlight = [...colors.highlight];
}

// ── Wave param setters ──
export function setWaveSpeed(speed: number) { _waveSpeed = speed; }
export function setWaveIntensity(intensity: number) { _waveIntensity = intensity; }

// ── Audio setters ──
export function setAnalyser(node: AnalyserNode | null) {
  _analyser = node;
  if (node) {
    _dataArray = new Uint8Array(node.frequencyBinCount) as Uint8Array<ArrayBuffer>;
  } else {
    _dataArray = null;
  }
}

export function setDirectAudioLevel(level: number | null) {
  _directAudioLevel = level;
}

// ── Getters (called every frame) ──
export function getColorDeep(): [number, number, number] { return _colorDeep; }
export function getColorHighlight(): [number, number, number] { return _colorHighlight; }
export function getWaveSpeed(): number { return _waveSpeed; }
export function getWaveIntensity(): number { return _waveIntensity; }

export function updateAndGetAudioLevel(): number {
  if (_directAudioLevel !== null) {
    _audioLevel += (_directAudioLevel - _audioLevel) * 0.15;
    return _audioLevel;
  }

  if (_analyser && _dataArray) {
    _analyser.getByteFrequencyData(_dataArray);
    let sum = 0;
    for (let i = 0; i < _dataArray.length; i++) {
      sum += _dataArray[i];
    }
    const target = sum / (_dataArray.length * 255);
    _audioLevel += (target - _audioLevel) * 0.15;
  } else {
    _audioLevel *= 0.92;
  }
  return _audioLevel;
}
