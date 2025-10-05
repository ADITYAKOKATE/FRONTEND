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

const KnowledgeGraph = () => {
  const { t } = useLanguage();
  const svgRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [graphSettings, setGraphSettings] = useState({
    showLabels: true,
    showConnections: true,
    nodeSize: 'medium',
    connectionStrength: 'medium'
  });

  // Fetch knowledge graph data
  const { data: graphData, isLoading: graphLoading } = useQuery(
    'knowledge-graph',
    insightsAPI.getKnowledgeGraph,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
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

  // Generate graph data if not available from API
  const processedGraphData = React.useMemo(() => {
    if (graphData) return graphData;

    if (!papersData?.papers) return { nodes: [], links: [] };

    // Create nodes from papers
    const nodes = [];
    const nodeMap = new Map();

    papersData.papers.forEach((paper, index) => {
      // Paper node
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

      // Author nodes
      paper.authors?.forEach(author => {
        const authorId = `author-${author.name}`;
        if (!nodeMap.has(authorId)) {
          const authorNode = {
            id: authorId,
            type: 'author',
            label: author.name,
            affiliation: author.affiliation,
            size: 8,
            color: '#10B981'
          };
          nodes.push(authorNode);
          nodeMap.set(authorId, authorNode);
        }
      });

      // Research area nodes
      if (paper.researchArea) {
        const areaId = `area-${paper.researchArea}`;
        if (!nodeMap.has(areaId)) {
          const areaNode = {
            id: areaId,
            type: 'researchArea',
            label: paper.researchArea,
            size: 12,
            color: '#8B5CF6'
          };
          nodes.push(areaNode);
          nodeMap.set(areaId, areaNode);
        }
      }

      // Organism nodes
      if (paper.organism) {
        const organismId = `organism-${paper.organism}`;
        if (!nodeMap.has(organismId)) {
          const organismNode = {
            id: organismId,
            type: 'organism',
            label: paper.organism,
            size: 10,
            color: '#F59E0B'
          };
          nodes.push(organismNode);
          nodeMap.set(organismId, organismNode);
        }
      }
    });

    // Create links
    const links = [];
    papersData.papers.forEach(paper => {
      const paperId = `paper-${paper._id}`;
      
      // Link paper to authors
      paper.authors?.forEach(author => {
        links.push({
          source: paperId,
          target: `author-${author.name}`,
          type: 'authored',
          strength: 1
        });
      });

      // Link paper to research area
      if (paper.researchArea) {
        links.push({
          source: paperId,
          target: `area-${paper.researchArea}`,
          type: 'belongsTo',
          strength: 1
        });
      }

      // Link paper to organism
      if (paper.organism) {
        links.push({
          source: paperId,
          target: `organism-${paper.organism}`,
          type: 'studies',
          strength: 1
        });
      }
    });

    return { nodes, links };
  }, [graphData, papersData]);

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
        setSelectedNode(d);
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

              {graphLoading ? (
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
                  
                  {/* Legend */}
                  <div className="absolute top-4 right-4 bg-space-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-semibold text-white mb-2">Node Types</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">Research Papers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">Authors</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-300">Research Areas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Organisms</span>
                      </div>
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
