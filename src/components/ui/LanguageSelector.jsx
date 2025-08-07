import React, { useState, useEffect } from 'react';
import Select from './Select';

const LanguageSelector = ({ className = '' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languageOptions = [
    { value: 'en', label: 'English', description: 'English' },
    { value: 'es', label: 'Español', description: 'Spanish' },
    { value: 'fr', label: 'Français', description: 'French' },
    { value: 'de', label: 'Deutsch', description: 'German' },
    { value: 'zh', label: '中文', description: 'Chinese' },
    { value: 'ja', label: '日本語', description: 'Japanese' },
    { value: 'ko', label: '한국어', description: 'Korean' },
    { value: 'ar', label: 'العربية', description: 'Arabic' },
    { value: 'hi', label: 'हिन्दी', description: 'Hindi' },
    { value: 'pt', label: 'Português', description: 'Portuguese' },
    { value: 'ru', label: 'Русский', description: 'Russian' },
    { value: 'it', label: 'Italiano', description: 'Italian' },
    { value: 'nl', label: 'Nederlands', description: 'Dutch' },
    { value: 'sv', label: 'Svenska', description: 'Swedish' },
    { value: 'da', label: 'Dansk', description: 'Danish' },
    { value: 'no', label: 'Norsk', description: 'Norwegian' },
    { value: 'fi', label: 'Suomi', description: 'Finnish' },
    { value: 'pl', label: 'Polski', description: 'Polish' },
    { value: 'tr', label: 'Türkçe', description: 'Turkish' },
    { value: 'th', label: 'ไทย', description: 'Thai' },
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    localStorage.setItem('selectedLanguage', value);
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: value } 
    }));
  };

  return (
    <div className={className}>
      <Select
        options={languageOptions}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        placeholder="Select language"
        searchable
        clearable={false}
      />
    </div>
  );
};

export default LanguageSelector;