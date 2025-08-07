import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import LanguageSelector from './components/LanguageSelector';
import TranslationPreferences from './components/TranslationPreferences';
import VoiceRecognitionSettings from './components/VoiceRecognitionSettings';
import LanguagePreview from './components/LanguagePreview';
import RegionalSettings from './components/RegionalSettings';
import ActionButtons from './components/ActionButtons';

const LanguageSettingsPreferences = () => {
  // Language Settings State
  const [inputLanguage, setInputLanguage] = useState('en');
  const [outputLanguage, setOutputLanguage] = useState('en');
  
  // Translation Preferences State
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState('medium');
  const [showTranslationSource, setShowTranslationSource] = useState(false);
  
  // Voice Recognition State
  const [speechLanguage, setSpeechLanguage] = useState('en-US');
  const [speechAccuracy, setSpeechAccuracy] = useState('standard');
  const [enablePunctuation, setEnablePunctuation] = useState(true);
  const [enableNoiseReduction, setEnableNoiseReduction] = useState(true);
  
  // Regional Settings State
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [numberFormat, setNumberFormat] = useState('US');
  const [timeFormat, setTimeFormat] = useState('12');
  const [culturalContext, setCulturalContext] = useState(true);
  
  // UI State
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState({});

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = {
      inputLanguage: localStorage.getItem('inputLanguage') || 'en',
      outputLanguage: localStorage.getItem('outputLanguage') || 'en',
      autoTranslate: localStorage.getItem('autoTranslate') === 'true',
      confidenceThreshold: localStorage.getItem('confidenceThreshold') || 'medium',
      showTranslationSource: localStorage.getItem('showTranslationSource') === 'true',
      speechLanguage: localStorage.getItem('speechLanguage') || 'en-US',
      speechAccuracy: localStorage.getItem('speechAccuracy') || 'standard',
      enablePunctuation: localStorage.getItem('enablePunctuation') !== 'false',
      enableNoiseReduction: localStorage.getItem('enableNoiseReduction') !== 'false',
      dateFormat: localStorage.getItem('dateFormat') || 'MM/DD/YYYY',
      numberFormat: localStorage.getItem('numberFormat') || 'US',
      timeFormat: localStorage.getItem('timeFormat') || '12',
      culturalContext: localStorage.getItem('culturalContext') !== 'false'
    };

    setInputLanguage(savedSettings?.inputLanguage);
    setOutputLanguage(savedSettings?.outputLanguage);
    setAutoTranslate(savedSettings?.autoTranslate);
    setConfidenceThreshold(savedSettings?.confidenceThreshold);
    setShowTranslationSource(savedSettings?.showTranslationSource);
    setSpeechLanguage(savedSettings?.speechLanguage);
    setSpeechAccuracy(savedSettings?.speechAccuracy);
    setEnablePunctuation(savedSettings?.enablePunctuation);
    setEnableNoiseReduction(savedSettings?.enableNoiseReduction);
    setDateFormat(savedSettings?.dateFormat);
    setNumberFormat(savedSettings?.numberFormat);
    setTimeFormat(savedSettings?.timeFormat);
    setCulturalContext(savedSettings?.culturalContext);
    setInitialSettings(savedSettings);
  }, []);

  // Check for changes
  useEffect(() => {
    const currentSettings = {
      inputLanguage,
      outputLanguage,
      autoTranslate,
      confidenceThreshold,
      showTranslationSource,
      speechLanguage,
      speechAccuracy,
      enablePunctuation,
      enableNoiseReduction,
      dateFormat,
      numberFormat,
      timeFormat,
      culturalContext
    };

    const changed = Object.keys(currentSettings)?.some(
      key => currentSettings?.[key] !== initialSettings?.[key]
    );
    
    setHasChanges(changed);
  }, [
    inputLanguage, outputLanguage, autoTranslate, confidenceThreshold,
    showTranslationSource, speechLanguage, speechAccuracy, enablePunctuation,
    enableNoiseReduction, dateFormat, numberFormat, timeFormat, culturalContext,
    initialSettings
  ]);

  const handleSave = async () => {
    // Save to localStorage
    localStorage.setItem('inputLanguage', inputLanguage);
    localStorage.setItem('outputLanguage', outputLanguage);
    localStorage.setItem('autoTranslate', autoTranslate?.toString());
    localStorage.setItem('confidenceThreshold', confidenceThreshold);
    localStorage.setItem('showTranslationSource', showTranslationSource?.toString());
    localStorage.setItem('speechLanguage', speechLanguage);
    localStorage.setItem('speechAccuracy', speechAccuracy);
    localStorage.setItem('enablePunctuation', enablePunctuation?.toString());
    localStorage.setItem('enableNoiseReduction', enableNoiseReduction?.toString());
    localStorage.setItem('dateFormat', dateFormat);
    localStorage.setItem('numberFormat', numberFormat);
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('culturalContext', culturalContext?.toString());

    // Update initial settings to current values
    const newSettings = {
      inputLanguage,
      outputLanguage,
      autoTranslate,
      confidenceThreshold,
      showTranslationSource,
      speechLanguage,
      speechAccuracy,
      enablePunctuation,
      enableNoiseReduction,
      dateFormat,
      numberFormat,
      timeFormat,
      culturalContext
    };
    setInitialSettings(newSettings);

    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: inputLanguage } 
    }));
  };

  const handleReset = () => {
    const defaultSettings = {
      inputLanguage: 'en',
      outputLanguage: 'en',
      autoTranslate: true,
      confidenceThreshold: 'medium',
      showTranslationSource: false,
      speechLanguage: 'en-US',
      speechAccuracy: 'standard',
      enablePunctuation: true,
      enableNoiseReduction: true,
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'US',
      timeFormat: '12',
      culturalContext: true
    };

    setInputLanguage(defaultSettings?.inputLanguage);
    setOutputLanguage(defaultSettings?.outputLanguage);
    setAutoTranslate(defaultSettings?.autoTranslate);
    setConfidenceThreshold(defaultSettings?.confidenceThreshold);
    setShowTranslationSource(defaultSettings?.showTranslationSource);
    setSpeechLanguage(defaultSettings?.speechLanguage);
    setSpeechAccuracy(defaultSettings?.speechAccuracy);
    setEnablePunctuation(defaultSettings?.enablePunctuation);
    setEnableNoiseReduction(defaultSettings?.enableNoiseReduction);
    setDateFormat(defaultSettings?.dateFormat);
    setNumberFormat(defaultSettings?.numberFormat);
    setTimeFormat(defaultSettings?.timeFormat);
    setCulturalContext(defaultSettings?.culturalContext);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 lg:pt-18">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link to="/main-chat-interface" className="hover:text-foreground transition-smooth">
              Settings
            </Link>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">Language Preferences</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Languages" size={20} color="white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Language Settings & Preferences
              </h1>
            </div>
            <p className="text-muted-foreground">
              Configure your multilingual preferences and customize the AI interaction experience
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Primary Language Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={16} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Primary Language Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LanguageSelector
                  label="Input Language"
                  description="Language for your messages and voice input"
                  value={inputLanguage}
                  onChange={setInputLanguage}
                />
                
                <LanguageSelector
                  label="Output Language"
                  description="Language for AI responses and translations"
                  value={outputLanguage}
                  onChange={setOutputLanguage}
                />
              </div>
            </div>

            {/* Translation Preferences */}
            <TranslationPreferences
              autoTranslate={autoTranslate}
              onAutoTranslateChange={setAutoTranslate}
              confidenceThreshold={confidenceThreshold}
              onConfidenceThresholdChange={setConfidenceThreshold}
              showTranslationSource={showTranslationSource}
              onShowTranslationSourceChange={setShowTranslationSource}
            />

            {/* Voice Recognition Settings */}
            <VoiceRecognitionSettings
              speechLanguage={speechLanguage}
              onSpeechLanguageChange={setSpeechLanguage}
              speechAccuracy={speechAccuracy}
              onSpeechAccuracyChange={setSpeechAccuracy}
              enablePunctuation={enablePunctuation}
              onEnablePunctuationChange={setEnablePunctuation}
              enableNoiseReduction={enableNoiseReduction}
              onEnableNoiseReductionChange={setEnableNoiseReduction}
            />

            {/* Language Preview */}
            <LanguagePreview selectedLanguage={inputLanguage} />

            {/* Regional Settings */}
            <RegionalSettings
              dateFormat={dateFormat}
              onDateFormatChange={setDateFormat}
              numberFormat={numberFormat}
              onNumberFormatChange={setNumberFormat}
              timeFormat={timeFormat}
              onTimeFormatChange={setTimeFormat}
              culturalContext={culturalContext}
              onCulturalContextChange={setCulturalContext}
            />

            {/* Action Buttons */}
            <ActionButtons
              onSave={handleSave}
              onReset={handleReset}
              hasChanges={hasChanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsPreferences;