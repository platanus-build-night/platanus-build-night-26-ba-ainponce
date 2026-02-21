// ═══════════════════════════════════════════════════════════════
// SilenceDetector — monitors an AnalyserNode and fires a
// callback when prolonged silence is detected after speech.
// ═══════════════════════════════════════════════════════════════

export interface SilenceDetectorConfig {
  silenceThreshold?: number;     // 0-255 average frequency level (default 20)
  silenceDurationMs?: number;    // continuous silence to trigger (default 2000)
  minSpeechDurationMs?: number;  // minimum speech before detection activates (default 500)
  pollIntervalMs?: number;       // polling interval (default 100)
}

export class SilenceDetector {
  private analyser: AnalyserNode;
  private onSilence: () => void;
  private threshold: number;
  private silenceDurationMs: number;
  private minSpeechDurationMs: number;
  private pollIntervalMs: number;

  private dataArray: Uint8Array<ArrayBuffer>;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private speechStartTime: number | null = null;
  private silenceStartTime: number | null = null;
  private stopped = false;

  constructor(
    analyser: AnalyserNode,
    onSilence: () => void,
    config?: SilenceDetectorConfig,
  ) {
    this.analyser = analyser;
    this.onSilence = onSilence;
    this.threshold = config?.silenceThreshold ?? 20;
    this.silenceDurationMs = config?.silenceDurationMs ?? 2000;
    this.minSpeechDurationMs = config?.minSpeechDurationMs ?? 500;
    this.pollIntervalMs = config?.pollIntervalMs ?? 100;
    this.dataArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
  }

  start() {
    this.stopped = false;
    this.speechStartTime = null;
    this.silenceStartTime = null;

    this.intervalId = setInterval(() => {
      if (this.stopped) return;
      this.poll();
    }, this.pollIntervalMs);
  }

  stop() {
    this.stopped = true;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private poll() {
    this.analyser.getByteFrequencyData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const avg = sum / this.dataArray.length;

    const now = Date.now();

    if (avg >= this.threshold) {
      // Speech detected
      if (this.speechStartTime === null) {
        this.speechStartTime = now;
      }
      this.silenceStartTime = null;
    } else {
      // Silence detected
      const speechDuration = this.speechStartTime !== null
        ? now - this.speechStartTime
        : 0;

      if (speechDuration >= this.minSpeechDurationMs) {
        if (this.silenceStartTime === null) {
          this.silenceStartTime = now;
        } else if (now - this.silenceStartTime >= this.silenceDurationMs) {
          this.stop();
          this.onSilence();
        }
      }
    }
  }
}
