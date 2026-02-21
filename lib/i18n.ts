import type { Language } from '@/types';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Onboarding
    'onboarding.chooseLevel': 'Choose your level',
    'onboarding.levelDesc': "We'll adjust phrase difficulty accordingly",
    'onboarding.beginner': 'Beginner',
    'onboarding.beginnerDesc': 'Simple words and short phrases',
    'onboarding.intermediate': 'Intermediate',
    'onboarding.intermediateDesc': 'Conversational sentences',
    'onboarding.advanced': 'Advanced',
    'onboarding.advancedDesc': 'Complex phrases and idioms',
    'onboarding.chooseTopic': 'Choose a topic',
    'onboarding.topicDesc': 'AI will generate contextual phrases for you',
    'onboarding.topicPlaceholder': 'Type a topic...',
    'onboarding.apiKeyTitle': 'API Key',
    'onboarding.apiKeyDesc': 'Enter your Anthropic API key to power the AI coach',
    'onboarding.apiKeyNote': 'Your key is stored locally in your browser and never sent to our servers.',
    'onboarding.getApiKey': 'Get your API key from Anthropic Console',
    'onboarding.back': 'Back',
    'onboarding.continue': 'Continue',
    'onboarding.startPracticing': 'Start Practicing',

    // Topics
    'topic.travel': 'Travel',
    'topic.business': 'Business',
    'topic.food': 'Food',
    'topic.technology': 'Technology',
    'topic.sports': 'Sports',
    'topic.dailyLife': 'Daily Life',
    'topic.music': 'Music',
    'topic.science': 'Science',

    // Practice
    'practice.listen': 'Listen',
    'practice.speak': 'Speak',
    'practice.stop': 'Stop',
    'practice.saying': "You're saying:",
    'practice.listening': 'Listening...',
    'practice.generating': 'Generating phrase...',
    'practice.noSpeech': 'No speech detected. Please try again.',
    'practice.speechRequired': 'Speech recognition requires Chrome or Edge.',
    'practice.failedGenerate': 'Failed to generate phrase. Please try again.',
    'practice.invalidApiKey': 'Invalid API key. Please check your settings.',
    'practice.failedFeedback': 'Failed to get feedback. Please try again.',
    'practice.couldNotPlay': 'Could not play audio.',
    'practice.skipPhrase': 'New Phrase',
    'practice.listenSlow': 'Listen Slow',
    'practice.endSession': 'End Session',

    // Feedback
    'feedback.youSaid': 'You said:',
    'feedback.tryAgain': 'Try Again',
    'feedback.continue': 'Continue',

    'feedback.details': 'View Feedback',
    'feedback.playRecording': 'Play My Recording',

    // Feedback Panel
    'feedbackPanel.wordAnalysis': 'Word-by-Word Analysis',
    'feedbackPanel.focusArea': 'Focus for Next Attempt',
    'feedbackPanel.missed': '(missed)',

    // Score
    'score.excellent': 'Excellent!',
    'score.great': 'Great job!',
    'score.good': 'Good effort!',
    'score.keepPracticing': 'Keep practicing!',
    'score.tryAgain': 'Try again!',

    // Progress
    'progress.title': 'Your Progress',
    'progress.noSessions': 'No practice sessions yet',
    'progress.startPracticing': 'Start practicing to see your progress here!',
    'progress.totalAttempts': 'Total Attempts',
    'progress.averageScore': 'Average Score',
    'progress.bestScore': 'Best Score',
    'progress.dayStreak': 'Day Streak',
    'progress.scoreTrend': 'Score Trend (Last 10)',
    'progress.recentAttempts': 'Recent Attempts',
    'progress.averageByLevel': 'Average by Level',
    'progress.clearAll': 'Clear All Progress',
    'progress.clearConfirm': 'Are you sure you want to clear all progress?',
    'progress.attempts': 'attempts',
    'progress.youSaid': 'You said:',

    // Shortcuts
    'shortcuts.title': 'Keyboard Shortcuts',
    'shortcuts.spaceDesc': 'Start / Stop recording',
    'shortcuts.enterDesc': 'Continue to next phrase',
    'shortcuts.escapeDesc': 'Close modal',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.level': 'Level',
    'settings.topic': 'Topic',
    'settings.apiKey': 'Anthropic API Key',
    'settings.save': 'Save Settings',
    'settings.getApiKey': 'Get your API key',
    'settings.topicPlaceholder': 'e.g. travel, business, food...',

    // Levels
    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',

    // Word Tap
    'feedbackPanel.tapToHear': 'Tap a word to hear it',

    // Leveling
    'level.levelUp': 'Level Up!',
    'level.newTier': 'New tier:',
    'progress.levelLabel': 'Level',
    'settings.levelAutoNote': 'Auto-adjusts as you level up',
  },

  es: {
    // Onboarding
    'onboarding.chooseLevel': 'Elige tu nivel',
    'onboarding.levelDesc': 'Ajustaremos la dificultad de las frases',
    'onboarding.beginner': 'Principiante',
    'onboarding.beginnerDesc': 'Palabras simples y frases cortas',
    'onboarding.intermediate': 'Intermedio',
    'onboarding.intermediateDesc': 'Oraciones conversacionales',
    'onboarding.advanced': 'Avanzado',
    'onboarding.advancedDesc': 'Frases complejas y modismos',
    'onboarding.chooseTopic': 'Elige un tema',
    'onboarding.topicDesc': 'La IA generará frases contextuales para ti',
    'onboarding.topicPlaceholder': 'Escribe un tema...',
    'onboarding.apiKeyTitle': 'Clave API',
    'onboarding.apiKeyDesc': 'Ingresa tu clave API de Anthropic para el coach de IA',
    'onboarding.apiKeyNote': 'Tu clave se almacena localmente y nunca se envía a nuestros servidores.',
    'onboarding.getApiKey': 'Obtén tu clave API de Anthropic Console',
    'onboarding.back': 'Atrás',
    'onboarding.continue': 'Continuar',
    'onboarding.startPracticing': 'Comenzar a practicar',

    // Topics
    'topic.travel': 'Viajes',
    'topic.business': 'Negocios',
    'topic.food': 'Comida',
    'topic.technology': 'Tecnología',
    'topic.sports': 'Deportes',
    'topic.dailyLife': 'Vida diaria',
    'topic.music': 'Música',
    'topic.science': 'Ciencia',

    // Practice
    'practice.listen': 'Escuchar',
    'practice.speak': 'Hablar',
    'practice.stop': 'Detener',
    'practice.saying': 'Estás diciendo:',
    'practice.listening': 'Escuchando...',
    'practice.generating': 'Generando frase...',
    'practice.noSpeech': 'No se detectó voz. Intenta de nuevo.',
    'practice.speechRequired': 'El reconocimiento de voz requiere Chrome o Edge.',
    'practice.failedGenerate': 'Error al generar frase. Intenta de nuevo.',
    'practice.invalidApiKey': 'Clave API inválida. Revisa tu configuración.',
    'practice.failedFeedback': 'Error al obtener feedback. Intenta de nuevo.',
    'practice.couldNotPlay': 'No se pudo reproducir el audio.',
    'practice.skipPhrase': 'Nueva Frase',
    'practice.listenSlow': 'Escuchar Lento',
    'practice.endSession': 'Terminar Sesión',

    // Feedback
    'feedback.youSaid': 'Dijiste:',
    'feedback.tryAgain': 'Intentar de nuevo',
    'feedback.continue': 'Continuar',

    'feedback.details': 'Ver Feedback',
    'feedback.playRecording': 'Escuchar Mi Grabación',

    // Feedback Panel
    'feedbackPanel.wordAnalysis': 'Análisis Palabra por Palabra',
    'feedbackPanel.focusArea': 'Enfoque para el Próximo Intento',
    'feedbackPanel.missed': '(omitido)',

    // Score
    'score.excellent': '¡Excelente!',
    'score.great': '¡Muy bien!',
    'score.good': '¡Buen esfuerzo!',
    'score.keepPracticing': '¡Sigue practicando!',
    'score.tryAgain': '¡Intenta de nuevo!',

    // Progress
    'progress.title': 'Tu Progreso',
    'progress.noSessions': 'Aún no hay sesiones de práctica',
    'progress.startPracticing': '¡Comienza a practicar para ver tu progreso aquí!',
    'progress.totalAttempts': 'Intentos Totales',
    'progress.averageScore': 'Puntaje Promedio',
    'progress.bestScore': 'Mejor Puntaje',
    'progress.dayStreak': 'Racha de Días',
    'progress.scoreTrend': 'Tendencia (Últimos 10)',
    'progress.recentAttempts': 'Intentos Recientes',
    'progress.averageByLevel': 'Promedio por Nivel',
    'progress.clearAll': 'Borrar Todo el Progreso',
    'progress.clearConfirm': '¿Estás seguro de que quieres borrar todo el progreso?',
    'progress.attempts': 'intentos',
    'progress.youSaid': 'Dijiste:',

    // Shortcuts
    'shortcuts.title': 'Atajos de Teclado',
    'shortcuts.spaceDesc': 'Iniciar / Detener grabación',
    'shortcuts.enterDesc': 'Continuar a siguiente frase',
    'shortcuts.escapeDesc': 'Cerrar modal',

    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.level': 'Nivel',
    'settings.topic': 'Tema',
    'settings.apiKey': 'Clave API de Anthropic',
    'settings.save': 'Guardar',
    'settings.getApiKey': 'Obtén tu clave API',
    'settings.topicPlaceholder': 'ej. viajes, negocios, comida...',

    // Levels
    'level.beginner': 'Principiante',
    'level.intermediate': 'Intermedio',
    'level.advanced': 'Avanzado',

    // Word Tap
    'feedbackPanel.tapToHear': 'Toca una palabra para escucharla',

    // Leveling
    'level.levelUp': '!Subiste de Nivel!',
    'level.newTier': 'Nuevo nivel:',
    'progress.levelLabel': 'Nivel',
    'settings.levelAutoNote': 'Se ajusta auto. al subir de nivel',
  },

  pt: {
    // Onboarding
    'onboarding.chooseLevel': 'Escolha seu nível',
    'onboarding.levelDesc': 'Vamos ajustar a dificuldade das frases',
    'onboarding.beginner': 'Iniciante',
    'onboarding.beginnerDesc': 'Palavras simples e frases curtas',
    'onboarding.intermediate': 'Intermediário',
    'onboarding.intermediateDesc': 'Frases conversacionais',
    'onboarding.advanced': 'Avançado',
    'onboarding.advancedDesc': 'Frases complexas e expressões idiomáticas',
    'onboarding.chooseTopic': 'Escolha um tema',
    'onboarding.topicDesc': 'A IA vai gerar frases contextuais para você',
    'onboarding.topicPlaceholder': 'Digite um tema...',
    'onboarding.apiKeyTitle': 'Chave API',
    'onboarding.apiKeyDesc': 'Insira sua chave API da Anthropic para o coach de IA',
    'onboarding.apiKeyNote': 'Sua chave é armazenada localmente e nunca é enviada aos nossos servidores.',
    'onboarding.getApiKey': 'Obtenha sua chave API no Anthropic Console',
    'onboarding.back': 'Voltar',
    'onboarding.continue': 'Continuar',
    'onboarding.startPracticing': 'Começar a praticar',

    // Topics
    'topic.travel': 'Viagens',
    'topic.business': 'Negócios',
    'topic.food': 'Comida',
    'topic.technology': 'Tecnologia',
    'topic.sports': 'Esportes',
    'topic.dailyLife': 'Dia a dia',
    'topic.music': 'Música',
    'topic.science': 'Ciência',

    // Practice
    'practice.listen': 'Ouvir',
    'practice.speak': 'Falar',
    'practice.stop': 'Parar',
    'practice.saying': 'Você está dizendo:',
    'practice.listening': 'Ouvindo...',
    'practice.generating': 'Gerando frase...',
    'practice.noSpeech': 'Nenhuma fala detectada. Tente novamente.',
    'practice.speechRequired': 'O reconhecimento de fala requer Chrome ou Edge.',
    'practice.failedGenerate': 'Erro ao gerar frase. Tente novamente.',
    'practice.invalidApiKey': 'Chave API inválida. Verifique suas configurações.',
    'practice.failedFeedback': 'Erro ao obter feedback. Tente novamente.',
    'practice.couldNotPlay': 'Não foi possível reproduzir o áudio.',
    'practice.skipPhrase': 'Nova Frase',
    'practice.listenSlow': 'Ouvir Devagar',
    'practice.endSession': 'Encerrar Sessão',

    // Feedback
    'feedback.youSaid': 'Você disse:',
    'feedback.tryAgain': 'Tentar novamente',
    'feedback.continue': 'Continuar',

    'feedback.details': 'Ver Feedback',
    'feedback.playRecording': 'Ouvir Minha Gravação',

    // Feedback Panel
    'feedbackPanel.wordAnalysis': 'Análise Palavra por Palavra',
    'feedbackPanel.focusArea': 'Foco para a Próxima Tentativa',
    'feedbackPanel.missed': '(omitido)',

    // Score
    'score.excellent': 'Excelente!',
    'score.great': 'Muito bom!',
    'score.good': 'Bom esforço!',
    'score.keepPracticing': 'Continue praticando!',
    'score.tryAgain': 'Tente novamente!',

    // Progress
    'progress.title': 'Seu Progresso',
    'progress.noSessions': 'Nenhuma sessão de prática ainda',
    'progress.startPracticing': 'Comece a praticar para ver seu progresso aqui!',
    'progress.totalAttempts': 'Total de Tentativas',
    'progress.averageScore': 'Pontuação Média',
    'progress.bestScore': 'Melhor Pontuação',
    'progress.dayStreak': 'Sequência de Dias',
    'progress.scoreTrend': 'Tendência (Últimos 10)',
    'progress.recentAttempts': 'Tentativas Recentes',
    'progress.averageByLevel': 'Média por Nível',
    'progress.clearAll': 'Limpar Todo o Progresso',
    'progress.clearConfirm': 'Tem certeza de que deseja limpar todo o progresso?',
    'progress.attempts': 'tentativas',
    'progress.youSaid': 'Você disse:',

    // Shortcuts
    'shortcuts.title': 'Atalhos de Teclado',
    'shortcuts.spaceDesc': 'Iniciar / Parar gravação',
    'shortcuts.enterDesc': 'Continuar para a próxima frase',
    'shortcuts.escapeDesc': 'Fechar modal',

    // Settings
    'settings.title': 'Configurações',
    'settings.language': 'Idioma',
    'settings.level': 'Nível',
    'settings.topic': 'Tema',
    'settings.apiKey': 'Chave API da Anthropic',
    'settings.save': 'Salvar',
    'settings.getApiKey': 'Obtenha sua chave API',
    'settings.topicPlaceholder': 'ex. viagens, negócios, comida...',

    // Levels
    'level.beginner': 'Iniciante',
    'level.intermediate': 'Intermediário',
    'level.advanced': 'Avançado',

    // Word Tap
    'feedbackPanel.tapToHear': 'Toque em uma palavra para ouvi-la',

    // Leveling
    'level.levelUp': 'Subiu de Nivel!',
    'level.newTier': 'Novo nivel:',
    'progress.levelLabel': 'Nivel',
    'settings.levelAutoNote': 'Ajusta-se auto. ao subir de nivel',
  },
};

export function t(key: string, language: Language): string {
  return translations[language]?.[key] || translations['en']?.[key] || key;
}

export function getLocalizedScoreLabel(score: number, language: Language): string {
  if (score >= 90) return t('score.excellent', language);
  if (score >= 70) return t('score.great', language);
  if (score >= 50) return t('score.good', language);
  if (score >= 30) return t('score.keepPracticing', language);
  return t('score.tryAgain', language);
}

export const topicKeys = [
  'topic.travel',
  'topic.business',
  'topic.food',
  'topic.technology',
  'topic.sports',
  'topic.dailyLife',
  'topic.music',
  'topic.science',
] as const;
