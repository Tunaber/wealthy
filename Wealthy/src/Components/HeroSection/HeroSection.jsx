import React from 'react';
import { Box, Typography, Fade } from '@mui/material';

const HeroSection = ({ isSmallScreen }) => (
  <Fade in timeout={500}>
    <Box sx={{ textAlign: 'center', mb: isSmallScreen ? 4 : 6, px: isSmallScreen ? 0 : 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <Box
          component="span"
          sx={{
            background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          Умное управление финансами
        </Box>
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" maxWidth="600px" margin="0 auto">
        Все необходимые инструменты для контроля ваших денег в одном месте
      </Typography>
    </Box>
  </Fade>
);

export default HeroSection;
