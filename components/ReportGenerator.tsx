
import React, { useState } from 'react';
import { predictRisk, predictPremium, generateExecutiveSummary } from '../services/geminiService';
import { FileText, Printer, Activity, User, ShieldAlert, TrendingUp, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = ['Demographics', 'Vitals', 'Medical History', 'Coverage'] as const;

const ReportGenerator: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    id: `PID-${Math.floor(Math.random() * 90000) + 10000}`,
    age: 45,
    gender: 'Male',
    bmi: 26.5,
    smoker: 'No',
    systolicBP: 120,
    diastolicBP: 80,
    historyHeartDisease: false,
    historyDiabetes: false,
    historyCancer: false,
    employmentType: 'Salaried',
    coverageAmount: 250000
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    risk: any;
    cost: any;
    summary: string;
    generatedAt: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' || type === 'range') ? Number(value) : value
    }));
  };

  const toggleFlag = (key: 'historyHeartDisease' | 'historyDiabetes' | 'historyCancer') => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Run all AI services in parallel
      const [riskRes, costRes] = await Promise.all([
        predictRisk(form),
        predictPremium(form)
      ]);

      // Generate summary based on the results
      const summaryRes = await generateExecutiveSummary(form, riskRes, costRes);

      setReport({
        risk: riskRes,
        cost: costRes,
        summary: summaryRes,
        generatedAt: new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      });
    } catch (error) {
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-white print:min-h-0">
      {/* Page header */}
      <div className="bg-surface-secondary border-b border-ink-quaternary pt-10 pb-8 px-5 print:hidden">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Report Generator</p>
          <h1 className="text-[28px] font-bold text-ink tracking-tight">Build an underwriting report.</h1>
          <p className="text-ink-secondary text-[14px] mt-2 max-w-[580px]">
            Walk through a short intake, then generate a print-ready document combining AI risk classification,
            premium forecasting, and an executive summary.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 py-8 print:p-0 print:max-w-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in print:block">
      {/* Hide Input Form when printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { grid-column: span 3 !important; width: 100% !important; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .report-container { box-shadow: none !important; border: none !important; padding: 0 !important; }
          @page { margin: 2cm; }
        }
      `}</style>

      {/* Input Wizard */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary no-print h-fit">
        {/* Step progress */}
        <div className="flex items-center gap-1 mb-6">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <button
                onClick={() => setStep(i)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  i < step ? 'bg-brand text-white' : i === step ? 'bg-ink text-white' : 'bg-surface-tertiary text-ink-tertiary'
                }`}
                title={label}
              >
                {i < step ? <Check size={13} /> : i + 1}
              </button>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-brand' : 'bg-surface-tertiary'}`} />}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-5">
          Step {step + 1} of {STEPS.length} &middot; {STEPS[step]}
        </p>

        <div className="space-y-4 min-h-[260px]">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">BMI</label>
                  <input type="number" step="0.1" name="bmi" value={form.bmi} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Smoker</label>
                  <select name="smoker" value={form.smoker} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Systolic BP</label>
                  <input type="number" name="systolicBP" value={form.systolicBP} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Diastolic BP</label>
                  <input type="number" name="diastolicBP" value={form.diastolicBP} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface-secondary p-4 rounded-lg border border-ink-quaternary animate-fade-in">
              <span className="text-xs font-bold text-ink-secondary uppercase block mb-3">Medical History</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'historyHeartDisease' as const, label: 'Heart Disease' },
                  { key: 'historyDiabetes' as const, label: 'Diabetes' },
                  { key: 'historyCancer' as const, label: 'Cancer History' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFlag(key)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                      form[key] ? 'bg-brand text-white border-brand' : 'bg-white text-ink-secondary border-ink-quaternary hover:border-brand hover:text-brand'
                    }`}
                  >
                    {label}
                    {form[key] && <Check size={15} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-ink-secondary uppercase mb-1">Employment Type</label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full px-3 py-2 border border-ink-quaternary rounded-lg focus:ring-2 focus:ring-ink-secondary text-sm font-medium">
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                  <option>Freelancer</option>
                  <option>Unemployed</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-ink-secondary uppercase">Coverage Amount</label>
                  <span className="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded">${form.coverageAmount.toLocaleString()}</span>
                </div>
                <input type="range" min="10000" max="1000000" step="10000" name="coverageAmount" value={form.coverageAmount} onChange={handleChange} className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand" />
              </div>
            </div>
          )}
        </div>

        {/* Wizard nav */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-ink-quaternary">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-3 py-2.5 rounded-lg text-sm font-semibold text-ink-secondary border border-ink-quaternary disabled:opacity-40 disabled:cursor-not-allowed hover:border-ink-tertiary transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={15} /> Back
          </button>
          {!isLastStep ? (
            <button
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-ink hover:bg-ink/80 transition-colors flex items-center justify-center gap-1"
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-brand hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand/30 disabled:opacity-70"
            >
              {loading ? <Activity className="animate-spin" size={16} /> : <FileText size={16} />}
              Generate Full Report
            </button>
          )}
        </div>
      </div>

      {/* Report Preview Section */}
      <div className="lg:col-span-2 print-full">
         {!report ? (
           <div className="h-full min-h-[500px] bg-surface-tertiary border-2 border-dashed border-ink-tertiary rounded-xl flex flex-col items-center justify-center text-ink-tertiary no-print">
             <FileText size={64} className="mb-4 opacity-30" />
             <h3 className="text-xl font-bold text-ink-secondary mb-2">Report Preview</h3>
             <p className="font-medium text-ink-tertiary">Complete the intake steps and generate to view the actuarial document.</p>
           </div>
         ) : (
           <div className="flex flex-col gap-4">
              <div className="flex justify-end no-print">
                 <button
                   onClick={handlePrint}
                   className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark font-bold text-sm shadow-md transition-colors"
                 >
                   <Printer size={16} />
                   Print / Save PDF
                 </button>
              </div>

              {/* The "Paper" Document */}
              <div className="bg-white p-12 rounded-xl shadow-lg border border-ink-quaternary report-container min-h-[800px] text-ink relative overflow-hidden">

                 {/* Decorative Top Border */}
                 <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-brand to-indigo-700"></div>

                 {/* Header */}
                 <div className="flex justify-between items-start border-b-2 border-ink-quaternary pb-8 mb-8">
                    <div className="flex gap-4">
                       <div className="bg-ink text-white p-3 rounded-lg h-fit">
                          <Activity size={32} />
                       </div>
                       <div>
                          <h1 className="text-3xl font-bold tracking-tight text-ink">HealthInsure AI</h1>
                          <p className="text-ink-secondary font-medium text-sm mt-1">Automated Underwriting & Risk Analysis</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="inline-block bg-surface-tertiary text-ink-secondary text-xs font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider">
                         Confidential
                       </div>
                       <div className="text-sm text-ink-tertiary font-mono">ID: {form.id}</div>
                       <div className="text-sm font-semibold text-ink">{report.generatedAt}</div>
                    </div>
                 </div>

                 {/* 1. Patient Profile */}
                 <div className="mb-8">
                    <h2 className="text-xs font-bold text-ink uppercase tracking-[0.2em] border-b border-ink-quaternary pb-3 mb-6 flex items-center gap-2">
                      <User size={14} className="text-brand"/> Patient Profile
                    </h2>
                    <div className="bg-surface-secondary rounded-lg border border-ink-quaternary p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">Age / Gender</span>
                          <span className="text-base font-bold text-ink">{form.age} / {form.gender}</span>
                        </div>
                        <div>
                          <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">Employment</span>
                          <span className="text-base font-bold text-ink">{form.employmentType}</span>
                        </div>
                        <div>
                           <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">BMI Score</span>
                           <span className={`text-base font-bold ${form.bmi > 30 ? 'text-orange-600' : 'text-ink'}`}>
                              {form.bmi}
                           </span>
                        </div>
                        <div>
                           <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">Blood Pressure</span>
                           <span className="text-base font-bold text-ink">{form.systolicBP}/{form.diastolicBP}</span>
                        </div>
                        <div>
                           <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">Coverage Amount</span>
                           <span className="text-base font-bold text-ink">${form.coverageAmount.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 md:col-span-4 border-t border-ink-quaternary pt-4 mt-2 flex gap-12 flex-wrap">
                            <div>
                                <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">Smoker Status</span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-sm font-bold ${form.smoker === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                   {form.smoker}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-ink-tertiary font-bold uppercase block mb-1">Medical Flags</span>
                                <div className="flex gap-3 text-sm font-bold flex-wrap">
                                    {form.historyHeartDisease && <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">Heart Disease</span>}
                                    {form.historyDiabetes && <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Diabetes</span>}
                                    {form.historyCancer && <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">Cancer History</span>}
                                    {!form.historyHeartDisease && !form.historyDiabetes && !form.historyCancer && <span className="text-ink-tertiary">None Reported</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* 2. Executive Summary */}
                 <div className="mb-10">
                    <h2 className="text-xs font-bold text-ink uppercase tracking-[0.2em] border-b border-ink-quaternary pb-3 mb-6 flex items-center gap-2">
                       <FileText size={14} className="text-brand"/> Executive Summary
                    </h2>
                    <div className="p-6 bg-brand-light/50 border-l-4 border-brand text-ink leading-loose font-serif text-lg text-justify">
                       {report.summary}
                    </div>
                 </div>

                 {/* 3. Detailed Analysis Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    {/* Risk Classification Card */}
                    <div className="border border-ink-quaternary rounded-xl overflow-hidden shadow-sm">
                       <div className="bg-surface-secondary px-6 py-4 border-b border-ink-quaternary flex justify-between items-center">
                          <h3 className="font-bold text-ink text-xs uppercase tracking-wider">Risk Classification</h3>
                          <ShieldAlert size={18} className="text-ink-tertiary"/>
                       </div>
                       <div className="p-6">
                           <div className="flex items-center justify-between mb-6">
                              <span className="text-ink-secondary text-sm font-medium">Predicted Level</span>
                              <span className={`text-xl font-extrabold px-3 py-1 rounded ${report.risk.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                 {report.risk.risk} Risk
                              </span>
                           </div>

                           <div className="mb-2">
                             <div className="flex justify-between text-[10px] font-bold text-ink-tertiary mb-1 uppercase tracking-wider">
                               <span>Model Confidence</span>
                               <span>{report.risk.confidence}%</span>
                             </div>
                             <div className="w-full bg-surface-tertiary rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-1000 ${report.risk.risk === 'High' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                  style={{width: `${report.risk.confidence}%`}}
                                ></div>
                             </div>
                           </div>

                           <p className="mt-6 text-sm text-ink-secondary italic bg-surface-secondary p-4 rounded border border-ink-quaternary">
                             "{report.risk.reasoning}"
                           </p>
                       </div>
                    </div>

                    {/* Actuarial Forecast Card */}
                    <div className="border border-ink-quaternary rounded-xl overflow-hidden shadow-sm">
                       <div className="bg-ink px-6 py-4 border-b border-ink/80 flex justify-between items-center">
                          <h3 className="font-bold text-ink-quaternary text-xs uppercase tracking-wider">Actuarial Forecast</h3>
                          <TrendingUp size={18} className="text-ink-tertiary"/>
                       </div>
                       <div className="p-6 bg-white">
                           <div className="flex flex-col mb-6">
                              <span className="text-ink-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Est. Annual Premium</span>
                              <span className="text-4xl font-extrabold text-ink tracking-tight">
                                 ${report.cost.estimatedPremium.toLocaleString()}
                              </span>
                              <span className="text-xs text-ink-tertiary font-bold mt-1">
                                 Range: ${report.cost.rangeLow.toLocaleString()} - ${report.cost.rangeHigh.toLocaleString()}
                              </span>
                           </div>

                           <div className="space-y-2 pt-4 border-t border-ink-quaternary">
                              <p className="text-[10px] font-bold uppercase text-ink-tertiary mb-2">Key Cost Drivers</p>
                              {report.cost.factors.map((f: string, i: number) => (
                                 <div key={i} className="flex items-center gap-2 text-sm font-medium text-ink bg-surface-secondary p-2 rounded border border-ink-quaternary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                    {f}
                                 </div>
                              ))}
                           </div>
                       </div>
                    </div>
                 </div>

                 {/* Footer */}
                 <div className="border-t-2 border-ink-quaternary pt-6 mt-auto">
                    <div className="flex justify-between items-center text-xs text-ink-tertiary font-medium">
                       <p>&copy; {new Date().getFullYear()} HealthInsure AI Analytics.</p>
                       <p className="font-mono">SYS-V2.5-BETA</p>
                    </div>
                 </div>
              </div>
           </div>
         )}
      </div>
      </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
