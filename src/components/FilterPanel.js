import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from 'react-query';
import { searchAPI } from '../services/api';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    organism: true,
    environment: true,
    researchArea: true,
    year: true,
  });

  // Fetch available filter options
  const { data: filterOptions, isLoading } = useQuery(
    'filter-options',
    searchAPI.getFilters,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFilterChange(newFilters);
  };

  const handleYearRangeChange = (type, value) => {
    const newFilters = { ...filters };
    
    if (!newFilters.yearRange) {
      newFilters.yearRange = {};
    }
    
    newFilters.yearRange[type] = value ? parseInt(value) : null;
    
    // Clean up empty year range
    if (!newFilters.yearRange.start && !newFilters.yearRange.end) {
      delete newFilters.yearRange;
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  if (isLoading) {
    return (
      <div className="bg-space-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-space-800 rounded-lg p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Organism Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('organism')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-300">Organism</span>
          {expandedSections.organism ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {expandedSections.organism && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <select
              value={filters.organism || ''}
              onChange={(e) => handleFilterChange('organism', e.target.value)}
              className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white"
            >
              <option value="">All Organisms</option>
              {filterOptions?.organisms?.map(organism => (
                <option key={organism} value={organism}>
                  {organism}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      {/* Space Environment Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('environment')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-300">Space Environment</span>
          {expandedSections.environment ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {expandedSections.environment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <select
              value={filters.spaceEnvironment || ''}
              onChange={(e) => handleFilterChange('spaceEnvironment', e.target.value)}
              className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white"
            >
              <option value="">All Environments</option>
              {filterOptions?.environments?.map(environment => (
                <option key={environment} value={environment}>
                  {environment}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      {/* Research Area Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('researchArea')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-300">Research Area</span>
          {expandedSections.researchArea ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {expandedSections.researchArea && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <select
              value={filters.researchArea || ''}
              onChange={(e) => handleFilterChange('researchArea', e.target.value)}
              className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white"
            >
              <option value="">All Research Areas</option>
              {filterOptions?.researchAreas?.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      {/* Year Range Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('year')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-300">Year Range</span>
          {expandedSections.year ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {expandedSections.year && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">From</label>
                <input
                  type="number"
                  min={filterOptions?.yearRange?.minYear || 2000}
                  max={filterOptions?.yearRange?.maxYear || 2025}
                  value={filters.yearRange?.start || ''}
                  onChange={(e) => handleYearRangeChange('start', e.target.value)}
                  placeholder="Start year"
                  className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">To</label>
                <input
                  type="number"
                  min={filterOptions?.yearRange?.minYear || 2000}
                  max={filterOptions?.yearRange?.maxYear || 2025}
                  value={filters.yearRange?.end || ''}
                  onChange={(e) => handleYearRangeChange('end', e.target.value)}
                  placeholder="End year"
                  className="w-full p-2 bg-space-700 border border-gray-600 rounded text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Available range: {filterOptions?.yearRange?.minYear || 2000} - {filterOptions?.yearRange?.maxYear || 2025}
            </div>
          </motion.div>
        )}
      </div>

      {/* Impact Score Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-300">Minimum Impact Score</span>
        </div>
        
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minImpactScore || 0}
            onChange={(e) => handleFilterChange('minImpactScore', parseFloat(e.target.value))}
            className="w-full h-2 bg-space-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span className="text-white font-medium">
              {filters.minImpactScore || 0}
            </span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (key === 'yearRange') {
                if (value.start || value.end) {
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                    >
                      Year: {value.start || 'Any'} - {value.end || 'Any'}
                      <button
                        onClick={() => handleFilterChange('yearRange', null)}
                        className="ml-2 hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                }
                return null;
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, null)}
                    className="ml-2 hover:text-gray-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FilterPanel;
