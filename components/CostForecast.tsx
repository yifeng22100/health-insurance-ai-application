
import React, { useState } from 'react';
import { predictPremium } from '../services/geminiService';
import { DollarSign, TrendingUp, Activity, User, Heart, ChevronRight, Calculator } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CostForecast: React.FC = () => {
  const [form, setForm] = useState({
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
    const prediction = await predictPremium(form);
    setResult(prediction);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Control Panel */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
             <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
               <Calculator size={20} />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Parameters</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                  <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BMI Score</label>
                  <input type="number" step="0.1" name="bmi" value={form.bmi} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700" />
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Smoker Status</label>
              <select name="smoker" value={form.smoker} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700">
                <option value="No">Non-Smoker</option>
                <option value="Yes">Smoker</option>
              </select>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-3">Medical History</span>
              <div className="space-y-3">
                 <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="historyHeartDisease" checked={form.historyHeartDisease} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">Heart Disease</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="historyDiabetes" checked={form.historyDiabetes} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">Diabetes</span>
                </label>
                 <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" name="historyCancer" checked={form.historyCancer} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">Cancer History</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-emerald-200"
            >
              {loading ? <Activity className="animate-spin" size={18} /> : (
                 <>
                 Calculate Premium <ChevronRight size={16} />
                 </>
              )}
            </button>
          </form>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-6">
         <div className={`h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all ${result ? 'border-transparent bg-white shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
         {!result ? (
           <div className="text-center text-slate-400">
              <DollarSign size={64} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-xl font-bold text-slate-500 mb-2">Cost Forecasting Engine</h3>
              <p className="max-w-xs mx-auto">Enter patient parameters to perform an actuarial regression analysis for premium estimation.</p>
           </div>
         ) : (
           <div className="w-full max-w-2xl text-center animate-fade-in-up">
              
              {/* Main Score Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
                 <div className="relative z-10 text-center">
                    <p className="text-emerald-300 font-bold uppercase tracking-[0.2em] text-xs mb-4">Estimated Annual Premium</p>
                    <h2 className="text-6xl font-black mb-2 tracking-tight">${result.estimatedPremium.toLocaleString()}</h2>
                    <p className="text-slate-400 font-medium">Confidence Interval: ${result.rangeLow.toLocaleString()} - ${result.rangeHigh.toLocaleString()}</p>
                 </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-500"/>
                      Primary Cost Drivers
                    </h4>
                    <ul className="space-y-3">
                      {result.factors.map((factor, i) => (
                        <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 text-sm font-medium">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                           {factor}
                        </li>
                      ))}
                    </ul>
                 </div>
                 
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-left">5-Year Cost Projection</h4>
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
  );
};

export default CostForecast;
