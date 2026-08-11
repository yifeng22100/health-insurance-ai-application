
import React, { useState } from 'react';
import { HealthcareRecord, ComparisonResult, FeatureSelectionResult } from '../types';
import { runModelComparison, runFeatureSelection } from '../services/geminiService';
import { Play, CheckCircle, BrainCircuit, Activity, Cpu, ScanSearch, BarChart as IconBarChart, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface ModelLabProps {
  data: HealthcareRecord[];
}

const ModelLab: React.FC<ModelLabProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [analyzingFeatures, setAnalyzingFeatures] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [featureResult, setFeatureResult] = useState<FeatureSelectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'benchmark' | 'features'>('benchmark');

  const getSummary = () => `
      Total Records: ${data.length}
      Target: RiskCategory (High/Low)
      Features: 30 (Age, BMI, Income, History, SystolicBP, etc.)
      Sample Row: ${JSON.stringify(data[0])}
    `;

  const handleRunComparison = async () => {
    if (data.length === 0) return;
    setLoading(true);
    try {
      const comparison = await runModelComparison(getSummary());
      setResult(comparison);
      setActiveTab('benchmark');
    } catch (e) {
      alert("Failed to run analysis. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureAnalysis = async () => {
    if (data.length === 0) return;
    setAnalyzingFeatures(true);
    try {
        const features = await runFeatureSelection(getSummary());
        setFeatureResult(features);
        setActiveTab('features');
    } catch (e) {
        alert("Failed to run feature analysis.");
    } finally {
        setAnalyzingFeatures(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
       {/* Hero / Action Section */}
      <div className="bg-gradient-to-br from-ink to-brand-dark text-white p-10 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit size={200} />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur">
               <Cpu className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">AutoML & Feature Lab</h2>
          </div>
          <p className="text-brand-light mb-8 text-lg leading-relaxed max-w-2xl">
            Leverage Google Gemini to benchmark <strong>8 state-of-the-art algorithms</strong> including Keras Deep Learning, 
            or identify the most predictive features in your dataset.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRunComparison}
                disabled={loading || data.length === 0}
                className={`
                  flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg
                  ${loading 
                    ? 'bg-ink/80 cursor-wait text-ink-tertiary'
                    : 'bg-brand hover:bg-brand-dark hover:shadow-brand/50 hover:scale-[1.02] active:scale-[0.98]'}
                `}
              >
                 {loading ? (
                   <>
                    <Activity className="animate-spin" size={20}/>
                    Benchmarking Models...
                   </>
                 ) : (
                   <>
                    <Play fill="currentColor" size={20}/>
                    Run Model Benchmark
                   </>
                 )}
              </button>

              <button
                onClick={handleFeatureAnalysis}
                disabled={analyzingFeatures || data.length === 0}
                className={`
                  flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg border-2
                  ${analyzingFeatures 
                    ? 'border-ink bg-ink/80 cursor-wait text-ink-tertiary' 
                    : 'border-indigo-400 text-indigo-100 hover:bg-white/10 hover:border-white hover:text-white'}
                `}
              >
                 {analyzingFeatures ? (
                   <>
                    <ScanSearch className="animate-spin" size={20}/>
                    Scanning Features...
                   </>
                 ) : (
                   <>
                    <IconBarChart size={20}/>
                    Run Feature Selection
                   </>
                 )}
              </button>
          </div>
          
          {data.length === 0 && (
             <div className="mt-6 flex items-center gap-2 text-red-300 bg-red-900/30 px-4 py-2 rounded-lg w-fit text-sm">
                <Activity size={16} /> Please load or generate a dataset first.
             </div>
          )}
        </div>
      </div>

      {/* Results */}
      {(result || featureResult) && (
        <div className="animate-fade-in-up">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-ink-quaternary mb-6">
            {result && (
              <button
                onClick={() => setActiveTab('benchmark')}
                className={`px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
                  activeTab === 'benchmark' ? 'border-brand text-brand' : 'border-transparent text-ink-secondary hover:text-ink'
                }`}
              >
                <Activity size={16} /> Model Benchmark
              </button>
            )}
            {featureResult && (
              <button
                onClick={() => setActiveTab('features')}
                className={`px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
                  activeTab === 'features' ? 'border-brand text-brand' : 'border-transparent text-ink-secondary hover:text-ink'
                }`}
              >
                <ScanSearch size={16} /> Feature Importance
              </button>
            )}
          </div>

          {/* Feature Selection Results */}
          {featureResult && activeTab === 'features' && (
            <div className="bg-white rounded-2xl shadow-card border border-ink-quaternary overflow-hidden">
                <div className="p-6 border-b border-ink-quaternary bg-surface-secondary/50">
                    <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                        <ScanSearch className="text-indigo-600" size={20}/>
                        Predictive Feature Importance
                    </h3>
                    <p className="text-xs text-ink-secondary mt-1 uppercase tracking-wider font-bold">Methodology: {featureResult.methodology}</p>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={featureResult.topFeatures}
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="feature" width={100} tick={{fontSize: 12, fontWeight: 600, fill: '#475569'}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="importance" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={16}>
                                     {/* Optional cells */}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {featureResult.topFeatures.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-surface-secondary rounded-xl border border-ink-quaternary hover:border-indigo-100 transition-colors">
                                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                     {idx + 1}
                                 </div>
                                 <div>
                                     <div className="flex items-center gap-2 mb-1">
                                         <span className="font-bold text-ink">{item.feature}</span>
                                         <div className="flex-1 h-1.5 bg-surface-tertiary rounded-full w-24">
                                             <div className="h-1.5 bg-indigo-500 rounded-full" style={{width: `${item.importance}%`}}></div>
                                         </div>
                                     </div>
                                     <p className="text-sm text-ink-secondary leading-relaxed">{item.reason}</p>
                                 </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {/* Model Benchmark Results */}
          {result && activeTab === 'benchmark' && (
            <div className="space-y-6">
               {/* Insights Panel */}
               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl shadow-sm flex gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full h-fit">
                     <CheckCircle size={24} />
                  </div>
                  <div>
                     <h3 className="text-emerald-900 font-bold text-lg mb-2">
                        Champion Model: {result.bestModel}
                     </h3>
                     <p className="text-emerald-800 leading-relaxed text-sm opacity-90">
                        {result.insights}
                     </p>
                  </div>
               </div>

               {/* Metrics Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary">
                    <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
                       <Activity size={18} className="text-brand" /> Tuning Impact
                    </h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={result.metrics}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" domain={[0, 1]} hide />
                          <YAxis type="category" dataKey="name" width={110} tick={{fontSize: 11, fontWeight: 600, fill: '#64748b'}} />
                          <Tooltip formatter={(val: number) => `${(val * 100).toFixed(1)}%`} contentStyle={{borderRadius: '8px'}} />
                          <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                          <Bar dataKey="accuracyBefore" name="Base Model" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={8} />
                          <Bar dataKey="accuracyAfter" name="Tuned Model" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Metrics Table */}
                  <div className="bg-white rounded-2xl shadow-card border border-ink-quaternary overflow-hidden flex flex-col">
                     <div className="p-6 border-b border-ink-quaternary">
                        <h3 className="text-lg font-bold text-ink">Technical Specifications</h3>
                     </div>
                     <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-surface-secondary text-ink-secondary font-bold uppercase text-xs tracking-wider border-b border-ink-quaternary">
                            <tr>
                              <th className="px-6 py-4">Algorithm</th>
                              <th className="px-6 py-4">Architecture / Params</th>
                              <th className="px-6 py-4 text-right">F1 Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ink-quaternary">
                            {result.metrics.map((m) => (
                              <tr key={m.name} className={`hover:bg-surface-secondary transition-colors ${m.name === result.bestModel ? 'bg-emerald-50/50' : ''}`}>
                                 <td className="px-6 py-4 font-bold text-ink align-top w-1/3">
                                    {m.name}
                                    {m.name === result.bestModel && (
                                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                                          Winner
                                       </span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 align-top">
                                    <span className={`text-[10px] px-2 py-0.5 rounded border mb-2 inline-block font-mono font-semibold ${m.type === 'DL' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-surface-tertiary text-ink-secondary border-ink-quaternary'}`}>
                                      {m.type}
                                    </span>
                                    <p className="text-xs text-ink-secondary leading-relaxed">{m.details}</p>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-ink text-right align-top font-bold text-base">
                                    {m.f1Score.toFixed(3)}
                                 </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelLab;
