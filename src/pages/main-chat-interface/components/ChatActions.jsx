import React from 'react';
import Button from '../../../components/ui/Button';

const ChatActions = ({ 
  onClearHistory, 
  onExportChat, 
  onToggleSettings,
  messageCount = 0,
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card border-t border-border">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSettings}
          disabled={disabled}
          iconName="Settings"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Settings</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportChat}
          disabled={disabled || messageCount === 0}
          iconName="Download"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {messageCount} messages
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          disabled={disabled || messageCount === 0}
          iconName="Trash2"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatActions;