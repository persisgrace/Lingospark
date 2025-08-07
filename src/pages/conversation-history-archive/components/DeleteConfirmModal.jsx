import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  conversationCount = 1,
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  const isMultiple = conversationCount > 1;

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
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Delete Conversation{isMultiple ? 's' : ''}
            </h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {isMultiple ? `${conversationCount} conversations` : 'this conversation'}? 
            All messages, voice recordings, and video summaries will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={isDeleting}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete {isMultiple ? 'All' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;