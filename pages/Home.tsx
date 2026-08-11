import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database, LayoutDashboard, Brain, FileOutput, DollarSign, FileText,
  ShieldCheck, Sparkles, LineChart, BookOpenText,
} from 'lucide-react';

const TOOL_CARDS = [
  {
    to: '/dataset', icon: Database, bg: 'bg-blue-50', iconColor: 'text-blue-600',
    title: 'Dataset Explorer', desc: 'Generate and browse synthetic patient records with 25+ statistical features.',
  },
  {
    to: '/insights', icon: LayoutDashboard, bg: 'bg-indigo-50', iconColor: 'text-indigo-600',
    title: 'Visual Insights', desc: 'Portfolio KPIs, 3D risk clustering, correlation analysis, and condition cost impact.',
  },
  {
    to: '/automl', icon: Brain, bg: 'bg-purple-50', iconColor: 'text-purple-600',
    title: 'AutoML Lab', desc: 'Benchmark 8 ML/DL algorithms and surface the most predictive features.',
  },
  {
    to: '/predict', icon: ShieldCheck, bg: 'bg-emerald-50', iconColor: 'text-emerald-600',
    title: 'Risk Predictor', desc: 'Real-time High/Low risk classification with AI-generated reasoning.',
  },
  {
    to: '/forecast', icon: DollarSign, bg: 'bg-amber-50', iconColor: 'text-amber-600',
    title: 'Cost Forecaster', desc: 'Actuarial premium estimation with a 5-year cost projection.',
  },
  {
    to: '/report', icon: FileOutput, bg: 'bg-slate-100', iconColor: 'text-slate-700',
    title: 'Report Generator', desc: 'Export a print-ready underwriting report combining risk and cost analysis.',
  },
];

const TRUST_ITEMS = [
  {
    icon: Sparkles,
    title: 'AI-generated, clearly labelled',
    desc: 'Every risk score, premium estimate, and report is produced by Gemini and marked as an AI estimate — never presented as a human underwriting decision.',
  },
  {
    icon: LineChart,
    title: 'Transparent methodology',
    desc: 'Model comparisons show before/after tuning accuracy, F1 scores, and architecture notes for every algorithm benchmarked.',
  },
  {
    icon: BookOpenText,
    title: 'Synthetic data by design',
    desc: 'The dataset is procedurally generated for demonstration — no real patient information is used or stored.',
  },
];

interface HomeProps {
  dataCount: number;
}

const Home: React.FC<HomeProps> = ({ dataCount }) => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-5 pt-16 pb-14 text-center">
        <div className="max-w-[680px] mx-auto">
          <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-4">
            AI Underwriting Intelligence
          </p>
          <h1 className="text-[40px] sm:text-[52px] font-bold text-ink tracking-tight leading-[1.08] mb-5">
            Smarter risk starts with<br className="hidden sm:block" /> the right signal.
          </h1>
          <p className="text-ink-secondary text-[18px] leading-relaxed mb-9 max-w-[560px] mx-auto">
            Generate a synthetic health insurance portfolio, benchmark machine learning models, and get
            AI-powered risk and premium estimates in one workbench.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dataset"
              className="bg-brand text-white px-6 py-3 rounded-xl text-[14px] font-semibold hover:bg-brand-dark transition-colors shadow-sm"
            >
              Open the Workbench
            </Link>
            <Link
              to="/health-tips"
              className="bg-white border border-ink-quaternary text-ink px-6 py-3 rounded-xl text-[14px] font-semibold hover:border-brand hover:text-brand transition-colors"
            >
              Read Health &amp; Insurance Tips
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-secondary border-y border-ink-quaternary py-9 px-5">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { n: dataCount ? dataCount.toLocaleString() : '—', label: 'Patient records', sub: 'Synthetic dataset' },
            { n: '25+', label: 'Features', sub: 'Vitals, labs, lifestyle' },
            { n: '8', label: 'Algorithms', sub: 'ML & deep learning' },
            { n: 'Gemini', label: 'AI Engine', sub: 'Predictions & reports' },
          ].map(({ n, label, sub }) => (
            <div key={label}>
              <div className="text-[32px] sm:text-[36px] font-bold text-ink tracking-tight leading-none">{n}</div>
              <div className="text-[14px] font-semibold text-ink mt-1">{label}</div>
              <div className="text-[12px] text-ink-tertiary mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white py-16 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-3">
              The Workbench
            </p>
            <h2 className="text-[32px] font-bold text-ink tracking-tight">
              Every step from raw data to underwriting report.
            </h2>
            <p className="text-ink-secondary text-[16px] mt-3 leading-relaxed">
              Six connected tools, one shared dataset — generate records once and carry them through
              analysis, modeling, and prediction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOL_CARDS.map(({ to, icon: Icon, bg, iconColor, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="bg-white border border-ink-quaternary rounded-2xl p-5 hover:border-brand hover:shadow-card-hover transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} ${iconColor} flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-ink text-[15px] mb-1.5 group-hover:text-brand transition-colors">
                  {title}
                </h3>
                <p className="text-ink-secondary text-[13px] leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-surface-secondary py-16 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-3">
              Built to be understood, not just trusted
            </p>
            <h2 className="text-[32px] font-bold text-ink tracking-tight mb-3">How the AI is used, plainly.</h2>
            <p className="text-ink-secondary text-[16px] max-w-[520px] mx-auto">
              This is a demonstration workbench. Here's exactly what's real, what's synthetic, and what's AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[900px] mx-auto">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-11 h-11 rounded-xl bg-white shadow-card flex items-center justify-center text-brand mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-ink text-[16px] mb-2">{title}</h3>
                <p className="text-ink-secondary text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sister site cross-link */}
      <section className="bg-white py-16 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-ink rounded-3xl px-8 py-12 sm:px-14 sm:py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-[480px] text-center lg:text-left">
              <p className="text-white/50 text-[12px] font-semibold uppercase tracking-[0.12em] mb-3">
                From the same toolkit
              </p>
              <h2 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight mb-3">
                Looking for hospitals and care, not just coverage?
              </h2>
              <p className="text-white/60 text-[15px] leading-relaxed">
                Discover, compare, and navigate hospitals with our companion project — verified data,
                cost references, and a health knowledge hub.
              </p>
            </div>
            <a
              href="https://yifeng22100.github.io/hospital-intelligence-my/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3 rounded-xl font-semibold text-[15px] hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Explore Healthcare Intelligence <Arrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default Home;
