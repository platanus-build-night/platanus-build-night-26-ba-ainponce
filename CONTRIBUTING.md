# Contributing to PronounceAI

Thanks for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and add your API keys
5. Run the development server: `npm run dev`

## Guidelines

- Write TypeScript with proper types
- Follow existing code conventions
- Test your changes locally before submitting
- Keep PRs focused on a single feature or fix

## Adding New Languages

1. Add exercises to `lib/exercises.ts`
2. Add the language option to `types/index.ts`
3. Update `LanguageSelector` component
4. Add speech recognition language code in `lib/speech-recognition.ts`
5. Configure a voice ID for the new language in `lib/elevenlabs.ts`

## Adding New Exercises

Each exercise needs:
- `id`: Unique identifier (format: `{lang}-{level_initial}-{number}`)
- `phrase`: The target phrase
- `phonetic`: IPA transcription
- `difficulty`: beginner | intermediate | advanced
- `category`: Descriptive category
- `tips`: Pronunciation tips
- `language`: Language code

## License

MIT
