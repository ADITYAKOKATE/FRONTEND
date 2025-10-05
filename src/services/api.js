import axios from 'axios';

const API_BASE_URL = 'https://nasaspaceapps-o017.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const papersAPI = {
  // Get research paper cards from backend
  getPapers: (offset = 0) => api.get(`/researchpapers/getcards/${offset}`),
  
  // Search papers (using the same endpoint for now)
  searchPapers: (params = {}) => api.get('/researchpapers/getcards'),
  
  // Get specific paper by ID (placeholder for future implementation)
  getPaper: (id) => api.get(`/researchpapers/${id}`),
  
  // Get statistics overview (placeholder for future implementation)
  getStats: () => api.get('/researchpapers/stats'),
  
  // Create new paper (admin) - placeholder for future implementation
  createPaper: (data) => api.post('/researchpapers', data),
  
  // Update paper - placeholder for future implementation
  updatePaper: (id, data) => api.put(`/researchpapers/${id}`, data),
  
  // Delete paper - placeholder for future implementation
  deletePaper: (id) => api.delete(`/researchpapers/${id}`),
};

export const searchAPI = {
  // Advanced search
  search: (data) => api.post('/search', data),
  
  // Get search suggestions
  getSuggestions: (query) => api.get('/search/suggestions', { params: { q: query } }),
  
  // Get filter options
  getFilters: () => api.get('/search/filters'),
  
  // Get similar papers by search term
  getSimilar: (term) => api.get(`/search/similar/${encodeURIComponent(term)}`),
  
  // Get a paper card by ID
  getPaperCard: (id) => api.get(`/search/getpaper/${id}`),
};

export const insightsAPI = {
  // Get knowledge graph data
  getKnowledgeGraph: () => api.get('/insights/knowledge-graph'),
  
  // Get specific paper knowledge graph
  getPaperKnowledgeGraph: (paperId) => api.get(`/knowledgegraph/paper/${paperId}`),
  
  // Get authors with their papers knowledge graph
  getAuthorsKnowledgeGraph: () => api.get('/knowledgegraph/authors'),
  
  // Get publications with their papers knowledge graph
  getPublicationsKnowledgeGraph: () => api.get('/knowledgegraph/publications'),
  
  // Get research areas with counts
  getResearchAreasKnowledge: () => api.get('/knowledgegraph/researcharea'),
  
  // Get research trends
  getTrends: (params = {}) => api.get('/insights/trends', { params }),
  
  // Get research gaps
  getGaps: () => api.get('/insights/gaps'),
  
  // Get AI insights
  getInsights: (params = {}) => api.get('/insights/analysis', { params }),
  
  // Generate AI summaries
  generateSummaries: (data) => api.post('/insights/summarize', data),
};

export const exportAPI = {
  // Export as PDF
  exportPDF: (data) => api.post('/export/pdf', data, {
    responseType: 'blob',
  }),
  
  // Export as CSV
  exportCSV: (data) => api.post('/export/csv', data, {
    responseType: 'blob',
  }),
  
  // Export summaries
  exportSummaries: (data) => api.post('/export/summaries', data, {
    responseType: 'blob',
  }),
};

// Dashboard endpoints
export const dashboardAPI = {
  // Get years and counts for research timeline
  getYears: () => api.get('/dashboard/years'),
  // Get top viewed papers list
  getTopViewed: () => api.get('/dashboard/topviewed'),
};

// Utility functions
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) return 'Unknown';
  if (typeof authors === 'string') return authors;
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors[0]} et al.`;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getImpactColor = (score) => {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 4) return 'text-orange-400';
  return 'text-red-400';
};

export const getImpactLabel = (score) => {
  if (score >= 8) return 'High Impact';
  if (score >= 6) return 'Medium Impact';
  if (score >= 4) return 'Low Impact';
  return 'Minimal Impact';
};

export default api;
