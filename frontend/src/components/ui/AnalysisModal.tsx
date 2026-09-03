import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Building2 } from 'lucide-react';
import { sampleBusinessTypes, sampleDistricts, defaultDemoAnalysis } from '@/data/demoData';
import { PrimaryButton } from './PrimaryButton';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose }) => {
  const [district, setDistrict] = useState(sampleDistricts[0]);
  const [businessType, setBusinessType] = useState(sampleBusinessTypes[0].label);
  const [capital, setCapital] = useState('500000');
  const [loanAmount, setLoanAmount] = useState('740000');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof defaultDemoAnalysis | null>(null);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    // Simulate API calculation latency for POST /api/v1/feasibility
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        ...defaultDemoAnalysis,
        locationContext: {
          ...defaultDemoAnalysis.locationContext,
          district: district,
        },
        financialSummary: {
          ...defaultDemoAnalysis.financialSummary,
          ownContribution: `₹${(parseInt(capital || '0') / 100000).toFixed(1)}L`,
          requiredLoan: `₹${(parseInt(loanAmount || '0') / 100000).toFixed(1)}L`,
        }
      });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#20242B]/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#1B2E4A] border border-[#E4E9F0]/20 p-6 sm:p-8 shadow-2xl z-10 text-[#F6F5F1] max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-[#94A3B8] hover:text-[#F6F5F1] hover:bg-[#F6F5F1]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#D98E2C] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>INTERACTIVE FEASIBILITY ENGINE</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
            Evaluate Business Viability
          </h2>

          {!result && (
            <form onSubmit={handleRunAnalysis} className="space-y-6">
              
              {/* Location Select */}
              <div>
                <label className="block text-xs font-mono-data text-[#94A3B8] uppercase mb-2">
                  1. Select Target District / Catchment Area
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#D98E2C]" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#20242B] border border-[#E4E9F0]/15 text-sm font-medium text-[#F6F5F1] focus:border-[#D98E2C] focus:outline-none"
                  >
                    {sampleDistricts.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-xs font-mono-data text-[#94A3B8] uppercase mb-2">
                  2. Select Proposed Business Opportunity
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-[#D98E2C]" />
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#20242B] border border-[#E4E9F0]/15 text-sm font-medium text-[#F6F5F1] focus:border-[#D98E2C] focus:outline-none"
                  >
                    {sampleBusinessTypes.map((b: typeof sampleBusinessTypes[0]) => (
                      <option key={b.label} value={b.label}>{b.label} ({b.category})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capital & Loan Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-data text-[#94A3B8] uppercase mb-2">
                    3. Own Capital / Contribution (₹)
                  </label>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#20242B] border border-[#E4E9F0]/15 font-mono-data text-sm text-[#F6F5F1] focus:border-[#D98E2C] focus:outline-none"
                    placeholder="e.g. 500000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-data text-[#94A3B8] uppercase mb-2">
                    4. Required Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#20242B] border border-[#E4E9F0]/15 font-mono-data text-sm text-[#F6F5F1] focus:border-[#D98E2C] focus:outline-none"
                    placeholder="e.g. 740000"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex justify-end">
                <PrimaryButton
                  type="submit"
                  disabled={isAnalyzing}
                  variant="amber"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? 'Analyzing Signals...' : 'Run Feasibility Engine →'}
                </PrimaryButton>
              </div>

            </form>
          )}

          {/* Simulated Analysis Output */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-[#20242B] border border-[#D98E2C]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono-data uppercase text-[#94A3B8]">
                    EXPLAINABLE VIABILITY SCORE
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono-data text-5xl font-extrabold text-[#F6F5F1]">
                      {result.businessViabilityScore}
                    </span>
                    <span className="font-mono-data text-lg text-[#94A3B8]">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono-data uppercase text-[#94A3B8] block mb-1">
                    DECISION RECOMMENDATION
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-[#D98E2C]/20 border border-[#D98E2C] text-[#D98E2C] font-mono-data font-bold text-sm inline-block">
                    {result.recommendation}
                  </span>
                </div>
              </div>

              <div className="bg-[#20242B]/80 p-5 rounded-2xl border border-[#E4E9F0]/10 text-xs sm:text-sm leading-relaxed">
                <span className="font-mono-data font-bold text-[#D98E2C] block mb-1 uppercase">WHY?</span>
                "{result.whyExplanation}"
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#20242B] border border-[#E4E9F0]/10 text-center font-mono-data">
                  <span className="text-[10px] text-[#94A3B8] block">OWN CONTRIBUTION</span>
                  <span className="text-base font-bold text-[#F6F5F1]">{result.financialSummary.ownContribution}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#20242B] border border-[#E4E9F0]/10 text-center font-mono-data">
                  <span className="text-[10px] text-[#94A3B8] block">LOAN REQUEST</span>
                  <span className="text-base font-bold text-[#D98E2C]">{result.financialSummary.requiredLoan}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#20242B] border border-[#E4E9F0]/10 text-center font-mono-data">
                  <span className="text-[10px] text-[#94A3B8] block">MONTHLY EMI</span>
                  <span className="text-base font-bold text-[#F6F5F1]">{result.financialSummary.monthlyEmi}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#20242B] border border-[#E4E9F0]/10 text-center font-mono-data">
                  <span className="text-[10px] text-[#94A3B8] block">PAYBACK HORIZON</span>
                  <span className="text-base font-bold text-[#2E6B4F]">{result.financialSummary.paybackPeriod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E4E9F0]/10">
                <button
                  onClick={() => setResult(null)}
                  className="text-xs font-mono-data text-[#94A3B8] hover:text-[#F6F5F1] underline"
                >
                  ← Test Another Scenario
                </button>
                <PrimaryButton onClick={onClose} variant="amber" size="sm">
                  Close & Continue Exploring
                </PrimaryButton>
              </div>

            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
