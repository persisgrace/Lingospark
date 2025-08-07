import React from 'react';
import Icon from '../AppIcon';

const ProcessingStatusIndicator = ({ 
  status = 'idle', 
  message = '', 
  progress = 0,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: 'Loader2',
          iconClass: 'animate-spin text-primary',
          bgClass: 'bg-primary/10 border-primary/20',
          textClass: 'text-primary'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          iconClass: 'text-success',
          bgClass: 'bg-success/10 border-success/20',
          textClass: 'text-success'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          iconClass: 'text-error',
          bgClass: 'bg-error/10 border-error/20',
          textClass: 'text-error'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconClass: 'text-warning',
          bgClass: 'bg-warning/10 border-warning/20',
          textClass: 'text-warning'
        };
      default:
        return {
          icon: 'Clock',
          iconClass: 'text-muted-foreground',
          bgClass: 'bg-muted border-border',
          textClass: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig();

  if (status === 'idle' && !message) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-smooth ${config?.bgClass} ${className}`}>
      <Icon 
        name={config?.icon} 
        size={16} 
        className={config?.iconClass}
      />
      <div className="flex-1 min-w-0">
        {message && (
          <p className={`text-sm font-medium ${config?.textClass}`}>
            {message}
          </p>
        )}
        
        {status === 'processing' && progress > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatusIndicator;