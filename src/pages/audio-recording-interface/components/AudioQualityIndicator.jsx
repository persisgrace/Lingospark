import React from 'react';
import Icon from '../../../components/AppIcon';

const AudioQualityIndicator = ({
  volume = 0,
  noiseLevel = 0,
  signalQuality = 'good',
  isRecording = false,
  className = ''
}) => {
  const getQualityConfig = () => {
    switch (signalQuality) {
      case 'excellent':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'CheckCircle2',
          label: 'Excellent'
        };
      case 'good':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'CheckCircle',
          label: 'Good'
        };
      case 'fair':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'AlertTriangle',
          label: 'Fair'
        };
      case 'poor':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'AlertCircle',
          label: 'Poor'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Mic',
          label: 'Unknown'
        };
    }
  };

  const config = getQualityConfig();

  const getVolumeLevel = () => {
    if (volume >= 0.8) return 'High';
    if (volume >= 0.5) return 'Medium';
    if (volume >= 0.2) return 'Low';
    return 'Very Low';
  };

  const getNoiseLevel = () => {
    if (noiseLevel >= 0.7) return 'High';
    if (noiseLevel >= 0.4) return 'Medium';
    if (noiseLevel >= 0.2) return 'Low';
    return 'Very Low';
  };

  if (!isRecording) {
    return null;
  }

  return (
    <div className={`${config?.bgColor} border ${config?.borderColor} rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={config?.icon} size={16} className={config?.color} />
          <span className="text-sm font-medium text-foreground">Audio Quality</span>
        </div>
        <span className={`text-xs font-medium ${config?.color}`}>
          {config?.label}
        </span>
      </div>
      {/* Metrics */}
      <div className="space-y-3">
        {/* Volume Level */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Volume</span>
            <span className="text-xs text-foreground">{getVolumeLevel()}</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-100"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* Noise Level */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Noise</span>
            <span className="text-xs text-foreground">{getNoiseLevel()}</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-100 ${
                noiseLevel >= 0.7 ? 'bg-error' : 
                noiseLevel >= 0.4 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${noiseLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Signal Strength Bars */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Signal</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5]?.map((bar) => {
                const isActive = (() => {
                  switch (signalQuality) {
                    case 'excellent': return bar <= 5;
                    case 'good': return bar <= 4;
                    case 'fair': return bar <= 3;
                    case 'poor': return bar <= 2;
                    default: return bar <= 1;
                  }
                })();
                
                return (
                  <div
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isActive ? config?.color?.replace('text-', 'bg-') : 'bg-muted-foreground/30'
                    }`}
                    style={{ height: `${bar * 3 + 2}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Tips */}
      {signalQuality === 'poor' && (
        <div className="mt-3 p-2 bg-background rounded border border-border">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={12} className="text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Improve quality:</p>
              <ul className="space-y-0.5">
                <li>• Move closer to microphone</li>
                <li>• Reduce background noise</li>
                <li>• Speak clearly and steadily</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioQualityIndicator;