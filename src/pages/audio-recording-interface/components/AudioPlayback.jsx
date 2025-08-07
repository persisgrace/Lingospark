import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AudioPlayback = ({
  audioBlob,
  waveformData = [],
  onPlaybackComplete,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (audioBlob && audioRef?.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      
      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [audioBlob]);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio?.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio?.currentTime);
      setPlaybackPosition((audio?.currentTime / audio?.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setPlaybackPosition(0);
      if (onPlaybackComplete) {
        onPlaybackComplete();
      }
    };

    audio?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio?.addEventListener('timeupdate', handleTimeUpdate);
    audio?.addEventListener('ended', handleEnded);

    return () => {
      audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
      audio?.removeEventListener('ended', handleEnded);
    };
  }, [onPlaybackComplete]);

  const handlePlayPause = () => {
    const audio = audioRef?.current;
    if (!audio) return;

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      audio?.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef?.current;
    const progress = progressRef?.current;
    if (!audio || !progress) return;

    const rect = progress?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const percentage = clickX / rect?.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setPlaybackPosition(percentage * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!audioBlob) {
    return null;
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <audio ref={audioRef} preload="metadata" />
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Volume2" size={20} className="text-primary" />
        <span className="font-medium text-foreground">Audio Playback</span>
      </div>
      {/* Waveform with Progress */}
      <div className="relative mb-4">
        <div className="flex items-end justify-center space-x-1 h-16 bg-muted rounded-lg p-2">
          {waveformData?.length > 0 ? (
            waveformData?.map((value, index) => {
              const isActive = (index / waveformData?.length) * 100 <= playbackPosition;
              return (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-75 ${
                    isActive ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  style={{
                    width: '3px',
                    height: `${Math.max(4, value * 48)}px`,
                  }}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Icon name="AudioLines" size={24} />
            </div>
          )}
        </div>
        
        {/* Progress Overlay */}
        <div
          ref={progressRef}
          className="absolute inset-0 cursor-pointer"
          onClick={handleSeek}
        />
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            disabled={!audioBlob}
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
          </Button>
          
          <div className="text-sm text-muted-foreground font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const audio = audioRef?.current;
              if (audio) {
                audio.currentTime = Math.max(0, audio?.currentTime - 10);
              }
            }}
            title="Rewind 10s"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const audio = audioRef?.current;
              if (audio) {
                audio.currentTime = Math.min(duration, audio?.currentTime + 10);
              }
            }}
            title="Forward 10s"
          >
            <Icon name="RotateCw" size={16} />
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-3">
        <div 
          className="w-full bg-muted rounded-full h-1 cursor-pointer"
          onClick={handleSeek}
          ref={progressRef}
        >
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-100"
            style={{ width: `${playbackPosition}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayback;