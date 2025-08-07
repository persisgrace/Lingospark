import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import VideoUploadZone from './components/VideoUploadZone';

import FilterControls from './components/FilterControls';
import ProcessingQueue from './components/ProcessingQueue';
import StatsOverview from './components/StatsOverview';
import ExportShareComponent from '../../components/ui/ExportShareComponent';
import Icon from '../../components/AppIcon';

const VideoProcessingDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock video data
  const mockVideos = [
    {
      id: 1,
      filename: "presentation_demo.mp4",
      size: 45678912,
      duration: 180,
      uploadedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 1800000),
      status: "completed",
      progress: 100,
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
      summary: `This presentation covers the fundamentals of artificial intelligence and machine learning. The speaker discusses various AI applications in business, including natural language processing, computer vision, and predictive analytics.\n\nKey topics covered:\n• Introduction to AI and ML concepts\n• Real-world business applications\n• Implementation strategies\n• Future trends and opportunities\n\nThe presentation concludes with a Q&A session addressing common concerns about AI adoption in enterprise environments.`,
      summaryLanguage: "en"
    },
    {
      id: 2,
      filename: "meeting_recording.webm",
      size: 123456789,
      duration: 3600,
      uploadedAt: new Date(Date.now() - 1800000),
      status: "processing",
      progress: 65,
      estimatedTime: "5 minutes",
      thumbnail: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      filename: "tutorial_video.mov",
      size: 87654321,
      duration: 900,
      uploadedAt: new Date(Date.now() - 900000),
      status: "uploading",
      progress: 35,
      thumbnail: "https://images.pixabay.com/photo/2016/02/01/00/56/news-1172463_1280.jpg?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      filename: "conference_keynote.mp4",
      size: 234567890,
      duration: 2700,
      uploadedAt: new Date(Date.now() - 7200000),
      status: "error",
      progress: 0,
      errorMessage: "Unsupported codec format. Please convert to a supported format.",
      thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      filename: "product_launch.avi",
      size: 156789012,
      duration: 1800,
      uploadedAt: new Date(Date.now() - 14400000),
      completedAt: new Date(Date.now() - 10800000),
      status: "completed",
      progress: 100,
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=300&h=200&fit=crop",
      summary: `Product launch event showcasing the new AI-powered analytics platform. The presentation includes live demonstrations of key features, customer testimonials, and pricing information.\n\nHighlights:\n• Advanced data visualization capabilities\n• Real-time analytics dashboard\n• Integration with popular business tools\n• Competitive pricing structure\n\nThe event concluded with a successful Q&A session and positive feedback from attendees.`,
      summaryLanguage: "en"
    }
  ];

  useEffect(() => {
    setVideos(mockVideos);
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleFileUpload = async (files) => {
    setIsUploading(true);

    try {
      const newVideos = files?.map((file, index) => ({
        id: Date.now() + index,
        filename: file?.name,
        size: file?.size,
        uploadedAt: new Date(),
        status: 'uploading',
        progress: 0,
        thumbnail: null
      }));

      setVideos(prev => [...newVideos, ...prev]);

      // Simulate upload progress
      for (const video of newVideos) {
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setVideos(prev => prev?.map(v => 
            v?.id === video?.id ? { ...v, progress } : v
          ));
        }

        // Change status to processing
        setVideos(prev => prev?.map(v => 
          v?.id === video?.id 
            ? { ...v, status: 'processing', progress: 0, estimatedTime: '3-5 minutes' }
            : v
        ));

        // Simulate processing
        for (let progress = 0; progress <= 100; progress += 15) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setVideos(prev => prev?.map(v => 
            v?.id === video?.id ? { ...v, progress } : v
          ));
        }

        // Complete processing
        setVideos(prev => prev?.map(v => 
          v?.id === video?.id 
            ? { 
                ...v, 
                status: 'completed', 
                progress: 100,
                completedAt: new Date(),
                summary: `AI-generated summary for ${video?.filename}. This video contains important information that has been processed and analyzed using advanced machine learning algorithms.\n\nKey points identified:\n• Main topics and themes\n• Important timestamps and segments\n• Action items and conclusions\n\nThe summary is available in multiple languages and can be exported in various formats.`,
                summaryLanguage: currentLanguage
              }
            : v
        ));
      }

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = (videoId) => {
    setVideos(prev => prev?.filter(v => v?.id !== videoId));
  };

  const handleLanguageChange = (videoId, language) => {
    setVideos(prev => prev?.map(v => 
      v?.id === videoId 
        ? { 
            ...v, 
            summaryLanguage: language,
            summary: `[Translated to ${language}] ${v?.summary}`
          }
        : v
    ));
  };

  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleExport = (video) => {
    const exportData = {
      filename: video?.filename,
      summary: video?.summary,
      language: video?.summaryLanguage,
      uploadedAt: video?.uploadedAt,
      completedAt: video?.completedAt
    };

    // Use the ExportShareComponent functionality
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${video?.filename}_summary.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredVideos = videos?.filter(video => {
    if (statusFilter === 'all') return true;
    return video?.status === statusFilter;
  });

  const sortedVideos = [...filteredVideos]?.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      case 'name':
        return a?.filename?.localeCompare(b?.filename);
      case 'size':
        return (b?.size || 0) - (a?.size || 0);
      case 'status':
        return a?.status?.localeCompare(b?.status);
      default: // newest
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    }
  });

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-18">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link to="/main-chat-interface" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">Video Processing</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Video Processing Dashboard
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Upload, process, and manage your video content with AI-powered summarization 
                across multiple languages. Get instant insights and summaries from your video files.
              </p>
            </div>

            <div className="mt-4 lg:mt-0">
              <ExportShareComponent
                data={sortedVideos}
                filename="video_processing_report"
                showFormats={['json', 'csv', 'txt']}
                className="justify-end"
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <StatsOverview videos={videos} />
          </div>

          {/* Upload Zone */}
          <div className="mb-8">
            <VideoUploadZone 
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
          </div>

          {/* Filter Controls */}
          {videos?.length > 0 && (
            <div className="mb-6">
              <FilterControls
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearAll={handleClearFilters}
                totalVideos={videos?.length}
                filteredCount={filteredVideos?.length}
              />
            </div>
          )}

          {/* Processing Queue */}
          <ProcessingQueue
            videos={sortedVideos}
            onDeleteVideo={handleDeleteVideo}
            onLanguageChange={handleLanguageChange}
            onCopyToClipboard={handleCopyToClipboard}
            onExport={handleExport}
          />
        </div>
      </main>
    </div>
  );
};

export default VideoProcessingDashboard;