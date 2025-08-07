import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatMessage from './components/ChatMessage';
import InputModeSelector from './components/InputModeSelector';
import TextInputArea from './components/TextInputArea';
import VoiceInputArea from './components/VoiceInputArea';
import VideoUploadArea from './components/VideoUploadArea';
import GoogleTranslateTextMode from './components/GoogleTranslateTextMode';
import LanguageSelector from './components/LanguageSelector';
import ChatActions from './components/ChatActions';
import ProcessingStatusIndicator from '../../components/ui/ProcessingStatusIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MainChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMode, setInputMode] = useState('text');
  const [inputLanguage, setInputLanguage] = useState('en');
  const [outputLanguage, setOutputLanguage] = useState('te');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processingMessage, setProcessingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mock conversation data
  const mockMessages = [
    {
      id: 1,
      sender: 'ai',
      type: 'text',
      content: `Hello! I'm your multilingual AI assistant. I can help you with:\n\n• Text conversations in multiple languages\n• Voice message transcription and translation\n• Video content summarization\n• Real-time language translation\n\nHow can I assist you today?`,timestamp: new Date(Date.now() - 300000),language: 'English'
    },
    {
      id: 2,
      sender: 'user',type: 'text',content: 'Can you help me translate some text from English to Telugu?',timestamp: new Date(Date.now() - 240000),language: 'English'
    },
    {
      id: 3,
      sender: 'ai',type: 'text',content: `Of course! I'd be happy to help you translate text from English to Telugu. Please use the translation interface below to type your text and get instant translations.\n\nమీరు ఇంగ్లీష్ నుంచి తెలుగులోకి అనువాదం కావాలంటే దయచేసి క్రింద ఉన్న ట్రాన్స్లేషన్ ఇంటర్ఫేస్ వాడండి!`,
      timestamp: new Date(Date.now() - 180000),
      language: 'English/Telugu'
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    const savedInputLanguage = localStorage.getItem('selectedInputLanguage') || 'en';
    const savedOutputLanguage = localStorage.getItem('selectedOutputLanguage') || 'te';
    
    setInputLanguage(savedInputLanguage);
    setOutputLanguage(savedOutputLanguage);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userMessage, messageType = 'text') => {
    setIsProcessing(true);
    setProcessingStatus('processing');
    setProcessingMessage('AI is thinking...');

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let aiResponse = '';
    
    if (messageType === 'text') {
      aiResponse = `I understand you're communicating in ${getLanguageName(inputLanguage)}. Here's my response:\n\nThank you for your message. I've processed your text and can provide assistance in multiple languages. Would you like me to translate this to ${getLanguageName(outputLanguage)} or help you with something specific?`;
    } else if (messageType === 'audio') {
      aiResponse = `I've processed your voice message successfully. The audio was clear and I've transcribed it accurately. Here's what I understood and my response:\n\nYour voice message has been processed and I can provide responses in your preferred language.`;
    } else if (messageType === 'video') {
      aiResponse = `Video Summary:\n\nI've analyzed your video content and here's a comprehensive summary:\n\n• Video Duration: Approximately 2-3 minutes\n• Main Topics: Educational content about language learning\n• Key Points: Discussion of multilingual communication benefits\n• Language Detected: ${getLanguageName(inputLanguage)}\n\nThe video contains valuable information about cross-cultural communication and language learning strategies.`;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'ai',
      type: 'text',
      content: aiResponse,
      timestamp: new Date(),
      language: getLanguageName(outputLanguage)
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(false);
    setProcessingStatus('success');
    setProcessingMessage('Response generated successfully');
    
    setTimeout(() => {
      setProcessingStatus('idle');
      setProcessingMessage('');
    }, 2000);
  };

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'te': 'Telugu',
      'ko': 'Korean',
      'ja': 'Japanese',
      'ru': 'Russian',
      'tr': 'Turkish',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'it': 'Italian',
      'nl': 'Dutch'
    };
    return languages?.[code] || 'Unknown';
  };

  const handleSendMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: message,
      timestamp: new Date(),
      language: getLanguageName(inputLanguage)
    };

    setMessages(prev => [...prev, userMessage]);
    await generateAIResponse(message, 'text');
  };

  const handleSendAudio = async (audioBlob, duration) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'audio',
      audioUrl: audioUrl,
      transcription: 'This is a sample transcription of the voice message.',
      timestamp: new Date(),
      language: getLanguageName(inputLanguage)
    };

    setMessages(prev => [...prev, userMessage]);
    await generateAIResponse('Voice message', 'audio');
  };

  const handleVideoUpload = async (videoFile) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'video',
      videoFile: videoFile,
      timestamp: new Date(),
      language: getLanguageName(inputLanguage)
    };

    setMessages(prev => [...prev, userMessage]);
    await generateAIResponse('Video content', 'video');
  };

  const handleCopyMessage = (messageId) => {
    // Handle copy functionality
    console.log('Copied message:', messageId);
  };

  const handleRegenerateMessage = async (messageId) => {
    const message = messages?.find(m => m?.id === messageId);
    if (message) {
      await generateAIResponse('Regenerate response', 'text');
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setProcessingStatus('idle');
    setProcessingMessage('');
  };

  const handleExportChat = () => {
    const chatData = messages?.map(msg => ({
      sender: msg?.sender,
      content: msg?.content,
      timestamp: msg?.timestamp,
      language: msg?.language
    }));
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleInputLanguageChange = (newLanguage) => {
    setInputLanguage(newLanguage);
    localStorage.setItem('selectedInputLanguage', newLanguage);
  };

  const handleOutputLanguageChange = (newLanguage) => {
    setOutputLanguage(newLanguage);
    localStorage.setItem('selectedOutputLanguage', newLanguage);
  };

  const renderInputArea = () => {
    switch (inputMode) {
      case 'text':
        return (
          <GoogleTranslateTextMode
            inputLanguage={inputLanguage}
            outputLanguage={outputLanguage}
            onInputLanguageChange={handleInputLanguageChange}
            onOutputLanguageChange={handleOutputLanguageChange}
            onSendMessage={handleSendMessage}
            disabled={isProcessing}
          />
        );
      case 'voice':
        return (
          <VoiceInputArea
            onSendAudio={handleSendAudio}
            disabled={isProcessing}
          />
        );
      case 'video':
        return (
          <VideoUploadArea
            onVideoUpload={handleVideoUpload}
            disabled={isProcessing}
          />
        );
      default:
        return (
          <TextInputArea
            onSendMessage={handleSendMessage}
            disabled={isProcessing}
            placeholder={`Type your message in ${getLanguageName(inputLanguage)}...`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-18 h-screen flex flex-col">
        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
          {/* Top Navigation Bar */}
          {inputMode !== 'text' && (
            <div className="flex items-center justify-between p-4 bg-card border-b border-border">
              <div className="flex items-center space-x-4">
                <LanguageSelector
                  label="Input Language"
                  value={inputLanguage}
                  onChange={handleInputLanguageChange}
                  className="w-40"
                  disabled={isProcessing}
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const temp = inputLanguage;
                    handleInputLanguageChange(outputLanguage);
                    handleOutputLanguageChange(temp);
                  }}
                  disabled={isProcessing}
                  title="Swap languages"
                >
                  <Icon name="ArrowLeftRight" size={16} />
                </Button>
                
                <LanguageSelector
                  label="Output Language"
                  value={outputLanguage}
                  onChange={handleOutputLanguageChange}
                  className="w-40"
                  disabled={isProcessing}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Link to="/conversation-history-archive">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="History"
                    iconPosition="left"
                  >
                    <span className="hidden sm:inline">History</span>
                  </Button>
                </Link>
                
                <Link to="/language-settings-preferences">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    iconPosition="left"
                  >
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Chat Messages Area - Show only when not in text mode */}
          {inputMode !== 'text' && (
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages?.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Icon name="MessageSquare" size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Start a Conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose your input method below and start chatting with the AI assistant in your preferred language.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages?.map((message) => (
                    <ChatMessage
                      key={message?.id}
                      message={message}
                      onCopy={handleCopyMessage}
                      onRegenerate={handleRegenerateMessage}
                    />
                  ))}
                  
                  {/* Processing Status */}
                  <ProcessingStatusIndicator
                    status={processingStatus}
                    message={processingMessage}
                    className="mx-auto max-w-md"
                  />
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className={`border-t border-border bg-card ${inputMode === 'text' ? 'flex-1 p-6' : ''}`}>
            {inputMode === 'text' ? (
              // Google Translate Mode - Full Screen
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Translation Interface</h2>
                  <div className="flex items-center space-x-2">
                    <Link to="/conversation-history-archive">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="History"
                        iconPosition="left"
                      >
                        <span className="hidden sm:inline">History</span>
                      </Button>
                    </Link>
                    
                    <Link to="/language-settings-preferences">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Settings"
                        iconPosition="left"
                      >
                        <span className="hidden sm:inline">Settings</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="flex-1">
                  {renderInputArea()}
                </div>
              </div>
            ) : (
              // Traditional Chat Mode
              <div className="p-4 space-y-4">
                <InputModeSelector
                  currentMode={inputMode}
                  onModeChange={setInputMode}
                  disabled={isProcessing}
                />
                
                {renderInputArea()}
              </div>
            )}
            
            {/* Chat Actions - Only show in non-text modes */}
            {inputMode !== 'text' && (
              <ChatActions
                onClearHistory={handleClearHistory}
                onExportChat={handleExportChat}
                onToggleSettings={() => {}}
                messageCount={messages?.length}
                disabled={isProcessing}
              />
            )}
          </div>
          
          {/* Mode Selector for Text Mode */}
          {inputMode === 'text' && (
            <div className="border-t border-border bg-muted/30 p-4">
              <InputModeSelector
                currentMode={inputMode}
                onModeChange={setInputMode}
                disabled={isProcessing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainChatInterface;