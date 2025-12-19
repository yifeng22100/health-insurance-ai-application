
import React, { useState, useEffect } from 'react';
import { HealthcareRecord } from '../types';
import { Upload, RefreshCw, Database, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { generateDataset } from '../utils/dataGenerator';

interface DatasetViewProps {
  data: HealthcareRecord[];
  onDataUpdate: (newData: HealthcareRecord[]) => void;
}

const DatasetView: React.FC<DatasetViewProps> = ({ data, onDataUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [genCount, setGenCount] = useState(1000);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  // Auto-generate data on mount if empty
  useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
      // Small delay to allow UI to paint
      setTimeout(() => {
        const newData = generateDataset(1000);
        onDataUpdate(newData);
        setLoading(false);
      }, 100);
    }
  }, []);

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

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Control Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Title & Description */}
          <div className="flex items-start gap-4 max-w-lg">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mt-1">
               <Database size={24}/>
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">Dataset Configuration</h2>
               <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                 Configure parameters to generate synthetic healthcare records. Adjust sample size and feature complexity for model training.
               </p>
             </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
             
             {/* Slider Control */}
             <div className="flex flex-col gap-2 w-full sm:w-48">
               <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                 <span>Records</span>
                 <span className="text-blue-600">{genCount.toLocaleString()}</span>
               </div>
               <input 
                 type="range" 
                 min="1000" 
                 max="10000" 
                 step="1000" 
                 value={genCount} 
                 onChange={(e) => setGenCount(Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                 <span>1k</span>
                 <span>10k</span>
               </div>
             </div>

             {/* Divider */}
             <div className="hidden sm:block w-px h-10 bg-slate-200"></div>

             {/* Feature Toggle */}
             <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Columns</span>
                <button 
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    showAdvancedFeatures 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
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
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 text-sm font-bold active:scale-95 whitespace-nowrap"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                Regenerate
              </button>

               <label className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 cursor-pointer transition-all shadow-sm group" title="Upload CSV">
                <Upload size={18} className="group-hover:scale-110 transition-transform"/>
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              </label>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <RefreshCw className="text-slate-300 animate-spin" size={48} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Initializing Dataset...</h3>
          <p className="text-slate-500 max-w-md text-center mt-2">
            Generating 1,000 synthetic patient records with 25 statistical features.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] animate-fade-in-up">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{data.length.toLocaleString()}</span> Records
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-slate-700">{showAdvancedFeatures ? '37' : '20'}</span> Features
             </div>
             <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                   <Filter size={18} />
                </button>
                <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Search Patient ID..." 
                      className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-48"
                   />
                </div>
             </div>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left whitespace-nowrap relative">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 bg-slate-50">ID</th>
                  <th className="px-6 py-4 bg-slate-50">Demographics</th>
                  <th className="px-6 py-4 bg-slate-50">BMI Status</th>
                  {showAdvancedFeatures && <th className="px-6 py-4 bg-slate-50">Vitals (BP/HR)</th>}
                  {showAdvancedFeatures && <th className="px-6 py-4 bg-slate-50">Lab Results</th>}
                  <th className="px-6 py-4 bg-slate-50">Lifestyle</th>
                  <th className="px-6 py-4 bg-slate-50">Premium</th>
                  <th className="px-6 py-4 bg-slate-50 text-right">Risk Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-slate-400 group-hover:text-blue-600">#{row.id}</td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{row.age} yrs • {row.gender}</span>
                          <span className="text-xs text-slate-400">{row.maritalStatus} • {row.occupation}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.bmi > 30 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                            BMI {row.bmi}
                          </span>
                          {showAdvancedFeatures && <span className="text-[10px] text-slate-400">Body Fat: {row.bodyFat}%</span>}
                      </div>
                    </td>
                    
                    {showAdvancedFeatures && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                         <span className={`font-mono font-medium ${row.systolicBP > 140 ? 'text-red-600' : 'text-slate-600'}`}>
                            BP: {row.systolicBP}/{row.diastolicBP}
                         </span>
                         <span className="text-xs text-slate-500 flex items-center gap-1">
                           HR: {row.heartRate} bpm
                         </span>
                      </div>
                    </td>
                    )}

                    {showAdvancedFeatures && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                         <div className="flex justify-between w-24">
                           <span className="text-slate-500">HbA1c:</span>
                           <span className={`font-bold ${row.hba1c > 6.0 ? 'text-orange-600' : 'text-slate-700'}`}>{row.hba1c}%</span>
                         </div>
                         <div className="flex justify-between w-24">
                           <span className="text-slate-500">SpO2:</span>
                           <span className={`font-bold ${row.oxygenSaturation < 95 ? 'text-red-600' : 'text-emerald-700'}`}>{row.oxygenSaturation}%</span>
                         </div>
                      </div>
                    </td>
                    )}

                    <td className="px-6 py-4">
                       <div className="flex gap-1">
                          {row.smoker === 'Yes' && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded border border-red-200">Smoker</span>}
                          {row.alcoholConsump === 'Heavy' && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded border border-orange-200">Alcohol</span>}
                          {row.smoker === 'No' && row.alcoholConsump !== 'Heavy' && <span className="text-slate-400 text-xs">-</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
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
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50">
             <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm hover:text-blue-600 rounded-lg border border-transparent hover:border-slate-200 transition-all"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm hover:text-blue-600 rounded-lg border border-transparent hover:border-slate-200 transition-all"
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
