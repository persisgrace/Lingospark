import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ videos }) => {
  const stats = {
    total: videos?.length,
    uploading: videos?.filter(v => v?.status === 'uploading')?.length,
    processing: videos?.filter(v => v?.status === 'processing')?.length,
    completed: videos?.filter(v => v?.status === 'completed')?.length,
    error: videos?.filter(v => v?.status === 'error')?.length,
  };

  const totalSize = videos?.reduce((acc, video) => acc + (video?.size || 0), 0);
  const completedToday = videos?.filter(v => 
    v?.status === 'completed' && 
    new Date(v.completedAt || v.uploadedAt)?.toDateString() === new Date()?.toDateString()
  )?.length;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const statCards = [
    {
      label: 'Total Videos',
      value: stats?.total,
      icon: 'Video',
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      label: 'Processing',
      value: stats?.processing,
      icon: 'Loader2',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      iconClass: 'animate-spin',
    },
    {
      label: 'Completed',
      value: stats?.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Storage Used',
      value: formatFileSize(totalSize),
      icon: 'HardDrive',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {stat?.label}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {stat?.value}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon 
                name={stat?.icon} 
                size={20} 
                className={`${stat?.color} ${stat?.iconClass || ''}`} 
              />
            </div>
          </div>

          {/* Additional Info */}
          {index === 3 && stats?.total > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Avg: {formatFileSize(totalSize / stats?.total)} per video
              </p>
            </div>
          )}

          {index === 2 && completedToday > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {completedToday} completed today
              </p>
            </div>
          )}

          {index === 1 && stats?.uploading > 0 && (
            <div className="mt-2 pt-2 border-border">
              <p className="text-xs text-muted-foreground">
                {stats?.uploading} uploading
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;