
import React, { useState } from 'react';
import { predictRisk } from '../services/geminiService';
import { ShieldCheck, AlertTriangle, Activity, Sliders, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const prediction = await predictRisk(form);
    setResult(prediction);
    setLoading(false);
  };

  const getGaugeColor = (risk: string) => risk === 'High' ? '#ef4444' : '#10b981';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Control Panel */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary h-fit">
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
            <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Smoker Status</label>
            <select name="smoker" value={form.smoker} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm font-medium text-ink">
              <option value="No">Non-Smoker</option>
              <option value="Yes">Smoker</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-ink-secondary uppercase">Stress Level</label>
                <span className="text-xs font-bold text-brand bg-brand-light px-2 rounded">{form.stressLevel}/10</span>
            </div>
            <input type="range" min="1" max="10" name="stressLevel" value={form.stressLevel} onChange={handleChange} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand" />
          </div>
          
          <div className="bg-surface-secondary p-4 rounded-lg border border-ink-quaternary">
             <span className="text-xs font-bold text-ink-secondary uppercase block mb-3">Medical History</span>
             <div className="space-y-3">
                 <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="historyHeartDisease" checked={form.historyHeartDisease} onChange={handleChange} className="w-4 h-4 text-brand rounded focus:ring-brand border-ink-tertiary" />
                    <span className="text-sm text-ink-secondary group-hover:text-ink transition-colors">Heart Disease</span>
                 </label>
                 <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="historyDiabetes" checked={form.historyDiabetes} onChange={handleChange} className="w-4 h-4 text-brand rounded focus:ring-brand border-ink-tertiary" />
                    <span className="text-sm text-ink-secondary group-hover:text-ink transition-colors">Diabetes</span>
                 </label>
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
      <div className="lg:col-span-2 space-y-6">
        <div className={`h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all ${result ? 'border-transparent bg-white shadow-sm' : 'border-ink-quaternary bg-surface-secondary'}`}>
          {!result ? (
            <div className="text-center text-ink-tertiary">
              <ShieldCheck size={64} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-ink-secondary mb-2">Risk Classification Engine</h3>
              <p className="max-w-xs mx-auto">Enter patient parameters in the control panel to generate a real-time risk assessment.</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl text-center animate-fade-in-up">
              
              {/* Main Score Card */}
              <div className="bg-gradient-to-br from-ink to-ink/80 text-white p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-xs font-bold tracking-[0.2em] text-ink-tertiary uppercase">Predicted Category</span>
                    <div className={`mt-4 text-6xl font-black flex items-center justify-center gap-4 ${result.risk === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.risk === 'High' ? <AlertTriangle size={56} /> : <ShieldCheck size={56} />}
                    {result.risk}
                    </div>
                  </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Reasoning */}
                 <div className="bg-white p-6 rounded-xl border border-ink-quaternary shadow-sm text-left">
                    <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-3">AI Reasoning</h4>
                    <p className="text-ink font-medium leading-relaxed">
                        "{result.reasoning}"
                    </p>
                 </div>

                 {/* Confidence Gauge */}
                 <div className="bg-white p-6 rounded-xl border border-ink-quaternary shadow-sm flex flex-col items-center">
                    <div className="text-xs text-ink-secondary font-bold uppercase tracking-wider mb-2">Model Confidence</div>
                    <div className="h-32 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: result.confidence }, { value: 100 - result.confidence }]}
                                    cx="50%"
                                    cy="100%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill={getGaugeColor(result.risk)} />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-x-0 bottom-0 flex justify-center items-end">
                            <span className="text-3xl font-black text-ink leading-none">{result.confidence}%</span>
                        </div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 text-xs text-ink-tertiary font-mono">
                  Engine: XGB-DeepHybrid-v2.5 &bull; Latency: 124ms
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
