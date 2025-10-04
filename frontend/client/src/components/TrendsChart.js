import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TrendsChart = ({ data, loading }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('totalPapers');

  const chartTypes = [
    { id: 'line', label: 'Line Chart', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'area', label: 'Area Chart', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const metrics = [
    { id: 'totalPapers', label: 'Total Papers' },
    { id: 'avgImpact', label: 'Average Impact' },
    { id: 'totalCitations', label: 'Total Citations' },
  ];

  const timeRanges = [
    { id: 'all', label: 'All Time' },
    { id: '5years', label: 'Last 5 Years' },
    { id: '10years', label: 'Last 10 Years' },
  ];

  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06d6a0'];

  // Process data for different chart types
  const processData = () => {
    if (!data?.trends) return [];

    let processedData = data.trends;

    // Filter by time range
    if (timeRange !== 'all') {
      const currentYear = new Date().getFullYear();
      const cutoffYear = timeRange === '5years' ? currentYear - 5 : currentYear - 10;
      processedData = processedData.filter(item => item.year >= cutoffYear);
    }

    // Sort by year
    processedData.sort((a, b) => a.year - b.year);

    return processedData;
  };

  const chartData = processData();

  // Prepare pie chart data for organism distribution
  const organismData = chartData.reduce((acc, item) => {
    Object.values(item.breakdown || {}).forEach(breakdown => {
      const organism = breakdown.organism;
      if (!acc[organism]) {
        acc[organism] = 0;
      }
      acc[organism] += breakdown.count;
    });
    return acc;
  }, {});

  const pieData = Object.entries(organismData).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-space-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading trends data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !chartData.length) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Trends Data</h3>
            <p className="text-gray-400">Trends data is not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Research Trends</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="btn-ghost text-sm px-3 py-1">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Chart Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Chart Type</label>
            <div className="flex space-x-1 bg-space-800 p-1 rounded-lg">
              {chartTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                    chartType === type.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-space-700'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Metric */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="card">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            )}

            {chartType === 'area' && (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            )}

            {chartType === 'bar' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey={selectedMetric}
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Organism Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Organism Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Summary Statistics</h3>
          <div className="space-y-4">
            {data.summary && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Years Covered</span>
                  <span className="text-white font-medium">{data.summary.totalYears}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Peak Research Year</span>
                  <span className="text-white font-medium">
                    {data.summary.peakYear?.year || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Peak Year Papers</span>
                  <span className="text-white font-medium">
                    {data.summary.peakYear?.totalPapers || 0}
                  </span>
                </div>
              </>
            )}
            
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Top Organisms</h4>
              <div className="space-y-2">
                {pieData.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsChart;
