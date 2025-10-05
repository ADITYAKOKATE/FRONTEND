import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  TrendingUp,
  Zap,
  RefreshCw,
  Download
} from 'lucide-react';
import { useQuery } from 'react-query';
import { insightsAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const InsightsPanel = ({ gapsData, gapsLoading, papersData }) => {
  const [selectedInsight, setSelectedInsight] = useState('gaps');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI insights for selected papers
  const { data: aiInsights, refetch: generateInsights } = useQuery(
    ['ai-insights', papersData?.papers?.slice(0, 5).map(p => p._id)],
    () => insightsAPI.generateSummaries({
      paperIds: papersData?.papers?.slice(0, 5).map(p => p._id) || [],
      summaryType: 'comprehensive'
    }),
    {
      enabled: false, // Only run when manually triggered
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateInsights();
    } finally {
      setIsGenerating(false);
    }
  };

  const insights = [
    {
      id: 'gaps',
      title: 'Research Gaps',
      icon: <Target className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-600/20'
    },
    {
      id: 'trends',
      title: 'Trend Analysis',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      id: 'ai',
      title: 'AI Insights',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20'
    }
  ];

  const renderGapsInsights = () => {
    if (gapsLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      );
    }

    if (!gapsData) {
      return (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No gaps data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Missing Combinations */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Missing Research Combinations</span>
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {gapsData.gaps?.missing?.slice(0, 6).map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-red-600/10 border border-red-600/30 rounded-lg p-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-white font-medium">{gap.organism}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Environment:</span> {gap.environment}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="text-gray-400">Research Area:</span> {gap.researchArea}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Underrepresented Areas */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <span>Underrepresented Research Areas</span>
          </h4>
          
          <div className="space-y-3">
            {gapsData.gaps?.underrepresented?.slice(0, 5).map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">
                      {area.organism} in {area.environment}
                    </div>
                    <div className="text-sm text-gray-400">{area.researchArea}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-medium">{area.count} papers</div>
                    <div className="text-sm text-gray-400">
                      Impact: {area.avgImpact?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>Research Recommendations</span>
          </h4>
          
          <div className="space-y-3">
            {gapsData.recommendations?.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">{recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTrendInsights = () => {
    if (!papersData?.papers) {
      return (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No trend data available</p>
        </div>
      );
    }

    // Analyze trends from current papers
    const organismCounts = {};
    const environmentCounts = {};
    const yearCounts = {};

    papersData.papers.forEach(paper => {
      organismCounts[paper.organism] = (organismCounts[paper.organism] || 0) + 1;
      environmentCounts[paper.spaceEnvironment] = (environmentCounts[paper.spaceEnvironment] || 0) + 1;
      if (paper.mission?.year) {
        yearCounts[paper.mission.year] = (yearCounts[paper.mission.year] || 0) + 1;
      }
    });

    const topOrganism = Object.entries(organismCounts).reduce((a, b) => 
      organismCounts[a[0]] > organismCounts[b[0]] ? a : b, ['N/A', 0]
    );

    const topEnvironment = Object.entries(environmentCounts).reduce((a, b) => 
      environmentCounts[a[0]] > environmentCounts[b[0]] ? a : b, ['N/A', 0]
    );

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <div className="text-blue-400 font-medium">Most Researched Organism</div>
            <div className="text-white text-lg font-semibold">{topOrganism[0]}</div>
            <div className="text-gray-400 text-sm">{topOrganism[1]} papers</div>
          </div>
          
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
            <div className="text-green-400 font-medium">Primary Environment</div>
            <div className="text-white text-lg font-semibold">{topEnvironment[0]}</div>
            <div className="text-gray-400 text-sm">{topEnvironment[1]} papers</div>
          </div>
          
          <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
            <div className="text-purple-400 font-medium">Total Papers Analyzed</div>
            <div className="text-white text-lg font-semibold">{papersData.papers.length}</div>
            <div className="text-gray-400 text-sm">in current view</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Organism Distribution</h4>
          <div className="space-y-2">
            {Object.entries(organismCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([organism, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{organism}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / topOrganism[1]) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAIInsights = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-gray-400">Generating AI insights...</p>
          </div>
        </div>
      );
    }

    if (!aiInsights) {
      return (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Generate AI-powered insights from selected papers</p>
          <button
            onClick={handleGenerateInsights}
            className="btn-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate Insights
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">AI-Generated Insights</h4>
          <button
            onClick={handleGenerateInsights}
            className="btn-ghost text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Regenerate
          </button>
        </div>

        <div className="space-y-4">
          {aiInsights.summaries?.map((summary, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4"
            >
              <h5 className="text-white font-medium mb-2">{summary.title}</h5>
              <p className="text-gray-300 mb-3">{summary.summary}</p>
              
              {summary.keyPoints?.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-gray-400 mb-2">Key Points:</h6>
                  <ul className="space-y-1">
                    {summary.keyPoints.map((point, pointIndex) => (
                      <li key={pointIndex} className="text-sm text-gray-300 flex items-start space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-2"></div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-400">
                Confidence: {(summary.confidence * 100).toFixed(0)}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    const recommendations = [
      {
        title: "Focus on Long-term Space Missions",
        description: "Prioritize research on human physiology and psychology for extended Mars missions",
        priority: "High",
        category: "Mission Planning"
      },
      {
        title: "Expand Plant-Microorganism Research",
        description: "Investigate symbiotic relationships in space agriculture systems",
        priority: "Medium",
        category: "Agriculture"
      },
      {
        title: "Deep Space Environment Studies",
        description: "Increase research on radiation effects beyond Earth's magnetosphere",
        priority: "High",
        category: "Radiation Biology"
      },
      {
        title: "Interdisciplinary Collaboration",
        description: "Foster collaboration between biology, engineering, and psychology teams",
        priority: "Medium",
        category: "Research Strategy"
      }
    ];

    return (
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h5 className="text-white font-medium">{rec.title}</h5>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                rec.priority === 'High' 
                  ? 'bg-red-600/20 text-red-400' 
                  : 'bg-yellow-600/20 text-yellow-400'
              }`}>
                {rec.priority}
              </span>
            </div>
            <p className="text-gray-300 mb-2">{rec.description}</p>
            <div className="text-xs text-gray-400">
              Category: {rec.category}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Insight Tabs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">AI Insights & Analysis</h3>
          <button className="btn-ghost text-sm px-3 py-1">
            <Download className="w-4 h-4 mr-1" />
            Export Report
          </button>
        </div>

        <div className="flex space-x-1 bg-space-800 p-1 rounded-lg w-fit">
          {insights.map((insight) => (
            <button
              key={insight.id}
              onClick={() => setSelectedInsight(insight.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedInsight === insight.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-space-700'
              }`}
            >
              {insight.icon}
              <span>{insight.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Insight Content */}
      <div className="card">
        {selectedInsight === 'gaps' && renderGapsInsights()}
        {selectedInsight === 'trends' && renderTrendInsights()}
        {selectedInsight === 'ai' && renderAIInsights()}
        {selectedInsight === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
};

export default InsightsPanel;
