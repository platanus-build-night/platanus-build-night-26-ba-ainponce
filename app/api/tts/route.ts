import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/elevenlabs';
import type { Language } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language } = body as { text: string; language: Language };

    if (!text || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: text, language' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text too long' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured. Use browser TTS.' },
        { status: 501 }
      );
    }

    const audioBuffer = await generateSpeech(text, language);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech. Please try again.' },
      { status: 500 }
    );
  }
}
