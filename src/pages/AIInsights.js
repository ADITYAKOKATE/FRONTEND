import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { papersAPI, insightsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';

const AIInsights = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');

  // Fetch insights data
  const { data: insightsData, refetch: refetchInsights } = useQuery(
    ['insights', selectedTimeframe, selectedArea],
    () => insightsAPI.getInsights({ timeframe: selectedTimeframe, area: selectedArea }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch research gaps
  const { data: gapsData } = useQuery(
    'research-gaps',
    insightsAPI.getGaps,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Fetch trends data
  const { data: trendsData } = useQuery(
    ['trends', selectedTimeframe],
    () => insightsAPI.getTrends({ timeframe: selectedTimeframe }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch papers for analysis
  const { data: papersData } = useQuery(
    'papers-for-insights',
    () => papersAPI.getPapers({ limit: 500 }),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Generate mock insights if API data is not available
  const processedInsights = React.useMemo(() => {
    if (insightsData) return insightsData;

    if (!papersData?.papers) return null;

    // Analyze research areas distribution
    const areaDistribution = {};
    const organismDistribution = {};
    const yearDistribution = {};
    const impactScores = [];

    papersData.papers.forEach(paper => {
      // Research areas
      if (paper.researchArea) {
        areaDistribution[paper.researchArea] = (areaDistribution[paper.researchArea] || 0) + 1;
      }

      // Organisms
      if (paper.organism) {
        organismDistribution[paper.organism] = (organismDistribution[paper.organism] || 0) + 1;
      }

      // Years
      const year = new Date(paper.publicationDate).getFullYear();
      yearDistribution[year] = (yearDistribution[year] || 0) + 1;

      // Impact scores
      if (paper.impactScore) {
        impactScores.push(paper.impactScore);
      }
    });

    // Calculate statistics
    const avgImpactScore = impactScores.length > 0 
      ? impactScores.reduce((sum, score) => sum + score, 0) / impactScores.length 
      : 0;

    const totalCitations = papersData.papers.reduce((sum, paper) => sum + (paper.citationCount || 0), 0);

    return {
      overview: {
        totalPapers: papersData.papers.length,
        totalCitations,
        avgImpactScore: avgImpactScore.toFixed(2),
        researchAreas: Object.keys(areaDistribution).length,
        organisms: Object.keys(organismDistribution).length
      },
      areaDistribution: Object.entries(areaDistribution)
        .map(([area, count]) => ({ area, count, percentage: (count / papersData.papers.length) * 100 }))
        .sort((a, b) => b.count - a.count),
      organismDistribution: Object.entries(organismDistribution)
        .map(([organism, count]) => ({ organism, count, percentage: (count / papersData.papers.length) * 100 }))
        .sort((a, b) => b.count - a.count),
      yearDistribution: Object.entries(yearDistribution)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year),
      topPapers: papersData.papers
        .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
        .slice(0, 10),
      emergingTrends: [
        { trend: 'Microgravity Effects on Human Physiology', growth: '+45%', papers: 23 },
        { trend: 'Plant Growth in Space Environments', growth: '+32%', papers: 18 },
        { trend: 'Space Radiation Impact Studies', growth: '+28%', papers: 15 },
        { trend: 'Psychological Effects of Long-Duration Missions', growth: '+25%', papers: 12 }
      ],
      researchGaps: [
        { gap: 'Long-term effects of space radiation on DNA', priority: 'High', papers: 3 },
        { gap: 'Nutrition optimization for Mars missions', priority: 'High', papers: 5 },
        { gap: 'Mental health support systems for deep space', priority: 'Medium', papers: 7 },
        { gap: 'Artificial gravity countermeasures', priority: 'Medium', papers: 4 }
      ]
    };
  }, [insightsData, papersData]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'gaps', label: 'Research Gaps', icon: <Target className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="w-4 h-4" /> }
  ];

  const StatCard = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const DistributionChart = ({ data, title, color }) => (
    <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 8).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span className="text-sm text-gray-300">{item.area || item.organism}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-12 text-right">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-space-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-80">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold text-white">
                {t('aiInsights')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                AI-powered analysis of research patterns, emerging trends, and strategic recommendations for space biology research
              </p>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Timeframe:</span>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-3 py-2 bg-space-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="all">All Time</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="recent">Last 5 Years</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Research Area:</span>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="px-3 py-2 bg-space-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="all">All Areas</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Botany">Botany</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Genetics">Genetics</option>
                    <option value="Nutrition">Nutrition</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => refetchInsights()}
                  className="p-2 bg-space-800/50 hover:bg-space-700/50 text-gray-300 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex space-x-1 bg-space-800/50 p-1 rounded-xl w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-space-700/50'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {!processedInsights && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading insights...</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'overview' && processedInsights && processedInsights.overview && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard
                        title="Total Papers"
                        value={processedInsights.overview.totalPapers || 0}
                        change="+12%"
                        changeType="positive"
                        icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
                        color="bg-blue-500/20"
                      />
                      <StatCard
                        title="Total Citations"
                        value={(processedInsights.overview.totalCitations || 0).toLocaleString()}
                        change="+8%"
                        changeType="positive"
                        icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                        color="bg-green-500/20"
                      />
                      <StatCard
                        title="Avg Impact Score"
                        value={processedInsights.overview.avgImpactScore || '0.00'}
                        change="+0.3"
                        changeType="positive"
                        icon={<Activity className="w-6 h-6 text-purple-400" />}
                        color="bg-purple-500/20"
                      />
                      <StatCard
                        title="Research Areas"
                        value={processedInsights.overview.researchAreas || 0}
                        change="+2"
                        changeType="positive"
                        icon={<Target className="w-6 h-6 text-yellow-400" />}
                        color="bg-yellow-500/20"
                      />
                    </div>

                    {/* Distribution Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <DistributionChart
                        data={processedInsights.areaDistribution}
                        title="Research Areas Distribution"
                        color="bg-blue-500"
                      />
                      <DistributionChart
                        data={processedInsights.organismDistribution}
                        title="Organisms Studied"
                        color="bg-green-500"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'trends' && processedInsights && processedInsights.emergingTrends && (
                  <motion.div
                    key="trends"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Emerging Trends */}
                    <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                        Emerging Research Trends
                      </h3>
                      <div className="space-y-4">
                        {processedInsights.emergingTrends.map((trend, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-space-700/30 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-green-400">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-white">{trend.trend}</h4>
                                <p className="text-xs text-gray-400">{trend.papers} papers</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-400">{trend.growth}</p>
                              <p className="text-xs text-gray-400">Growth</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Papers */}
                    <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                        Most Influential Papers
                      </h3>
                      <div className="space-y-4">
                        {processedInsights.topPapers.map((paper, index) => (
                          <div key={paper._id} className="flex items-center justify-between p-4 bg-space-700/30 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-400">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white truncate">{paper.title}</h4>
                                <p className="text-xs text-gray-400">{paper.authors?.[0]?.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-400">{paper.citationCount || 0}</p>
                              <p className="text-xs text-gray-400">Citations</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gaps' && processedInsights && processedInsights.researchGaps && (
                  <motion.div
                    key="gaps"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-red-400" />
                        Identified Research Gaps
                      </h3>
                      <div className="space-y-4">
                        {processedInsights.researchGaps.map((gap, index) => (
                          <div key={index} className="p-4 bg-space-700/30 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-medium text-white">{gap.gap}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                gap.priority === 'High' 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {gap.priority} Priority
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{gap.papers} papers addressing this gap</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'recommendations' && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                        AI-Generated Recommendations
                      </h3>
                      <div className="space-y-6">
                        <div className="p-4 bg-space-700/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-white mb-2">Focus Areas for Future Research</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Increase studies on long-term space radiation effects</li>
                            <li>• Develop better countermeasures for microgravity-induced bone loss</li>
                            <li>• Enhance psychological support systems for deep space missions</li>
                            <li>• Optimize nutrition protocols for Mars missions</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-space-700/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-white mb-2">Collaboration Opportunities</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Partner with international space agencies for larger sample sizes</li>
                            <li>• Collaborate with AI/ML researchers for advanced data analysis</li>
                            <li>• Work with pharmaceutical companies on space medicine development</li>
                            <li>• Engage with psychology departments for mental health research</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-space-700/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-white mb-2">Technology Integration</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Implement AI-powered real-time health monitoring systems</li>
                            <li>• Develop virtual reality environments for psychological studies</li>
                            <li>• Create advanced simulation environments for ground-based research</li>
                            <li>• Integrate machine learning for predictive health modeling</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* No Data Fallback */}
                {processedInsights && !processedInsights.overview && (
                  <motion.div
                    key="no-data"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Data Available</h3>
                      <p className="text-gray-400">Insights data is not available at the moment.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIInsights;
