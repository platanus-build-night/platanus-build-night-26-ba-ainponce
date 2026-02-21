// ═══════════════════════════════════════════════════════════════
// Shared AudioContext singleton + synthesized UI sounds
// ═══════════════════════════════════════════════════════════════

let _audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!_audioContext || _audioContext.state === 'closed') {
    _audioContext = new AudioContext();
  }
  if (_audioContext.state === 'suspended') {
    _audioContext.resume();
  }
  return _audioContext;
}

interface ToneOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  gainStart?: number;
  gainEnd?: number;
  rampDuration?: number;
  startTime?: number;
}

function playTone({
  frequency,
  duration,
  type = 'sine',
  gainStart = 0.12,
  gainEnd = 0.001,
  rampDuration,
  startTime,
}: ToneOptions) {
  const ctx = getAudioContext();
  const t = startTime ?? ctx.currentTime;
  const ramp = rampDuration ?? duration * 0.8;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);

  gain.gain.setValueAtTime(gainStart, t);
  gain.gain.exponentialRampToValueAtTime(gainEnd, t + ramp);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + duration);
}

export function playStartRecordingSound() {
  playTone({ frequency: 300, duration: 0.12, type: 'sine', gainStart: 0.12 });
}

export function playStopRecordingSound() {
  playTone({ frequency: 500, duration: 0.1, type: 'sine', gainStart: 0.12 });
}

export function playScoreRevealSound(score: number) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const base = 350 + (score / 100) * 450;
  const second = base * 1.5;

  playTone({
    frequency: base,
    duration: 0.2,
    type: 'sine',
    gainStart: 0.12,
    startTime: now,
  });

  playTone({
    frequency: second,
    duration: 0.25,
    type: 'sine',
    gainStart: 0.12,
    startTime: now + 0.1,
  });
}
