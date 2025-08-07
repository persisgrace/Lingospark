import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LanguageDetector = ({
  selectedLanguage,
  onLanguageChange,
  detectedLanguage = null,
  confidence = 0,
  isDetecting = false,
  className = ''
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ko', label: '한국어', flag: '🇰🇷' },
    { value: 'ja', label: '日本語', flag: '🇯🇵' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
    { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'zh', label: '中文', flag: '🇨🇳' },
    { value: 'pt', label: 'Português', flag: '🇵🇹' },
    { value: 'it', label: 'Italiano', flag: '🇮🇹' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      if (onLanguageChange) {
        onLanguageChange(savedLanguage);
      }
    }
  }, [onLanguageChange]);

  const handleLanguageChange = (value) => {
    setCurrentLanguage(value);
    localStorage.setItem('selectedLanguage', value);
    if (onLanguageChange) {
      onLanguageChange(value);
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-success';
    if (conf >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (conf) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Speech Recognition Language
        </label>
        <Select
          options={languageOptions?.map(lang => ({
            ...lang,
            label: `${lang?.flag} ${lang?.label}`
          }))}
          value={selectedLanguage || currentLanguage}
          onChange={handleLanguageChange}
          placeholder="Select language"
          className="w-full"
        />
      </div>
      {/* Language Detection Results */}
      {(isDetecting || detectedLanguage) && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Language Detection
            </span>
            {isDetecting && (
              <Icon name="Loader2" size={16} className="animate-spin text-primary" />
            )}
          </div>

          {isDetecting && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Search" size={14} />
              <span>Analyzing speech patterns...</span>
            </div>
          )}

          {detectedLanguage && !isDetecting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {languageOptions?.find(lang => lang?.value === detectedLanguage)?.flag || '🌐'}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {languageOptions?.find(lang => lang?.value === detectedLanguage)?.label || detectedLanguage}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
                    {getConfidenceLabel(confidence)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="w-full bg-background rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    confidence >= 0.8 ? 'bg-success' : 
                    confidence >= 0.6 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>

              {/* Auto-switch suggestion */}
              {detectedLanguage !== (selectedLanguage || currentLanguage) && confidence >= 0.7 && (
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={14} className="text-primary" />
                    <span className="text-xs text-primary">
                      Switch to detected language?
                    </span>
                  </div>
                  <button
                    onClick={() => handleLanguageChange(detectedLanguage)}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Switch
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Language Support Info */}
      <div className="text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Info" size={12} />
          <span>Supports {languageOptions?.length} languages with real-time detection</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageDetector;