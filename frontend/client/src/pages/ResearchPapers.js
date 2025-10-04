import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  FileText,
  Network,
  ExternalLink,
  Tag,
  Calendar,
  User,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { papersAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

const ResearchPapers = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('publicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const papersPerPage = 20;

  // Fetch all papers
  const { data: allPapersData } = useQuery(
    'all-papers',
    () => papersAPI.getPapers({ limit: 1000 }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Fetch filtered papers
  const { data: papersData, isLoading: papersLoading } = useQuery(
    ['papers', searchQuery, filters, currentPage, sortBy, sortOrder],
    () => {
      const queryParams = {
        ...filters,
        page: currentPage,
        limit: papersPerPage,
        sortBy,
        sortOrder
      };
      
      if (searchQuery.trim()) {
        return papersAPI.searchPapers({
          query: searchQuery,
          ...queryParams
        });
      } else {
        return papersAPI.getPapers(queryParams);
      }
    },
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Get all unique keywords
  const allKeywords = React.useMemo(() => {
    if (!allPapersData?.papers) return [];
    const keywords = new Set();
    allPapersData.papers.forEach(paper => {
      paper.keywords?.forEach(keyword => keywords.add(keyword));
    });
    return Array.from(keywords).sort();
  }, [allPapersData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleKeywordToggle = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
    setCurrentPage(1);
  };

  const openPaper = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getSummary = (paper) => {
    return paper.summary || paper.abstract?.substring(0, 200) + '...' || 'No summary available';
  };

  const PaperCard = ({ paper, viewMode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-space-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 ${
        viewMode === 'grid' ? 'p-6' : 'p-4'
      }`}
    >
      <div className={`${viewMode === 'grid' ? 'space-y-4' : 'flex space-x-4'}`}>
        {/* Paper Info */}
        <div className={`${viewMode === 'grid' ? 'space-y-3' : 'flex-1'}`}>
          <h3 className={`font-bold text-white hover:text-blue-400 transition-colors cursor-pointer ${
            viewMode === 'grid' ? 'text-lg' : 'text-base'
          }`}>
            {paper.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(paper.publicationDate).getFullYear()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{paper.authors?.[0]?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>{paper.authors?.[0]?.affiliation || 'Unknown'}</span>
            </div>
          </div>

          {viewMode === 'grid' && (
            <p className="text-gray-300 text-sm leading-relaxed">
              {getSummary(paper)}
            </p>
          )}

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {paper.keywords?.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  selectedKeywords.includes(keyword)
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
                onClick={() => handleKeywordToggle(keyword)}
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {keyword}
              </span>
            ))}
            {paper.keywords?.length > 5 && (
              <span className="px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-400">
                +{paper.keywords.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center space-x-2 ${
          viewMode === 'grid' ? 'justify-between' : 'flex-col space-y-2'
        }`}>
          <div className="flex space-x-2">
            <button
              onClick={() => {/* Show summary modal */}}
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">{t('summary')}</span>
            </button>
            
            <button
              onClick={() => {/* Show knowledge graph */}}
              className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Network className="w-4 h-4" />
              <span className="text-sm">{t('knowledgeGraphBtn')}</span>
            </button>
          </div>

          <button
            onClick={() => openPaper(paper.url)}
            className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">{t('openPaper')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-space-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-80">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold text-white">
                {t('researchPapers')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Explore all 608 research papers with detailed summaries, knowledge graphs, and direct access to publications
              </p>
            </motion.div>

            {/* Search and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="bg-space-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search papers, authors, keywords..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-space-800/50 hover:bg-space-700/50 rounded-lg transition-colors"
                  >
                    <Filter className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300">{t('filter')}</span>
                    {showFilters ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{t('sortBy')}:</span>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 bg-space-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="publicationDate-desc">Latest First</option>
                      <option value="publicationDate-asc">Oldest First</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
                      <option value="citationCount-desc">Most Cited</option>
                      <option value="impactScore-desc">Highest Impact</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-space-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-space-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Keywords Filter */}
              <div className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-400" />
                  {t('keywords')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allKeywords.slice(0, 20).map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordToggle(keyword)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedKeywords.includes(keyword)
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Papers Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {papersLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : papersData?.papers?.length > 0 ? (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {papersData.papers.map((paper) => (
                      <PaperCard
                        key={paper._id}
                        paper={paper}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {papersData?.pagination && papersData.pagination.pages > 1 && (
                    <div className="flex justify-center space-x-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-space-700/50 hover:bg-space-600/50 text-gray-300 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{t('previous')}</span>
                      </button>
                      
                      <span className="flex items-center px-4 py-2 text-gray-400">
                        {t('page')} {currentPage} {t('of')} {papersData.pagination.pages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(papersData.pagination.pages, prev + 1))}
                        disabled={currentPage === papersData.pagination.pages}
                        className="px-4 py-2 bg-space-700/50 hover:bg-space-600/50 text-gray-300 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>{t('next')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('noResults')}</h3>
                  <p className="text-gray-400">{t('tryAdjusting')}</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResearchPapers;
