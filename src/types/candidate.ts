export interface Candidate {
  name?: string;
  headline?: string;
  linkedin_url?: string;
  fit_score?: number;
  score_breakdown?: Record<string, number>;
  // Add other fields as needed
} 