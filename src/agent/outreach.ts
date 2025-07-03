import { Candidate } from '../types/candidate';

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text: string;
      }[];
    };
  }[];
}

export async function generateOutreach(
  candidate: Candidate,
  jobDescription: string
): Promise<{ message: string; confidence: number }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in .env.local');
  }

  const fitScore = candidate.fit_score || 0;
  const scoreBreakdown = candidate.score_breakdown || {};

  const strengths = Object.entries(scoreBreakdown)
    .filter(([, score]) => (score as number) >= 7.5)
    .map(([category, score]) => `${category} (${score}/10)`)
    .join(', ');

  const areas = Object.entries(scoreBreakdown)
    .filter(([, score]) => (score as number) >= 6)
    .map(([category, score]) => `${category} (${score}/10)`)
    .join(', ');

  const confidence = calculateConfidence(fitScore, candidate.headline || '', strengths);

  let tone = 'professional';
  let urgency = 'standard';

  if (fitScore >= 8.5) {
    tone = 'enthusiastic';
    urgency = 'high';
  } else if (fitScore >= 7) {
    tone = 'positive';
    urgency = 'moderate';
  } else if (fitScore >= 6) {
    tone = 'professional';
    urgency = 'standard';
  } else {
    tone = 'exploratory';
    urgency = 'low';
  }

  const prompt = `
You are a technical recruiter writing personalized outreach messages.

CANDIDATE PROFILE:
- Name: ${candidate.name || 'Unknown'}
- Headline: ${candidate.headline || 'Not provided'}
- LinkedIn: ${candidate.linkedin_url || 'Unknown'}

CANDIDATE SCORING ANALYSIS:
- Overall Fit Score: ${fitScore}/10
- Key Strengths: ${strengths || 'Not specified'}
- Relevant Areas: ${areas || 'Not specified'}

JOB DESCRIPTION:
${jobDescription}

SCORING BREAKDOWN:
${Object.entries(scoreBreakdown)
  .map(([category, score]) => `- ${category}: ${score}/10`)
  .join('\n')}

TASK:
Write a personalized outreach message that:
1. Uses a ${tone} tone appropriate for a ${fitScore}/10 fit score
2. References specific strengths from their profile (${strengths})
3. Mentions relevant experience areas (${areas})
4. Is concise (2-3 sentences max)
5. Includes a clear call-to-action
6. Adapts urgency level based on fit score (${urgency} priority)

MESSAGE GUIDELINES:
- For high scores (8.5+): Be enthusiastic, mention specific fit, immediate opportunity
- For good scores (7-8.4): Be positive, highlight relevant experience, discuss potential
- For moderate scores (6-6.9): Be professional, explore interest, discuss alignment
- For lower scores (5.5-5.9): Be exploratory, discuss potential fit, ask about interest

Always be professional and friendly. Don't demotivate the candidate to apply.

Respond ONLY in this JSON format (no backticks or markdown):
{
  "message": "<Personalized outreach message>",
  "confidence": ${confidence}
}
`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const result: GeminiResponse = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('🔍 Raw Gemini response:', rawText);

    const match = rawText.match(/{[^}]+confidence[^}]+}/s);
    if (match) {
      console.log('✅ Found JSON match:', match[0]);
      const parsed = JSON.parse(match[0]);
      return {
        message: parsed.message || generateFallbackMessage(candidate, fitScore, strengths),
        confidence: parsed.confidence || confidence,
      };
    }

    console.log('❌ No JSON match found. Trying alternative parsing...');

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Found alternative JSON:', parsed);
        return {
          message: parsed.message || generateFallbackMessage(candidate, fitScore, strengths),
          confidence: parsed.confidence || confidence,
        };
      } catch (parseError) {
        console.log('❌ Failed to parse alternative JSON:', parseError);
      }
    }

    throw new Error('No valid JSON block found in Gemini response');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Gemini outreach message generation failed:', error.message);
    }
    return {
      message: generateFallbackMessage(candidate, fitScore, strengths),
      confidence: confidence,
    };
  }
}

// Confidence calculation
function calculateConfidence(fitScore: number, headline: string, strengths: string): number {
  let confidence = fitScore;
  if (headline.length > 20) confidence += 0.5;
  const strengthCount = strengths.split(',').length;
  if (strengthCount >= 3) confidence += 0.5;
  else if (strengthCount >= 1) confidence += 0.2;
  return Math.round(Math.max(5, Math.min(10, confidence)) * 10) / 10;
}

// Fallback outreach message
function generateFallbackMessage(candidate: Candidate, fitScore: number, strengths: string): string {
  const name = candidate.name || 'there';
  const headline = candidate.headline || 'your background';

  if (fitScore >= 8.5) {
    return `Hi ${name}! I was impressed by your ${headline} and believe you'd be an excellent fit for our team. Your strong ${strengths} align perfectly with what we're looking for. Would you be interested in discussing this opportunity?`;
  } else if (fitScore >= 7) {
    return `Hi ${name}! I came across your profile and was intrigued by your ${headline}. Your experience in ${strengths} seems relevant to a role we're hiring for. Would you be open to a brief conversation?`;
  } else if (fitScore >= 6) {
    return `Hi ${name}! I noticed your ${headline} and thought you might be interested in exploring a new opportunity. Your background in ${strengths} could be a good match. Would you like to learn more?`;
  } else {
    return `Hi ${name}! I came across your profile and was curious about your ${headline}. We're always looking for talented professionals to join our team. Would you be interested in discussing potential opportunities?`;
  }
}
