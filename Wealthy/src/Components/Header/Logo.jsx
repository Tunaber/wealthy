import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { keyframes } from '../constants';

const Logo = ({ onClick }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mr: 4,
      cursor: 'pointer',
      animation: `${keyframes.fadeIn} 0.5s ease-out`,
      '&:hover': {
        '& .logo-avatar': {
          transform: 'rotate(15deg)',
        },
      },
    }}
    onClick={onClick}
  >
    <Avatar
      className="logo-avatar"
      sx={{
        bgcolor: 'primary.main',
        width: 40,
        height: 40,
        mr: 2,
        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
        transition: 'transform 0.3s ease',
      }}
    >
      W
    </Avatar>
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 700,
        letterSpacing: '-0.5px',
        background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      Welphy
    </Typography>
  </Box>
);

export default Logo;
