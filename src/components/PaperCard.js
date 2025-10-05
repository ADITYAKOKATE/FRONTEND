import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Building, 
  ExternalLink,
  Check,
  ChevronRight,
  Tag,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatAuthors, truncateText } from '../services/api';

const PaperCard = ({ paper, viewMode = 'grid', isSelected = false, onSelect }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // For now, we'll use the title as a simple identifier
    // In the future, you might want to add an ID field to the backend
    navigate(`/paper/${encodeURIComponent(paper.title)}`);
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
        className={`bg-space-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 p-4 cursor-pointer ${
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
                    <span>{paper.year}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{paper.publication}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">
                  {truncateText(paper.summary, 200)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords?.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full flex items-center space-x-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{keyword}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
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
      className={`bg-space-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 p-6 cursor-pointer relative ${
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
            {paper.publication}
          </span>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{paper.year}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {paper.title}
        </h3>
      </div>

      {/* Authors */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span className="truncate">{formatAuthors(paper.authors)}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm line-clamp-3">
          {truncateText(paper.summary, 150)}
        </p>
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {paper.keywords?.slice(0, 4).map((keyword, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full flex items-center space-x-1"
            >
              <Tag className="w-3 h-3" />
              <span>{keyword}</span>
            </span>
          ))}
          {paper.keywords?.length > 4 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
              +{paper.keywords.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Show summary modal or navigate to detail page
            }}
            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Summary</span>
          </button>
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
