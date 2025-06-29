/**
 * Assigns a fit score using simplified fixed logic.
 */
export function scoreCandidate(candidate: any): any {
    const scoreBreakdown = {
      education: 7.0,     // Mocked values
      trajectory: 8.0,
      company: 7.5,
      skills: 9.0,
      location: 6.0,
      tenure: 7.0,
    };
  
    const totalScore = parseFloat((
      scoreBreakdown.education * 0.2 +
      scoreBreakdown.trajectory * 0.2 +
      scoreBreakdown.company * 0.15 +
      scoreBreakdown.skills * 0.25 +
      scoreBreakdown.location * 0.1 +
      scoreBreakdown.tenure * 0.1
    ).toFixed(1));
  
    return {
      ...candidate,
      fit_score: totalScore,
      score_breakdown: scoreBreakdown,
    };
  }
  