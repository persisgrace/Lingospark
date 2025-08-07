import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  conversations, 
  onExport 
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'json', label: 'JSON (.json)', description: 'Structured data format' },
    { value: 'txt', label: 'Text (.txt)', description: 'Plain text format' },
    { value: 'pdf', label: 'PDF (.pdf)', description: 'Formatted document' },
    { value: 'csv', label: 'CSV (.csv)', description: 'Spreadsheet format' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData = {
        conversations,
        format: exportFormat,
        options: {
          includeMetadata,
          includeTimestamps
        },
        exportedAt: new Date()?.toISOString()
      };

      await onExport(exportData);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-card-hover w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Export Conversations
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isExporting}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Export Options */}
        <div className="space-y-4 mb-6">
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />

          <div className="space-y-3">
            <Checkbox
              label="Include metadata"
              description="Language info, timestamps, and conversation details"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e?.target?.checked)}
            />
            
            <Checkbox
              label="Include timestamps"
              description="Message timestamps and conversation dates"
              checked={includeTimestamps}
              onChange={(e) => setIncludeTimestamps(e?.target?.checked)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted rounded-lg p-3 mb-6">
          <div className="text-sm text-muted-foreground">
            <p>Exporting {conversations?.length} conversation{conversations?.length !== 1 ? 's' : ''}</p>
            <p>Format: {formatOptions?.find(f => f?.value === exportFormat)?.label}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;