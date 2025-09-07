import React from 'react';

interface ModernSliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModernSlider: React.FC<ModernSliderProps> = ({ label, value, min, max, step = 1, unit = '', onChange }) => {
  const progress = ((value - min) / (max - min)) * 100;
  const sliderStyle = {
    background: `linear-gradient(to right, #6366f1 ${progress}%, #e2e8f0 ${progress}%)`,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
        <span className="font-semibold text-indigo-600 bg-indigo-100 text-sm rounded-md px-2 py-0.5">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="modern-slider"
        style={sliderStyle}
        aria-label={label || 'slider'}
      />
    </div>
  );
};

export default ModernSlider;
