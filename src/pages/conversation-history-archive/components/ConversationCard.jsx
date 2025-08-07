import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConversationCard = ({ 
  conversation, 
  onExport, 
  onDelete, 
  onResume 
}) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const getInteractionTypeIcon = (type) => {
    switch (type) {
      case 'text': return 'MessageCircle';
      case 'voice': return 'Mic';
      case 'video': return 'Video';
      default: return 'MessageCircle';
    }
  };

  const getLanguageFlag = (lang) => {
    const flags = {
      'en': '🇺🇸',
      'ko': '🇰🇷',
      'ja': '🇯🇵',
      'ru': '🇷🇺',
      'tr': '🇹🇷',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'zh': '🇨🇳'
    };
    return flags?.[lang] || '🌐';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getInteractionTypeIcon(conversation?.type)} 
            size={16} 
            className="text-primary" 
          />
          <span className="text-sm font-medium text-foreground">
            {conversation?.title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(conversation?.timestamp)}
        </span>
      </div>
      {/* Preview */}
      <div className="mb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {conversation?.preview}
        </p>
      </div>
      {/* Languages and Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {conversation?.languages?.map((lang, index) => (
            <span key={index} className="text-sm">
              {getLanguageFlag(lang)} {lang?.toUpperCase()}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span>{conversation?.messageCount} messages</span>
          {conversation?.duration && (
            <span>{conversation?.duration}</span>
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link to="/main-chat-interface" state={{ conversationId: conversation?.id }}>
          <Button
            variant="outline"
            size="sm"
            iconName="Play"
            iconPosition="left"
            onClick={() => onResume && onResume(conversation?.id)}
          >
            Resume
          </Button>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExport && onExport(conversation)}
            title="Export conversation"
          >
            <Icon name="Download" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete && onDelete(conversation?.id)}
            title="Delete conversation"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;