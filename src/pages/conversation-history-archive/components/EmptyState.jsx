import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No conversations found
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
          No conversations match your current search criteria. Try adjusting your filters or search terms.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
        <Icon name="MessageCircle" size={24} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No conversations yet
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
        Start your first conversation to see your chat history here. All your text, voice, and video interactions will be saved automatically.
      </p>
      <Link to="/main-chat-interface">
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
        >
          Start New Conversation
        </Button>
      </Link>
    </div>
  );
};

export default EmptyState;