import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Search, 
  Brain, 
  BarChart3, 
  Globe, 
  Star,
  ArrowRight,
  Moon,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Search & Filter",
      description: "Find papers by keyword, organism, mission, or year with AI-powered search capabilities."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Summaries",
      description: "Get instant key insights from research papers with advanced NLP summarization."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Knowledge Graph",
      description: "Visualize relationships between organisms, missions, and research areas."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Trends & Insights",
      description: "Track research progress and identify knowledge gaps for future missions."
    }
  ];

  const stats = [
    { number: "608", label: "Research Papers" },
    { number: "50+", label: "Space Missions" },
    { number: "15+", label: "Years of Data" },
    { number: "100%", label: "AI Powered" }
  ];

  return (
    <div className="min-h-screen bg-space-900 relative overflow-hidden">
      {/* Enhanced Star field background */}
      <div className="absolute inset-0 star-field opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-space-900 via-space-800 to-space-900 opacity-50"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-3xl font-bold gradient-text">NASA BioExplorer</span>
            <p className="text-sm text-gray-400 -mt-1">Space Biology Research Platform</p>
          </div>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-space-800/50 backdrop-blur-sm hover:bg-space-700/50 transition-colors border border-gray-700/50"
          >
            {isDarkMode ? <Moon className="w-5 h-5 text-yellow-400" /> : <Star className="w-5 h-5 text-blue-400" />}
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Launch Dashboard
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-glow">
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          >
            Explore the{' '}
            <span className="gradient-text">Future</span>
            <br />
            of Space Biology
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Discover insights from NASA's 608+ biology research papers with AI-powered analysis, 
            interactive knowledge graphs, and mission planning tools.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-xl font-semibold rounded-2xl flex items-center space-x-3 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <Zap className="w-6 h-6" />
              <span>Start Exploring</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-space-800/50 backdrop-blur-sm hover:bg-space-700/50 text-white text-xl font-semibold rounded-2xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-neon-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Powerful Features for{' '}
            <span className="gradient-text">Mission Planning</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card card-hover text-center"
              >
                <div className="text-neon-blue mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Explore the{' '}
            <span className="gradient-text">Cosmos</span>?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-300 mb-8"
          >
            Join scientists and mission planners in discovering the future of space biology.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-xl px-12 py-6 rounded-xl flex items-center space-x-3 mx-auto animate-glow"
          >
            <Rocket className="w-6 h-6" />
            <span>Launch Dashboard</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 NASA BioExplorer. Built for the future of space exploration.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
