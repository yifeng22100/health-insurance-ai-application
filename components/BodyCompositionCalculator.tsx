import React, { useMemo, useState } from 'react';
import { Calculator, Percent } from 'lucide-react';

interface CategoryBand {
  label: string;
  max: number;
  color: string;
  tip: string;
}

const BMI_CATEGORIES: CategoryBand[] = [
  { label: 'Underweight', max: 18.5, color: '#0891b2', tip: 'A healthcare provider can help assess whether your weight is right for your body and history.' },
  { label: 'Healthy range', max: 25, color: '#16a34a', tip: 'This range is associated with the lowest average health risk in most population studies.' },
  { label: 'Overweight', max: 30, color: '#d97706', tip: 'Small, sustained changes in activity and diet tend to matter more than any single quick fix.' },
  { label: 'Obese', max: Infinity, color: '#dc2626', tip: 'Consider discussing a personalised plan with a healthcare provider — BMI alone is only a starting point.' },
];

// Rough adult body-fat bands (American Council on Exercise), split by gender.
const BODYFAT_CATEGORIES: Record<'Male' | 'Female', CategoryBand[]> = {
  Male: [
    { label: 'Athletic', max: 14, color: '#0891b2', tip: 'Typical of trained athletes — not a general-population target.' },
    { label: 'Fitness', max: 18, color: '#16a34a', tip: 'Associated with a lean, active lifestyle.' },
    { label: 'Acceptable', max: 25, color: '#d97706', tip: 'Within the commonly cited healthy range for most adult men.' },
    { label: 'Obese', max: Infinity, color: '#dc2626', tip: 'Consider discussing body composition with a healthcare provider.' },
  ],
  Female: [
    { label: 'Athletic', max: 21, color: '#0891b2', tip: 'Typical of trained athletes — not a general-population target.' },
    { label: 'Fitness', max: 25, color: '#16a34a', tip: 'Associated with a lean, active lifestyle.' },
    { label: 'Acceptable', max: 32, color: '#d97706', tip: 'Within the commonly cited healthy range for most adult women.' },
    { label: 'Obese', max: Infinity, color: '#dc2626', tip: 'Consider discussing body composition with a healthcare provider.' },
  ],
};

function getCategory(categories: CategoryBand[], value: number): CategoryBand {
  return categories.find(c => value < c.max) || categories[categories.length - 1];
}

function scaleGradient(categories: CategoryBand[], scaleMax: number) {
  const stops: string[] = [];
  let prevPct = 0;
  categories.forEach(c => {
    const pct = Math.min(100, (c.max / scaleMax) * 100);
    stops.push(`${c.color} ${prevPct}%`, `${c.color} ${pct}%`);
    prevPct = pct;
  });
  return `linear-gradient(to right, ${stops.join(', ')})`;
}

const BodyCompositionCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(7);
  const [weightLb, setWeightLb] = useState(154);
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

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

  // Deurenberg formula — estimates body fat % from BMI, age, and sex.
  const bodyFat = useMemo(() => {
    if (bmi <= 0) return 0;
    const sex = gender === 'Male' ? 1 : 0;
    const estimate = 1.2 * bmi + 0.23 * age - 10.8 * sex - 5.4;
    return Math.max(2, estimate);
  }, [bmi, age, gender]);

  const bmiCategory = getCategory(BMI_CATEGORIES, bmi);
  const bmiMarkerPct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  const bodyFatCategories = BODYFAT_CATEGORIES[gender];
  const bodyFatCategory = getCategory(bodyFatCategories, bodyFat);
  const BODYFAT_SCALE_MAX = 45;
  const bodyFatMarkerPct = Math.min(100, Math.max(0, (bodyFat / BODYFAT_SCALE_MAX) * 100));

  return (
    <div className="bg-white rounded-2xl border border-ink-quaternary shadow-card p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h3 className="font-bold text-ink text-[15px] flex items-center gap-2">
          <Calculator size={17} className="text-brand" /> Body Composition Calculator
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-6">
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-ink-secondary uppercase">Age</label>
              <span className="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded">{age} yrs</span>
            </div>
            <input type="range" min="18" max="90" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand" />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-secondary uppercase mb-1.5">Sex</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Male', 'Female'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    gender === g ? 'bg-brand text-white border-brand' : 'bg-white text-ink-secondary border-ink-quaternary hover:border-brand hover:text-brand'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BMI result */}
        <div className="bg-surface-secondary rounded-xl border border-ink-quaternary p-5 flex flex-col justify-center">
          <div className="text-center mb-3">
            <span className="text-4xl font-black text-ink tracking-tight">{bmi > 0 ? bmi.toFixed(1) : '—'}</span>
            <p className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wide mt-0.5">BMI</p>
          </div>
          <div
            className="text-center text-[13px] font-bold px-3 py-1 rounded-full mx-auto mb-4"
            style={{ color: bmiCategory.color, backgroundColor: `${bmiCategory.color}15` }}
          >
            {bmiCategory.label}
          </div>

          <div className="relative h-2 rounded-full overflow-hidden mb-1" style={{ background: scaleGradient(BMI_CATEGORIES, 45) }}>
            <div
              className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
              style={{ left: `${bmiMarkerPct}%`, transform: 'translate(-50%, -50%)', borderColor: bmiCategory.color }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-ink-tertiary font-medium mb-4">
            <span>15</span>
            <span>40+</span>
          </div>

          <p className="text-[12px] text-ink-secondary leading-relaxed text-center">{bmiCategory.tip}</p>
        </div>

        {/* Body fat result */}
        <div className="bg-surface-secondary rounded-xl border border-ink-quaternary p-5 flex flex-col justify-center">
          <div className="text-center mb-3">
            <span className="text-4xl font-black text-ink tracking-tight">{bodyFat > 0 ? bodyFat.toFixed(1) : '—'}<span className="text-xl">%</span></span>
            <p className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wide mt-0.5 flex items-center justify-center gap-1">
              <Percent size={11} /> Body Fat (est.)
            </p>
          </div>
          <div
            className="text-center text-[13px] font-bold px-3 py-1 rounded-full mx-auto mb-4"
            style={{ color: bodyFatCategory.color, backgroundColor: `${bodyFatCategory.color}15` }}
          >
            {bodyFatCategory.label}
          </div>

          <div className="relative h-2 rounded-full overflow-hidden mb-1" style={{ background: scaleGradient(bodyFatCategories, BODYFAT_SCALE_MAX) }}>
            <div
              className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
              style={{ left: `${bodyFatMarkerPct}%`, transform: 'translate(-50%, -50%)', borderColor: bodyFatCategory.color }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-ink-tertiary font-medium mb-4">
            <span>0%</span>
            <span>{BODYFAT_SCALE_MAX}%+</span>
          </div>

          <p className="text-[12px] text-ink-secondary leading-relaxed text-center">{bodyFatCategory.tip}</p>
        </div>
      </div>

      <p className="text-[11px] text-ink-tertiary mt-5 leading-relaxed">
        Body fat is estimated from BMI, age, and sex (Deurenberg formula) — a population-level approximation, not a
        substitute for skinfold, DEXA, or bioimpedance measurement. Accuracy varies more for athletes, older adults,
        and people outside average body proportions.
      </p>
    </div>
  );
};

export default BodyCompositionCalculator;
