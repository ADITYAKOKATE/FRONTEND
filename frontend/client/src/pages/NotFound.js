import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Rocket, 
  Search,
  AlertTriangle
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-6"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="text-8xl font-bold gradient-text mb-4">404</div>
            <div className="absolute -top-4 -right-4">
              <Rocket className="w-12 h-12 text-neon-blue animate-float" />
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Lost in Space?
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The page you're looking for seems to have drifted off into the cosmic void. 
            Don't worry, even astronauts get lost sometimes!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-6 py-3 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary px-6 py-3 flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Explore Papers</span>
          </button>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-4 bg-space-800 rounded-lg border border-gray-700"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Space Fact:</h3>
          <p className="text-xs text-gray-400">
            The International Space Station travels at approximately 17,500 mph, 
            completing one orbit around Earth every 90 minutes!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
