import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';

const LanguageSelector = ({ 
  label = "Language", 
  value, 
  onChange, 
  className = "",
  disabled = false 
}) => {
  const languageOptions = [
    { value: 'en', label: 'English', description: 'English' },
    { value: 'ko', label: '한국어', description: 'Korean' },
    { value: 'ja', label: '日本語', description: 'Japanese' },
    { value: 'ru', label: 'Русский', description: 'Russian' },
    { value: 'tr', label: 'Türkçe', description: 'Turkish' },
    { value: 'es', label: 'Español', description: 'Spanish' },
    { value: 'fr', label: 'Français', description: 'French' },
    { value: 'de', label: 'Deutsch', description: 'German' },
    { value: 'zh', label: '中文', description: 'Chinese' },
    { value: 'ar', label: 'العربية', description: 'Arabic' },
    { value: 'hi', label: 'हिन्दी', description: 'Hindi' },
    { value: 'pt', label: 'Português', description: 'Portuguese' },
    { value: 'it', label: 'Italiano', description: 'Italian' },
    { value: 'nl', label: 'Nederlands', description: 'Dutch' },
  ];

  const handleLanguageChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div className={className}>
      <Select
        label={label}
        options={languageOptions}
        value={value}
        onChange={handleLanguageChange}
        placeholder="Select language"
        searchable
        disabled={disabled}
        clearable={false}
      />
    </div>
  );
};

export default LanguageSelector;