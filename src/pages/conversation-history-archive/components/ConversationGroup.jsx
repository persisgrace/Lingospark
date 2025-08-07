import React, { useState } from 'react';
import ConversationCard from './ConversationCard';
import Button from '../../../components/ui/Button';


const ConversationGroup = ({ 
  date, 
  conversations, 
  onExport, 
  onDelete, 
  onResume,
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const formatGroupDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })?.format(date);
    }
  };

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronDown" : "ChevronRight"}
          iconPosition="left"
          className="text-foreground font-medium"
        >
          {formatGroupDate(date)}
          <span className="ml-2 text-sm text-muted-foreground">
            ({conversations?.length} conversation{conversations?.length !== 1 ? 's' : ''})
          </span>
        </Button>
      </div>
      {/* Conversations List */}
      {isExpanded && (
        <div className="space-y-3 pl-4">
          {conversations?.map((conversation) => (
            <ConversationCard
              key={conversation?.id}
              conversation={conversation}
              onExport={onExport}
              onDelete={onDelete}
              onResume={onResume}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationGroup;