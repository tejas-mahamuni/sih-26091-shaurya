import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Building2, TrendingUp, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: MapPin,
      title: 'Location Intelligence',
      desc: 'We map your target panchayat/town against census data, nearby mandi trade volumes, and transportation routes to estimate real buyer density.',
      metrics: ['Catchment Radius: 5km', 'Footfall Density', 'Mandi Access']
    },
    {
      num: '02',
      icon: DollarSign,
      title: 'Capital & Investment Structure',
      desc: 'Enter your own available capital to structure project setup costs, mandatory working capital reserves, and required bank loan sizing.',
      metrics: ['Equity Contribution', 'Working Capital Reserve', 'Loan Requirement']
    },
    {
      num: '03',
      icon: Building2,
      title: 'Opportunity Selection',
      desc: 'Select a business opportunity (e.g. Dairy Chilling Unit, Cold Storage, Retail Store) to benchmark setup cost against local purchasing power.',
      metrics: ['Asset Setup Cost', 'Inventory Turnover', 'Licensing']
    },
    {
      num: '04',
      icon: TrendingUp,
      title: 'Market Demand & Competition',
      desc: 'Scans hyperlocal competitors, price sensitivity, and seasonal demand cycles to ensure the market is not already oversaturated.',
      metrics: ['Competitor Saturation', 'Demand Index', 'Price Elasticity']
    },
    {
      num: '05',
      icon: SlidersHorizontal,
      title: 'Risk & Stress Testing',
      desc: 'Simulates stress scenarios (-20% off-season demand drop, input cost hikes) to evaluate whether your cash flow can cover monthly bank EMIs.',
      metrics: ['DSCR Stress', 'Break-even Month', 'Off-season Buffer']
    },
    {
      num: '06',
      icon: ShieldCheck,
      title: 'Explainable Viability Recommendation',
      desc: 'Produces a composite Viability Score (0-100) and actionable recommendation (e.g. PROCEED WITH CONDITIONS) with zero black-box mystery.',
      metrics: ['Viability Index', 'Government Scheme Match', 'Bankability']
    }
  ];

  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A] block mb-2">
          SYSTEM METHODOLOGY
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] mb-4">
          How VyapaarIQ Evaluates Business Feasibility
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
          From geographic catchment mapping to bank loan stress testing, explore the 6-step decision intelligence workflow.
        </p>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-2xl apple-card shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F5F3]/80 border border-[#E2E2DC] flex items-center justify-center text-[#C9793A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono-data text-xl font-bold text-[#6B6B6B]">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#111111] mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E2DC] flex flex-wrap gap-2">
                {step.metrics.map(m => (
                  <span key={m} className="px-2.5 py-1 rounded-full text-[11px] font-mono-data bg-[#F5F5F3]/80 text-[#111111] border border-[#E2E2DC]">
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <Link to="/analyze">
          <PrimaryButton size="lg" variant="accent">
            Test Your Business Idea Now →
          </PrimaryButton>
        </Link>
      </div>

    </div>
  );
};
