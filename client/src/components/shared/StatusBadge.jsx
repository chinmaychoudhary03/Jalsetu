import React from 'react';
import Badge from '../ui/Badge';

// Re-export Badge as StatusBadge for backward compatibility
const StatusBadge = ({ status, size = 'sm', className = '' }) => (
  <Badge status={status} size={size} className={className} />
);

export default StatusBadge;
