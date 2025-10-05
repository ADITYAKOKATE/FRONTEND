import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  FileText,
  Star
} from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color = 'blue',
  subtitle,
  trend
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: 'text-blue-400'
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: 'text-green-400'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      icon: 'text-purple-400'
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      icon: 'text-orange-400'
    },
    pink: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      text: 'text-pink-400',
      icon: 'text-pink-400'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      icon: 'text-cyan-400'
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`relative p-6 rounded-2xl border ${colorClasses[color].bg} ${colorClasses[color].border} backdrop-blur-sm hover:shadow-xl transition-all duration-300 group`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-white to-transparent"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color].bg} ${colorClasses[color].border} border`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
          </div>
          
          {change && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${colorClasses[color].bg}`}>
              {getChangeIcon()}
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors">
            {value}
          </h3>
          <p className="text-gray-400 text-sm font-medium">
            {title}
          </p>
          {subtitle && (
            <p className="text-gray-500 text-xs">
              {subtitle}
            </p>
          )}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Trend</span>
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">{trend}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

// Predefined stat cards for common metrics
export const PaperStatsCard = ({ count, change, changeType }) => (
  <StatCard
    title="Research Papers"
    value={count}
    change={change}
    changeType={changeType}
    icon={FileText}
    color="blue"
    subtitle="Total papers in database"
  />
);

export const ImpactStatsCard = ({ score, change, changeType }) => (
  <StatCard
    title="Avg Impact Score"
    value={score}
    change={change}
    changeType={changeType}
    icon={Star}
    color="purple"
    subtitle="Research impact rating"
  />
);

export const CitationStatsCard = ({ count, change, changeType }) => (
  <StatCard
    title="Total Citations"
    value={count}
    change={change}
    changeType={changeType}
    icon={TrendingUp}
    color="green"
    subtitle="Academic references"
  />
);

export const ResearcherStatsCard = ({ count, change, changeType }) => (
  <StatCard
    title="Active Researchers"
    value={count}
    change={change}
    changeType={changeType}
    icon={Users}
    color="orange"
    subtitle="NASA scientists"
  />
);

export default StatCard;
