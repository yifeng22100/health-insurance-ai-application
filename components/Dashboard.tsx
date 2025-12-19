
import React, { useMemo, useEffect, useRef } from 'react';
import { HealthcareRecord } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, Cell
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
    if (!data.length || !riskClusterRef.current || !(window as any).Plotly) return;

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
      marker: { size: 3, color: '#10b981', opacity: 0.6 }
    };

    const layout = {
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Inter, sans-serif' },
      scene: {
        xaxis: { title: 'BMI' },
        yaxis: { title: 'Age' },
        zaxis: { title: 'Premium ($)' },
      },
      legend: { x: 0, y: 1 }
    };

    (window as any).Plotly.newPlot(riskClusterRef.current, [traceHigh, traceLow], layout, {responsive: true, displayModeBar: false});
  }, [data]);

  // 2. Correlation Heatmap
  useEffect(() => {
    if (!data.length || !correlationRef.current || !(window as any).Plotly) return;

    // Added new features to correlation map
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
      zmax: 1
    }];

    const layout = {
      autosize: true,
      margin: { l: 40, r: 10, b: 40, t: 10 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { size: 10, family: 'Inter, sans-serif' },
      xaxis: { showgrid: false },
      yaxis: { showgrid: false }
    };

    (window as any).Plotly.newPlot(correlationRef.current, dataPlot, layout, {responsive: true, displayModeBar: false});
  }, [data]);

  // 3. Sunburst (Hierarchy)
  useEffect(() => {
    if (!data.length || !sunburstRef.current || !(window as any).Plotly) return;

    const regions = Array.from(new Set(data.map(d => d.region)));

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
      outsidetextfont: {size: 10, color: "#fff"},
      leaf: {opacity: 0.4},
      marker: {line: {width: 2}},
      branchvalues: 'total'
    }];

    const layout = {
      autosize: true,
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Inter, sans-serif' }
    };

    (window as any).Plotly.newPlot(sunburstRef.current, plotData, layout, {responsive: true, displayModeBar: false});

  }, [data]);


  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-slate-200">
      <div className="bg-slate-50 p-6 rounded-full mb-4">
        <LayoutDashboard className="text-slate-300" size={48} />
      </div>
      <h3 className="text-lg font-bold text-slate-700">No Data to Visualize</h3>
      <p className="text-slate-500 max-w-md text-center mt-2">
        Please generate or load a dataset to view analytics and insights.
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <LayoutDashboard size={20}/>
         </div>
         <div>
            <h2 className="text-xl font-bold text-slate-800">Visual Insights</h2>
            <p className="text-sm text-slate-500">Portfolio health, risk distribution, and actuarial analysis.</p>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group hover:border-blue-200 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={64} className="text-blue-600" />
           </div>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500"></div> Avg Annual Premium
           </p>
           <h3 className="text-3xl font-extrabold text-slate-800 mt-1">${kpis?.avgPremium.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
           <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
             <TrendingUp size={12}/> +4.5% vs Last Year
           </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group hover:border-emerald-200 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={64} className="text-emerald-600" />
           </div>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Total Value
           </p>
           <h3 className="text-3xl font-extrabold text-slate-800 mt-1">${(kpis?.totalRevenue || 0 / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
           <p className="text-xs text-slate-400 mt-2 font-medium">Across {data.length.toLocaleString()} lives</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group hover:border-red-200 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertCircle size={64} className="text-red-600" />
           </div>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk Ratio
           </p>
           <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{kpis?.highRiskRate.toFixed(1)}%</h3>
           <p className="text-xs text-red-500 mt-2 font-medium">Requires immediate attention</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group hover:border-orange-200 transition-all">
           <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cigarette size={64} className="text-orange-600" />
           </div>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> Smoker %
           </p>
           <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{kpis?.smokerRate.toFixed(1)}%</h3>
           <p className="text-xs text-slate-400 mt-2 font-medium">Of total population</p>
        </div>
      </div>

      {/* Advanced Analytics Section (Plotly) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
             <div className="flex items-center gap-2">
                <Box className="text-indigo-600" size={20} />
                <h3 className="text-lg font-bold text-slate-800">3D Risk Landscape</h3>
             </div>
             <div className="flex gap-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> High Risk</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Low Risk</span>
             </div>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Cluster - Main Focus */}
            <div className="lg:col-span-2 h-[450px] bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden shadow-inner">
               <div ref={riskClusterRef} className="w-full h-full" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-mono text-slate-600 border border-slate-200 shadow-sm pointer-events-none">
                  X: BMI &bull; Y: Age &bull; Z: Premium
               </div>
            </div>

            {/* Smaller Charts Column - Constrained Height to Match Main Chart */}
            <div className="lg:col-span-1 h-[450px] flex flex-col gap-4">
                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 flex flex-col shadow-sm overflow-hidden min-h-0">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2 shrink-0">
                        <Maximize2 size={14} /> Correlation Matrix
                    </h4>
                    <div ref={correlationRef} className="flex-1 w-full min-h-0" />
                </div>
                 <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 flex flex-col shadow-sm overflow-hidden min-h-0">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2 shrink-0">
                        <Layers size={14} /> Portfolio Hierarchy
                    </h4>
                    <div ref={sunburstRef} className="flex-1 w-full min-h-0" />
                </div>
            </div>
         </div>
      </div>

      {/* Standard Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar: Risk Profiles */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Risk Profile Comparison</h3>
          <p className="text-xs text-slate-500 mb-6">Normalized feature average (High vs Low)</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="High Risk" dataKey="HighRisk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="Low Risk" dataKey="LowRisk" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', marginTop: '10px'}}/>
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Medical History Impact */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
           <h3 className="text-lg font-bold text-slate-800 mb-1">Condition Cost Impact</h3>
           <p className="text-xs text-slate-500 mb-6">Average premium increase by medical condition</p>
           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={medicalHistoryImpact} layout="vertical" margin={{ left: 40, right: 40 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" unit="$" tick={{fontSize: 12}} />
                 <YAxis dataKey="name" type="category" width={100} tick={{fontWeight: 500, fontSize: 13, fill: '#475569'}} />
                 <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="avgCost" name="Avg Annual Premium" fill="url(#colorCost)" radius={[0, 4, 4, 0]} barSize={24}>
                    {medicalHistoryImpact.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#eab308', '#3b82f6'][index % 4]} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
