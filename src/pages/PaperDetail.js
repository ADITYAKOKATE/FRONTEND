import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  MapPin,
  Star,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';
import { useQuery } from 'react-query';
import { papersAPI } from '../services/api';
import { formatDate, formatAuthors, getImpactColor, getImpactLabel } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PaperDetail = () => {
  const navigate = useNavigate();
  const paperId = window.location.pathname.split('/')[2];

  const { data: paper, isLoading, error } = useQuery(
    ['paper', paperId],
    () => papersAPI.getPaper(paperId),
    {
      enabled: !!paperId,
    }
  );

  const handleExport = () => {
    toast.success('Export functionality coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: paper?.title,
        text: paper?.abstract,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading paper details..." />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Paper Not Found</h2>
          <p className="text-gray-400 mb-6">The requested paper could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-space-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-space-800 hover:bg-space-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold gradient-text">Paper Details</h1>
                <p className="text-sm text-gray-400">NASA StellarBioNexus</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="btn-ghost px-3 py-2"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
              
              <button
                onClick={handleExport}
                className="btn-primary px-3 py-2"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Paper Header */}
            <div className="card">
              <div className="space-y-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-white leading-tight">
                  {paper.title}
                </h1>

                {/* Authors */}
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    {formatAuthors(paper.authors)}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(paper.publicationDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{paper.spaceEnvironment}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span className={getImpactColor(paper.impactScore)}>
                      {getImpactLabel(paper.impactScore)} ({paper.impactScore?.toFixed(1) || 'N/A'})
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                    {paper.organism}
                  </span>
                  <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">
                    {paper.researchArea}
                  </span>
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
                    {paper.spaceEnvironment}
                  </span>
                  {paper.mission?.name && (
                    <span className="px-3 py-1 bg-orange-600/20 text-orange-400 text-sm rounded-full">
                      {paper.mission.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Abstract */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Abstract</h2>
              <p className="text-gray-300 leading-relaxed">
                {paper.abstract}
              </p>
            </div>

            {/* AI Summary */}
            {paper.summary && (
              <div className="card bg-blue-600/10 border-blue-600/30">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span>AI Summary</span>
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {paper.summary}
                </p>
              </div>
            )}

            {/* Key Findings */}
            {paper.keyFindings && paper.keyFindings.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Key Findings</h2>
                <ul className="space-y-3">
                  {paper.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Results */}
            {paper.results && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
                <p className="text-gray-300 leading-relaxed">
                  {paper.results}
                </p>
              </div>
            )}

            {/* Conclusions */}
            {paper.conclusions && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Conclusions</h2>
                <p className="text-gray-300 leading-relaxed">
                  {paper.conclusions}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {paper.recommendations && paper.recommendations.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Recommendations</h2>
                <ul className="space-y-3">
                  {paper.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Methodology */}
            {paper.methodology && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Methodology</h2>
                <p className="text-gray-300 leading-relaxed">
                  {paper.methodology}
                </p>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Publication Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Publication Information</h3>
                <div className="space-y-3">
                  {paper.journal && (
                    <div>
                      <span className="text-gray-400">Journal:</span>
                      <span className="text-white ml-2">{paper.journal}</span>
                    </div>
                  )}
                  
                  {paper.doi && (
                    <div>
                      <span className="text-gray-400">DOI:</span>
                      <span className="text-white ml-2">{paper.doi}</span>
                    </div>
                  )}
                  
                  {paper.url && (
                    <div>
                      <span className="text-gray-400">URL:</span>
                      <a 
                        href={paper.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 ml-2 flex items-center space-x-1"
                      >
                        <span>View Paper</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-400">Citations:</span>
                    <span className="text-white ml-2">{paper.citationCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Mission Details */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Mission Details</h3>
                <div className="space-y-3">
                  {paper.mission?.name && (
                    <div>
                      <span className="text-gray-400">Mission:</span>
                      <span className="text-white ml-2">{paper.mission.name}</span>
                    </div>
                  )}
                  
                  {paper.mission?.year && (
                    <div>
                      <span className="text-gray-400">Year:</span>
                      <span className="text-white ml-2">{paper.mission.year}</span>
                    </div>
                  )}
                  
                  {paper.mission?.duration && (
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{paper.mission.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Papers */}
            {paper.relatedPapers && paper.relatedPapers.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Related Papers</h3>
                <div className="space-y-3">
                  {paper.relatedPapers.map((relatedPaper, index) => (
                    <div key={index} className="bg-space-800 rounded-lg p-4 border border-gray-700">
                      <h4 className="text-white font-medium mb-2">{relatedPaper.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{relatedPaper.organism}</span>
                        <span>•</span>
                        <span>{formatDate(relatedPaper.publicationDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PaperDetail;
