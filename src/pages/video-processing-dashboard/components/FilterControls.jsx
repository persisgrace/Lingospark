import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ 
  statusFilter, 
  onStatusFilterChange, 
  sortBy, 
  onSortChange, 
  onClearAll,
  totalVideos,
  filteredCount 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'uploading', label: 'Uploading' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'error', label: 'Error' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'size', label: 'File Size' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filter by status"
            />
          </div>

          {/* Sort Options */}
          <div className="w-full sm:w-40">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Sort by"
            />
          </div>

          {/* Clear Filters */}
          {(statusFilter !== 'all' || sortBy !== 'newest') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Right Section - Stats and Actions */}
        <div className="flex items-center justify-between sm:justify-end space-x-4">
          {/* Video Count */}
          <div className="text-sm text-muted-foreground">
            {filteredCount !== totalVideos ? (
              <span>
                Showing {filteredCount} of {totalVideos} videos
              </span>
            ) : (
              <span>
                {totalVideos} {totalVideos === 1 ? 'video' : 'videos'}
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            title="Refresh"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Grid view"
            >
              <Icon name="Grid3X3" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="List view"
            >
              <Icon name="List" size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {(statusFilter !== 'all' || sortBy !== 'newest') && (
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          
          {statusFilter !== 'all' && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <span>Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}</span>
              <button
                onClick={() => onStatusFilterChange('all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {sortBy !== 'newest' && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <span>Sort: {sortOptions?.find(opt => opt?.value === sortBy)?.label}</span>
              <button
                onClick={() => onSortChange('newest')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;