import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { currentLanguage, languages, changeLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 bg-space-900/95 backdrop-blur-xl border-b border-gray-700/50"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - System Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-400">
                {isOnline ? t('online') : t('offline')}
              </span>
            </div>
          </div>

          {/* Center Section - Title */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="text-white font-semibold">NASA StellarBioNexus</span>
          </div>

          {/* Right Section - Language Selector */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300">{languages[currentLanguage].flag}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-space-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                  <div className="p-2">
                    {Object.entries(languages).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => {
                          changeLanguage(code);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          currentLanguage === code
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-medium">{lang.nativeName}</div>
                          <div className="text-xs text-gray-400">{lang.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </motion.header>
  );
};

export default Header;
