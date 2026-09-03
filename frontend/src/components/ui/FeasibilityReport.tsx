import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, BarChart3, TrendingUp, Info } from 'lucide-react';

interface Props {
  report: any;
  onReset: () => void;
}

export const FeasibilityReport: React.FC<Props> = ({ report, onReset }) => {
  const { 
    viability_score, recommendation, confidence_score, 
    market_reach, opportunity_analysis, competition, pricing, threats, swot, 
    financial_digital_twin, ai_reasoning 
  } = report;

  const getRecommendationColor = (rec: string) => {
    if (rec === 'PROCEED') return 'text-[#3F7657] bg-[#3F7657]/10 border-[#3F7657]/20';
    if (rec === 'PROCEED WITH CONDITIONS') return 'text-[#C9793A] bg-[#C9793A]/10 border-[#C9793A]/20';
    if (rec === 'RECONSIDER') return 'text-red-600 bg-red-600/10 border-red-600/20';
    return 'text-[#6B6B6B] bg-[#6B6B6B]/10 border-[#6B6B6B]/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl bg-[#111111] text-white">
        <div>
          <span className="text-xs font-mono-data text-[#C9793A] uppercase tracking-widest font-bold block mb-1">
            VYAPAARIQ INTELLIGENCE
          </span>
          <h2 className="font-display text-2xl font-bold">Business Feasibility Report</h2>
          <p className="text-sm text-white/60 flex items-center gap-2 mt-1">
            Data Confidence Score: <span className="text-white font-mono-data font-bold">{confidence_score}%</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-[10px] uppercase text-white/50 block">VIABILITY SCORE</span>
            <span className="font-display text-4xl font-bold text-white">{viability_score}</span>
            <span className="text-xs text-white/50">/100</span>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${getRecommendationColor(recommendation)}`}>
        {recommendation === 'PROCEED' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
        <div>
          <span className="font-bold text-sm uppercase block mb-1">RECOMMENDATION: {recommendation}</span>
          <p className="text-sm font-sans opacity-90">{ai_reasoning?.executive_summary}</p>
        </div>
      </div>

      {/* AI Action Plan */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-[#111111] border-b border-[#E2E2DC] pb-2">Action Plan</h3>
        <ul className="space-y-2">
          {ai_reasoning?.action_plan?.map((action: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#111111]">
              <span className="w-5 h-5 shrink-0 rounded-full bg-[#E2E2DC] flex items-center justify-center text-[10px] font-mono-data text-[#6B6B6B] mt-0.5">{i + 1}</span>
              {action}
            </li>
          ))}
        </ul>
        <div className="text-xs text-[#6B6B6B] bg-[#F5F5F3] p-3 rounded-xl flex gap-2 items-start mt-4">
          <Info className="w-4 h-4 shrink-0" />
          <span><strong>AI Reasoning Evidence:</strong> {ai_reasoning?.evidence}</span>
        </div>
      </div>

      {/* 6 Modules Grid */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-[#111111] border-b border-[#E2E2DC] pb-2">Hyper-Local Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <ModuleCard title="Market Reach (Demographics)" module={market_reach} />
          <ModuleCard title="Local Competition" module={competition} />
          <ModuleCard title="Pricing & Economics" module={pricing} />
          <ModuleCard title="Opportunity Mapping" module={opportunity_analysis} />

        </div>
      </div>

      {/* Financial Digital Twin */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-[#111111] border-b border-[#E2E2DC] pb-2">Financial Digital Twin</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TwinCard title="Conservative" scenario={financial_digital_twin?.conservative} type="bad" />
          <TwinCard title="Expected" scenario={financial_digital_twin?.expected} type="neutral" />
          <TwinCard title="Optimistic" scenario={financial_digital_twin?.optimistic} type="good" />
        </div>
      </div>

      {/* SWOT Synthesis */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-[#111111] border-b border-[#E2E2DC] pb-2">SWOT Synthesis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#3F7657]/10 border border-[#3F7657]/20">
            <span className="font-bold text-[#3F7657] text-sm mb-2 block uppercase">Strengths</span>
            <ul className="text-xs text-[#111111] space-y-1 list-disc pl-4">{swot?.Strengths?.map((s:string, i:number)=><li key={i}>{s}</li>)}</ul>
          </div>
          <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
            <span className="font-bold text-red-600 text-sm mb-2 block uppercase">Weaknesses</span>
            <ul className="text-xs text-[#111111] space-y-1 list-disc pl-4">{swot?.Weaknesses?.map((s:string, i:number)=><li key={i}>{s}</li>)}</ul>
          </div>
          <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
            <span className="font-bold text-blue-600 text-sm mb-2 block uppercase">Opportunities</span>
            <ul className="text-xs text-[#111111] space-y-1 list-disc pl-4">{swot?.Opportunities?.map((s:string, i:number)=><li key={i}>{s}</li>)}</ul>
          </div>
          <div className="p-4 rounded-xl bg-[#C9793A]/10 border border-[#C9793A]/20">
            <span className="font-bold text-[#C9793A] text-sm mb-2 block uppercase">Threats</span>
            <ul className="text-xs text-[#111111] space-y-1 list-disc pl-4">{swot?.Threats?.map((s:string, i:number)=><li key={i}>{s}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#E2E2DC] flex justify-center">
        <button onClick={onReset} className="text-sm font-mono-data text-[#6B6B6B] hover:text-[#111111] underline">
          Start New Analysis
        </button>
      </div>

    </div>
  );
};

const ModuleCard = ({ title, module }: { title: string, module: any }) => {
  if (!module) return null;
  return (
    <div className="p-4 rounded-2xl border border-[#E2E2DC] bg-white space-y-3 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm text-[#111111]">{title}</span>
        <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full ${module.status === 'VERIFIED' ? 'bg-[#3F7657]/10 text-[#3F7657]' : 'bg-[#E2E2DC] text-[#6B6B6B]'}`}>
          {module.status}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-[#F5F5F3] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#C9793A] h-full" style={{ width: `${module.score}%` }}></div>
        </div>
        <span className="text-xs font-mono-data font-bold text-[#111111]">{module.score}/100</span>
      </div>
      <ul className="text-xs text-[#6B6B6B] space-y-1">
        {module.insights?.map((insight: string, idx: number) => (
          <li key={idx} className="flex gap-1.5 items-start">
            <span className="text-[#C9793A]">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TwinCard = ({ title, scenario, type }: { title: string, scenario: any, type: 'bad'|'neutral'|'good' }) => {
  if (!scenario) return null;
  return (
    <div className="p-4 rounded-2xl border border-[#E2E2DC] bg-[#F5F5F3]/50 text-center">
      <span className="text-xs font-mono-data text-[#6B6B6B] uppercase font-bold tracking-wider">{title}</span>
      <div className="mt-3 mb-1">
        <span className="text-2xl font-bold font-mono-data text-[#111111]">₹{scenario.monthly_net_profit?.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
      </div>
      <span className="text-[10px] text-[#6B6B6B] block">Expected Net Profit / Month</span>
      <div className="mt-3 pt-3 border-t border-[#E2E2DC] flex justify-center items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-[#3F7657]" />
        <span className="text-xs font-mono-data">{scenario.break_even_months} Mo. Break-even</span>
      </div>
    </div>
  );
};
