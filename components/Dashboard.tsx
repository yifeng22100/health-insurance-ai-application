
import React, { useMemo, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { HealthcareRecord } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import { Box, Layers, Maximize2, LayoutDashboard, TrendingUp, Users, AlertCircle, Cigarette } from 'lucide-react';

interface DashboardProps {
  data: HealthcareRecord[];
}

// Helper to compute correlation
const calculateCorrelation = (x: number[], y: number[]) => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

const PLOTLY_FONT = { family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', color: '#6e6e73' };

const Dashboard: React.FC<DashboardProps> = ({ data }) => {

  // -- Plotly Refs --
  const riskClusterRef = useRef<HTMLDivElement>(null);
  const correlationRef = useRef<HTMLDivElement>(null);
  const sunburstRef = useRef<HTMLDivElement>(null);

  // -- KPI Calculations --
  const kpis = useMemo(() => {
    if(!data.length) return null;
    const avgPremium = data.reduce((acc, c) => acc + c.annualPremium, 0) / data.length;
    const highRiskCount = data.filter(d => d.riskCategory === 'High').length;
    const smokers = data.filter(d => d.smoker === 'Yes').length;
    return {
      avgPremium,
      highRiskRate: (highRiskCount / data.length) * 100,
      smokerRate: (smokers / data.length) * 100,
      totalRevenue: data.reduce((acc, c) => acc + c.annualPremium, 0)
    };
  }, [data]);

  // -- Recharts Data Preparation --
  const medicalHistoryImpact = useMemo(() => {
    const conditions = [
      { key: 'historyHeartDisease', label: 'Heart Disease' },
      { key: 'historyDiabetes', label: 'Diabetes' },
      { key: 'historyCancer', label: 'Cancer' },
      { key: 'historyHighBP', label: 'High BP' }
    ];

    return conditions.map(c => {
      const withCondition = data.filter(d => d[c.key as keyof HealthcareRecord] === true);
      const avgCost = withCondition.reduce((acc, curr) => acc + curr.annualPremium, 0) / (withCondition.length || 1);
      const riskRate = (withCondition.filter(d => d.riskCategory === 'High').length / (withCondition.length || 1)) * 100;
      return {
        name: c.label,
        avgCost: Math.round(avgCost),
        riskRate: Math.round(riskRate)
      };
    }).sort((a,b) => b.avgCost - a.avgCost);
  }, [data]);

  const radarData = useMemo(() => {
    if (data.length === 0) return [];
    const getAvg = (filterFn: (d: HealthcareRecord) => boolean, key: keyof HealthcareRecord) => {
      const subset = data.filter(filterFn);
      return subset.length ? subset.reduce((acc, curr) => acc + (curr[key] as number), 0) / subset.length : 0;
    };
    const metrics = [
      { key: 'age', label: 'Age', max: 80 },
      { key: 'bmi', label: 'BMI', max: 50 },
      { key: 'stressLevel', label: 'Stress', max: 10 },
      { key: 'hba1c', label: 'HbA1c', max: 10 },
      { key: 'systolicBP', label: 'BP(Sys)', max: 180 }
    ];

    return metrics.map(m => {
       const highVal = getAvg(d => d.riskCategory === 'High', m.key as keyof HealthcareRecord);
       const lowVal = getAvg(d => d.riskCategory === 'Low', m.key as keyof HealthcareRecord);
       return {
         subject: m.label,
         HighRisk: (highVal / m.max) * 100,
         LowRisk: (lowVal / m.max) * 100,
         fullMark: 100
       };
    });
  }, [data]);


  // -- Plotly Rendering Effects --

  // 1. 3D Risk Cluster
  useEffect(() => {
    if (!data.length || !riskClusterRef.current) return;

    const highRisk = data.filter(d => d.riskCategory === 'High');
    const lowRisk = data.filter(d => d.riskCategory === 'Low');

    const traceHigh = {
      x: highRisk.map(d => d.bmi),
      y: highRisk.map(d => d.age),
      z: highRisk.map(d => d.annualPremium),
      mode: 'markers',
      type: 'scatter3d',
      name: 'High Risk',
      marker: { size: 3, color: '#ef4444', opacity: 0.8 }
    };

    const traceLow = {
      x: lowRisk.map(d => d.bmi),
      y: lowRisk.map(d => d.age),
      z: lowRisk.map(d => d.annualPremium),
      mode: 'markers',
      type: 'scatter3d',
      name: 'Low Risk',
      marker: { size: 3, color: '#0071e3', opacity: 0.6 }
    };

    const layout = {
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: PLOTLY_FONT,
      scene: {
        xaxis: { title: 'BMI' },
        yaxis: { title: 'Age' },
        zaxis: { title: 'Premium ($)' },
      },
      legend: { x: 0, y: 1 }
    };

    Plotly.newPlot(riskClusterRef.current, [traceHigh, traceLow] as any, layout as any, { responsive: true, displayModeBar: false });

    return () => { if (riskClusterRef.current) Plotly.purge(riskClusterRef.current); };
  }, [data]);

  // 2. Correlation Heatmap
  useEffect(() => {
    if (!data.length || !correlationRef.current) return;

    const features = ['age', 'bmi', 'annualPremium', 'hba1c', 'bodyFat', 'systolicBP', 'stressLevel'];
    const featureLabels = ['Age', 'BMI', 'Premium', 'HbA1c', 'Fat %', 'BP', 'Stress'];
    const matrix: number[][] = [];

    for (let i = 0; i < features.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < features.length; j++) {
        const val1 = data.map(d => d[features[i] as keyof HealthcareRecord] as number);
        const val2 = data.map(d => d[features[j] as keyof HealthcareRecord] as number);
        row.push(calculateCorrelation(val1, val2));
      }
      matrix.push(row);
    }

    const dataPlot = [{
      z: matrix,
      x: featureLabels,
      y: featureLabels,
      type: 'heatmap',
      colorscale: 'RdBu',
      zmin: -1,
      zmax: 1,
      texttemplate: '%{z:.2f}',
      textfont: { size: 11 },
    }];

    const layout = {
      autosize: true,
      margin: { l: 60, r: 20, b: 60, t: 10 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { ...PLOTLY_FONT, size: 11 },
      xaxis: { showgrid: false },
      yaxis: { showgrid: false }
    };

    Plotly.newPlot(correlationRef.current, dataPlot as any, layout as any, { responsive: true, displayModeBar: false });

    return () => { if (correlationRef.current) Plotly.purge(correlationRef.current); };
  }, [data]);

  // 3. Sunburst (Hierarchy)
  useEffect(() => {
    if (!data.length || !sunburstRef.current) return;

    const regions: string[] = Array.from(new Set(data.map(d => d.region)));

    const ids = ["root"];
    const plotLabels = ["All"];
    const plotParents = [""];
    const plotValues = [data.reduce((a,c) => a + c.annualPremium, 0)];

    regions.forEach(r => {
        ids.push(r);
        plotLabels.push(r);
        plotParents.push("root");
        const rData = data.filter(d => d.region === r);
        plotValues.push(rData.reduce((a,c) => a + c.annualPremium, 0));

        ['Yes', 'No'].forEach(s => {
            const sId = `${r}-${s}`;
            ids.push(sId);
            plotLabels.push(s === 'Yes' ? 'Smoke' : 'Non');
            plotParents.push(r);
            const sData = rData.filter(d => d.smoker === s);
            plotValues.push(sData.reduce((a,c) => a + c.annualPremium, 0));

            ['High', 'Low'].forEach(rk => {
                const rkId = `${sId}-${rk}`;
                ids.push(rkId);
                plotLabels.push(rk);
                plotParents.push(sId);
                const rkData = sData.filter(d => d.riskCategory === rk);
                plotValues.push(rkData.reduce((a,c) => a + c.annualPremium, 0));
            });
        });
    });

    const plotData = [{
      type: "sunburst",
      ids: ids,
      labels: plotLabels,
      parents: plotParents,
      values: plotValues,
      outsidetextfont: {size: 11, color: "#1d1d1f"},
      insidetextfont: {size: 11},
      leaf: {opacity: 0.6},
      marker: {line: {width: 2, color: '#ffffff'}, colors: ['#0071e3', '#e8f2fd', '#6e6e73', '#aeaeb2']},
      branchvalues: 'total'
    }];

    const layout = {
      autosize: true,
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: PLOTLY_FONT,
    };

    Plotly.newPlot(sunburstRef.current, plotData as any, layout as any, { responsive: true, displayModeBar: false });

  }, [data]);


  const header = (
    <div className="bg-surface-secondary border-b border-ink-quaternary pt-10 pb-8 px-5">
      <div className="max-w-[1280px] mx-auto">
        <p className="text-brand text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Visual Insights</p>
        <h1 className="text-[28px] font-bold text-ink tracking-tight">Portfolio &amp; risk analytics.</h1>
        <p className="text-ink-secondary text-[14px] mt-2 max-w-[580px]">
          Portfolio health, risk distribution, and actuarial analysis across the current synthetic dataset.
        </p>
      </div>
    </div>
  );

  if (data.length === 0) return (
    <div className="min-h-screen bg-white">
      {header}
      <div className="max-w-[1280px] mx-auto px-5 py-8">
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-ink-quaternary">
          <div className="bg-surface-secondary p-6 rounded-full mb-4">
            <LayoutDashboard className="text-ink-tertiary" size={48} />
          </div>
          <h3 className="text-lg font-bold text-ink">No Data to Visualize</h3>
          <p className="text-ink-secondary max-w-md text-center mt-2">
            Please generate or load a dataset to view analytics and insights.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {header}
      <div className="max-w-[1280px] mx-auto px-5 py-8 space-y-6 animate-fade-in pb-10">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-card border border-ink-quaternary flex flex-col relative overflow-hidden group hover:shadow-card-hover transition-shadow">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={64} className="text-brand" />
           </div>
           <p className="text-ink-secondary text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
             <span className="inline-block w-2 h-2 rounded-full bg-brand"></span> Avg Annual Premium
           </p>
           <h3 className="text-3xl font-extrabold text-ink mt-1">${kpis?.avgPremium.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
           <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
             <TrendingUp size={12}/> +4.5% vs Last Year
           </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-ink-quaternary flex flex-col relative overflow-hidden group hover:shadow-card-hover transition-shadow">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={64} className="text-emerald-600" />
           </div>
           <p className="text-ink-secondary text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span> Total Portfolio Value
           </p>
           <h3 className="text-3xl font-extrabold text-ink mt-1">${(kpis?.totalRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
           <p className="text-xs text-ink-tertiary mt-2 font-medium">Across {data.length.toLocaleString()} lives</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-ink-quaternary flex flex-col relative overflow-hidden group hover:shadow-card-hover transition-shadow">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertCircle size={64} className="text-red-600" />
           </div>
           <p className="text-ink-secondary text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span> High Risk Ratio
           </p>
           <h3 className="text-3xl font-extrabold text-ink mt-1">{kpis?.highRiskRate.toFixed(1)}%</h3>
           <p className="text-xs text-red-500 mt-2 font-medium">Requires immediate attention</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-ink-quaternary flex flex-col relative overflow-hidden group hover:shadow-card-hover transition-shadow">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cigarette size={64} className="text-orange-600" />
           </div>
           <p className="text-ink-secondary text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span> Smoker %
           </p>
           <h3 className="text-3xl font-extrabold text-ink mt-1">{kpis?.smokerRate.toFixed(1)}%</h3>
           <p className="text-xs text-ink-tertiary mt-2 font-medium">Of total population</p>
        </div>
      </div>

      {/* 3D Risk Landscape */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary">
         <div className="flex items-center justify-between mb-6 pb-4 border-b border-ink-quaternary flex-wrap gap-3">
             <div className="flex items-center gap-2">
                <Box className="text-brand" size={20} />
                <h3 className="text-lg font-bold text-ink">3D Risk Landscape</h3>
             </div>
             <div className="flex gap-3 text-xs font-medium text-ink-secondary">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> High Risk</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-brand rounded-full"></div> Low Risk</span>
             </div>
         </div>

         <div className="h-[460px] bg-surface-secondary rounded-2xl border border-ink-quaternary relative overflow-hidden">
            <div ref={riskClusterRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-mono text-ink-secondary border border-ink-quaternary shadow-sm pointer-events-none">
               X: BMI &bull; Y: Age &bull; Z: Premium
            </div>
         </div>
      </div>

      {/* Correlation + Hierarchy — each given full, legible space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-ink-quaternary shadow-card p-6 flex flex-col">
            <h4 className="text-sm font-bold text-ink uppercase tracking-wide mb-1 flex items-center gap-2">
                <Maximize2 size={15} className="text-brand" /> Correlation Matrix
            </h4>
            <p className="text-ink-tertiary text-[12px] mb-4">How strongly each metric moves with the others (-1 to 1).</p>
            <div ref={correlationRef} className="w-full h-[380px]" />
        </div>
        <div className="bg-white rounded-2xl border border-ink-quaternary shadow-card p-6 flex flex-col">
            <h4 className="text-sm font-bold text-ink uppercase tracking-wide mb-1 flex items-center gap-2">
                <Layers size={15} className="text-brand" /> Portfolio Hierarchy
            </h4>
            <p className="text-ink-tertiary text-[12px] mb-4">Premium value by region → smoker status → risk category.</p>
            <div ref={sunburstRef} className="w-full h-[380px]" />
        </div>
      </div>

      {/* Standard Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar: Risk Profiles */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary flex flex-col">
          <h3 className="text-lg font-bold text-ink mb-1">Risk Profile Comparison</h3>
          <p className="text-xs text-ink-tertiary mb-6">Normalized feature average (High vs Low)</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid stroke="#e8e8ed" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6e6e73', fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="High Risk" dataKey="HighRisk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="Low Risk" dataKey="LowRisk" stroke="#0071e3" fill="#0071e3" fillOpacity={0.3} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', marginTop: '10px'}}/>
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Medical History Impact */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-ink-quaternary flex flex-col">
           <h3 className="text-lg font-bold text-ink mb-1">Condition Cost Impact</h3>
           <p className="text-xs text-ink-tertiary mb-6">Average premium increase by medical condition</p>
           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={medicalHistoryImpact} layout="vertical" margin={{ left: 40, right: 40 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f7" />
                 <XAxis type="number" unit="$" tick={{fontSize: 12}} />
                 <YAxis dataKey="name" type="category" width={100} tick={{fontWeight: 500, fontSize: 13, fill: '#1d1d1f'}} />
                 <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} cursor={{fill: '#f5f5f7'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="avgCost" name="Avg Annual Premium" radius={[0, 4, 4, 0]} barSize={24}>
                    {medicalHistoryImpact.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#eab308', '#0071e3'][index % 4]} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
