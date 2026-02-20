import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, createAnthropicClient, PRONUNCIATION_SYSTEM_PROMPT } from '@/lib/anthropic';
import { parseScoringResponse } from '@/lib/scoring';
import type { ScoringRequest } from '@/types';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { targetPhrase, userTranscription, language, level, apiKey } = body as ScoringRequest & { apiKey?: string };

    if (!targetPhrase || !userTranscription || !language || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (targetPhrase.length > 500 || userTranscription.length > 500) {
      return NextResponse.json(
        { error: 'Input too long' },
        { status: 400 }
      );
    }

    const client = apiKey ? createAnthropicClient(apiKey) : getAnthropicClient();

    const langName = { en: 'English', es: 'Spanish', pt: 'Portuguese (Brazilian)' }[language] || language;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: PRONUNCIATION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Language: ${langName}
Level: ${level}
Target phrase: "${targetPhrase}"
User's transcription: "${userTranscription}"

IMPORTANT: Write ALL feedback text (overallFeedback, encouragement, focusArea, issue, tip) in ${langName}. The JSON keys must stay in English, but all human-readable values must be in ${langName}.

Please analyze the pronunciation attempt and provide detailed feedback.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const result = parseScoringResponse(responseText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze pronunciation. Please try again.' },
      { status: 500 }
    );
  }
}
