import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalGrid } from './components/ui/GlobalGrid';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';

import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { FinancialPlan } from './pages/FinancialPlan';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { CompareBusinesses } from './pages/CompareBusinesses';
import { Analyze } from './pages/Analyze';
import { AnalysisReport } from './pages/AnalysisReport';
import { About } from './pages/About';

export function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#F5F5F3] text-[#111111] font-sans selection:bg-[#C9793A] selection:text-white flex flex-col justify-between">
        
        {/* Global Technical Grid Overlay */}
        <GlobalGrid />

        {/* Sticky Translucent Apple-Style Navigation */}
        <Navbar />

        {/* Client-side Router Pages */}
        <div className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/market" element={<MarketIntelligence />} />
            <Route path="/finance" element={<FinancialPlan />} />
            <Route path="/risk" element={<RiskAnalysis />} />
            <Route path="/compare" element={<CompareBusinesses />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/analysis/:analysisId" element={<AnalysisReport />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        {/* Dark Minimal Editorial Footer */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;
