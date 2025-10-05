import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResearchPapers from './pages/ResearchPapers';
import KnowledgeGraph from './pages/KnowledgeGraph';
import AIInsights from './pages/AIInsights';
import PaperDetail from './pages/PaperDetail';
import NotFound from './pages/NotFound';
import SpaceChatbot from './components/SpaceChatbot';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-space-900 text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research-papers" element={<ResearchPapers />} />
            <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/paper/:id" element={<PaperDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Space Chatbot - Available on all pages */}
          <SpaceChatbot />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
