import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  MapPin, 
  TrendingUp, 
  ExternalLink,
  Check,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatAuthors, truncateText, getImpactColor } from '../services/api';

const PaperCard = ({ paper, viewMode = 'grid', isSelected = false, onSelect }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/paper/${paper._id}`);
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`card cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-900/20' : ''
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-start space-x-4">
          {/* Selection checkbox */}
          <button
            onClick={handleSelectClick}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isSelected 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-600 hover:border-blue-500'
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
          </button>

          {/* Paper content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {paper.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{formatAuthors(paper.authors)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(paper.publicationDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{paper.spaceEnvironment}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">
                  {paper.summary || truncateText(paper.abstract, 200)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-400">Organism:</span>
                      <span className="text-sm font-medium text-white">{paper.organism}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-400">Area:</span>
                      <span className="text-sm font-medium text-white">{paper.researchArea}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getImpactColor(paper.impactScore)}`}>
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{paper.impactScore?.toFixed(1) || 'N/A'}</span>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`card cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-900/20' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      <button
        onClick={handleSelectClick}
        className={`absolute top-4 right-4 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors z-10 ${
          isSelected 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'border-gray-600 hover:border-blue-500'
        }`}
      >
        {isSelected && <Check className="w-3 h-3" />}
      </button>

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded">
            {paper.organism}
          </span>
          
          <div className={`flex items-center space-x-1 ${getImpactColor(paper.impactScore)}`}>
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{paper.impactScore?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {paper.title}
        </h3>
      </div>

      {/* Authors and Date */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span className="truncate">{formatAuthors(paper.authors)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(paper.publicationDate)}</span>
        </div>
      </div>

      {/* Abstract/Summary */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm line-clamp-3">
          {paper.summary || truncateText(paper.abstract, 150)}
        </p>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
            {paper.spaceEnvironment}
          </span>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
            {paper.researchArea}
          </span>
          {paper.mission?.name && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              {paper.mission.name}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          {paper.citationCount > 0 && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>{paper.citationCount} citations</span>
            </div>
          )}
          
          {paper.mission?.year && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{paper.mission.year}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 text-blue-400 text-sm">
          <span>View Details</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default PaperCard;
