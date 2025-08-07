import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TextInputArea = ({ onSendMessage, disabled = false, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef?.current?.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e?.target?.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full px-4 py-3 pr-12 bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth text-sm"
          style={{ maxHeight: '120px' }}
        />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {message?.length}/2000
        </div>
      </div>
      <Button
        type="submit"
        variant="default"
        size="icon"
        disabled={!message?.trim() || disabled}
        className="h-12 w-12 shrink-0"
      >
        <Icon name="Send" size={20} />
      </Button>
    </form>
  );
};

export default TextInputArea;