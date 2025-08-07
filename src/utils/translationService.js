// Translation Service - Handles text translation between languages
export class TranslationService {
  constructor() {
    this.translations = this.initializeTranslationMaps();
  }

  // Initialize comprehensive translation mappings
  initializeTranslationMaps() {
    return {
      // Telugu translations (bidirectional)
      'te-en': {
        // Telugu to English
        'మేరు ఎలా ఉన్నారు': 'how are you',
        'మీరు ఎలా ఉన్నారు': 'how are you',
        'హలో': 'hello',
        'హాయ్': 'hi',
        'ధన్యవాదాలు': 'thank you',
        'శుభోదయం': 'good morning',
        'శుభ రాత్రి': 'good night',
        'నమస్కారం': 'namaste',
        'మీ పేరు ఏమిటి': 'what is your name',
        'నేను బాగున్నాను': 'i am fine',
        'మీకు ఎలా అనిపిస్తుంది': 'how do you feel',
        'చాలా బాగుంది': 'very good',
        'అర్థం కాలేదు': 'i do not understand',
        'దయచేసి మళ్లీ చెప్పండి': 'please say again',
        'సహాయం కావాలి': 'need help',
        'క్షమించండి': 'sorry'
      },
      'en-te': {
        // English to Telugu
        'how are you': 'మీరు ఎలా ఉన్నారు',
        'hello': 'హలో',
        'hi': 'హాయ్',
        'thank you': 'ధన్యవాదాలు',
        'good morning': 'శుభోదయం',
        'good night': 'శుభ రాత్రి',
        'namaste': 'నమస్కారం',
        'what is your name': 'మీ పేరు ఏమిటి',
        'i am fine': 'నేను బాగున్నాను',
        'how do you feel': 'మీకు ఎలా అనిపిస్తుంది',
        'very good': 'చాలా బాగుంది',
        'i do not understand': 'అర్థం కాలేదు',
        'please say again': 'దయచేసి మళ్లీ చెప్పండి',
        'need help': 'సహాయం కావాలి',
        'sorry': 'క్షమించండి'
      },
      // Korean translations
      'en-ko': {
        'hello': '안녕하세요',
        'how are you': '어떻게 지내세요?',
        'thank you': '감사합니다',
        'good morning': '좋은 아침입니다',
        'good night': '안녕히 주무세요',
        'yes': '네',
        'no': '아니요',
        'sorry': '죄송합니다',
        'please': '부탁합니다'
      },
      'ko-en': {
        '안녕하세요': 'hello',
        '어떻게 지내세요?': 'how are you',
        '감사합니다': 'thank you',
        '좋은 아침입니다': 'good morning',
        '안녕히 주무세요': 'good night',
        '네': 'yes',
        '아니요': 'no',
        '죄송합니다': 'sorry',
        '부탁합니다': 'please'
      },
      // Spanish translations
      'en-es': {
        'hello': 'hola',
        'how are you': '¿cómo estás?',
        'thank you': 'gracias',
        'good morning': 'buenos días',
        'good night': 'buenas noches',
        'yes': 'sí',
        'no': 'no',
        'sorry': 'lo siento',
        'please': 'por favor'
      },
      'es-en': {
        'hola': 'hello',
        '¿cómo estás?': 'how are you',
        'gracias': 'thank you',
        'buenos días': 'good morning',
        'buenas noches': 'good night',
        'sí': 'yes',
        'lo siento': 'sorry',
        'por favor': 'please'
      },
      // Hindi translations
      'en-hi': {
        'hello': 'नमस्ते',
        'how are you': 'आप कैसे हैं?',
        'thank you': 'धन्यवाद',
        'good morning': 'शुभ प्रभात',
        'good night': 'शुभ रात्रि',
        'yes': 'हाँ',
        'no': 'नहीं',
        'sorry': 'माफ़ करें',
        'please': 'कृपया'
      },
      'hi-en': {
        'नमस्ते': 'hello',
        'आप कैसे हैं?': 'how are you',
        'धन्यवाद': 'thank you',
        'शुभ प्रभात': 'good morning',
        'शुभ रात्रि': 'good night',
        'हाँ': 'yes',
        'नहीं': 'no',
        'माफ़ करें': 'sorry',
        'कृपया': 'please'
      }
    };
  }

