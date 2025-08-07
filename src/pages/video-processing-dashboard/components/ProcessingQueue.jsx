import React from 'react';
import VideoCard from './VideoCard';
import Icon from '../../../components/AppIcon';

const ProcessingQueue = ({ 
  videos, 
  onDeleteVideo, 
  onLanguageChange, 
  onCopyToClipboard, 
  onExport 
}) => {
  if (videos?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Video" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No videos uploaded yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Upload your first video to get started with AI-powered summarization. 
          Drag and drop files or use the upload button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Processing Queue
        </h2>
        <div className="text-sm text-muted-foreground">
          {videos?.length} {videos?.length === 1 ? 'video' : 'videos'}
        </div>
      </div>
      {/* Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {videos?.map((video) => (
          <VideoCard
            key={video?.id}
            video={video}
            onDelete={onDeleteVideo}
            onLanguageChange={onLanguageChange}
            onCopyToClipboard={onCopyToClipboard}
            onExport={onExport}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessingQueue;