import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ onSave, onReset, hasChanges }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (showResetConfirm) {
      onReset();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Save Changes</h3>
          <p className="text-sm text-muted-foreground">
            {hasChanges 
              ? "You have unsaved changes. Click save to apply your preferences." :"All changes are saved and up to date."
            }
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
            iconName={showResetConfirm ? "AlertTriangle" : "RotateCcw"}
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            {showResetConfirm ? "Confirm Reset" : "Reset to Default"}
          </Button>

          <Button
            variant="default"
            onClick={handleSave}
            loading={isSaving}
            disabled={!hasChanges}
            iconName="Save"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning-foreground">
            This will reset all language settings to their default values. This action cannot be undone.
          </p>
        </div>
      )}

      {hasChanges && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            Changes will be applied immediately and affect all future conversations and interactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;