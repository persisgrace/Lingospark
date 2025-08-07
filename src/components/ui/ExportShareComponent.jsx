import React, { useState } from 'react';
import Button from './Button';
import Select from './Select';
import Icon from '../AppIcon';

const ExportShareComponent = ({ 
  data, 
  filename = 'export', 
  className = '',
  showFormats = ['txt', 'json', 'pdf'],
  onExport,
  onShare 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('txt');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const formatOptions = [
    { value: 'txt', label: 'Text (.txt)', description: 'Plain text format' },
    { value: 'json', label: 'JSON (.json)', description: 'Structured data format' },
    { value: 'pdf', label: 'PDF (.pdf)', description: 'Portable document format' },
    { value: 'csv', label: 'CSV (.csv)', description: 'Comma-separated values' },
    { value: 'md', label: 'Markdown (.md)', description: 'Markdown format' },
  ]?.filter(option => showFormats?.includes(option?.value));

  const handleExport = async () => {
    if (!data) return;

    setIsExporting(true);
    
    try {
      let content = '';
      let mimeType = 'text/plain';
      let fileExtension = selectedFormat;

      switch (selectedFormat) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          mimeType = 'application/json';
          break;
        case 'csv':
          if (Array.isArray(data)) {
            const headers = Object.keys(data?.[0] || {});
            const csvContent = [
              headers?.join(','),
              ...data?.map(row => headers?.map(header => `"${row?.[header] || ''}"`)?.join(','))
            ]?.join('\n');
            content = csvContent;
          } else {
            content = JSON.stringify(data);
          }
          mimeType = 'text/csv';
          break;
        case 'md':
          content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
          mimeType = 'text/markdown';
          break;
        case 'pdf':
          // For PDF, we would typically use a library like jsPDF
          // For now, fallback to text
          content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
          mimeType = 'text/plain';
          fileExtension = 'txt';
          break;
        default:
          content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${fileExtension}`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

      if (onExport) {
        onExport(selectedFormat, content);
      }

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!data) return;

    setIsSharing(true);

    try {
      const shareText = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      
      if (navigator.share) {
        await navigator.share({
          title: filename,
          text: shareText,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard?.writeText(shareText);
        // You might want to show a toast notification here
      }

      if (onShare) {
        onShare(shareText);
      }

    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!data) return;

    try {
      const textToCopy = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      await navigator.clipboard?.writeText(textToCopy);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Format Selector */}
      <div className="w-32">
        <Select
          options={formatOptions}
          value={selectedFormat}
          onChange={setSelectedFormat}
          placeholder="Format"
        />
      </div>

      {/* Export Button */}
      <Button
        variant="outline"
        onClick={handleExport}
        loading={isExporting}
        disabled={!data || isExporting}
        iconName="Download"
        iconPosition="left"
      >
        Export
      </Button>

      {/* Share Button */}
      <Button
        variant="outline"
        onClick={handleShare}
        loading={isSharing}
        disabled={!data || isSharing}
        iconName="Share"
        iconPosition="left"
      >
        Share
      </Button>

      {/* Copy Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopyToClipboard}
        disabled={!data}
        title="Copy to clipboard"
      >
        <Icon name="Copy" size={16} />
      </Button>
    </div>
  );
};

export default ExportShareComponent;