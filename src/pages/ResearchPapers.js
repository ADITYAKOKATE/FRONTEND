import React, { useState, useEffect } from 'react';
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
import PaperCard from '../components/PaperCard';
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

  const batchSize = 10;

  // Local state to accumulate loaded papers
  const [loadedPapers, setLoadedPapers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Initial load (first 10)
  useEffect(() => {
    let isMounted = true;
    setIsLoadingInitial(true);
    papersAPI
      .getPapers(0)
      .then((res) => {
        if (!isMounted) return;
        const cards = res?.data?.cards || [];
        setLoadedPapers(cards);
        setOffset(cards.length);
        setHasMore(cards.length === batchSize);
        setLoadError(null);
      })
      .catch((e) => {
        if (!isMounted) return;
        setLoadError(e);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingInitial(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    papersAPI
      .getPapers(offset)
      .then((res) => {
        const next = res?.data?.cards || [];
        setLoadedPapers((prev) => [...prev, ...next]);
        const newOffset = offset + next.length;
        setOffset(newOffset);
        setHasMore(next.length === batchSize);
      })
      .catch((e) => setLoadError(e))
      .finally(() => setIsLoadingMore(false));
  };
  
  // Filter papers based on search query
  const filteredPapers = React.useMemo(() => {
    if (!searchQuery.trim()) return loadedPapers;
    
    const query = searchQuery.toLowerCase();
    return loadedPapers.filter(paper => 
      paper.title?.toLowerCase().includes(query) ||
      paper.summary?.toLowerCase().includes(query) ||
      paper.authors?.some(author => author.toLowerCase().includes(query)) ||
      paper.keywords?.some(keyword => keyword.toLowerCase().includes(query)) ||
      paper.publication?.toLowerCase().includes(query)
    );
  }, [loadedPapers, searchQuery]);

  // Visible papers are simply the filtered subset of what we've loaded
  const visiblePapers = filteredPapers;

  // Get all unique keywords
  const allKeywords = React.useMemo(() => {
    if (!loadedPapers) return [];
    const keywords = new Set();
    loadedPapers.forEach(paper => {
      paper.keywords?.forEach(keyword => keywords.add(keyword));
    });
    return Array.from(keywords).sort();
  }, [loadedPapers]);

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
    return paper.summary || 'No summary available';
  };


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
                Explore {loadedPapers.length} research papers with detailed summaries, knowledge graphs, and direct access to publications
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
              {isLoadingInitial ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : loadError ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Papers</h3>
                  <p className="text-gray-400">Failed to load research papers. Please check if the backend is running.</p>
                </div>
              ) : visiblePapers?.length > 0 ? (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {visiblePapers.map((paper, index) => (
                      <PaperCard
                        key={`${paper.title}-${index}`}
                        paper={paper}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                  {/* Load More */}
                  <div className="flex justify-center mt-8">
                    {hasMore ? (
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 py-3 bg-space-700/50 hover:bg-space-600/50 text-gray-200 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        {isLoadingMore ? (
                          <>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Load more</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-500">No more papers</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Papers Found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
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
