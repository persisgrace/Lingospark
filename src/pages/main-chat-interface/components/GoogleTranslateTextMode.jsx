import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import translationService from '../../../utils/translationService';

const GoogleTranslateTextMode = ({
  inputLanguage,
  outputLanguage,
  onInputLanguageChange,
  onOutputLanguageChange,
  onSendMessage,
  disabled = false
}) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastTranslatedText, setLastTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [translationConfidence, setTranslationConfidence] = useState(0);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Auto-translate when input text changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText?.trim() && inputText !== lastTranslatedText) {
        handleTranslate();
      } else if (!inputText?.trim()) {
        setOutputText('');
        setLastTranslatedText('');
        setDetectedLanguage(null);
        setTranslationConfidence(0);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, inputLanguage, outputLanguage]);

  const handleTranslate = async () => {
    if (!inputText?.trim()) return;
    
    setIsTranslating(true);
    setLastTranslatedText(inputText);
    
    try {
      // Detect input language if different from selected
      const detected = translationService?.detectLanguage(inputText);
      setDetectedLanguage(detected);
      
      // Use detected language or selected input language
      const sourceLanguage = detected !== 'en' ? detected : inputLanguage;
      
      // Perform translation
      const translatedText = await translationService?.translateText(
        inputText,
        sourceLanguage,
        outputLanguage
      );
      
      setOutputText(translatedText);
      
      // Calculate confidence based on translation quality
      const confidence = calculateTranslationConfidence(inputText, translatedText, sourceLanguage, outputLanguage);
      setTranslationConfidence(confidence);
      
      // Auto-adjust input language if detection is confident
      if (detected !== inputLanguage && confidence > 0.8 && detected !== 'en') {
        onInputLanguageChange(detected);
      }
      
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText(`Translation error: ${inputText}`);
      setTranslationConfidence(0);
    }
    
    setIsTranslating(false);
  };

  const calculateTranslationConfidence = (original, translated, fromLang, toLang) => {
    // Basic confidence calculation
    if (original === translated) return 0.1; // No change indicates poor translation
    if (translated?.includes(`(${toLang})`)) return 0.3; // Fallback translation
    
    // Check if translation seems successful
    const hasNativeScript = {
      'te': /[\u0C00-\u0C7F]/?.test(translated),
      'ko': /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/?.test(translated),
      'ja': /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/?.test(translated),
      'hi': /[\u0900-\u097F]/?.test(translated),
      'ar': /[\u0600-\u06FF]/?.test(translated),
      'zh': /[\u4E00-\u9FFF]/?.test(translated)
    };
    
    if (toLang !== 'en' && hasNativeScript?.[toLang]) return 0.9;
    if (toLang === 'en' && !/[\u0080-\uFFFF]/?.test(translated)) return 0.8;
    
    return 0.6; // Medium confidence for other cases
  };

  const handleSwapLanguages = () => {
    const temp = inputLanguage;
    onInputLanguageChange(outputLanguage);
    onOutputLanguageChange(temp);
    
    // Swap text content too
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
    
    // Clear detection state
    setDetectedLanguage(null);
    setTranslationConfidence(0);
  };

  const handleCopyOutput = async () => {
    if (outputText) {
      try {
        await navigator?.clipboard?.writeText(outputText);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleSpeakInput = () => {
    if (inputText && 'speechSynthesis' in window) {
      const effectiveLanguage = detectedLanguage || inputLanguage;
      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.lang = getVoiceLanguageCode(effectiveLanguage);
      window?.speechSynthesis?.speak(utterance);
    }
  };

  const handleSpeakOutput = () => {
    if (outputText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(outputText);
      utterance.lang = getVoiceLanguageCode(outputLanguage);
      window?.speechSynthesis?.speak(utterance);
    }
  };

  const getVoiceLanguageCode = (langCode) => {
    const voiceCodes = {
      'en': 'en-US',
      'te': 'te-IN',
      'ko': 'ko-KR',
      'ja': 'ja-JP',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
      'pt': 'pt-BR',
      'it': 'it-IT',
      'nl': 'nl-NL',
      'ru': 'ru-RU',
      'tr': 'tr-TR'
    };
    return voiceCodes?.[langCode] || langCode;
  };

  const handleMicInput = () => {
    // Mock microphone functionality
    console.log('Microphone input requested');
  };

  const handleSubmitMessage = () => {
    if (inputText?.trim()) {
      onSendMessage(inputText?.trim());
      setInputText('');
      setOutputText('');
      setLastTranslatedText('');
      setDetectedLanguage(null);
      setTranslationConfidence(0);
    }
  };

  const handleUndo = () => {
    setInputText('');
    setOutputText('');
    setLastTranslatedText('');
    setDetectedLanguage(null);
    setTranslationConfidence(0);
  };

  const getLanguageOptions = () => {
    return translationService?.getSupportedLanguages()?.map(lang => ({
      value: lang?.code,
      label: lang?.name
    }));
  };

  const getLanguageDisplayName = (code) => {
    const lang = translationService?.getSupportedLanguages()?.find(l => l?.code === code);
    return lang?.name || code?.toUpperCase();
  };

  const renderTranslationStatus = () => {
    if (isTranslating) {
      return (
        <div className="text-xs text-blue-600 flex items-center">
          <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full mr-1"></div>
          Translating...
        </div>
      );
    }

    if (detectedLanguage && detectedLanguage !== inputLanguage) {
      return (
        <div className="text-xs text-orange-600">
          Detected: {getLanguageDisplayName(detectedLanguage)}
        </div>
      );
    }

    if (translationConfidence > 0 && outputText) {
      const confidenceLevel = translationConfidence > 0.8 ? 'High' : 
                             translationConfidence > 0.5 ? 'Medium' : 'Low';
      const confidenceColor = translationConfidence > 0.8 ? 'text-green-600' : 
                              translationConfidence > 0.5 ? 'text-yellow-600' : 'text-red-600';
      
      return (
        <div className={`text-xs ${confidenceColor}`}>
          Confidence: {confidenceLevel}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Language Selector Header */}
      <div className="flex items-center justify-center p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-4">
          <div className="min-w-[120px]">
            <select
              value={inputLanguage}
              onChange={(e) => onInputLanguageChange(e?.target?.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {getLanguageOptions()?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapLanguages}
            disabled={disabled}
            className="h-8 w-8"
            title="Swap languages"
          >
            <Icon name="ArrowLeftRight" size={16} />
          </Button>
          
          <div className="min-w-[120px]">
            <select
              value={outputLanguage}
              onChange={(e) => onOutputLanguageChange(e?.target?.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {getLanguageOptions()?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Dual Panel Layout */}
      <div className="flex min-h-[300px]">
        {/* Input Panel */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="flex-1 p-4">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e?.target?.value)}
              placeholder="Type text to translate..."
              disabled={disabled}
              className="w-full h-full resize-none bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-base leading-relaxed"
              style={{ minHeight: '200px' }}
            />
          </div>
          
          {/* Input Status Bar */}
          {(isTranslating || detectedLanguage || inputText) && (
            <div className="px-4 py-2 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  {renderTranslationStatus()}
                  {inputText && (
                    <span className="text-muted-foreground">
                      {inputText?.length} characters
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  className="h-6 px-2 text-xs"
                  disabled={!inputText}
                >
                  CLEAR
                </Button>
              </div>
            </div>
          )}
          
          {/* Input Actions */}
          <div className="flex items-center justify-between p-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMicInput}
                disabled={disabled}
                className="h-8 w-8"
                title="Voice input"
              >
                <Icon name="Mic" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeakInput}
                disabled={disabled || !inputText}
                className="h-8 w-8"
                title="Listen"
              >
                <Icon name="Volume2" size={16} />
              </Button>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmitMessage}
              disabled={disabled || !inputText?.trim()}
              className="px-4 py-2"
            >
              Send to Chat
            </Button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 bg-muted/10">
            {outputText ? (
              <div className="h-full">
                <div className="text-foreground text-base leading-relaxed mb-3">
                  {outputText}
                </div>
                {/* Show transliteration for Telugu */}
                {outputLanguage === 'te' && outputText && /[\u0C00-\u0C7F]/?.test(outputText) && (
                  <div className="text-muted-foreground text-sm italic">
                    {getTransliteration(outputText)}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Translation will appear here
              </div>
            )}
          </div>
          
          {/* Output Actions */}
          <div className="flex items-center justify-between p-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyOutput}
                disabled={!outputText}
                className="h-8 w-8"
                title="Copy translation"
              >
                <Icon name="Copy" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeakOutput}
                disabled={!outputText}
                className="h-8 w-8"
                title="Listen to translation"
              >
                <Icon name="Volume2" size={16} />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!outputText}
                className="px-3 py-1 text-xs"
                title="Open in Google Translate"
              >
                <Icon name="ExternalLink" size={12} className="mr-1" />
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to get transliteration (basic)
  function getTransliteration(teluguText) {
    const transliterationMap = {
      'మీరు ఎలా ఉన్నారు': 'Mīru elā unnāru',
      'హలో': 'Halō',
      'ధన్యవాదాలు': 'Dhan\'yavādālu',
      'శుభోదయం': 'Śubhōdayaṁ',
      'శుభ రాత్రి': 'Śubha rātri',
      'నమస్కారం': 'Namaskāraṁ'
    };
    
    return transliterationMap?.[teluguText] || '';
  }
};

export default GoogleTranslateTextMode;