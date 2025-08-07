import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VideoUploadZone = ({ onFileUpload, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const maxFileSize = 500 * 1024 * 1024; // 500MB

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const isValidFormat = supportedFormats?.some(format => 
        file?.name?.toLowerCase()?.endsWith(format)
      );
      const isValidSize = file?.size <= maxFileSize;
      
      if (!isValidFormat) {
        alert(`Unsupported format: ${file?.name}. Please use: ${supportedFormats?.join(', ')}`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`File too large: ${file?.name}. Maximum size is 500MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles?.length > 0) {
      onFileUpload(validFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedFormats?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name="Upload" size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragOver ? 'Drop videos here' : 'Upload Video Files'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop your video files here, or click to browse. 
              Supports {supportedFormats?.join(', ')} formats up to 500MB each.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleBrowseClick}
            disabled={isUploading}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Browse Files
          </Button>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Icon name="Loader2" size={20} className="animate-spin text-primary" />
              <span className="text-sm font-medium text-foreground">Uploading...</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Supported formats: {supportedFormats?.join(', ')}</p>
        <p>Maximum file size: 500MB per file</p>
      </div>
    </div>
  );
};

export default VideoUploadZone;