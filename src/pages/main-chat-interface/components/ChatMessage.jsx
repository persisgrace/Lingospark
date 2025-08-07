import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatMessage = ({ message, onCopy, onRegenerate }) => {
  const isUser = message?.sender === 'user';
  
  const handleCopy = () => {
    navigator.clipboard?.writeText(message?.content);
    if (onCopy) onCopy(message?.id);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] lg:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-foreground">AI Assistant</span>
          </div>
        )}
        
        {/* Message Content */}
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-card border border-border shadow-card'
        }`}>
          {message?.type === 'text' && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message?.content}
            </p>
          )}
          
          {message?.type === 'audio' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Mic" size={16} />
                <span className="text-sm">Voice message</span>
              </div>
              <audio controls className="w-full">
                <source src={message?.audioUrl} type="audio/webm" />
              </audio>
              {message?.transcription && (
                <p className="text-sm opacity-80 italic">
                  "{message?.transcription}"
                </p>
              )}
            </div>
          )}
          
          {message?.type === 'video' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Video" size={16} />
                <span className="text-sm">Video processed</span>
              </div>
              {message?.videoSummary && (
                <p className="text-sm leading-relaxed">
                  {message?.videoSummary}
                </p>
              )}
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {formatTimestamp(message?.timestamp)}
            {message?.language && (
              <span className="ml-2">• {message?.language}</span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        {!isUser && (
          <div className="flex items-center space-x-1 mt-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleCopy}
              iconName="Copy"
              iconPosition="left"
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onRegenerate && onRegenerate(message?.id)}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Regenerate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;