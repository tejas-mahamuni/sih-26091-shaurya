import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LaptopMockup } from './LaptopMockup';
import { PrimaryButton } from './PrimaryButton';

export const HeroScrollSequence: React.FC = () => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Eager Loading progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        return prev + 12;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  // Scroll driven progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Map 0 -> 1 into 6 stages (0, 1, 2, 3, 4, 5)
    const stage = Math.min(5, Math.floor(latest * 6));
    if (stage !== activeStageIndex) {
      setActiveStageIndex(stage);
    }
  });

  const stages = [
    {
      step: '01 / 06',
      label: 'LOCATION INTELLIGENCE',
      title: 'Start with your place.',
      description: 'Business viability begins with understanding the local market, population density, and nearest commercial nodes.',
    },
    {
      step: '02 / 06',
      label: 'FINANCIAL STRUCTURE',
      title: 'Start with what you have.',
      description: 'Tell us how much capital you can actually invest to model project cost, working capital buffers, and required loan amount.',
    },
    {
      step: '03 / 06',
      label: 'BUSINESS OPPORTUNITY',
      title: 'Choose what you want to build.',
      description: 'Select a business opportunity and let VyapaarIQ evaluate it against your local geographic context.',
    },
    {
      step: '04 / 06',
      label: 'MARKET INTELLIGENCE',
      title: 'Understand the opportunity around you.',
      description: 'VyapaarIQ combines hyperlocal demand signals, competition saturation, and customer footfall metrics.',
    },
    {
      step: '05 / 06',
      label: 'RISK SIMULATION',
      title: 'Stress-test the decision.',
      description: 'What happens if demand falls 20%? What happens if costs rise? Test resilience before borrowing.',
    },
    {
      step: '06 / 06',
      label: 'DECISION INTELLIGENCE',
      title: 'Now make the decision.',
      description: 'One explainable recommendation, backed by verified signals and transparent confidence badges.',
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full bg-transparent text-[#111111]">
      
      {/* Loading Indicator Header Banner */}
      {!isReady && (
        <div className="fixed top-20 right-6 z-40 bg-[#111111] text-[#F5F5F3] px-3.5 py-1.5 rounded-full text-xs font-mono-data border border-[#C9793A]/40 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#C9793A] animate-pulse" />
          <span>Preparing decision engine · {loadProgress}%</span>
        </div>
      )}

      {/* Initial Hero Stage Header */}
      <section className="min-h-[85vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 flex flex-col justify-between items-center text-center">
        
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 my-auto pt-8">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111]/5 border border-[#111111]/10 text-[#6B6B6B] text-xs font-mono-data uppercase tracking-widest backdrop-blur-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9793A]" />
            <span>RURAL & SEMI-URBAN DECISION INTELLIGENCE</span>
          </motion.div>

          {/* Clean Bold Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-1 sm:space-y-2"
          >
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#111111] leading-[1.05]">
              Before you borrow.
            </h1>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#C9793A] leading-[1.05]">
              Know your business.
            </h2>
          </motion.div>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-2xl font-normal"
          >
            VyapaarIQ combines local market signals, competition, financial feasibility and risk analysis to help you make a smarter business decision before taking a loan.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/analyze">
              <PrimaryButton size="lg" variant="accent">
                Start Analysis →
              </PrimaryButton>
            </Link>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-xs font-mono-data text-[#6B6B6B] animate-bounce pt-6">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-[#C9793A]" />
        </div>

      </section>

      {/* Pinned 6-Stage Scroll Sequence Stage Container */}
      <div className="relative h-[360vh]">
        <div className="sticky top-20 min-h-[80vh] py-8 flex flex-col justify-center items-center overflow-hidden">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Stage Text Content & Step Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono-data text-[#C9793A] bg-[#C9793A]/10 border border-[#C9793A]/20 uppercase">
                  {stages[activeStageIndex].label}
                </span>

                <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                  {stages[activeStageIndex].title}
                </h3>

                <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
                  {stages[activeStageIndex].description}
                </p>
              </div>

              {/* Step Navigation Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 pt-4">
                {stages.map((stg, idx) => {
                  const isActive = idx === activeStageIndex;

                  return (
                    <div
                      key={stg.step}
                      className={`p-3 rounded-xl border text-left font-mono-data text-xs transition-all ${
                        isActive
                          ? 'bg-[#111111] border-[#C9793A] text-white shadow-md'
                          : 'bg-white/80 backdrop-blur-xs border-[#E2E2DC] text-[#6B6B6B]'
                      }`}
                    >
                      <div className={`font-bold ${isActive ? 'text-[#C9793A]' : 'text-[#111111]'}`}>
                        {stg.step}
                      </div>
                      <div className="text-[11px] truncate mt-0.5 opacity-90">
                        {stg.label.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Pinned Laptop Mockup Frame */}
            <div className="lg:col-span-7">
              <LaptopMockup currentStage={activeStageIndex} />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
