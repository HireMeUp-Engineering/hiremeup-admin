import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Queue,
  Star,
  Visibility,
  Done,
  Work,
} from '@mui/icons-material';

export type StatusType =
  | 'published' | 'active' | 'completed' | 'hired' | 'shortlisted'
  | 'pending' | 'in_review' | 'in_queue' | 'scheduled' | 'in_progress'
  | 'rejected' | 'cancelled' | 'draft' | 'archived'
  | 'reviewed';

interface EnhancedChipProps {
  status: StatusType | string;
  label?: string;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG: Record<string, { bg: string; icon: any }> = {
  // Positive
  published: { bg: '#4caf50', icon: CheckCircle },
  active: { bg: '#4caf50', icon: CheckCircle },
  completed: { bg: '#00c853', icon: Done },
  hired: { bg: '#00c853', icon: Work },
  shortlisted: { bg: '#4caf50', icon: Star },

  // In-progress
  pending: { bg: '#ff9800', icon: HourglassEmpty },
  in_review: { bg: '#ff9800', icon: Visibility },
  in_queue: { bg: '#2196f3', icon: Queue },
  scheduled: { bg: '#2196f3', icon: Queue },
  in_progress: { bg: '#ff9800', icon: HourglassEmpty },

  // Negative
  rejected: { bg: '#f44336', icon: Cancel },
  cancelled: { bg: '#f44336', icon: Cancel },
  draft: { bg: '#757575', icon: null },
  archived: { bg: '#757575', icon: null },

  // Neutral
  reviewed: { bg: '#9c27b0', icon: Visibility },
};

export const EnhancedChip: React.FC<EnhancedChipProps> = ({ status, label, size = 'small' }) => {
  const config = STATUS_CONFIG[status] || { bg: '#757575', icon: null };
  const displayLabel = label || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const IconComponent = config.icon;

  return (
    <Chip
      label={displayLabel}
      size={size}
      icon={IconComponent ? <IconComponent sx={{ fontSize: 16 }} /> : undefined}
      sx={{
        bgcolor: config.bg,
        color: '#ffffff',
        fontWeight: 500,
        '& .MuiChip-icon': {
          color: '#ffffff',
          marginLeft: '8px',
        },
      }}
    />
  );
};
