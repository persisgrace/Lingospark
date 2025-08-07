import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VoiceInputArea = ({ onSendAudio, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef?.current) {
        streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      }
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, []);

  const generateWaveform = () => {
    if (!analyserRef?.current) return;

    const bufferLength = analyserRef?.current?.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef?.current?.getByteFrequencyData(dataArray);

    const waveform = [];
    const samples = 20;
    const step = Math.floor(bufferLength / samples);

    for (let i = 0; i < samples; i++) {
      const index = i * step;
      const value = dataArray?.[index] / 255;
      waveform?.push(value);
    }

    setWaveformData(waveform);
    
    if (isRecording) {
      animationRef.current = requestAnimationFrame(generateWaveform);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;

      // Setup audio context for waveform visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef?.current?.createAnalyser();
      const source = audioContextRef?.current?.createMediaStreamSource(stream);
      source?.connect(analyserRef?.current);
      analyserRef.current.fftSize = 256;

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunks?.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
      };

      mediaRecorderRef?.current?.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start waveform animation
      generateWaveform();

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      
      if (streamRef?.current) {
        streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      }
      
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
      
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }

      if (audioContextRef?.current) {
        audioContextRef?.current?.close();
      }
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSendAudio) {
        onSendAudio(audioBlob, recordingTime);
      }
      
      // Reset state
      setAudioBlob(null);
      setRecordingTime(0);
      setWaveformData([]);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Waveform Visualization */}
      <div className="flex items-end justify-center space-x-1 h-20 bg-muted rounded-lg p-4">
        {waveformData?.length > 0 ? (
          waveformData?.map((value, index) => (
            <div
              key={index}
              className="bg-primary rounded-full transition-all duration-75"
              style={{
                width: '4px',
                height: `${Math.max(4, value * 48)}px`,
                opacity: isRecording ? 0.8 + value * 0.2 : 0.4
              }}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Icon name="Mic" size={24} />
          </div>
        )}
      </div>
      {/* Recording Time */}
      <div className="text-center">
        <div className="text-lg font-mono font-medium text-foreground">
          {formatTime(recordingTime)}
        </div>
        {isRecording && (
          <div className="flex items-center justify-center space-x-2 mt-1 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <span>Recording...</span>
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="flex items-center justify-center space-x-3">
        {!isRecording && !audioBlob && (
          <Button
            variant="default"
            size="lg"
            onClick={startRecording}
            disabled={disabled}
            iconName="Mic"
            iconPosition="left"
            className="px-8"
          >
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button
            variant="destructive"
            size="lg"
            onClick={stopRecording}
            iconName="Square"
            iconPosition="left"
            className="px-8"
          >
            Stop Recording
          </Button>
        )}

        {audioBlob && !isProcessing && (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setAudioBlob(null);
                setRecordingTime(0);
                setWaveformData([]);
              }}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Re-record
            </Button>
            <Button
              variant="default"
              onClick={handleSendAudio}
              iconName="Send"
              iconPosition="left"
            >
              Send Audio
            </Button>
          </div>
        )}

        {isProcessing && (
          <Button
            variant="default"
            size="lg"
            loading
            disabled
            className="px-8"
          >
            Processing...
          </Button>
        )}
      </div>
      {/* Audio Preview */}
      {audioBlob && (
        <div className="p-3 bg-muted rounded-lg">
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default VoiceInputArea;