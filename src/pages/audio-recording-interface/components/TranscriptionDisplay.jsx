import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TranscriptionDisplay = ({
  transcription = '',
  confidence = 0,
  isProcessing = false,
  onEdit,
  onSend,
  onClear,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcription);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(transcription);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(editedText);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(transcription);
  };

  const handleSend = () => {
    if (onSend) {
      onSend(isEditing ? editedText : transcription);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard?.writeText(transcription);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-success';
    if (conf >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (conf) => {
    if (conf >= 0.8) return 'High Confidence';
    if (conf >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (isProcessing) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <Icon name="Loader2" size={20} className="animate-spin text-primary" />
          <span className="text-muted-foreground">Processing speech...</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!transcription && !isProcessing) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 text-center ${className}`}>
        <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Transcription will appear here</p>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <span className="font-medium text-foreground">Transcription</span>
          {confidence > 0 && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                confidence >= 0.8 ? 'bg-success' : 
                confidence >= 0.6 ? 'bg-warning' : 'bg-error'
              }`} />
              <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                {getConfidenceLabel(confidence)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyToClipboard}
            title="Copy to clipboard"
          >
            <Icon name="Copy" size={16} />
          </Button>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              title="Edit transcription"
            >
              <Icon name="Edit" size={16} />
            </Button>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e?.target?.value)}
              className="w-full min-h-[120px] p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Edit your transcription..."
            />
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {transcription}
            </div>
            
            {/* Word Count and Character Count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <div className="flex items-center space-x-4">
                <span>{transcription?.split(' ')?.filter(word => word?.length > 0)?.length} words</span>
                <span>{transcription?.length} characters</span>
              </div>
              {confidence > 0 && (
                <span>{Math.round(confidence * 100)}% accuracy</span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Actions */}
      {!isEditing && transcription && (
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            iconName="Trash2"
            iconPosition="left"
          >
            Clear
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              iconName="Edit"
              iconPosition="left"
            >
              Edit
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSend}
              iconName="Send"
              iconPosition="left"
            >
              Send to Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionDisplay;