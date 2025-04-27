import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '../constants';

const NotificationBadge = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      width: 12,
      height: 12,
      bgcolor: '#ef4444',
      borderRadius: '50%',
      animation: `${keyframes.pulse} 2s infinite`,
    }}
  />
);

export default NotificationBadge;
