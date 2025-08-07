import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const VoiceRecognitionSettings = ({
  speechLanguage,
  onSpeechLanguageChange,
  speechAccuracy,
  onSpeechAccuracyChange,
  enablePunctuation,
  onEnablePunctuationChange,
  enableNoiseReduction,
  onEnableNoiseReductionChange
}) => {
  const speechLanguageOptions = [
    { value: 'en-US', label: 'English (US)', description: 'American English' },
    { value: 'en-GB', label: 'English (UK)', description: 'British English' },
    { value: 'ko-KR', label: '한국어', description: 'Korean' },
    { value: 'ja-JP', label: '日本語', description: 'Japanese' },
    { value: 'ru-RU', label: 'Русский', description: 'Russian' },
    { value: 'tr-TR', label: 'Türkçe', description: 'Turkish' },
    { value: 'es-ES', label: 'Español', description: 'Spanish' },
    { value: 'fr-FR', label: 'Français', description: 'French' },
    { value: 'de-DE', label: 'Deutsch', description: 'German' },
    { value: 'zh-CN', label: '中文', description: 'Chinese (Simplified)' },
  ];

  const accuracyOptions = [
    { value: 'standard', label: 'Standard', description: 'Balanced speed and accuracy' },
    { value: 'high', label: 'High Accuracy', description: 'Slower but more precise' },
    { value: 'fast', label: 'Fast Recognition', description: 'Quicker response, less precise' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Mic" size={16} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Voice Recognition Settings</h3>
      </div>
      <div className="space-y-6">
        <div>
          <Select
            label="Speech Recognition Language"
            description="Primary language for voice input processing"
            options={speechLanguageOptions}
            value={speechLanguage}
            onChange={onSpeechLanguageChange}
            searchable
          />
        </div>

        <div>
          <Select
            label="Recognition Accuracy"
            description="Balance between speed and precision"
            options={accuracyOptions}
            value={speechAccuracy}
            onChange={onSpeechAccuracyChange}
          />
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Auto-punctuation"
            description="Automatically add punctuation to speech recognition results"
            checked={enablePunctuation}
            onChange={(e) => onEnablePunctuationChange(e?.target?.checked)}
          />

          <Checkbox
            label="Noise reduction"
            description="Filter background noise during voice recording"
            checked={enableNoiseReduction}
            onChange={(e) => onEnableNoiseReductionChange(e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceRecognitionSettings;