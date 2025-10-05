import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import * as d3 from 'd3';
import { papersAPI, insightsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

const KnowledgeGraph = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const paperFromState = location.state?.paper;
  const svgRef = useRef();
  const pendingFocusNodeIdRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedAuthors, setExpandedAuthors] = useState(new Set());
  const [expandedPublications, setExpandedPublications] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('authors'); // authors | publications | researchareas
  const [showSettings, setShowSettings] = useState(false);
  const [graphSettings, setGraphSettings] = useState({
    showLabels: true,
    showConnections: true,
    nodeSize: 'medium',
    connectionStrength: 'medium'
  });

  const toSafeId = (prefix, value) => {
    const base = String(value || '').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_\-]/g, '');
    return `${prefix}-${base || 'unknown'}`;
  };

  // Fetch knowledge graph data (global)
  const { data: graphData, isLoading: graphLoading } = useQuery(
    ['knowledge-graph', activeCategory],
    () => {
      if (activeCategory === 'authors') {
        return insightsAPI.getAuthorsKnowledgeGraph();
      }
      if (activeCategory === 'publications') {
        return insightsAPI.getPublicationsKnowledgeGraph();
      }
      if (activeCategory === 'researchareas') {
        return insightsAPI.getResearchAreasKnowledge();
      }
      // default/global graph
      return insightsAPI.getKnowledgeGraph();
    },
    {
      enabled: !paperFromState,
      staleTime: 10 * 60 * 1000,
    }
  );

  // Fetch per-paper knowledge graph when a paper is provided
  const { data: paperGraphData, isLoading: paperGraphLoading } = useQuery(
    ['paper-knowledge-graph', paperFromState?.paper_id],
    () => insightsAPI.getPaperKnowledgeGraph(paperFromState.paper_id),
    {
      enabled: Boolean(paperFromState?.paper_id),
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch papers for additional context
  const { data: papersData } = useQuery(
    'papers-for-graph',
    () => papersAPI.getPapers({ limit: 100 }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Generate graph data either for a specific paper or global
  const processedGraphData = React.useMemo(() => {
    // Per-paper mode
    if (paperFromState) {
      const dto = paperGraphData?.data; // axios response
      if (!dto) return { nodes: [], links: [] };

      const centerId = `paper-${paperFromState.paper_id}`;
      const nodes = [
        {
          id: centerId,
          type: 'paper',
          label: dto.title || paperFromState.title,
          size: 18,
          color: '#3B82F6',
          url: dto.url || paperFromState.url,
        }
      ];
      const links = [];

      // Publication node
      if (dto.publication) {
        nodes.push({ id: `pub-${dto.publication}`, type: 'publication', label: dto.publication, size: 12, color: '#10B981' });
        links.push({ source: centerId, target: `pub-${dto.publication}`, type: 'published_in', strength: 1 });
      }

      // Research area node
      if (dto.researchArea) {
        nodes.push({ id: `area-${dto.researchArea}`, type: 'researchArea', label: dto.researchArea, size: 12, color: '#F59E0B' });
        links.push({ source: centerId, target: `area-${dto.researchArea}`, type: 'research_area', strength: 1 });
      }

      // Keyword nodes
      (dto.keywords || []).forEach((kw) => {
        const kid = `kw-${kw}`;
        nodes.push({ id: kid, type: 'keyword', label: kw, size: 10, color: '#8B5CF6' });
        links.push({ source: centerId, target: kid, type: 'has_keyword', strength: 1 });
      });

      return { nodes, links };
    }

    // Authors mode graph (authors with their papers)
    if (activeCategory === 'authors') {
      const list = graphData?.data || [];
      if (!Array.isArray(list)) return { nodes: [], links: [] };

      const centerId = 'authors-center';
      const nodes = [
        { id: centerId, type: 'authorsCenter', label: 'Authors', size: 20, color: '#22c55e' }
      ];
      const links = [];

      list.forEach((entry, idx) => {
        const authorName = entry.author || entry.name || `Author ${idx + 1}`;
        const authorId = `author-${authorName}`;
        nodes.push({ id: authorId, type: 'author', label: authorName, size: 14, color: '#0ea5e9' });
        links.push({ source: centerId, target: authorId, type: 'author', strength: 1 });

        // Only add papers if this author is expanded
        if (expandedAuthors.has(authorId)) {
          (entry.papers || []).forEach((p, i) => {
            const pid = p.paper_id || p.id || `${idx}-${i}`;
            const paperId = `paper-${pid}`;
            nodes.push({ id: paperId, type: 'paper', label: p.title, size: 10, color: '#8b5cf6', url: p.url });
            links.push({ source: authorId, target: paperId, type: 'wrote', strength: 1 });
          });
        }
      });

      return { nodes, links };
    }

    // Publications mode graph (publication center -> publication -> papers)
    if (activeCategory === 'publications') {
      const list = graphData?.data || [];
      if (!Array.isArray(list)) return { nodes: [], links: [] };

      const centerId = 'publications-center';
      const nodes = [
        { id: centerId, type: 'publicationsCenter', label: 'Publications', size: 20, color: '#10b981' }
      ];
      const links = [];

      list.forEach((entry, idx) => {
        const pubName = entry.publication || `Publication ${idx + 1}`;
        const pubId = toSafeId('pub', pubName);
        nodes.push({ id: pubId, type: 'publication', label: pubName, size: 14, color: '#22d3ee' });
        links.push({ source: centerId, target: pubId, type: 'publication', strength: 1 });

        if (expandedPublications.has(pubId)) {
          (entry.papers || []).forEach((p, i) => {
            const pid = p.paper_id || p.id || `${idx}-${i}`;
            const paperId = toSafeId('paper', pid);
            nodes.push({ id: paperId, type: 'paper', label: p.title, size: 10, color: '#8b5cf6', url: p.url });
            links.push({ source: pubId, target: paperId, type: 'published', strength: 1 });
          });
        }
      });

      return { nodes, links };
    }

    // Research areas mode graph (research area center -> area -> count; size scales by count)
    if (activeCategory === 'researchareas') {
      const list = graphData?.data || [];
      if (!Array.isArray(list)) return { nodes: [], links: [] };

      const centerId = 'researchareas-center';
      const nodes = [
        { id: centerId, type: 'researchAreasCenter', label: 'Research Areas', size: 20, color: '#f59e0b' }
      ];
      const links = [];

      // Endpoint returns List<Object[]> with [researchArea, count]
      const parsed = list.map((tuple, idx) => {
        if (Array.isArray(tuple)) {
          return { name: String(tuple[0]), count: Number(tuple[1]) || 0 };
        }
        return { name: tuple.researchArea || `Area ${idx + 1}`, count: Number(tuple.count) || 0 };
      });

      const counts = parsed.map(p => Math.max(0, p.count || 0));
      const extent = counts.length ? [Math.min(...counts), Math.max(...counts)] : [0, 1];
      const sizeScale = extent[0] === extent[1]
        ? () => 14
        : d3.scaleSqrt().domain(extent).range([10, 40]);
      const sizeFor = (c) => sizeScale(Math.max(0, c || 0));

      parsed.forEach((p) => {
        const areaId = `area-${p.name}`;
        nodes.push({ id: areaId, type: 'researchArea', label: p.name, size: sizeFor(p.count), color: '#fde047' });
        links.push({ source: centerId, target: areaId, type: 'area', strength: 1 });
      });

      return { nodes, links };
    }

    // Global fallback graph
    if (graphData?.data) return graphData.data;
    if (!papersData?.papers) return { nodes: [], links: [] };

    const nodes = [];
    const nodeMap = new Map();

    papersData.papers.forEach((paper) => {
      const paperNode = {
        id: `paper-${paper._id}`,
        type: 'paper',
        label: paper.title.substring(0, 50) + '...',
        fullTitle: paper.title,
        paper: paper,
        size: Math.max(5, Math.min(20, (paper.citationCount || 0) / 5)),
        color: '#3B82F6'
      };
      nodes.push(paperNode);
      nodeMap.set(paperNode.id, paperNode);

      if (paper.researchArea) {
        const areaId = `area-${paper.researchArea}`;
        if (!nodeMap.has(areaId)) {
          const areaNode = { id: areaId, type: 'researchArea', label: paper.researchArea, size: 12, color: '#8B5CF6' };
          nodes.push(areaNode);
          nodeMap.set(areaId, areaNode);
        }
      }

      if (paper.organism) {
        const organismId = `organism-${paper.organism}`;
        if (!nodeMap.has(organismId)) {
          const organismNode = { id: organismId, type: 'organism', label: paper.organism, size: 10, color: '#F59E0B' };
          nodes.push(organismNode);
          nodeMap.set(organismId, organismNode);
        }
      }
    });

    const links = [];
    papersData.papers.forEach((paper) => {
      const paperId = `paper-${paper._id}`;
      if (paper.researchArea) links.push({ source: paperId, target: `area-${paper.researchArea}`, type: 'belongsTo', strength: 1 });
      if (paper.organism) links.push({ source: paperId, target: `organism-${paper.organism}`, type: 'studies', strength: 1 });
    });

    return { nodes, links };
  }, [paperFromState, paperGraphData, graphData, papersData, activeCategory, expandedAuthors, expandedPublications]);

  // Reset expanded authors when switching away from authors category
  useEffect(() => {
    if (activeCategory !== 'authors' && expandedAuthors.size > 0) {
      setExpandedAuthors(new Set());
    }
  }, [activeCategory]);

  // Reset expanded publications when switching away from publications category
  useEffect(() => {
    if (activeCategory !== 'publications' && expandedPublications.size > 0) {
      setExpandedPublications(new Set());
    }
  }, [activeCategory]);

  // Initialize D3 force simulation
  useEffect(() => {
    if (!processedGraphData.nodes.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group
    const g = svg.append('g');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(processedGraphData.nodes)
      .force('link', d3.forceLink(processedGraphData.links)
        .id(d => d.id)
        .distance(100)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.size + 5));

    // Helper: focus and highlight a node and its immediate neighbors
    function focusAndHighlight(targetNode) {
      const connectedNodeIds = new Set([targetNode.id]);
      const connectedLinks = new Set();
      (processedGraphData.links || []).forEach(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        if (s === targetNode.id) {
          connectedNodeIds.add(t);
          connectedLinks.add(l);
        } else if (t === targetNode.id) {
          connectedNodeIds.add(s);
          connectedLinks.add(l);
        }
      });

      // Dim non-neighbors
      node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.15);
      labels.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.15);
      link.style('opacity', l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return (s === targetNode.id || t === targetNode.id) ? 1 : 0.15;
      });

      // Smooth zoom and center on node
      const k = 2; // zoom factor
      const tx = width / 2 - targetNode.x * k;
      const ty = height / 2 - targetNode.y * k;
      svg.transition().duration(500).call(
        zoom.transform,
        d3.zoomIdentity.translate(tx, ty).scale(k)
      );
    }

    // Helper: reset highlight and zoom
    function resetFocus() {
      node.style('opacity', 1);
      labels.style('opacity', 1);
      link.style('opacity', 0.6);
      svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
    }

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(processedGraphData.links)
      .enter().append('line')
      .attr('stroke', '#4B5563')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength) * 2);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(processedGraphData.nodes)
      .enter().append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
      .on('click', (event, d) => {
         event.stopPropagation();
        setSelectedNode(d);
         if (d.type === 'paper' && d.url) {
           window.open(d.url, '_blank');
           return;
         }
         if (activeCategory === 'authors' && d.type === 'author') {
           setExpandedAuthors(prev => {
             const next = new Set(Array.from(prev));
             if (next.has(d.id)) {
               next.delete(d.id);
             } else {
               next.add(d.id);
             }
             return next;
           });
            pendingFocusNodeIdRef.current = d.id;
            return;
          }
          if (activeCategory === 'publications' && d.type === 'publication') {
          setExpandedPublications(prev => {
            const next = new Set(Array.from(prev));
            if (next.has(d.id)) {
              next.delete(d.id);
            } else {
              next.add(d.id);
            }
            return next;
          });
            pendingFocusNodeIdRef.current = d.id;
          } else {
            // Generic focus for other node types
            focusAndHighlight(d);
          }
       });

    // Clicking on empty space resets focus
    svg.on('click', (event) => {
      if (event.target === svg.node()) {
        resetFocus();
      }
      });

    // Add labels
    const labels = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(processedGraphData.nodes)
      .enter().append('text')
      .text(d => graphSettings.showLabels ? d.label : '')
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size + 15)
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // After initial render, apply any pending focus (post re-render)
    if (pendingFocusNodeIdRef.current) {
      const target = (processedGraphData.nodes || []).find(n => n.id === pendingFocusNodeIdRef.current);
      if (target) {
        // Delay slightly to allow layout settle
        setTimeout(() => focusAndHighlight(target), 50);
      }
      pendingFocusNodeIdRef.current = null;
    }

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [processedGraphData, graphSettings]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom().transform,
      d3.zoomTransform(svg.node()).scale(zoomLevel * 1.5)
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom().transform,
      d3.zoomTransform(svg.node()).scale(zoomLevel / 1.5)
    );
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom().transform,
      d3.zoomIdentity
    );
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
                {t('knowledgeGraph')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Interactive visualization of research relationships, connections between papers, authors, and research areas
              </p>

              {/* Category Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setActiveCategory('authors')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    activeCategory === 'authors'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-space-800/50 text-gray-300 border-gray-700 hover:bg-space-700/50'
                  }`}
                >
                  Authors
                </button>
                <button
                  onClick={() => setActiveCategory('publications')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    activeCategory === 'publications'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-space-800/50 text-gray-300 border-gray-700 hover:bg-space-700/50'
                  }`}
                >
                  Publications
                </button>
                <button
                  onClick={() => setActiveCategory('researchareas')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    activeCategory === 'researchareas'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-space-800/50 text-gray-300 border-gray-700 hover:bg-space-700/50'
                  }`}
                >
                  Research Areas
                </button>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-space-800/50 hover:bg-space-700/50 text-gray-300 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-space-800/50 hover:bg-space-700/50 text-gray-300 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 bg-space-800/50 hover:bg-space-700/50 text-gray-300 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">
                  Zoom: {(zoomLevel * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-4 py-2 bg-space-800/50 hover:bg-space-700/50 text-gray-300 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </motion.div>

            {/* Settings Panel */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Graph Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Show Labels</label>
                    <button
                      onClick={() => setGraphSettings(prev => ({ ...prev, showLabels: !prev.showLabels }))}
                      className={`w-full px-3 py-2 rounded-lg transition-colors ${
                        graphSettings.showLabels ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      {graphSettings.showLabels ? <Eye className="w-4 h-4 mx-auto" /> : <EyeOff className="w-4 h-4 mx-auto" />}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Node Size</label>
                    <select
                      value={graphSettings.nodeSize}
                      onChange={(e) => setGraphSettings(prev => ({ ...prev, nodeSize: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Connection Strength</label>
                    <select
                      value={graphSettings.connectionStrength}
                      onChange={(e) => setGraphSettings(prev => ({ ...prev, connectionStrength: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="weak">Weak</option>
                      <option value="medium">Medium</option>
                      <option value="strong">Strong</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Show Connections</label>
                    <button
                      onClick={() => setGraphSettings(prev => ({ ...prev, showConnections: !prev.showConnections }))}
                      className={`w-full px-3 py-2 rounded-lg transition-colors ${
                        graphSettings.showConnections ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      {graphSettings.showConnections ? <Eye className="w-4 h-4 mx-auto" /> : <EyeOff className="w-4 h-4 mx-auto" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Graph Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Network className="w-5 h-5 mr-2 text-blue-400" />
                  Research Network
                </h2>
                <div className="text-sm text-gray-400">
                  {processedGraphData.nodes.length} nodes • {processedGraphData.links.length} connections
                </div>
              </div>

              {(paperFromState ? paperGraphLoading : graphLoading) ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="relative">
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="600"
                    className="border border-gray-700/50 rounded-lg"
                  />
                  
                  {/* Legend (dynamic) */}
                  <div className="absolute top-4 right-4 bg-space-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-semibold text-white mb-2">Legend</h4>
                    <div className="space-y-2 text-xs">
                      {activeCategory === 'authors' && (
                        <>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#22c55e] rounded-full"></div><span className="text-gray-300">Authors Center</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#0ea5e9] rounded-full"></div><span className="text-gray-300">Author</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#8b5cf6] rounded-full"></div><span className="text-gray-300">Paper</span></div>
                        </>
                      )}
                      {activeCategory === 'publications' && (
                        <>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#10b981] rounded-full"></div><span className="text-gray-300">Publications Center</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#22d3ee] rounded-full"></div><span className="text-gray-300">Publication</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#8b5cf6] rounded-full"></div><span className="text-gray-300">Paper</span></div>
                        </>
                      )}
                      {activeCategory === 'researchareas' && (
                        <>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#f59e0b] rounded-full"></div><span className="text-gray-300">Research Areas Center</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-[#fde047] rounded-full"></div><span className="text-gray-300">Research Area</span></div>
                        </>
                      )}
                      {!['authors','publications','researchareas'].includes(activeCategory) && (
                        <>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-gray-300">Paper Title</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-gray-300">Publication</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span className="text-gray-300">Research Area</span></div>
                          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-gray-300">Keywords</span></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Selected Node Details */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-space-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Node Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Type</h4>
                    <p className="text-white capitalize">{selectedNode.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Label</h4>
                    <p className="text-white">{selectedNode.label}</p>
                  </div>
                  {selectedNode.paper && (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Authors</h4>
                        <p className="text-white">{selectedNode.paper.authors?.map(a => a.name).join(', ')}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Research Area</h4>
                        <p className="text-white">{selectedNode.paper.researchArea}</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
