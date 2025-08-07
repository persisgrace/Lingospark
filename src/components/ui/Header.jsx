import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Select from './Select';

const Header = () => {
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'ar', label: 'العربية' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'pt', label: 'Português' },
  ];

  const navigationItems = [
    {
      label: 'Chat',
      path: '/main-chat-interface',
      icon: 'MessageCircle',
    },
    {
      label: 'Video',
      path: '/video-processing-dashboard',
      icon: 'Video',
    },
    {
      label: 'History',
      path: '/conversation-history-archive',
      icon: 'History',
    },
    {
      label: 'Settings',
      path: '/language-settings-preferences',
      icon: 'Settings',
    },
  ];

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    localStorage.setItem('selectedLanguage', value);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 lg:h-18">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <Link to="/main-chat-interface" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="MessageSquare" size={20} color="white" />
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:block">
            MultiLingual AI
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="w-32">
            <Select
              options={languageOptions}
              value={selectedLanguage}
              onChange={handleLanguageChange}
              placeholder="Language"
              className="text-sm"
            />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-accent transition-smooth">
            <Icon name="Menu" size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-card">
        <nav className="flex items-center justify-around py-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth ${
                isActivePath(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;