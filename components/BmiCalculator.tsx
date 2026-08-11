import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

const CATEGORIES = [
  { label: 'Underweight', max: 18.5, color: '#0891b2', tip: 'A healthcare provider can help assess whether your weight is right for your body and history.' },
  { label: 'Healthy range', max: 25, color: '#16a34a', tip: 'This range is associated with the lowest average health risk in most population studies.' },
  { label: 'Overweight', max: 30, color: '#d97706', tip: 'Small, sustained changes in activity and diet tend to matter more than any single quick fix.' },
  { label: 'Obese', max: Infinity, color: '#dc2626', tip: 'Consider discussing a personalised plan with a healthcare provider — BMI alone is only a starting point.' },
];

function getCategory(bmi: number) {
  return CATEGORIES.find(c => bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
}

const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(7);
  const [weightLb, setWeightLb] = useState(154);

  const bmi = useMemo(() => {
    if (unit === 'metric') {
      const m = heightCm / 100;
      if (m <= 0) return 0;
      return weightKg / (m * m);
    }
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches <= 0) return 0;
    return (weightLb / (totalInches * totalInches)) * 703;
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const category = getCategory(bmi);
  // Position the marker along a 15–40 BMI visual scale
  const markerPct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-ink-quaternary shadow-card p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h3 className="font-bold text-ink text-[15px] flex items-center gap-2">
          <Calculator size={17} className="text-brand" /> BMI Calculator
        </h3>
        <div className="flex bg-surface-secondary rounded-lg p-1 border border-ink-quaternary">
          {(['metric', 'imperial'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-3 py-1 rounded-md text-[12px] font-bold transition-colors ${
                unit === u ? 'bg-white text-brand shadow-sm' : 'text-ink-secondary'
              }`}
            >
              {u === 'metric' ? 'cm / kg' : 'ft·in / lb'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          {unit === 'metric' ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-ink-secondary uppercase">Height</label>
                  <span className="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded">{heightCm} cm</span>
                </div>
                <input type="range" min="120" max="220" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-ink-secondary uppercase">Weight</label>
                  <span className="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded">{weightKg} kg</span>
                </div>
                <input type="range" min="30" max="180" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Height</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-1">
                    <input type="number" min="3" max="8" value={heightFt} onChange={e => setHeightFt(Number(e.target.value))} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg text-sm font-medium" />
                    <span className="text-xs text-ink-tertiary">ft</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <input type="number" min="0" max="11" value={heightIn} onChange={e => setHeightIn(Number(e.target.value))} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg text-sm font-medium" />
                    <span className="text-xs text-ink-tertiary">in</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Weight</label>
                <div className="flex items-center gap-1">
                  <input type="number" min="60" max="400" value={weightLb} onChange={e => setWeightLb(Number(e.target.value))} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg text-sm font-medium" />
                  <span className="text-xs text-ink-tertiary">lb</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Result */}
        <div className="bg-surface-secondary rounded-xl border border-ink-quaternary p-5 flex flex-col justify-center">
          <div className="text-center mb-3">
            <span className="text-4xl font-black text-ink tracking-tight">{bmi > 0 ? bmi.toFixed(1) : '—'}</span>
            <p className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wide mt-0.5">BMI</p>
          </div>
          <div
            className="text-center text-[13px] font-bold px-3 py-1 rounded-full mx-auto mb-4"
            style={{ color: category.color, backgroundColor: `${category.color}15` }}
          >
            {category.label}
          </div>

          {/* Scale */}
          <div className="relative h-2 rounded-full overflow-hidden mb-1" style={{
            background: 'linear-gradient(to right, #0891b2 0%, #16a34a 25%, #16a34a 40%, #d97706 55%, #dc2626 70%, #dc2626 100%)'
          }}>
            <div
              className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
              style={{ left: `${markerPct}%`, transform: 'translate(-50%, -50%)', borderColor: category.color }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-ink-tertiary font-medium mb-4">
            <span>15</span>
            <span>40+</span>
          </div>

          <p className="text-[12px] text-ink-secondary leading-relaxed text-center">{category.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;
