import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-secondary border-t border-ink-quaternary mt-auto print:hidden">
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🛡️</span>
              <span className="font-bold text-ink text-[15px]">
                HealthInsure<span className="text-brand">AI</span>
              </span>
            </div>
            <p className="text-ink-secondary text-[13px] leading-relaxed">
              AI-powered underwriting intelligence — risk classification, premium forecasting, and portfolio
              analytics for health insurance.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-ink uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                ['/dataset', 'Dataset'],
                ['/insights', 'Insights'],
                ['/automl', 'AutoML Lab'],
                ['/predict', 'Risk Predictor'],
                ['/forecast', 'Cost Forecaster'],
                ['/report', 'Report Generator'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-ink-secondary text-[13px] hover:text-brand transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-ink uppercase tracking-wider mb-3">Learn</h4>
            <ul className="space-y-2">
              {[
                ['/health-tips', 'Health Tips'],
                ['/about', 'About'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-ink-secondary text-[13px] hover:text-brand transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://yifeng22100.github.io/hospital-intelligence-my/#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-secondary text-[13px] hover:text-brand transition-colors"
                >
                  Healthcare Intelligence ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-ink uppercase tracking-wider mb-3">About the data</h4>
            <p className="text-ink-secondary text-[13px] leading-relaxed">
              Synthetic dataset for demonstration. Predictions are AI-generated estimates, not underwriting advice.
            </p>
            <p className="text-ink-tertiary text-[12px] mt-2">Powered by Gemini</p>
          </div>
        </div>

        <div className="border-t border-ink-quaternary pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ink-tertiary text-[12px]">
            © 2026 HealthInsure AI. For demonstration only — not underwriting or medical advice.
          </p>
          <p className="text-ink-tertiary text-[12px]">
            Part of the same toolkit as{' '}
            <a
              href="https://yifeng22100.github.io/hospital-intelligence-my/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-medium hover:underline"
            >
              Healthcare Intelligence
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
