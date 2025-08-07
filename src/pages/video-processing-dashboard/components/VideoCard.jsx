import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const VideoCard = ({ video, onDelete, onLanguageChange, onCopyToClipboard, onExport }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(video?.summaryLanguage || 'en');
  const [isExpanded, setIsExpanded] = useState(false);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'ru', label: 'Русский' },
    { value: 'tr', label: 'Türkçe' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  const getStatusConfig = () => {
    switch (video?.status) {
      case 'uploading':
        return {
          icon: 'Upload',
          iconClass: 'text-primary animate-pulse',
          bgClass: 'bg-primary/10',
          textClass: 'text-primary',
          label: 'Uploading'
        };
      case 'processing':
        return {
          icon: 'Loader2',
          iconClass: 'text-warning animate-spin',
          bgClass: 'bg-warning/10',
          textClass: 'text-warning',
          label: 'Processing'
        };
      case 'completed':
        return {
          icon: 'CheckCircle',
          iconClass: 'text-success',
          bgClass: 'bg-success/10',
          textClass: 'text-success',
          label: 'Completed'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          iconClass: 'text-error',
          bgClass: 'bg-error/10',
          textClass: 'text-error',
          label: 'Error'
        };
      default:
        return {
          icon: 'Clock',
          iconClass: 'text-muted-foreground',
          bgClass: 'bg-muted',
          textClass: 'text-muted-foreground',
          label: 'Pending'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    onLanguageChange(video?.id, language);
  };

  const handleCopy = () => {
    if (video?.summary) {
      onCopyToClipboard(video?.summary);
    }
  };

  const handleExport = () => {
    if (video?.summary) {
      onExport(video);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Thumbnail */}
            <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {video?.thumbnail ? (
                <Image
                  src={video?.thumbnail}
                  alt={video?.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Video" size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate" title={video?.filename}>
                {video?.filename}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                <span>{formatFileSize(video?.size)}</span>
                {video?.duration && <span>{formatDuration(video?.duration)}</span>}
                <span>{new Date(video.uploadedAt)?.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(video?.id)}
              title="Delete video"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mt-3">
          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full ${statusConfig?.bgClass}`}>
            <Icon name={statusConfig?.icon} size={14} className={statusConfig?.iconClass} />
            <span className={`text-xs font-medium ${statusConfig?.textClass}`}>
              {statusConfig?.label}
            </span>
          </div>

          {video?.status === 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              iconPosition="right"
            >
              Summary
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {(video?.status === 'uploading' || video?.status === 'processing') && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>
                {video?.status === 'uploading' ? 'Uploading...' : 'Processing...'}
              </span>
              <span>{Math.round(video?.progress || 0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  video?.status === 'uploading' ? 'bg-primary' : 'bg-warning'
                }`}
                style={{ width: `${video?.progress || 0}%` }}
              />
            </div>
            {video?.estimatedTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Estimated time: {video?.estimatedTime}
              </p>
            )}
          </div>
        )}
      </div>
      {/* Summary Section */}
      {video?.status === 'completed' && isExpanded && (
        <div className="p-4 space-y-4">
          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Summary Language:
            </label>
            <div className="w-32">
              <Select
                options={languageOptions}
                value={selectedLanguage}
                onChange={handleLanguageChange}
                placeholder="Language"
              />
            </div>
          </div>

          {/* Summary Content */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {video?.summary || "Summary not available"}
            </p>
          </div>

          {/* Summary Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                iconName="Copy"
                iconPosition="left"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {video?.summary?.length || 0} characters
            </div>
          </div>
        </div>
      )}
      {/* Error Message */}
      {video?.status === 'error' && (
        <div className="p-4 bg-error/5 border-t border-error/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error">
              {video?.errorMessage || "An error occurred during processing"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;