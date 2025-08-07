import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const TranslationPreferences = ({ 
  autoTranslate, 
  onAutoTranslateChange,
  confidenceThreshold,
  onConfidenceThresholdChange,
  showTranslationSource,
  onShowTranslationSourceChange
}) => {
  const confidenceOptions = [
    { value: 'low', label: 'Low (60%)', description: 'Accept translations with 60% confidence' },
    { value: 'medium', label: 'Medium (75%)', description: 'Accept translations with 75% confidence' },
    { value: 'high', label: 'High (90%)', description: 'Accept translations with 90% confidence' },
    { value: 'very-high', label: 'Very High (95%)', description: 'Accept translations with 95% confidence' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-primary rounded-full" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Translation Preferences</h3>
      </div>
      <div className="space-y-6">
        <Checkbox
          label="Auto-translate incoming messages"
          description="Automatically translate messages that are not in your preferred language"
          checked={autoTranslate}
          onChange={(e) => onAutoTranslateChange(e?.target?.checked)}
        />

        <div>
          <Select
            label="Translation Confidence Threshold"
            description="Minimum confidence level required for automatic translations"
            options={confidenceOptions}
            value={confidenceThreshold}
            onChange={onConfidenceThresholdChange}
          />
        </div>

        <Checkbox
          label="Show translation source"
          description="Display the original text alongside translations"
          checked={showTranslationSource}
          onChange={(e) => onShowTranslationSourceChange(e?.target?.checked)}
        />
      </div>
    </div>
  );
};

export default TranslationPreferences;