import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BmiCalculator from '../components/BmiCalculator';

const TOPICS = [
  { id: 'premiums', icon: '💰', label: 'How Premiums Work', desc: 'The factors insurers commonly use to price a policy, and why.' },
  { id: 'bmi', icon: '⚖️', label: 'BMI & Body Composition', desc: 'What BMI actually measures, its limits, and healthier alternatives.' },
  { id: 'smoking', icon: '🚭', label: 'Smoking, Alcohol & Cost', desc: 'Why lifestyle habits move premiums more than almost anything else.' },
  { id: 'risk-report', icon: '📋', label: 'Reading a Risk Report', desc: 'How to interpret a High/Low classification and a confidence score.' },
  { id: 'chronic', icon: '🩺', label: 'Chronic Conditions & Underwriting', desc: 'How conditions like diabetes and hypertension affect eligibility and price.' },
  { id: 'lower-risk', icon: '📈', label: 'Building a Lower-Risk Profile', desc: 'Habits that plausibly improve your risk profile ahead of renewal.' },
  { id: 'coverage', icon: '🧮', label: 'Choosing Coverage Amount', desc: 'A simple framework for sizing coverage against income and dependents.' },
  { id: 'glossary', icon: '📖', label: 'Glossary', desc: 'Plain-English definitions for common insurance and vitals terms.' },
];

const TOPIC_GROUPS = [
  { label: 'Understanding Pricing', ids: ['premiums', 'bmi', 'smoking'] },
  { label: 'Your Risk Profile', ids: ['risk-report', 'chronic', 'lower-risk'] },
  { label: 'Making Decisions', ids: ['coverage', 'glossary'] },
];

const HealthTips: React.FC = () => {
  const [active, setActive] = useState('premiums');
  const topic = TOPICS.find(t => t.id === active)!;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-surface-secondary border-b border-ink-quaternary pt-10 pb-8 px-5">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Health Tips</p>
          <h1 className="text-[28px] font-bold text-ink tracking-tight">Understand your risk and your premium.</h1>
          <p className="text-ink-secondary text-[14px] mt-2 max-w-[580px]">
            Plain-English guides to how health insurance pricing works, what your vitals mean, and how to make
            sense of the AI-generated results elsewhere in this workbench.
          </p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5 py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-[260px] flex-shrink-0">
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar space-y-4">
              {TOPIC_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wide text-ink-tertiary mb-1">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.ids.map(id => {
                      const t = TOPICS.find(tp => tp.id === id)!;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setActive(t.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                            active === t.id ? 'bg-brand text-white' : 'text-ink-secondary hover:bg-surface-secondary hover:text-ink'
                          }`}
                        >
                          <span className="text-[16px] mr-2">{t.icon}</span>
                          <span className="text-[13px] font-semibold">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-[22px] font-bold text-ink mb-1">{topic.icon} {topic.label}</h2>
              <p className="text-ink-secondary text-[14px]">{topic.desc}</p>
            </div>

            {active === 'premiums' && <PremiumsSection />}
            {active === 'bmi' && <BmiSection />}
            {active === 'smoking' && <SmokingSection />}
            {active === 'risk-report' && <RiskReportSection />}
            {active === 'chronic' && <ChronicSection />}
            {active === 'lower-risk' && <LowerRiskSection />}
            {active === 'coverage' && <CoverageSection />}
            {active === 'glossary' && <GlossarySection />}
          </main>
        </div>
      </div>
    </div>
  );
};

function Callout({ tone, title, children }: { tone: 'brand' | 'amber' | 'red'; title?: string; children: React.ReactNode }) {
  const toneClasses = {
    brand: 'bg-brand/5 border-brand/20 text-ink-secondary',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  }[tone];
  return (
    <div className={`border rounded-2xl p-4 text-[13px] leading-relaxed ${toneClasses}`}>
      {title && <strong className="text-ink block mb-1">{title}</strong>}
      {children}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-ink-quaternary rounded-xl p-4">
      <p className="font-bold text-ink text-[13px] mb-1.5">{title}</p>
      <p className="text-ink-secondary text-[12px] leading-relaxed">{children}</p>
    </div>
  );
}

/* ─── How Premiums Work ─────────────────────────────────────── */
function PremiumsSection() {
  const FACTORS = [
    { label: 'Age', weight: 'High', desc: 'Risk of chronic and acute conditions rises with age, so premiums typically increase in bands (e.g. every 5–10 years).' },
    { label: 'Smoking status', weight: 'High', desc: 'Smokers are commonly priced at a significant multiplier over non-smokers — often the single largest lifestyle factor.' },
    { label: 'BMI / body composition', weight: 'Medium–High', desc: 'Elevated BMI correlates with higher claims risk for cardiovascular and metabolic conditions.' },
    { label: 'Medical history', weight: 'High', desc: 'Pre-existing conditions (heart disease, diabetes, cancer) directly raise expected claims cost.' },
    { label: 'Family history', weight: 'Low–Medium', desc: 'A family history of hereditary conditions is a smaller, secondary signal insurers may weight.' },
    { label: 'Claims history', weight: 'Medium', desc: 'Frequent past claims can signal ongoing or recurring health needs.' },
    { label: 'Coverage amount', weight: 'Direct', desc: 'Higher coverage limits mean higher potential payouts, scaling the premium directly.' },
  ];
  return (
    <div className="space-y-6">
      <Callout tone="brand" title="The short version">
        Insurers estimate your expected annual claims cost, add a margin for uncertainty and administration, and
        set your premium to cover it. Every factor below is really just a proxy for "how likely and how
        expensive are this person's future claims?"
      </Callout>
      <div className="space-y-2.5">
        {FACTORS.map(f => (
          <div key={f.label} className="border border-ink-quaternary rounded-xl p-3.5 flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-bold text-ink text-[13px]">{f.label}</p>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-secondary text-ink-secondary">
                  {f.weight} impact
                </span>
              </div>
              <p className="text-ink-secondary text-[12px]">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Callout tone="amber">
        In this workbench, the <Link to="/forecast" className="font-semibold text-ink hover:underline">Cost Forecaster</Link> asks
        Gemini to reason through exactly this kind of factor weighting on a hypothetical profile — it's a useful way to see
        which levers move the estimate most, not a real pricing engine.
      </Callout>
    </div>
  );
}

/* ─── BMI Explained ──────────────────────────────────────────── */
function BmiSection() {
  const BMI_RANGES = [
    { label: 'Underweight', range: '< 18.5', color: '#0891b2' },
    { label: 'Healthy range', range: '18.5 – 24.9', color: '#16a34a' },
    { label: 'Overweight', range: '25.0 – 29.9', color: '#d97706' },
    { label: 'Obese (Class I–III)', range: '≥ 30.0', color: '#dc2626' },
  ];
  return (
    <div className="space-y-6">
      <p className="text-ink-secondary text-[14px] leading-relaxed">
        Body Mass Index (BMI) is weight in kilograms divided by height in metres squared. It's cheap and fast to
        calculate, which is why it's used so widely by insurers and clinicians alike — but it's a population-level
        screening tool, not a precise individual health measure.
      </p>

      <BmiCalculator />

      <div className="space-y-2.5">
        {BMI_RANGES.map(r => (
          <div key={r.label} className="border border-ink-quaternary rounded-xl p-3.5 flex items-center gap-3" style={{ borderLeft: `3px solid ${r.color}` }}>
            <p className="font-bold text-ink text-[13px] flex-1">{r.label}</p>
            <span className="text-[12px] font-mono text-ink-secondary">{r.range} kg/m²</span>
          </div>
        ))}
      </div>
      <Callout tone="amber" title="Why BMI alone can mislead">
        BMI doesn't distinguish muscle from fat, doesn't account for where fat is distributed (visceral fat around
        organs is riskier than fat elsewhere), and uses the same cutoffs regardless of ethnicity, sex, or age —
        even though body composition norms vary across all three. A muscular athlete and a sedentary person can
        share the same BMI with very different actual health risk.
      </Callout>
      <p className="text-ink-secondary text-[14px] leading-relaxed">
        In this workbench's dataset, <strong className="text-ink">Body Fat %</strong> is tracked alongside BMI
        specifically to give the AutoML models a second, complementary signal — worth comparing the two on the{' '}
        <Link to="/dataset" className="text-brand font-semibold hover:underline">Dataset Explorer</Link>.
      </p>
    </div>
  );
}

/* ─── Smoking & Alcohol ──────────────────────────────────────── */
function SmokingSection() {
  return (
    <div className="space-y-6">
      <Callout tone="red" title="The biggest lever in most pricing models">
        Smoking is consistently one of the largest single factors in health and life insurance pricing —
        commonly associated with premiums 1.5–3x higher than a comparable non-smoker, because smoking materially
        raises long-term risk of cardiovascular disease, respiratory illness, and multiple cancers.
      </Callout>
      <div className="grid sm:grid-cols-2 gap-3">
        <Card title="🚬 Smoking">
          Insurers typically define "smoker" broadly — including vaping and occasional use in many policies — and
          may require a cessation period (often 12 months tobacco-free) before you can be re-rated as a
          non-smoker.
        </Card>
        <Card title="🍷 Alcohol">
          Light-to-moderate consumption is usually a smaller factor than smoking, but heavy or dependent use is
          flagged similarly to a chronic condition, given its links to liver disease, cardiovascular risk, and
          accident risk.
        </Card>
      </div>
      <p className="text-ink-secondary text-[14px] leading-relaxed">
        Try toggling smoker status on the{' '}
        <Link to="/forecast" className="text-brand font-semibold hover:underline">Cost Forecaster</Link> with
        everything else held constant — it's often the single biggest swing you can produce with one field.
      </p>
    </div>
  );
}

/* ─── Reading a Risk Report ──────────────────────────────────── */
function RiskReportSection() {
  return (
    <div className="space-y-6">
      <p className="text-ink-secondary text-[14px] leading-relaxed">
        The <Link to="/predict" className="text-brand font-semibold hover:underline">Risk Predictor</Link> returns
        three things: a category (High or Low), a confidence percentage, and a short reasoning sentence. Here's how
        to read each one.
      </p>
      <div className="space-y-3">
        <Card title="Category: High vs Low">
          A binary simplification of what's really a continuous risk spectrum. Treat it as a coarse triage
          signal — "does this profile warrant closer review" — rather than a precise score.
        </Card>
        <Card title="Confidence %">
          How strongly the model's internal signals point toward the chosen category — not a probability that the
          category is "correct" in any real-world sense, since this is a demonstration model on synthetic data.
        </Card>
        <Card title="Reasoning">
          A natural-language explanation of the top factors the AI weighted. Useful for sanity-checking that the
          result responds to the inputs you'd expect (e.g. does adding a smoking history push risk upward?).
        </Card>
      </div>
      <Callout tone="brand">
        A well-behaved model should change its output in the direction you'd intuitively expect when you change one
        input at a time. Try adjusting a single field on the Risk Predictor and re-running it — that kind of
        sensitivity check is a simple, effective way to build intuition for any AI system, not just this one.
      </Callout>
    </div>
  );
}

/* ─── Chronic Conditions ─────────────────────────────────────── */
function ChronicSection() {
  const CONDITIONS = [
    { name: 'Heart disease', note: 'Typically the largest single-condition impact on both risk classification and premium, given ongoing monitoring and event risk.' },
    { name: 'Diabetes', note: 'Impact scales with control — an elevated HbA1c (see the dataset\'s lab fields) signals poorer control and higher near-term complication risk.' },
    { name: 'Hypertension (high BP)', note: 'Often the most common flagged condition; risk rises further when combined with elevated BMI or smoking.' },
    { name: 'Cancer history', note: 'Impact depends heavily on type, stage, and time since remission — factors this simplified demo does not model in detail.' },
  ];
  return (
    <div className="space-y-6">
      <p className="text-ink-secondary text-[14px] leading-relaxed">
        Chronic conditions affect underwriting in two distinct ways: they raise the expected cost of a policy
        (pricing), and in some real-world markets, they can affect whether coverage is offered at all
        (eligibility). This workbench only models the pricing side.
      </p>
      <div className="space-y-2.5">
        {CONDITIONS.map(c => (
          <div key={c.name} className="border border-ink-quaternary rounded-xl p-4">
            <p className="font-bold text-ink text-[13px] mb-1">{c.name}</p>
            <p className="text-ink-secondary text-[12px] leading-relaxed">{c.note}</p>
          </div>
        ))}
      </div>
      <Callout tone="amber">
        Real underwriting also considers how well a condition is managed (medication adherence, recent lab trends,
        time since diagnosis) — not just whether it's present. A flag alone is a starting point, not the full
        picture.
      </Callout>
    </div>
  );
}

/* ─── Lower Risk Over Time ───────────────────────────────────── */
function LowerRiskSection() {
  const HABITS = [
    { step: '1', title: 'Move toward a healthy BMI range', color: '#16a34a', detail: 'Gradual, sustained weight change (rather than crash dieting) is what shows up in the kind of longitudinal data insurers actually see at renewal.' },
    { step: '2', title: 'Quit smoking — and document it', color: '#0891b2', detail: 'Most policies allow re-rating as a non-smoker after a sustained cessation period. Keep records; you may need to demonstrate it.' },
    { step: '3', title: 'Get blood pressure and HbA1c under control', color: '#7c3aed', detail: 'These are two of the most heavily weighted lab values in this workbench\'s dataset — and in real underwriting.' },
    { step: '4', title: 'Build a consistent activity habit', color: '#d97706', detail: 'Regular activity improves nearly every downstream metric (BP, resting heart rate, body composition) that feeds into risk models.' },
    { step: '5', title: 'Keep up with preventive screening', color: '#dc2626', detail: 'Catching a condition early, and showing it\'s being actively managed, generally reads better than an undiagnosed or untreated one.' },
  ];
  return (
    <div className="space-y-6">
      <Callout tone="brand">
        None of this is medical advice — it's a description of the kinds of measurable changes that plausibly move
        the inputs this workbench (and real underwriting models) use. Talk to a clinician about what's right for
        you.
      </Callout>
      <div className="space-y-3">
        {HABITS.map(h => (
          <div key={h.step} className="border border-ink-quaternary rounded-xl p-4 flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: h.color }}>
              {h.step}
            </span>
            <div>
              <p className="font-bold text-ink text-[13px] mb-1">{h.title}</p>
              <p className="text-ink-secondary text-[12px] leading-relaxed">{h.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Choosing Coverage ──────────────────────────────────────── */
function CoverageSection() {
  return (
    <div className="space-y-6">
      <p className="text-ink-secondary text-[14px] leading-relaxed">
        There's no universal "right" coverage amount, but a few widely-used rules of thumb can anchor the
        decision before you fine-tune it to your situation.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        <Card title="Income replacement">Some guidance suggests coverage worth several years of income for anyone with dependents relying on that income.</Card>
        <Card title="Expected medical costs">Consider your region's typical costs for major procedures relevant to your age and family history.</Card>
        <Card title="Existing safety nets">Employer coverage, government schemes, and savings all reduce how much individual coverage you may need.</Card>
      </div>
      <Callout tone="amber">
        In the <Link to="/forecast" className="font-semibold text-ink hover:underline">Cost Forecaster</Link>,
        try adjusting the coverage amount field alone — it's a useful way to see roughly how premium scales with
        limit, holding everything else constant.
      </Callout>
    </div>
  );
}

/* ─── Glossary ────────────────────────────────────────────────── */
function GlossarySection() {
  const TERMS = [
    { term: 'Premium', desc: 'The amount paid (usually annually or monthly) to keep an insurance policy active.' },
    { term: 'Coverage amount', desc: 'The maximum payout the policy provides — also called the sum assured or benefit limit.' },
    { term: 'Underwriting', desc: 'The process an insurer uses to assess risk and set the terms (or decline) a policy.' },
    { term: 'Risk classification', desc: 'Grouping applicants into risk tiers (e.g. High/Low) that map to different pricing.' },
    { term: 'Claims history', desc: 'A record of past insurance claims made — used as a signal for future claims likelihood.' },
    { term: 'BMI', desc: 'Body Mass Index — weight (kg) divided by height (m) squared; a coarse screening metric.' },
    { term: 'HbA1c', desc: 'Glycated haemoglobin — reflects average blood sugar over roughly the past 2–3 months; used to screen for diabetes.' },
    { term: 'Systolic / diastolic BP', desc: 'The top (pressure during heartbeats) and bottom (pressure between beats) blood pressure numbers, in mmHg.' },
    { term: 'F1 score', desc: 'A machine learning metric balancing precision and recall — used on the AutoML Lab to compare model quality.' },
    { term: 'Feature importance', desc: 'A ranking of which input variables most influence a model\'s predictions.' },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {TERMS.map(t => (
        <div key={t.term} className="border border-ink-quaternary rounded-xl p-4">
          <p className="font-bold text-ink text-[13px] mb-1">{t.term}</p>
          <p className="text-ink-secondary text-[12px] leading-relaxed">{t.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default HealthTips;
