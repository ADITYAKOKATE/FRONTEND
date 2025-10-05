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
import { papersAPI, searchAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import PaperCard from '../components/PaperCard';
import { useLanguage } from '../contexts/LanguageContext';
import * as d3 from 'd3';
import { insightsAPI } from '../services/api';

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
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const batchSize = 10;

  // Local state to accumulate loaded papers
  const [loadedPapers, setLoadedPapers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [graphPaper, setGraphPaper] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [graphLoading, setGraphLoading] = useState(false);
  const svgRef = React.useRef();

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

  const openKnowledgeGraphModal = async (paper) => {
    setGraphPaper(paper);
    setGraphModalOpen(true);
    setGraphLoading(true);
    try {
      const res = await insightsAPI.getPaperKnowledgeGraph(paper.paper_id);
      const dto = res.data || {};
      const centerId = `paper-${paper.paper_id}`;
      const nodes = [
        { id: centerId, type: 'paper', label: dto.title || paper.title, size: 18, color: '#3B82F6', url: dto.url || paper.url }
      ];
      const links = [];
      if (dto.publication) {
        nodes.push({ id: `pub-${dto.publication}`, type: 'publication', label: dto.publication, size: 12, color: '#10B981' });
        links.push({ source: centerId, target: `pub-${dto.publication}`, type: 'published_in', strength: 1 });
      }
      if (dto.researchArea) {
        nodes.push({ id: `area-${dto.researchArea}`, type: 'researchArea', label: dto.researchArea, size: 12, color: '#F59E0B' });
        links.push({ source: centerId, target: `area-${dto.researchArea}`, type: 'research_area', strength: 1 });
      }
      (dto.keywords || []).forEach((kw) => {
        const kid = `kw-${kw}`;
        nodes.push({ id: kid, type: 'keyword', label: kw, size: 10, color: '#8B5CF6' });
        links.push({ source: centerId, target: kid, type: 'has_keyword', strength: 1 });
      });
      setGraphData({ nodes, links });
    } catch (e) {
      setGraphData({ nodes: [], links: [] });
    } finally {
      setGraphLoading(false);
    }
  };

  // Render D3 graph inside modal
  useEffect(() => {
    if (!graphModalOpen || graphLoading || !graphData.nodes.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 800;
    const height = 500;
    const g = svg.append('g');
    const zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.size + 6));
    const link = g.append('g').selectAll('line').data(graphData.links).enter().append('line').attr('stroke', '#4B5563').attr('stroke-opacity', 0.6).attr('stroke-width', d => Math.sqrt(d.strength || 1) * 2);
    const node = g.append('g').selectAll('circle').data(graphData.nodes).enter().append('circle')
      .attr('r', d => d.size).attr('fill', d => d.color).attr('stroke', '#fff').attr('stroke-width', 2).style('cursor', 'pointer')
      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
      .on('click', (event, d) => {
        if (d.type === 'paper' && d.url) window.open(d.url, '_blank');
      });
    const labels = g.append('g').selectAll('text').data(graphData.nodes).enter().append('text')
      .text(d => d.label).attr('font-size', '12px').attr('fill', '#fff').attr('text-anchor', 'middle').attr('dy', d => d.size + 14).style('pointer-events', 'none');
    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('cx', d => d.x).attr('cy', d => d.y);
      labels.attr('x', d => d.x).attr('y', d => d.y);
    });
    function dragstarted(event, d) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
    function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
    function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }
    return () => simulation.stop();
  }, [graphModalOpen, graphLoading, graphData]);
  
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

  // Visible papers use search results when present
  const visiblePapers = searchResults ? searchResults : filteredPapers;

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
    if (!query || !query.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    searchAPI.getSimilar(query.trim())
      .then((res) => {
        const list = res?.data || [];
        const ids = list.map(row => Array.isArray(row) ? row[0] : row?.paper_id).filter(id => id !== undefined && id !== null);
        if (ids.length === 0) {
          setSearchResults([]);
          return;
        }
        const first = ids.slice(0, 20);
        return Promise.all(first.map((id) => searchAPI.getPaperCard(id).then(r => r.data))).then((cards) => {
          setSearchResults(cards);
        });
      })
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
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
    <>
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
              ) : searchResults !== null ? (
                isSearching ? (
                  <div className="flex justify-center py-12"><LoadingSpinner /></div>
                ) : (
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
                          onOpenKnowledgeGraph={openKnowledgeGraphModal}
                        />
                      ))}
                    </div>
                    {visiblePapers.length === 0 && (
                      <div className="text-center py-12 text-gray-400">No results</div>
                    )}
                  </>
                )
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
                        onOpenKnowledgeGraph={openKnowledgeGraphModal}
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
    {graphModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={() => setGraphModalOpen(false)} />
        <div className="relative bg-space-900 border border-gray-700 rounded-2xl w-11/12 max-w-5xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Knowledge Graph</h3>
            <button onClick={() => setGraphModalOpen(false)} className="px-3 py-1 bg-gray-700/60 hover:bg-gray-600/60 rounded-lg text-gray-200">Close</button>
          </div>
          {graphLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> <span>Paper Title</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> <span>Publication</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> <span>Research Area</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> <span>Keywords</span></div>
                </div>
              </div>
              <svg ref={svgRef} width="100%" height="500" className="border border-gray-700 rounded-lg" />
              <div className="mt-3 text-xs text-gray-400">Click the title node to open the paper link.</div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default ResearchPapers;
