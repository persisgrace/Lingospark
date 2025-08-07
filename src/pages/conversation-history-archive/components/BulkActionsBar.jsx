import React from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActionsBar = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onClearSelection, 
  onBulkExport, 
  onBulkDelete,
  isAllSelected 
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-card border border-border rounded-lg shadow-card-hover p-4 min-w-80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isAllSelected}
              onChange={onSelectAll}
              indeterminate={selectedCount > 0 && !isAllSelected}
            />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} of {totalCount} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;