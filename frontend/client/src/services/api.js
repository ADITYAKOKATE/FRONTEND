import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
  // Get all papers with pagination and filtering
  getPapers: (params = {}) => api.get('/papers', { params }),
  
  // Search papers
  searchPapers: (params = {}) => api.get('/papers/search', { params }),
  
  // Get specific paper by ID
  getPaper: (id) => api.get(`/papers/${id}`),
  
  // Get statistics overview
  getStats: () => api.get('/papers/stats/overview'),
  
  // Create new paper (admin)
  createPaper: (data) => api.post('/papers', data),
  
  // Update paper
  updatePaper: (id, data) => api.put(`/papers/${id}`, data),
  
  // Delete paper
  deletePaper: (id) => api.delete(`/papers/${id}`),
};

export const searchAPI = {
  // Advanced search
  search: (data) => api.post('/search', data),
  
  // Get search suggestions
  getSuggestions: (query) => api.get('/search/suggestions', { params: { q: query } }),
  
  // Get filter options
  getFilters: () => api.get('/search/filters'),
};

export const insightsAPI = {
  // Get knowledge graph data
  getKnowledgeGraph: () => api.get('/insights/knowledge-graph'),
  
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
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} and ${authors[1].name}`;
  return `${authors[0].name} et al.`;
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
