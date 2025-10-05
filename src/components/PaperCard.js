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
  FileText,
  Network,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatAuthors, truncateText } from '../services/api';

const PaperCard = ({ paper, viewMode = 'grid', onOpenKnowledgeGraph }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {};

  const openDetailsUrl = (e) => {
    e.stopPropagation();
    if (paper?.url) {
      window.open(paper.url, '_blank');
    }
  };

  const openKnowledgeGraph = (e) => {
    e.stopPropagation();
    if (onOpenKnowledgeGraph) {
      onOpenKnowledgeGraph(paper);
      return;
    }
    navigate('/knowledge-graph', { state: { paper } });
  };

  const askAIAboutPaper = (e) => {
    e.stopPropagation();
    const message = `Tell me about this paper: ${paper?.title || ''}`.trim();
    window.dispatchEvent(new CustomEvent('open-space-chatbot', { detail: { message, paperId: paper?.paper_id } }));
  };

  const getYear = (p) => {
    if (!p) return '';
    if (p.year) return p.year;
    if (p.publicationDate) {
      const d = new Date(p.publicationDate);
      const y = d.getFullYear();
      return Number.isNaN(y) ? '' : y;
    }
    if (p.date) {
      const d = new Date(p.date);
      const y = d.getFullYear();
      return Number.isNaN(y) ? '' : y;
    }
    if (p.publication_year) return p.publication_year;
    if (p.pub_year) return p.pub_year;
    return '';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.002 }}
        className="group bg-gradient-to-b from-space-800/60 to-space-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/60 overflow-hidden hover:border-gray-600/60 transition-all duration-300 p-5 shadow-sm hover:shadow-xl"
      >
        <div className="flex items-start space-x-4">
          {/* Paper content */}
          <div className="flex-1 min-w-0 flex flex-col">
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
                    <span>{getYear(paper)}</span>
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
                    <button
                      onClick={openKnowledgeGraph}
                      className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center space-x-1 text-xs"
                    >
                      <Network className="w-3 h-3" />
                      <span>Knowledge Graph</span>
                    </button>
                    <button
                      onClick={askAIAboutPaper}
                      className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors flex items-center space-x-1 text-xs"
                    >
                      <Bot className="w-3 h-3" />
                      <span>Ask AI</span>
                    </button>
                    <button
                      onClick={openDetailsUrl}
                      className="px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors flex items-center space-x-1 text-xs"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
      whileHover={{ y: -6, scale: 1.01 }}
      className="group bg-gradient-to-b from-space-800/60 to-space-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/60 overflow-hidden hover:border-gray-600/60 transition-all duration-300 p-6 relative shadow-sm hover:shadow-2xl h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded shadow-sm">
            {paper.publication}
          </span>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{getYear(paper)}</span>
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
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full flex items-center space-x-1 shadow-sm"
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

      {/* Footer: 2x2 actions */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Placeholder: could show a summary modal
            }}
            className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Summary</span>
          </button>
          <button
            onClick={openKnowledgeGraph}
            className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Network className="w-4 h-4" />
            <span className="text-sm">Knowledge Graph</span>
          </button>
          <button
            onClick={askAIAboutPaper}
            className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span className="text-sm">Ask AI</span>
          </button>
          <button
            onClick={openDetailsUrl}
            className="w-full px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <span className="text-sm">View Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaperCard;
