'use client';

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function SpeedSlider({ value, onChange, disabled }: SpeedSliderProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={0.5}
        max={1.2}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="glass-slider w-24"
      />
      <span className="text-xs text-white/40 tabular-nums w-8 text-right">
        {value.toFixed(1)}x
      </span>
    </div>
  );
}
