import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LanguageSettingsPreferences from './pages/language-settings-preferences';
import ConversationHistoryArchive from './pages/conversation-history-archive';
import VideoProcessingDashboard from './pages/video-processing-dashboard';
import MainChatInterface from './pages/main-chat-interface';
import AudioRecordingInterface from './pages/audio-recording-interface';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AudioRecordingInterface />} />
        <Route path="/language-settings-preferences" element={<LanguageSettingsPreferences />} />
        <Route path="/conversation-history-archive" element={<ConversationHistoryArchive />} />
        <Route path="/video-processing-dashboard" element={<VideoProcessingDashboard />} />
        <Route path="/main-chat-interface" element={<MainChatInterface />} />
        <Route path="/audio-recording-interface" element={<AudioRecordingInterface />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
