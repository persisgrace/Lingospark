import React from 'react';
import Select from '../../../components/ui/Select';


const LanguageSelector = ({ 
  label, 
  value, 
  onChange, 
  description,
  className = '' 
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
  ];

  return (
    <div className={className}>
      <Select
        label={label}
        description={description}
        options={languageOptions}
        value={value}
        onChange={onChange}
        searchable
        placeholder="Select language"
      />
    </div>
  );
};

export default LanguageSelector;