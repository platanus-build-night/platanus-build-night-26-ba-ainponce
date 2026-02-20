import type { Language } from '@/types';

export function getVoiceId(language: Language): string {
  const voiceMap: Record<Language, string> = {
    en: process.env.ELEVENLABS_VOICE_ID_EN || 'EXAVITQu4vr4xnSDxMaL',
    pt: process.env.ELEVENLABS_VOICE_ID_PT || 'ErXwobaYiN019PkySvjV',
    es: process.env.ELEVENLABS_VOICE_ID_ES || 'pFZP5JQG7iQjIQuC4Bku',
  };
  return voiceMap[language];
}

export async function generateSpeech(
  text: string,
  language: Language
): Promise<ArrayBuffer> {
  const voiceId = getVoiceId(language);
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response.arrayBuffer();
}
