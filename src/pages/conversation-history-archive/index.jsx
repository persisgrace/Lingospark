import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import SearchFilterBar from './components/SearchFilterBar';
import ConversationGroup from './components/ConversationGroup';
import BulkActionsBar from './components/BulkActionsBar';
import ExportModal from './components/ExportModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EmptyState from './components/EmptyState';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ConversationHistoryArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedConversations, setSelectedConversations] = useState(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock conversation data
  const mockConversations = [
    {
      id: 'conv-001',
      title: 'Business Meeting Translation',
      type: 'text',
      timestamp: new Date('2025-01-07T10:30:00'),
      preview: `Hello, I need help translating this business proposal from English to Korean. The document contains technical terms about AI and machine learning.`,
      languages: ['en', 'ko'],
      messageCount: 24,
      duration: '15 min'
    },
    {
      id: 'conv-002',
      title: 'Voice Recipe Translation',
      type: 'voice',
      timestamp: new Date('2025-01-07T08:15:00'),
      preview: `Voice recording about traditional Japanese cooking techniques, translated to English with cultural context explanations.`,
      languages: ['ja', 'en'],
      messageCount: 8,
      duration: '8 min'
    },
    {
      id: 'conv-003',
      title: 'Marketing Video Summary',
      type: 'video',
      timestamp: new Date('2025-01-06T16:45:00'),
      preview: `Summarized a 45-minute marketing presentation video in Russian, providing key points and action items in English.`,
      languages: ['ru', 'en'],
      messageCount: 12,
      duration: '45 min'
    },
    {
      id: 'conv-004',
      title: 'Technical Documentation',
      type: 'text',
      timestamp: new Date('2025-01-06T14:20:00'),
      preview: `Translated software documentation from German to Turkish, focusing on API integration and security protocols.`,
      languages: ['de', 'tr'],
      messageCount: 31,
      duration: '22 min'
    },
    {
      id: 'conv-005',
      title: 'Customer Support Chat',
      type: 'text',
      timestamp: new Date('2025-01-05T11:30:00'),
      preview: `Multilingual customer support conversation helping resolve billing issues across English and Spanish.`,
      languages: ['en', 'es'],
      messageCount: 18,
      duration: '12 min'
    },
    {
      id: 'conv-006',
      title: 'Educational Content Voice',
      type: 'voice',
      timestamp: new Date('2025-01-05T09:15:00'),
      preview: `Voice-based learning session about French literature, with real-time translation and cultural explanations.`,
      languages: ['fr', 'en'],
      messageCount: 15,
      duration: '25 min'
    },
    {
      id: 'conv-007',
      title: 'News Video Analysis',
      type: 'video',
      timestamp: new Date('2025-01-04T19:30:00'),
      preview: `Analyzed Chinese news broadcast, providing summary and key insights translated to English with context.`,
      languages: ['zh', 'en'],
      messageCount: 9,
      duration: '30 min'
    },
    {
      id: 'conv-008',
      title: 'Legal Document Review',
      type: 'text',
      timestamp: new Date('2025-01-04T13:45:00'),
      preview: `Reviewed and translated legal contract terms from Turkish to English, highlighting important clauses and obligations.`,
      languages: ['tr', 'en'],
      messageCount: 27,
      duration: '35 min'
    }
  ];

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail?.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    let filtered = mockConversations;

    // Apply search query
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(conv => 
        conv?.title?.toLowerCase()?.includes(query) ||
        conv?.preview?.toLowerCase()?.includes(query) ||
        conv?.languages?.some(lang => lang?.toLowerCase()?.includes(query))
      );
    }

    // Apply filters
    if (filters?.language) {
      filtered = filtered?.filter(conv => 
        conv?.languages?.includes(filters?.language)
      );
    }

    if (filters?.type) {
      filtered = filtered?.filter(conv => conv?.type === filters?.type);
    }

    if (filters?.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(conv => conv?.timestamp >= filterDate);
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          filtered = filtered?.filter(conv => conv?.timestamp >= filterDate);
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          filtered = filtered?.filter(conv => conv?.timestamp >= filterDate);
          break;
        case 'quarter':
          filterDate?.setMonth(now?.getMonth() - 3);
          filtered = filtered?.filter(conv => conv?.timestamp >= filterDate);
          break;
      }
    }

    return filtered?.sort((a, b) => b?.timestamp - a?.timestamp);
  }, [searchQuery, filters]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const groups = {};
    
    filteredConversations?.forEach(conv => {
      const dateKey = conv?.timestamp?.toDateString();
      if (!groups?.[dateKey]) {
        groups[dateKey] = [];
      }
      groups?.[dateKey]?.push(conv);
    });

    return Object.entries(groups)?.sort(([a], [b]) => 
      new Date(b) - new Date(a)
    );
  }, [filteredConversations]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
  };

  const handleSelectConversation = (conversationId, selected) => {
    const newSelected = new Set(selectedConversations);
    if (selected) {
      newSelected?.add(conversationId);
    } else {
      newSelected?.delete(conversationId);
    }
    setSelectedConversations(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedConversations?.size === filteredConversations?.length) {
      setSelectedConversations(new Set());
    } else {
      setSelectedConversations(new Set(filteredConversations.map(c => c.id)));
    }
  };

  const handleBulkExport = () => {
    const selectedConvs = filteredConversations?.filter(c => 
      selectedConversations?.has(c?.id)
    );
    setShowExportModal(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget('bulk');
    setShowDeleteModal(true);
  };

  const handleDeleteConversation = (conversationId) => {
    setDeleteTarget(conversationId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // In a real app, this would make an API call
    console.log('Deleting:', deleteTarget);
    setShowDeleteModal(false);
    setDeleteTarget(null);
    if (deleteTarget === 'bulk') {
      setSelectedConversations(new Set());
    }
  };

  const handleExportConversation = (conversation) => {
    // In a real app, this would trigger the export
    console.log('Exporting conversation:', conversation);
  };

  const handleExport = async (exportData) => {
    // In a real app, this would handle the actual export
    console.log('Exporting data:', exportData);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversations-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = searchQuery?.trim() || Object.values(filters)?.some(Boolean);
  const isAllSelected = selectedConversations?.size === filteredConversations?.length && filteredConversations?.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 lg:pt-24">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="space-y-4">
                {[1, 2, 3]?.map(i => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Conversation History Archive - MultiLingual AI</title>
        <meta name="description" content="Browse and manage your multilingual chat history, voice recordings, and video summaries" />
      </Helmet>
      <Header />
      <div className="pt-20 lg:pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <span>Chat</span>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">History</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Conversation History
              </h1>
              <p className="text-muted-foreground">
                Browse and manage your multilingual conversations
              </p>
            </div>
            
            {filteredConversations?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                iconName="Download"
                iconPosition="left"
              >
                Export All
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Results Count */}
          {filteredConversations?.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredConversations?.length} conversation{filteredConversations?.length !== 1 ? 's' : ''} found
              </p>
              {selectedConversations?.size > 0 && (
                <p className="text-sm text-primary">
                  {selectedConversations?.size} selected
                </p>
              )}
            </div>
          )}

          {/* Conversations List */}
          {filteredConversations?.length > 0 ? (
            <div className="space-y-6">
              {groupedConversations?.map(([date, conversations]) => (
                <ConversationGroup
                  key={date}
                  date={date}
                  conversations={conversations}
                  onExport={handleExportConversation}
                  onDelete={handleDeleteConversation}
                  onResume={(id) => console.log('Resume conversation:', id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </div>
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedConversations?.size}
        totalCount={filteredConversations?.length}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedConversations(new Set())}
        onBulkExport={handleBulkExport}
        onBulkDelete={handleBulkDelete}
        isAllSelected={isAllSelected}
      />
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        conversations={selectedConversations?.size > 0 
          ? filteredConversations?.filter(c => selectedConversations?.has(c?.id))
          : filteredConversations
        }
        onExport={handleExport}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        conversationCount={deleteTarget === 'bulk' ? selectedConversations?.size : 1}
      />
    </div>
  );
};

export default ConversationHistoryArchive;