import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useQuery } from 'react-query';
import { searchAPI } from '../services/api';
import toast from 'react-hot-toast';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Fetch search suggestions
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery(
    ['suggestions', query],
    () => searchAPI.getSuggestions(query),
    {
      enabled: query.length >= 2,
      staleTime: 5 * 60 * 1000,
    }
  );

  const suggestions = suggestionsData?.suggestions || [];

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      toast.success(`Searching for "${query.trim()}"`);
    }
  }, [query, onSearch]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, [onSearch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, selectedIndex, handleSearch, handleSuggestionClick]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length >= 2);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search papers by title, keywords, authors, or organisms..."
          className="w-full pl-10 pr-20 py-3 bg-space-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="btn-primary px-4 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-space-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {suggestionsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-400">Loading suggestions...</span>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-space-700 transition-colors ${
                    index === selectedIndex ? 'bg-space-700' : ''
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${
                    index === suggestions.length - 1 ? 'rounded-b-lg' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{suggestion}</span>
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      {query.length === 0 && (
        <div className="mt-2 text-sm text-gray-400">
          <p>💡 Try searching for: "Mars mission", "plant growth", "human physiology", or "ISS experiments"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
