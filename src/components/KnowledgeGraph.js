import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Loader2, Network, Zap } from 'lucide-react';

const KnowledgeGraph = ({ data, loading }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(400, width), height: Math.max(300, height - 100) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create the knowledge graph
  useEffect(() => {
    if (!data || loading) return;

    // Ensure data has the required structure
    if (!data.nodes || !Array.isArray(data.nodes) || !data.links || !Array.isArray(data.links)) {
      console.warn('KnowledgeGraph: Invalid data structure', data);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links || []).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Define node colors based on type
    const nodeColors = {
      paper: '#3b82f6',
      organism: '#10b981',
      environment: '#8b5cf6',
      researchArea: '#f59e0b'
    };

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links || [])
      .enter().append('line')
      .attr('stroke', '#374151')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight || 1) * 2);

    // Create link labels
    const linkLabels = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(data.links || [])
      .enter().append('text')
      .attr('font-size', '10px')
      .attr('fill', '#9ca3af')
      .text(d => d.type)
      .style('opacity', 0);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', d => {
        if (d.type === 'paper') return 8;
        if (d.type === 'organism') return 12 + (d.size || 0) * 2;
        if (d.type === 'environment') return 10 + (d.size || 0) * 1.5;
        return 8;
      })
      .attr('fill', d => nodeColors[d.type] || '#6b7280')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        setHoveredNode(d);
        
        // Highlight connected nodes
        const connectedNodes = new Set();
        const connectedLinks = new Set();
        
        (data.links || []).forEach(link => {
          if (link.source.id === d.id || link.target.id === d.id) {
            connectedLinks.add(link);
            connectedNodes.add(link.source.id);
            connectedNodes.add(link.target.id);
          }
        });

        // Update link opacity
        link.style('opacity', l => connectedLinks.has(l) ? 1 : 0.1);
        
        // Update node opacity
        node.style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.3);
        
        // Show link labels
        linkLabels.style('opacity', l => connectedLinks.has(l) ? 1 : 0);
      })
      .on('mouseout', () => {
        setHoveredNode(null);
        
        // Reset all elements
        link.style('opacity', 0.6);
        node.style('opacity', 1);
        linkLabels.style('opacity', 0);
      })
      .on('click', (event, d) => {
        setSelectedNode(d);
      });

    // Create node labels
    const nodeLabels = g.append('g')
      .attr('class', 'node-labels')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .attr('font-size', '12px')
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text(d => {
        if (d.type === 'paper') return d.label.substring(0, 20) + '...';
        return d.label;
      })
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

      nodeLabels
        .attr('x', d => d.x)
        .attr('y', d => d.y);

      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);
    });

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [data, loading, dimensions]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Generating knowledge graph...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Data Available</h3>
            <p className="text-gray-400">Knowledge graph data is not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Graph Container */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Knowledge Graph</h3>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Papers ({data.nodes?.filter(n => n.type === 'paper').length || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Organisms ({data.nodes?.filter(n => n.type === 'organism').length || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Environments ({data.nodes?.filter(n => n.type === 'environment').length || 0})</span>
            </div>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="w-full bg-space-800 rounded-lg border border-gray-700 overflow-hidden"
          style={{ height: '600px' }}
        >
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>💡 <strong>Tip:</strong> Hover over nodes to see connections. Click nodes for details. Use mouse wheel to zoom.</p>
        </div>
      </div>

      {/* Node Details Panel */}
      {(selectedNode || hoveredNode) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Node Details</h3>
          </div>
          
          {(() => {
            const node = selectedNode || hoveredNode;
            return (
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium">{node.label}</h4>
                  <p className="text-sm text-gray-400 capitalize">{node.type}</p>
                </div>
                
                {node.organism && (
                  <div>
                    <span className="text-sm text-gray-400">Organism:</span>
                    <span className="text-sm text-white ml-2">{node.organism}</span>
                  </div>
                )}
                
                {node.environment && (
                  <div>
                    <span className="text-sm text-gray-400">Environment:</span>
                    <span className="text-sm text-white ml-2">{node.environment}</span>
                  </div>
                )}
                
                {node.researchArea && (
                  <div>
                    <span className="text-sm text-gray-400">Research Area:</span>
                    <span className="text-sm text-white ml-2">{node.researchArea}</span>
                  </div>
                )}
                
                {node.mission && (
                  <div>
                    <span className="text-sm text-gray-400">Mission:</span>
                    <span className="text-sm text-white ml-2">{node.mission}</span>
                  </div>
                )}
                
                {node.size && (
                  <div>
                    <span className="text-sm text-gray-400">Connections:</span>
                    <span className="text-sm text-white ml-2">{node.size}</span>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
