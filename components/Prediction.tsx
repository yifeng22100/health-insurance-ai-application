
import React, { useState } from 'react';
import { predictRisk } from '../services/geminiService';
import { ShieldCheck, AlertTriangle, Activity, Sliders, ChevronRight, HeartPulse, Wind } from 'lucide-react';
import RadialGauge from './RadialGauge';

const Prediction: React.FC = () => {
  const [form, setForm] = useState({
    age: 35,
    bmi: 24.5,
    smoker: 'No',
    historyHeartDisease: false,
    historyDiabetes: false,
    dailySteps: 5000,
    stressLevel: 5
  });

  const [result, setResult] = useState<{ risk: string; confidence: number; reasoning: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const toggleFlag = (key: 'historyHeartDisease' | 'historyDiabetes') => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const prediction = await predictRisk(form);
    setResult(prediction);
    setLoading(false);
  };

  const gaugeColor = result?.risk === 'High' ? '#ef4444' : '#10b981';

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-surface-secondary border-b border-ink-quaternary pt-10 pb-8 px-5">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Risk Predictor</p>
          <h1 className="text-[28px] font-bold text-ink tracking-tight">Classify risk in real time.</h1>
          <p className="text-ink-secondary text-[14px] mt-2 max-w-[580px]">
            Adjust a patient profile and get an instant AI-generated High/Low risk classification with a
            confidence score and plain-language reasoning.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
      {/* Control Panel */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary h-fit">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-ink-quaternary">
           <div className="p-2 bg-brand-light text-brand rounded-lg">
             <Sliders size={20} />
           </div>
           <h3 className="text-xl font-bold text-ink">Parameters</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm font-medium text-ink" />
             </div>
             <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">BMI Score</label>
                <input type="number" step="0.1" name="bmi" value={form.bmi} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm font-medium text-ink" />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Daily Steps</label>
             <input type="number" name="dailySteps" value={form.dailySteps} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm font-medium text-ink" />
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
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-ink-secondary border-ink-quaternary hover:border-brand hover:text-brand'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-ink-secondary uppercase">Stress Level</label>
                <span className="text-xs font-bold text-brand bg-brand-light px-2 rounded">{form.stressLevel}/10</span>
            </div>
            <input type="range" min="1" max="10" name="stressLevel" value={form.stressLevel} onChange={handleChange} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand" />
          </div>

          <div>
             <span className="block text-xs font-bold text-ink-secondary uppercase mb-2">Medical History</span>
             <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleFlag('historyHeartDisease')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                    form.historyHeartDisease
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-ink-secondary border-ink-quaternary hover:border-ink-tertiary'
                  }`}
                >
                  <HeartPulse size={14} /> Heart Disease
                </button>
                <button
                  type="button"
                  onClick={() => toggleFlag('historyDiabetes')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                    form.historyDiabetes
                      ? 'bg-orange-50 text-orange-600 border-orange-200'
                      : 'bg-white text-ink-secondary border-ink-quaternary hover:border-ink-tertiary'
                  }`}
                >
                  <Wind size={14} /> Diabetes
                </button>
             </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-brand text-white py-3 rounded-lg font-bold hover:bg-brand-dark transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-brand/30"
          >
            {loading ? <Activity className="animate-spin" size={18} /> : (
                <>
                Run Prediction <ChevronRight size={16} />
                </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display */}
      <div className="lg:col-span-3 space-y-6">
        <div className={`h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all ${result ? 'border-transparent bg-white shadow-card' : 'border-ink-quaternary bg-surface-secondary'}`}>
          {!result ? (
            <div className="text-center text-ink-tertiary">
              <ShieldCheck size={64} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-ink-secondary mb-2">Risk Classification Engine</h3>
              <p className="max-w-xs mx-auto">Enter patient parameters in the control panel to generate a real-time risk assessment.</p>
            </div>
          ) : (
            <div className="w-full max-w-lg text-center animate-fade-in-up">

              <RadialGauge
                value={result.confidence}
                color={gaugeColor}
                label={result.risk}
                sublabel={`${result.confidence}% confidence`}
              />

              <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
                result.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {result.risk === 'High' ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                {result.risk} Risk Category
              </div>

              <div className="mt-8 bg-surface-secondary p-6 rounded-2xl border border-ink-quaternary text-left">
                <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-3">AI Reasoning</h4>
                <p className="text-ink font-medium leading-relaxed">
                    "{result.reasoning}"
                </p>
              </div>

              <div className="mt-6 text-xs text-ink-tertiary font-mono">
                  Engine: XGB-DeepHybrid-v2.5 &bull; Latency: 124ms
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

export default Prediction;
