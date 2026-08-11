
import React, { useState } from 'react';
import { HealthcareRecord } from '../types';
import { Upload, RefreshCw, Database, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { generateDataset } from '../utils/dataGenerator';

interface DatasetViewProps {
  data: HealthcareRecord[];
  onDataUpdate: (newData: HealthcareRecord[]) => void;
}

const RISK_FILTERS: Array<'All' | 'High' | 'Low'> = ['All', 'High', 'Low'];

const DatasetView: React.FC<DatasetViewProps> = ({ data, onDataUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [genCount, setGenCount] = useState(1000);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Low'>('All');
  const rowsPerPage = 12;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = generateDataset(genCount);
      onDataUpdate(newData);
      setLoading(false);
      setPage(1);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Loaded ${file.name} successfully (Simulation)`);
    }
  };

  const cycleRiskFilter = () => {
    setRiskFilter(prev => RISK_FILTERS[(RISK_FILTERS.indexOf(prev) + 1) % RISK_FILTERS.length]);
    setPage(1);
  };

  const filteredData = data.filter(row => {
    if (riskFilter !== 'All' && row.riskCategory !== riskFilter) return false;
    if (search.trim() && !String(row.id).includes(search.trim())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const displayedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Control Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Title & Description */}
          <div className="flex items-start gap-4 max-w-lg">
             <div className="p-3 bg-brand-light text-brand rounded-xl mt-1">
               <Database size={24}/>
             </div>
             <div>
               <h2 className="text-xl font-bold text-ink">Dataset Configuration</h2>
               <p className="text-ink-secondary text-sm mt-1 leading-relaxed">
                 Configure parameters to generate synthetic healthcare records. Adjust sample size and feature complexity for model training.
               </p>
             </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto bg-surface-secondary p-4 rounded-xl border border-ink-quaternary">
             
             {/* Slider Control */}
             <div className="flex flex-col gap-2 w-full sm:w-48">
               <div className="flex justify-between text-xs font-bold text-ink-secondary uppercase tracking-wide">
                 <span>Records</span>
                 <span className="text-brand">{genCount.toLocaleString()}</span>
               </div>
               <input 
                 type="range" 
                 min="1000" 
                 max="10000" 
                 step="1000" 
                 value={genCount} 
                 onChange={(e) => setGenCount(Number(e.target.value))}
                 className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand"
               />
               <div className="flex justify-between text-[10px] text-ink-tertiary font-medium">
                 <span>1k</span>
                 <span>10k</span>
               </div>
             </div>

             {/* Divider */}
             <div className="hidden sm:block w-px h-10 bg-surface-tertiary"></div>

             {/* Feature Toggle */}
             <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-ink-secondary uppercase tracking-wide">Columns</span>
                <button 
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    showAdvancedFeatures 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                      : 'bg-white text-ink-secondary border-ink-quaternary hover:border-ink-tertiary'
                  }`}
                >
                  {showAdvancedFeatures ? <Eye size={14}/> : <EyeOff size={14}/>}
                  {showAdvancedFeatures ? '25+ Features' : 'Basic'}
                </button>
             </div>

             {/* Actions */}
             <div className="flex items-center gap-2">
               <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all shadow-md shadow-brand-light text-sm font-bold active:scale-95 whitespace-nowrap"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                Regenerate
              </button>

               <label className="p-2.5 bg-white border border-ink-quaternary rounded-lg text-ink-secondary hover:text-brand hover:border-brand/30 cursor-pointer transition-all shadow-sm group" title="Upload CSV">
                <Upload size={18} className="group-hover:scale-110 transition-transform"/>
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              </label>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-ink-quaternary">
          <div className="bg-surface-secondary p-6 rounded-full mb-4">
            <RefreshCw className="text-ink-tertiary animate-spin" size={48} />
          </div>
          <h3 className="text-lg font-bold text-ink">Initializing Dataset...</h3>
          <p className="text-ink-secondary max-w-md text-center mt-2">
            Generating 1,000 synthetic patient records with 25 statistical features.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-ink-quaternary overflow-hidden flex flex-col h-[600px] animate-fade-in-up">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-ink-quaternary flex justify-between items-center bg-surface-secondary/50">
             <div className="flex items-center gap-2 text-sm text-ink-secondary">
                <span className="font-semibold text-ink">{filteredData.length.toLocaleString()}</span> Records
                <span className="text-ink-tertiary">|</span>
                <span className="font-semibold text-ink">{showAdvancedFeatures ? '37' : '20'}</span> Features
             </div>
             <div className="flex gap-2">
                <button
                  onClick={cycleRiskFilter}
                  title="Cycle risk filter"
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-colors border ${
                    riskFilter === 'All'
                      ? 'text-ink-tertiary border-transparent hover:text-brand hover:bg-brand-light'
                      : riskFilter === 'High'
                        ? 'text-red-600 bg-red-50 border-red-100'
                        : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  }`}
                >
                   <Filter size={16} />
                   {riskFilter === 'All' ? 'All Risk' : `${riskFilter} Risk`}
                </button>
                <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                   <input
                      type="text"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search Patient ID..."
                      className="pl-9 pr-4 py-1.5 text-sm border border-ink-quaternary rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand w-48"
                   />
                </div>
             </div>
          </div>

          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-sm text-left whitespace-nowrap relative">
              <thead className="bg-surface-secondary text-ink-secondary font-bold uppercase text-xs tracking-wider border-b border-ink-quaternary sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 bg-surface-secondary">ID</th>
                  <th className="px-6 py-4 bg-surface-secondary">Demographics</th>
                  <th className="px-6 py-4 bg-surface-secondary">BMI Status</th>
                  {showAdvancedFeatures && <th className="px-6 py-4 bg-surface-secondary">Vitals (BP/HR)</th>}
                  {showAdvancedFeatures && <th className="px-6 py-4 bg-surface-secondary">Lab Results</th>}
                  <th className="px-6 py-4 bg-surface-secondary">Lifestyle</th>
                  <th className="px-6 py-4 bg-surface-secondary">Premium</th>
                  <th className="px-6 py-4 bg-surface-secondary text-right">Risk Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-quaternary">
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={showAdvancedFeatures ? 8 : 6} className="px-6 py-16 text-center text-ink-secondary">
                      No records match your search or filter.
                    </td>
                  </tr>
                )}
                {displayedData.map((row) => (
                  <tr key={row.id} className="hover:bg-brand-light/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-ink-tertiary group-hover:text-brand">#{row.id}</td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="font-semibold text-ink">{row.age} yrs • {row.gender}</span>
                          <span className="text-xs text-ink-tertiary">{row.maritalStatus} • {row.occupation}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.bmi > 30 ? 'bg-orange-100 text-orange-700' : 'bg-surface-tertiary text-ink-secondary'}`}>
                            BMI {row.bmi}
                          </span>
                          {showAdvancedFeatures && <span className="text-[10px] text-ink-tertiary">Body Fat: {row.bodyFat}%</span>}
                      </div>
                    </td>
                    
                    {showAdvancedFeatures && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                         <span className={`font-mono font-medium ${row.systolicBP > 140 ? 'text-red-600' : 'text-ink-secondary'}`}>
                            BP: {row.systolicBP}/{row.diastolicBP}
                         </span>
                         <span className="text-xs text-ink-secondary flex items-center gap-1">
                           HR: {row.heartRate} bpm
                         </span>
                      </div>
                    </td>
                    )}

                    {showAdvancedFeatures && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                         <div className="flex justify-between w-24">
                           <span className="text-ink-secondary">HbA1c:</span>
                           <span className={`font-bold ${row.hba1c > 6.0 ? 'text-orange-600' : 'text-ink'}`}>{row.hba1c}%</span>
                         </div>
                         <div className="flex justify-between w-24">
                           <span className="text-ink-secondary">SpO2:</span>
                           <span className={`font-bold ${row.oxygenSaturation < 95 ? 'text-red-600' : 'text-emerald-700'}`}>{row.oxygenSaturation}%</span>
                         </div>
                      </div>
                    </td>
                    )}

                    <td className="px-6 py-4">
                       <div className="flex gap-1">
                          {row.smoker === 'Yes' && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded border border-red-200">Smoker</span>}
                          {row.alcoholConsump === 'Heavy' && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded border border-orange-200">Alcohol</span>}
                          {row.smoker === 'No' && row.alcoholConsump !== 'Heavy' && <span className="text-ink-tertiary text-xs">-</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-ink">
                        ${row.annualPremium.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                           row.riskCategory === 'High' 
                           ? 'bg-red-50 text-red-700 border-red-100' 
                           : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                        {row.riskCategory.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-ink-quaternary bg-surface-secondary">
             <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm hover:text-brand rounded-lg border border-transparent hover:border-ink-quaternary transition-all"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-ink-tertiary uppercase tracking-widest">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm hover:text-brand rounded-lg border border-transparent hover:border-ink-quaternary transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetView;
