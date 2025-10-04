import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  TrendingUp,
  BarChart3,
  Activity,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Building
} from 'lucide-react';
import { papersAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState({
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy'
  });
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 95
  });

  // Fetch statistics
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'stats',
    papersAPI.getStats,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch papers for timeline
  const { data: papersData } = useQuery(
    'papers-timeline',
    () => papersAPI.getPapers({ limit: 1000 }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 3)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(10, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(80, Math.min(100, prev.network + (Math.random() - 0.5) * 5))
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process timeline data
  const timelineData = React.useMemo(() => {
    if (!papersData?.papers) return [];
    
    const yearCounts = {};
    papersData.papers.forEach(paper => {
      const year = new Date(paper.publicationDate).getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [papersData]);

  // Process most visited papers (simulated)
  const mostVisitedPapers = React.useMemo(() => {
    if (!papersData?.papers) return [];
    
    return papersData.papers
      .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, 5);
  }, [papersData]);

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
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold text-white">
                {t('welcomeToNASA')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                {t('exploreFuture')}
              </p>
            </motion.div>

            {/* Stats Cards */}
            {!statsLoading && statsData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('researchPapersCount')}</p>
                      <p className="text-3xl font-bold text-white">{statsData.overview?.totalPapers || 608}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('researchAreasCount')}</p>
                      <p className="text-3xl font-bold text-white">7</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('organizationsCount')}</p>
                      <p className="text-3xl font-bold text-white">156</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('systemStatus')}</p>
                      <p className="text-3xl font-bold text-green-400">Online</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Research Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
                className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  {t('researchTimeline')}
                </h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {timelineData.map((item, index) => (
                    <div key={item.year} className="flex flex-col items-center space-y-2">
                      <div 
                        className="bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-400"
                        style={{ 
                          height: `${(item.count / Math.max(...timelineData.map(d => d.count))) * 200}px`,
                          width: '20px'
                        }}
                      />
                      <span className="text-xs text-gray-400">{item.year}</span>
                      <span className="text-xs text-gray-300">{item.count}</span>
              </div>
                  ))}
                </div>
            </motion.div>

              {/* Most Visited Papers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
                className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-400" />
                  {t('mostVisitedPapers')}
                </h2>
                <div className="space-y-4">
                  {mostVisitedPapers.map((paper, index) => (
                    <div key={paper._id} className="flex items-center justify-between p-3 bg-space-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-400">{index + 1}</span>
              </div>
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-xs">{paper.title}</p>
                          <p className="text-xs text-gray-400">{paper.citationCount || 0} citations</p>
                        </div>
                          </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">{paper.impactScore?.toFixed(1) || '0.0'}</p>
                        <p className="text-xs text-gray-400">Impact</p>
                      </div>
                        </div>
                          ))}
                        </div>
              </motion.div>
                        </div>

            {/* Weather and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weather */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Cloud className="w-5 h-5 mr-2 text-yellow-400" />
                  {t('weather')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Thermometer className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{weather.temperature.toFixed(1)}°C</p>
                    <p className="text-sm text-gray-400">Temperature</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{weather.humidity.toFixed(0)}%</p>
                    <p className="text-sm text-gray-400">Humidity</p>
                  </div>
                  <div className="text-center">
                    <Wind className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{weather.windSpeed.toFixed(1)} km/h</p>
                    <p className="text-sm text-gray-400">Wind Speed</p>
                  </div>
                  <div className="text-center">
                    <Cloud className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-lg font-bold text-white">{weather.condition}</p>
                    <p className="text-sm text-gray-400">Condition</p>
                  </div>
                </div>
                  </motion.div>

              {/* System Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  {t('systemStatus')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-white">{systemStatus.cpu.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemStatus.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-white">{systemStatus.memory.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemStatus.memory}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Disk Usage</span>
                      <span className="text-white">{systemStatus.disk.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemStatus.disk}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white">{systemStatus.network.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemStatus.network}%` }}
                      />
                    </div>
                  </div>
                </div>
                  </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