  // Main translation function
  async translateText(text, fromLang, toLang) {
    if (!text?.trim()) return '';
    if (fromLang === toLang) return text;

    const normalizedText = text?.toLowerCase()?.trim();
    const translationKey = `${fromLang}-${toLang}`;
    
    // Try exact match first
    const exactMatch = this.translations?.[translationKey]?.[normalizedText];
    if (exactMatch) {
      return exactMatch;
    }

    // Try partial matches for common phrases
    const partialMatch = this.findPartialMatch(normalizedText, translationKey);
    if (partialMatch) {
      return partialMatch;
    }

    // Fallback to basic word-by-word translation for supported languages
    const wordTranslation = await this.translateWordsBasic(text, fromLang, toLang);
    if (wordTranslation !== text) {
      return wordTranslation;
    }

    // If no translation found, return with language indicator
    return this.getFallbackTranslation(text, toLang);
  }

  // Find partial matches in text
  findPartialMatch(text, translationKey) {
    const translations = this.translations?.[translationKey];
    if (!translations) return null;

    // Look for phrase matches within the text
    for (const [source, target] of Object.entries(translations)) {
      if (text?.includes(source?.toLowerCase())) {
        return text?.replace(new RegExp(source.toLowerCase(), 'gi'), target);
      }
    }
    return null;
  }

  // Basic word-by-word translation
  async translateWordsBasic(text, fromLang, toLang) {
    const words = text?.toLowerCase()?.split(/\s+/);
    const translationKey = `${fromLang}-${toLang}`;
    const translations = this.translations?.[translationKey];
    
    if (!translations) return text;

    const translatedWords = words?.map(word => {
      const cleanWord = word?.replace(/[^\w\s]/g, '');
      return translations?.[cleanWord] || word;
    });

    const result = translatedWords?.join(' ');
    return result !== text?.toLowerCase() ? result : text;
  }

  // Get fallback translation with language indicator
  getFallbackTranslation(text, toLang) {
    const languageNames = {
      'en': 'English',
      'te': 'తెలుగు',
      'ko': '한국어',
      'ja': '日本語',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'zh': '中文',
      'ar': 'العربية',
      'hi': 'हिंदी',
      'pt': 'Português',
      'it': 'Italiano',
      'nl': 'Nederlands',
      'ru': 'Русский',
      'tr': 'Türkçe'
    };

    const langName = languageNames?.[toLang] || toLang;
    return `${text} (${langName})`;
  }

  // Detect language of input text
  detectLanguage(text) {
    if (!text?.trim()) return 'en';

    const normalizedText = text?.toLowerCase()?.trim();
    
    // Telugu detection
    if (/[\u0C00-\u0C7F]/?.test(text)) return 'te';
    
    // Korean detection
    if (/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/?.test(text)) return 'ko';
    
    // Japanese detection
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/?.test(text)) return 'ja';
    
    // Hindi detection
    if (/[\u0900-\u097F]/?.test(text)) return 'hi';
    
    // Arabic detection
    if (/[\u0600-\u06FF]/?.test(text)) return 'ar';
    
    // Chinese detection
    if (/[\u4E00-\u9FFF]/?.test(text)) return 'zh';

    // Check for common phrases in different languages
    const commonPhrases = {
      'te': ['మేరు', 'మీరు', 'హలో', 'ధన్యవాదాలు', 'నమస్కారం'],
      'ko': ['안녕', '감사', '죄송'],
      'es': ['hola', 'gracias', 'buenos'],
      'hi': ['नमस्ते', 'धन्यवाद', 'कैसे'],
      'de': ['hallo', 'danke', 'guten'],
      'fr': ['bonjour', 'merci', 'comment']
    };

    for (const [lang, phrases] of Object.entries(commonPhrases)) {
      if (phrases?.some(phrase => normalizedText?.includes(phrase))) {
        return lang;
      }
    }

    return 'en'; // Default to English
  }

  // Get supported language pairs
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' }
    ];
  }

  // Check if translation is available for language pair
  isTranslationAvailable(fromLang, toLang) {
    const key = `${fromLang}-${toLang}`;
    return !!this.translations?.[key] || fromLang === toLang;
  }
}

// Export singleton instance
export const translationService = new TranslationService();

export default translationService;