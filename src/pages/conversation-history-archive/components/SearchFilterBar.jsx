import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const SearchFilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onClearFilters 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'ko', label: '🇰🇷 Korean' },
    { value: 'ja', label: '🇯🇵 Japanese' },
    { value: 'ru', label: '🇷🇺 Russian' },
    { value: 'tr', label: '🇹🇷 Turkish' },
    { value: 'es', label: '🇪🇸 Spanish' },
    { value: 'fr', label: '🇫🇷 French' },
    { value: 'de', label: '🇩🇪 German' },
    { value: 'zh', label: '🇨🇳 Chinese' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'text', label: 'Text Chat' },
    { value: 'voice', label: 'Voice Chat' },
    { value: 'video', label: 'Video Summary' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      {/* Main Search Bar */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search conversations, messages, or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Filters
        </Button>
      </div>
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              label="Language"
              options={languageOptions}
              value={filters?.language || ''}
              onChange={(value) => handleFilterChange('language', value)}
            />
            
            <Select
              label="Type"
              options={typeOptions}
              value={filters?.type || ''}
              onChange={(value) => handleFilterChange('type', value)}
            />
            
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters?.dateRange || ''}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
          </div>

          {/* Custom Date Range */}
          {filters?.dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="date"
                label="From Date"
                value={filters?.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
              />
              <Input
                type="date"
                label="To Date"
                value={filters?.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
              />
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {Object.values(filters)?.filter(Boolean)?.length > 0 && (
                <span>Active filters: {Object.values(filters)?.filter(Boolean)?.length}</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;