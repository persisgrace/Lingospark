import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import WaveformVisualizer from './components/WaveformVisualizer';
import RecordingControls from './components/RecordingControls';
import LanguageDetector from './components/LanguageDetector';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import AudioPlayback from './components/AudioPlayback';
import AudioQualityIndicator from './components/AudioQualityIndicator';

const AudioRecordingInterface = () => {
  const navigate = useNavigate();
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [transcriptionConfidence, setTranscriptionConfidence] = useState(0);
  
  // Language detection
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Audio quality metrics
  const [audioMetrics, setAudioMetrics] = useState({
    volume: 0,
    noiseLevel: 0,
    signalQuality: 'good'
  });
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  // Mock transcription data for different languages
  const mockTranscriptions = {
    en: "Hello, this is a test recording in English. The speech recognition system is working properly and can detect various accents and speaking patterns.",
    ko: "안녕하세요, 이것은 한국어로 된 테스트 녹음입니다. 음성 인식 시스템이 제대로 작동하고 있으며 다양한 억양과 말하기 패턴을 감지할 수 있습니다.",
    ja: "こんにちは、これは日本語でのテスト録音です。音声認識システムが正常に動作しており、さまざまなアクセントや話し方のパターンを検出できます。",
    ru: "Привет, это тестовая запись на русском языке. Система распознавания речи работает правильно и может обнаруживать различные акценты и модели речи.",
    tr: "Merhaba, bu Türkçe bir test kaydıdır. Konuşma tanıma sistemi düzgün çalışıyor ve çeşitli aksanları ve konuşma kalıplarını tespit edebiliyor.",
    es: "Hola, esta es una grabación de prueba en español. El sistema de reconocimiento de voz funciona correctamente y puede detectar varios acentos y patrones de habla.",
    fr: "Bonjour, ceci est un enregistrement de test en français. Le système de reconnaissance vocale fonctionne correctement et peut détecter divers accents et modèles de parole.",
    de: "Hallo, das ist eine Testaufnahme auf Deutsch. Das Spracherkennungssystem funktioniert ordnungsgemäß und kann verschiedene Akzente und Sprachmuster erkennen."
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
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
  };

  const generateWaveform = () => {
    if (!analyserRef?.current) return;

    const bufferLength = analyserRef?.current?.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef?.current?.getByteFrequencyData(dataArray);

    const waveform = [];
    const samples = 64;
    const step = Math.floor(bufferLength / samples);

    for (let i = 0; i < samples; i++) {
      const index = i * step;
      const value = dataArray?.[index] / 255;
      waveform?.push(value);
    }

    setWaveformData(waveform);
    
    // Update audio quality metrics
    const avgVolume = waveform?.reduce((sum, val) => sum + val, 0) / waveform?.length;
    const noiseLevel = Math.random() * 0.3; // Mock noise level
    const signalQuality = avgVolume > 0.6 ? 'excellent' : avgVolume > 0.4 ? 'good' : avgVolume > 0.2 ? 'fair' : 'poor';
    
    setAudioMetrics({
      volume: avgVolume,
      noiseLevel,
      signalQuality
    });
    
    if (isRecording && !isPaused) {
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
        processAudio(blob);
      };

      mediaRecorderRef?.current?.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setTranscription('');
      setTranscriptionConfidence(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start waveform animation
      generateWaveform();

      // Start language detection simulation
      setTimeout(() => {
        setIsDetecting(true);
        setTimeout(() => {
          const detectedLang = selectedLanguage;
          const confidence = 0.75 + Math.random() * 0.2;
          setDetectedLanguage(detectedLang);
          setDetectionConfidence(confidence);
          setIsDetecting(false);
        }, 2000);
      }, 3000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      setIsPaused(false);
      
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

  const pauseRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.pause();
      setIsPaused(true);
      
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
      
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef?.current && isPaused) {
      mediaRecorderRef?.current?.resume();
      setIsPaused(false);
      
      // Resume timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Resume waveform animation
      generateWaveform();
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setWaveformData([]);
    setTranscription('');
    setTranscriptionConfidence(0);
    setDetectedLanguage(null);
    setDetectionConfidence(0);
    setRecordingTime(0);
    setAudioMetrics({
      volume: 0,
      noiseLevel: 0,
      signalQuality: 'good'
    });
  };

  const processAudio = async (blob) => {
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transcription based on selected language
      const mockText = mockTranscriptions?.[selectedLanguage] || mockTranscriptions?.en;
      const confidence = 0.8 + Math.random() * 0.15;
      
      setTranscription(mockText);
      setTranscriptionConfidence(confidence);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscription('Error processing audio. Please try again.');
      setTranscriptionConfidence(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditTranscription = (newText) => {
    setTranscription(newText);
  };

  const handleSendToChat = (text) => {
    // Store the transcription in localStorage for the chat interface
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      source: 'voice'
    };
    
    chatHistory?.push(newMessage);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // Navigate to chat interface
    navigate('/main-chat-interface');
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/main-chat-interface"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition-smooth"
            >
              <Icon name="ArrowLeft" size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Voice Recording</h1>
              <p className="text-sm text-muted-foreground">Speak naturally in your preferred language</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/language-settings-preferences')}
              title="Language Settings"
            >
              <Icon name="Settings" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/conversation-history-archive')}
              title="History"
            >
              <Icon name="History" size={20} />
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Language Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LanguageDetector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                detectedLanguage={detectedLanguage}
                confidence={detectionConfidence}
                isDetecting={isDetecting}
              />
            </div>
            <div className="lg:col-span-1">
              <AudioQualityIndicator
                volume={audioMetrics?.volume}
                noiseLevel={audioMetrics?.noiseLevel}
                signalQuality={audioMetrics?.signalQuality}
                isRecording={isRecording && !isPaused}
              />
            </div>
          </div>

          {/* Waveform Visualization */}
          <WaveformVisualizer
            isRecording={isRecording && !isPaused}
            audioData={waveformData}
            height={160}
            className="w-full"
          />

          {/* Recording Controls */}
          <RecordingControls
            isRecording={isRecording}
            isPaused={isPaused}
            recordingTime={recordingTime}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPauseRecording={pauseRecording}
            onResumeRecording={resumeRecording}
            onClearRecording={clearRecording}
            hasRecording={!!audioBlob}
            isProcessing={isProcessing}
            className="text-center"
          />

          {/* Audio Playback */}
          {audioBlob && (
            <AudioPlayback
              audioBlob={audioBlob}
              waveformData={waveformData}
              onPlaybackComplete={() => console.log('Playback completed')}
            />
          )}

          {/* Transcription Display */}
          <TranscriptionDisplay
            transcription={transcription}
            confidence={transcriptionConfidence}
            isProcessing={isProcessing}
            onEdit={handleEditTranscription}
            onSend={handleSendToChat}
            onClear={() => setTranscription('')}
          />

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/main-chat-interface')}
              iconName="MessageCircle"
              iconPosition="left"
            >
              Go to Chat
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/video-processing-dashboard')}
              iconName="Video"
              iconPosition="left"
            >
              Process Video
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/conversation-history-archive')}
              iconName="Archive"
              iconPosition="left"
            >
              View History
            </Button>
          </div>
        </div>
      </main>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <nav className="flex items-center justify-around py-2">
          <Link
            to="/main-chat-interface"
            className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Icon name="MessageCircle" size={16} />
            <span>Chat</span>
          </Link>
          <Link
            to="/video-processing-dashboard"
            className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Icon name="Video" size={16} />
            <span>Video</span>
          </Link>
          <div className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium text-primary">
            <Icon name="Mic" size={16} />
            <span>Record</span>
          </div>
          <Link
            to="/conversation-history-archive"
            className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Icon name="History" size={16} />
            <span>History</span>
          </Link>
          <Link
            to="/language-settings-preferences"
            className="flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Icon name="Settings" size={16} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AudioRecordingInterface;