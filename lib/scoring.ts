import type { ScoringResult } from '@/types';

export function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e';
  if (score >= 70) return '#84cc16';
  if (score >= 50) return '#eab308';
  if (score >= 30) return '#f97316';
  return '#ef4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent!';
  if (score >= 70) return 'Great job!';
  if (score >= 50) return 'Good effort!';
  if (score >= 30) return 'Keep practicing!';
  return 'Try again!';
}

export function parseScoringResponse(text: string): ScoringResult {
  // Strip markdown code fences
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as ScoringResult;
  } catch {
    // Continue with repair attempts
  }

  // Try to extract a JSON object from the text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // Fix trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  // Fix single quotes → double quotes (only around property names/values)
  cleaned = cleaned.replace(/'/g, '"');

  try {
    return JSON.parse(cleaned) as ScoringResult;
  } catch {
    // Last resort: try to build a minimal valid result
    const scoreMatch = text.match(/"score"\s*:\s*(\d+)/);
    const feedbackMatch = text.match(/"overallFeedback"\s*:\s*"([^"]*?)"/);
    const encouragementMatch = text.match(/"encouragement"\s*:\s*"([^"]*?)"/);
    const focusMatch = text.match(/"focusArea"\s*:\s*"([^"]*?)"/);

    if (scoreMatch) {
      return {
        score: parseInt(scoreMatch[1], 10),
        overallFeedback: feedbackMatch?.[1] || 'Analysis complete.',
        wordAnalysis: [],
        encouragement: encouragementMatch?.[1] || '',
        focusArea: focusMatch?.[1] || '',
      };
    }

    throw new Error('Could not parse scoring response');
  }
}
