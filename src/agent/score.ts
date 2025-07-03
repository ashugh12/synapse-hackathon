import { Candidate } from '../types/candidate';

/**
 * Assigns a fit score using dynamic analysis of candidate profile data.
 */
export function scoreCandidate(candidate: Candidate): Candidate {
  const headline = (candidate.headline || "").toLowerCase();

  // Analyze headline for relevant keywords and experience
  const headlineScore = analyzeHeadline(headline);
  
  // Analyze company/role patterns
  const companyScore = analyzeCompany(headline);
  
  // Analyze skills mentioned
  const skillsScore = analyzeSkills(headline);
  
  // Analyze location (if mentioned)
  const locationScore = analyzeLocation(headline);
  
  // Analyze tenure/experience level
  const tenureScore = analyzeTenure(headline);

  const scoreBreakdown = {
    education: Math.min(10, Math.max(5, headlineScore.education)),
    trajectory: Math.min(10, Math.max(5, headlineScore.trajectory)),
    company: Math.min(10, Math.max(5, companyScore)),
    skills: Math.min(10, Math.max(5, skillsScore)),
    location: Math.min(10, Math.max(5, locationScore)),
    tenure: Math.min(10, Math.max(5, tenureScore)),
  };

  const totalScore = parseFloat((
    scoreBreakdown.education * 0.15 +
    scoreBreakdown.trajectory * 0.2 +
    scoreBreakdown.company * 0.15 +
    scoreBreakdown.skills * 0.25 +
    scoreBreakdown.location * 0.1 +
    scoreBreakdown.tenure * 0.15
  ).toFixed(1));

  return {
    ...candidate,
    fit_score: totalScore,
    score_breakdown: scoreBreakdown,
  };
}

function analyzeHeadline(headline: string): { education: number; trajectory: number } {
  let education = 6.0;
  let trajectory = 6.0;

  // Education indicators
  if (headline.includes("phd") || headline.includes("doctorate")) {
    education = 9.5;
  } else if (headline.includes("master") || headline.includes("ms") || headline.includes("mba")) {
    education = 8.5;
  } else if (headline.includes("bachelor") || headline.includes("bs") || headline.includes("ba")) {
    education = 7.5;
  }

  // Career trajectory indicators
  if (headline.includes("cto") || headline.includes("vp") || headline.includes("director")) {
    trajectory = 9.5;
  } else if (headline.includes("senior") || headline.includes("lead") || headline.includes("principal")) {
    trajectory = 8.5;
  } else if (headline.includes("manager") || headline.includes("team lead")) {
    trajectory = 7.5;
  } else if (headline.includes("junior") || headline.includes("entry")) {
    trajectory = 5.5;
  }

  return { education, trajectory };
}

function analyzeCompany(headline: string): number {
  let score = 6.0;

  // Top tier companies
  if (headline.includes("google") || headline.includes("microsoft") || headline.includes("apple") || 
      headline.includes("amazon") || headline.includes("meta") || headline.includes("netflix")) {
    score = 9.0;
  } else if (headline.includes("startup") || headline.includes("founder") || headline.includes("co-founder")) {
    score = 8.5;
  } else if (headline.includes("consultant") || headline.includes("freelance")) {
    score = 7.0;
  }

  return score;
}

function analyzeSkills(headline: string): number {
  let score = 6.0;
  const techKeywords = [
    "react", "angular", "vue", "node", "python", "java", "javascript", "typescript",
    "aws", "azure", "gcp", "docker", "kubernetes", "machine learning", "ai", "data science",
    "sql", "mongodb", "redis", "graphql", "rest", "microservices", "devops", "ci/cd"
  ];

  const foundSkills = techKeywords.filter(skill => headline.includes(skill));
  score = Math.min(10, 6 + (foundSkills.length * 0.8));

  return score;
}

function analyzeLocation(headline: string): number {
  let score = 6.0;

  // Major tech hubs
  if (headline.includes("san francisco") || headline.includes("silicon valley") || 
      headline.includes("seattle") || headline.includes("new york") || 
      headline.includes("austin") || headline.includes("boston")) {
    score = 8.5;
  } else if (headline.includes("remote") || headline.includes("wfh")) {
    score = 7.5;
  }

  return score;
}

function analyzeTenure(headline: string): number {
  let score = 6.0;

  // Experience indicators
  if (headline.includes("10+") || headline.includes("15+") || headline.includes("20+")) {
    score = 9.0;
  } else if (headline.includes("5+") || headline.includes("7+")) {
    score = 8.0;
  } else if (headline.includes("3+") || headline.includes("4+")) {
    score = 7.0;
  } else if (headline.includes("1+") || headline.includes("2+")) {
    score = 6.0;
  }

  return score;
}
  