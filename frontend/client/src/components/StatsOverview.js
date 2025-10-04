import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

const StatsOverview = ({ data }) => {
  const { overview, organisms, environments, years } = data;

  const organismColors = {
    'Human': 'text-blue-400',
    'Plant': 'text-green-400',
    'Animal': 'text-orange-400',
    'Microorganism': 'text-purple-400',
    'Mixed': 'text-yellow-400',
    'Other': 'text-gray-400'
  };

  const environmentColors = {
    'ISS': 'text-blue-400',
    'Moon': 'text-gray-300',
    'Mars': 'text-red-400',
    'Deep Space': 'text-purple-400',
    'Ground Control': 'text-green-400',
    'Other': 'text-gray-400'
  };

  const topOrganisms = organisms?.slice(0, 3) || [];
  const topEnvironments = environments?.slice(0, 3) || [];
  const recentYears = years?.slice(0, 5) || [];

  const stats = [
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'Total Papers',
      value: overview?.totalPapers || 0,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Avg Impact Score',
      value: overview?.avgImpactScore?.toFixed(1) || '0.0',
      color: 'text-green-400',
      bgColor: 'bg-green-600/20'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Citations',
      value: overview?.totalCitations || 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Years Covered',
      value: years?.length || 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-4 border border-gray-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Organisms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Top Organisms</h3>
          </div>
          
          <div className="space-y-3">
            {topOrganisms.map((organism, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    organismColors[organism._id]?.replace('text-', 'bg-') || 'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-300">{organism._id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{organism.count}</span>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(organism.count / topOrganisms[0]?.count) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Environments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Research Environments</h3>
          </div>
          
          <div className="space-y-3">
            {topEnvironments.map((environment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    environmentColors[environment._id]?.replace('text-', 'bg-') || 'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-300">{environment._id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{environment.count}</span>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(environment.count / topEnvironments[0]?.count) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Recent Years</h3>
          </div>
          
          <div className="space-y-3">
            {recentYears.map((year, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{year._id || 'Unknown'}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{year.count}</span>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(year.count / recentYears[0]?.count) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Insights</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">
                Most researched organism: <span className="text-white font-medium">
                  {topOrganisms[0]?._id || 'N/A'}
                </span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">
                Primary environment: <span className="text-white font-medium">
                  {topEnvironments[0]?._id || 'N/A'}
                </span>
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">
                Peak research year: <span className="text-white font-medium">
                  {recentYears[0]?._id || 'N/A'}
                </span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-gray-300">
                Average impact: <span className="text-white font-medium">
                  {overview?.avgImpactScore?.toFixed(1) || '0.0'}/10
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsOverview;
