import { NextRequest, NextResponse } from 'next/server';
import { createAnthropicClient, PHRASE_GENERATION_SYSTEM_PROMPT } from '@/lib/anthropic';
import type { ConversationContext, Language, Level } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, level, topic, conversationContext, apiKey } = body as {
      language: Language;
      level: Level;
      topic: string;
      conversationContext?: ConversationContext;
      apiKey?: string;
    };

    if (!language || !level || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: language, level, topic' },
        { status: 400 }
      );
    }

    const client = createAnthropicClient(apiKey);

    const langNames: Record<Language, string> = {
      en: 'English',
      es: 'Spanish',
      pt: 'Portuguese (Brazilian)',
    };

    const langName = langNames[language] || language;

    let userPrompt = `Generate a pronunciation practice phrase.
Language: ${langName}
Level: ${level}
Topic: ${topic}

IMPORTANT: The phrase must be in ${langName}. The "tips" and "context" fields must also be written in ${langName}.`;

    if (conversationContext) {
      if (conversationContext.previousPhrases.length > 0) {
        const recent = conversationContext.previousPhrases.slice(-5);
        userPrompt += `\n\nPrevious phrases (avoid repeating):\n${recent.map((p) => `- "${p}"`).join('\n')}`;
      }
      if (conversationContext.weakAreas.length > 0) {
        userPrompt += `\n\nWeak areas to target: ${conversationContext.weakAreas.join(', ')}`;
      }
      if (conversationContext.lastScore !== null) {
        userPrompt += `\n\nLast score: ${conversationContext.lastScore}/100`;
        if (conversationContext.lastScore >= 90) {
          userPrompt += ' (doing great, increase difficulty slightly)';
        } else if (conversationContext.lastScore < 50) {
          userPrompt += ' (struggling, simplify a bit)';
        }
      }
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 512,
      system: PHRASE_GENERATION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const cleaned = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('API key') || message.includes('authentication')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Anthropic API key.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate phrase. Please try again.' },
      { status: 500 }
    );
  }
}
