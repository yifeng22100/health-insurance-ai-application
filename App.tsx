import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HealthcareRecord } from './types';
import { generateDataset } from './utils/dataGenerator';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import HealthTips from './pages/HealthTips';
import About from './pages/About';
import DatasetView from './components/DatasetView';
import ModelLab from './components/ModelLab';
import Prediction from './components/Prediction';
import CostForecast from './components/CostForecast';
import ReportGenerator from './components/ReportGenerator';

// Dashboard pulls in Plotly (a large charting library), so it's split into its own
// chunk and only downloaded when the Insights page is actually visited.
const Dashboard = lazy(() => import('./components/Dashboard'));

function RouteLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-ink-secondary">
        <span className="w-5 h-5 border-2 border-ink-quaternary border-t-brand rounded-full animate-spin" />
        <span className="text-[13px] font-medium">Loading…</span>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  const [dataset, setDataset] = useState<HealthcareRecord[]>([]);

  useEffect(() => {
    if (dataset.length === 0) {
      const timer = setTimeout(() => setDataset(generateDataset(1000)), 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-white flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:text-[13px] focus:font-semibold"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" className="flex-1 w-full">
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Home dataCount={dataset.length} />} />
              <Route path="/dataset" element={<DatasetView data={dataset} onDataUpdate={setDataset} />} />
              <Route path="/insights" element={<Dashboard data={dataset} />} />
              <Route
                path="/automl"
                element={
                  <div className="max-w-[1280px] mx-auto px-5 py-8">
                    <ModelLab data={dataset} />
                  </div>
                }
              />
              <Route path="/predict" element={<Prediction />} />
              <Route path="/forecast" element={<CostForecast />} />
              <Route path="/report" element={<ReportGenerator />} />
              <Route path="/health-tips" element={<HealthTips />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
