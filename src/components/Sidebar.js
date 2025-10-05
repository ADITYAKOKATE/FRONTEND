import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  BarChart3,
  FileText,
  Network,
  Brain,
  ChevronLeft,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);

  const navigationItems = [
    {
      id: '/',
      label: t('home'),
      icon: <Home className="w-5 h-5" />,
      path: '/',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: '/dashboard',
      label: t('dashboard'),
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/dashboard',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: '/research-papers',
      label: t('researchPapers'),
      icon: <FileText className="w-5 h-5" />,
      path: '/research-papers',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: '/knowledge-graph',
      label: t('knowledgeGraph'),
      icon: <Network className="w-5 h-5" />,
      path: '/knowledge-graph',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      id: '/ai-insights',
      label: t('aiInsights'),
      icon: <Brain className="w-5 h-5" />,
      path: '/ai-insights',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    }
  ];

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    collapsed: {
      width: 80,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.1
      }
    },
    collapsed: {
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="fixed left-0 top-0 h-full bg-space-800/95 backdrop-blur-xl border-r border-gray-700/50 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            animate={isCollapsed ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NASA</h1>
              <p className="text-xs text-gray-400">BioExplorer</p>
            </div>
          </motion.div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeItem === item.id
                  ? `${item.bgColor} ${item.borderColor} border`
                  : 'hover:bg-gray-700/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`${activeItem === item.id ? item.color : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    variants={itemVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className={`font-medium ${
                      activeItem === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    } transition-colors`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
