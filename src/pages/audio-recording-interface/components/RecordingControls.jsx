import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RecordingControls = ({
  isRecording,
  isPaused,
  recordingTime,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onClearRecording,
  hasRecording,
  isProcessing,
  className = ''
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Recording Timer */}
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-foreground mb-1">
          {formatTime(recordingTime)}
        </div>
        {isRecording && !isPaused && (
          <div className="flex items-center justify-center space-x-2 text-sm text-error">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <span>Recording...</span>
          </div>
        )}
        {isPaused && (
          <div className="flex items-center justify-center space-x-2 text-sm text-warning">
            <Icon name="Pause" size={12} />
            <span>Paused</span>
          </div>
        )}
      </div>

      {/* Main Control Button */}
      <div className="flex items-center justify-center">
        {!isRecording && !hasRecording && (
          <Button
            variant="default"
            size="xl"
            onClick={onStartRecording}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Icon name="Mic" size={32} color="white" />
          </Button>
        )}

        {isRecording && !isPaused && (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onPauseRecording}
              className="w-16 h-16 rounded-full"
            >
              <Icon name="Pause" size={24} />
            </Button>
            <Button
              variant="destructive"
              size="xl"
              onClick={onStopRecording}
              className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Icon name="Square" size={32} />
            </Button>
          </div>
        )}

        {isPaused && (
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              size="lg"
              onClick={onResumeRecording}
              className="w-16 h-16 rounded-full"
            >
              <Icon name="Play" size={24} />
            </Button>
            <Button
              variant="destructive"
              size="xl"
              onClick={onStopRecording}
              className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Icon name="Square" size={32} />
            </Button>
          </div>
        )}

        {hasRecording && !isRecording && (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onClearRecording}
              disabled={isProcessing}
              className="w-16 h-16 rounded-full"
            >
              <Icon name="RotateCcw" size={24} />
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={onStartRecording}
              disabled={isProcessing}
              className="w-16 h-16 rounded-full"
            >
              <Icon name="Mic" size={24} />
            </Button>
          </div>
        )}
      </div>

      {/* Secondary Controls */}
      {(isRecording || hasRecording) && (
        <div className="flex items-center space-x-3">
          {hasRecording && !isRecording && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearRecording}
                disabled={isProcessing}
                iconName="Trash2"
                iconPosition="left"
              >
                Clear
              </Button>
            </>
          )}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Loader2" size={16} className="animate-spin" />
          <span>Processing audio...</span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;