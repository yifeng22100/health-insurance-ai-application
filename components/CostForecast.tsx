
import React, { useState, useMemo } from 'react';
import { predictPremium } from '../services/geminiService';
import { DollarSign, TrendingUp, Activity, ChevronRight, Calculator, Zap, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ForecastForm {
  age: number;
  bmi: number;
  smoker: string;
  historyHeartDisease: boolean;
  historyDiabetes: boolean;
  historyCancer: boolean;
  coverageAmount: number;
}

// Instant, non-AI ballpark estimate — mirrors the same heuristic used to generate
// the synthetic dataset, so it stays consistent with the rest of the workbench.
function quickEstimate(form: ForecastForm) {
  let base = 2000;
  base += form.age * 250;
  base += (form.bmi - 18) * 150;
  if (form.smoker === 'Yes') base *= 2.5;
  if (form.historyHeartDisease) base += 5000;
  if (form.historyDiabetes) base += 3000;
  if (form.historyCancer) base += 8000;
  base += (form.coverageAmount - 100000) * 0.01;
  return Math.max(0, Math.round(base));
}

const CostForecast: React.FC = () => {
  const [form, setForm] = useState<ForecastForm>({
    age: 40,
    bmi: 28.5,
    smoker: 'No',
    historyHeartDisease: false,
    historyDiabetes: false,
    historyCancer: false,
    coverageAmount: 100000
  });

  const [result, setResult] = useState<{ estimatedPremium: number; rangeLow: number; rangeHigh: number; factors: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const toggleFlag = (key: 'historyHeartDisease' | 'historyDiabetes' | 'historyCancer') => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const prediction = await predictPremium(form);
    setResult(prediction);
    setLoading(false);
  };

  const estimate = useMemo(() => quickEstimate(form), [form]);

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-surface-secondary border-b border-ink-quaternary pt-10 pb-8 px-5">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Cost Forecaster</p>
          <h1 className="text-[28px] font-bold text-ink tracking-tight">Estimate premiums as you adjust.</h1>
          <p className="text-ink-secondary text-[14px] mt-2 max-w-[580px]">
            Drag the sliders for an instant local estimate, then request a detailed AI-generated forecast with
            a confidence range and cost drivers.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
      {/* Control Panel */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary h-fit">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-ink-quaternary">
             <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
               <Calculator size={20} />
             </div>
             <h3 className="text-xl font-bold text-ink">Parameters</h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-ink-secondary uppercase">Age</label>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{form.age} yrs</span>
              </div>
              <input type="range" min="18" max="80" name="age" value={form.age} onChange={handleSlider} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-ink-secondary uppercase">BMI Score</label>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{form.bmi.toFixed(1)}</span>
              </div>
              <input type="range" min="15" max="50" step="0.1" name="bmi" value={form.bmi} onChange={handleSlider} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-ink-secondary uppercase">Coverage Amount</label>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">${form.coverageAmount.toLocaleString()}</span>
              </div>
              <input type="range" min="10000" max="1000000" step="10000" name="coverageAmount" value={form.coverageAmount} onChange={handleSlider} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary uppercase mb-2">Smoker Status</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: 'No', label: 'Non-Smoker' }, { v: 'Yes', label: 'Smoker' }].map(opt => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => setForm(prev => ({ ...prev, smoker: opt.v }))}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      form.smoker === opt.v
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-ink-secondary border-ink-quaternary hover:border-emerald-500 hover:text-emerald-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-ink-secondary uppercase mb-2">Medical History</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'historyHeartDisease' as const, label: 'Heart' },
                  { key: 'historyDiabetes' as const, label: 'Diabetes' },
                  { key: 'historyCancer' as const, label: 'Cancer' },
                ].map(({ key, label }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleFlag(key)}
                    className={`px-2 py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                      form[key]
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-ink-secondary border-ink-quaternary hover:border-ink-tertiary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live local estimate */}
            <div className="bg-surface-secondary rounded-xl border border-ink-quaternary p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Quick Estimate</span>
              </div>
              <span className="text-lg font-black text-ink">${estimate.toLocaleString()}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-emerald-200"
            >
              {loading ? <Activity className="animate-spin" size={18} /> : (
                 <>
                 <Sparkles size={16} /> Get AI Forecast <ChevronRight size={16} />
                 </>
              )}
            </button>
          </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-3 space-y-6">
         <div className={`h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all ${result ? 'border-transparent bg-white shadow-card' : 'border-ink-quaternary bg-surface-secondary'}`}>
         {!result ? (
           <div className="text-center text-ink-tertiary">
              <DollarSign size={64} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-xl font-bold text-ink-secondary mb-2">Cost Forecasting Engine</h3>
              <p className="max-w-xs mx-auto">The Quick Estimate updates instantly on the left. Request an AI forecast for a detailed breakdown with cost drivers and a 5-year projection.</p>
           </div>
         ) : (
           <div className="w-full max-w-2xl text-center animate-fade-in-up">

              {/* Main Score Card */}
              <div className="bg-gradient-to-br from-ink to-ink/80 text-white p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
                 <div className="relative z-10 text-center">
                    <p className="text-emerald-300 font-bold uppercase tracking-[0.2em] text-xs mb-4">AI-Estimated Annual Premium</p>
                    <h2 className="text-6xl font-black mb-2 tracking-tight">${result.estimatedPremium.toLocaleString()}</h2>
                    <p className="text-ink-tertiary font-medium">Confidence Interval: ${result.rangeLow.toLocaleString()} - ${result.rangeHigh.toLocaleString()}</p>
                 </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary text-left">
                    <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-500"/>
                      Primary Cost Drivers
                    </h4>
                    <ul className="space-y-3">
                      {result.factors.map((factor, i) => (
                        <li key={i} className="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg border border-ink-quaternary text-ink text-sm font-medium">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                           {factor}
                        </li>
                      ))}
                    </ul>
                 </div>

                 <div className="bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary flex flex-col">
                    <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-4 text-left">5-Year Cost Projection</h4>
                    <div className="flex-1 min-h-[150px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={[
                           { year: 'Y1', cost: result.estimatedPremium },
                           { year: 'Y2', cost: result.estimatedPremium * 1.05 },
                           { year: 'Y3', cost: result.estimatedPremium * 1.12 },
                           { year: 'Y4', cost: result.estimatedPremium * 1.20 },
                           { year: 'Y5', cost: result.estimatedPremium * 1.35 },
                         ]}>
                            <defs>
                              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <YAxis hide />
                            <Tooltip formatter={(v:number) => `$${Math.round(v).toLocaleString()}`} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
         )}
         </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default CostForecast;
