'use client';

import { useState } from 'react';
import { Search, Users, MessageSquare, TrendingUp, Loader2, ExternalLink, Star } from 'lucide-react';

interface Candidate {
  name: string;
  headline: string;
  linkedin_url: string;
  fit_score: number;
  score_breakdown: {
    education: number;
    trajectory: number;
    company: number;
    skills: number;
    location: number;
    tenure: number;
  };
  outreach_message: string;
  confidence: number;
}

interface ApiResponse {
  job_id: string;
  candidates_found: number;
  top_candidates: Candidate[];
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 LinkedIn Sourcing Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find top candidates on LinkedIn using AI-powered search, scoring, and personalized outreach generation.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter a detailed job description (e.g., 'Software Engineer with 5+ years experience in React, Node.js, and AWS for a fintech startup in San Francisco')"
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !jobDescription.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Searching Candidates...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Find Candidates
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">❌ {error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="max-w-6xl mx-auto">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-900">{results.candidates_found}</h3>
                <p className="text-gray-600">Candidates Found</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-900">{results.top_candidates.length}</h3>
                <p className="text-gray-600">Top Candidates</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {(results.top_candidates.reduce((acc, c) => acc + c.confidence, 0) / results.top_candidates.length || 0).toFixed(1)}
                </h3>
                <p className="text-gray-600">Avg Confidence</p>
              </div>
            </div>

            {/* Candidates List */}
            <div className="space-y-6">
              {results.top_candidates.map((candidate, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {candidate.name}
                          </h3>
                          <p className="text-gray-600 mb-2">{candidate.headline}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.fit_score)}`}>
                            {candidate.fit_score}/10
                          </span>
                          <Star className="w-5 h-5 text-yellow-500" />
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {Object.entries(candidate.score_breakdown).map(([key, score]) => (
                          <div key={key} className="text-sm">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <span className={`ml-2 font-medium ${getScoreColor(score)}`}>
                              {score}/10
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-3 mb-4">
                        <a
                          href={candidate.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink size={16} />
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>

                    {/* Outreach Message */}
                    <div className="lg:w-96">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MessageSquare size={16} />
                        Outreach Message
                        <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${getScoreColor(candidate.confidence)}`}>
                          {candidate.confidence}/10 confidence
                        </span>
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                        {candidate.outreach_message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p>Built with ❤️ for the Synapse AI Internship Challenge</p>
        </footer>
      </div>
    </div>
  );
}