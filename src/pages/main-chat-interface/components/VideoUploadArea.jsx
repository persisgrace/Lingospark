import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VideoUploadArea = ({ onVideoUpload, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const supportedFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const validateFile = (file) => {
    const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();
    
    if (!supportedFormats?.includes(fileExtension)) {
      throw new Error(`Unsupported file format. Please use: ${supportedFormats.join(', ')}`);
    }
    
    if (file?.size > maxFileSize) {
      throw new Error('File size must be less than 100MB');
    }
    
    return true;
  };

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;

    try {
      validateFile(file);
      setSelectedFile(file);
      await uploadFile(file);
    } catch (error) {
      console.error('File validation error:', error);
      // You might want to show a toast notification here
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onVideoUpload) {
        onVideoUpload(file);
      }
      
      // Reset state
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
          dragActive
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef?.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Video" size={32} className="text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Upload Video File
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your video here, or click to browse
            </p>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Supported formats: {supportedFormats?.join(', ')?.toUpperCase()}</p>
              <p>Maximum file size: 100MB</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            disabled={disabled || isUploading}
            iconName="Upload"
            iconPosition="left"
          >
            Choose File
          </Button>
        </div>
      </div>
      {/* Upload Progress */}
      {isUploading && selectedFile && (
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Video" size={16} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile?.size)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploadArea;