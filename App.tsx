
import React, { useState } from 'react';
import { AppTab, HealthcareRecord } from './types';
import DatasetView from './components/DatasetView';
import Dashboard from './components/Dashboard';
import ModelLab from './components/ModelLab';
import Prediction from './components/Prediction';
import CostForecast from './components/CostForecast';
import ReportGenerator from './components/ReportGenerator';
import { Database, LayoutDashboard, Brain, FileOutput, DollarSign, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DATASET);
  const [dataset, setDataset] = useState<HealthcareRecord[]>([]);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DATASET:
        return <DatasetView data={dataset} onDataUpdate={setDataset} />;
      case AppTab.DASHBOARD:
        return <Dashboard data={dataset} />;
      case AppTab.MODELS:
        return <ModelLab data={dataset} />;
      case AppTab.PREDICTION:
        return <Prediction />;
      case AppTab.COST_FORECAST:
        return <CostForecast />;
      case AppTab.REPORT:
        return <ReportGenerator />;
      default:
        return null;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: AppTab; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
        ${activeTab === tab 
          ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg shadow-lg">
                <Database className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">HealthInsure AI</h1>
                <p className="text-xs text-slate-500 font-medium">Data Science Workbench</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-1 -mb-px overflow-x-auto no-scrollbar">
            <NavButton tab={AppTab.DATASET} icon={Database} label="Dataset" />
            <NavButton tab={AppTab.DASHBOARD} icon={LayoutDashboard} label="Visual Insights" />
            <NavButton tab={AppTab.MODELS} icon={Brain} label="AutoML Lab" />
            <NavButton tab={AppTab.PREDICTION} icon={FileOutput} label="Risk Classifier" />
            <NavButton tab={AppTab.COST_FORECAST} icon={DollarSign} label="Cost Forecaster" />
            <NavButton tab={AppTab.REPORT} icon={FileText} label="Export Report" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        {renderContent()}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; 2024 HealthInsure AI Workbench. Powered by Gemini 2.5 Flash, Keras & TensorFlow.js Concepts.
        </div>
      </footer>
    </div>
  );
};

export default App;
