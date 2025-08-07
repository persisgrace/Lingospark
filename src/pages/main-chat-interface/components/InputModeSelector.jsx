import React from 'react';
import Button from '../../../components/ui/Button';

const InputModeSelector = ({ currentMode, onModeChange, disabled = false }) => {
  const modes = [
    {
      id: 'text',
      label: 'Text',
      icon: 'MessageSquare',
      description: 'Type your message'
    },
    {
      id: 'voice',
      label: 'Voice',
      icon: 'Mic',
      description: 'Record audio message'
    },
    {
      id: 'video',
      label: 'Video',
      icon: 'Video',
      description: 'Upload video file'
    }
  ];

  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      {modes?.map((mode) => (
        <Button
          key={mode?.id}
          variant={currentMode === mode?.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange(mode?.id)}
          disabled={disabled}
          iconName={mode?.icon}
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          <span className="hidden sm:inline">{mode?.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default InputModeSelector;