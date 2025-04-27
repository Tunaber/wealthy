import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { FACTS } from '../constants';

const StatsBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('left');

  const handleNext = useCallback(() => {
    setDirection('left');
    setActiveIndex((prev) => (prev + 1) % FACTS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection('right');
    setActiveIndex((prev) => (prev - 1 + FACTS.length) % FACTS.length);
  }, []);

  const handleDotClick = useCallback(
    (index) => {
      setDirection(index > activeIndex ? 'left' : 'right');
      setActiveIndex(index);
    },
    [activeIndex],
  );

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        minHeight: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', position: 'relative', height: '100%', alignItems: 'center' }}>
        {FACTS.map((fact, index) => (
          <Box
            key={fact.id}
            sx={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              transition: 'opacity 300ms, transform 500ms',
              opacity: activeIndex === index ? 1 : 0,
              transform: `translateX(${
                activeIndex === index
                  ? 0
                  : direction === 'left'
                  ? index > activeIndex
                    ? '100%'
                    : '-100%'
                  : index < activeIndex
                  ? '-100%'
                  : '100%'
              })`,
              pointerEvents: activeIndex === index ? 'auto' : 'none',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500, color: fact.color }}>
              {fact.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        {FACTS.map((fact, index) => (
          <Box
            key={fact.id}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: activeIndex === index ? fact.color : 'action.disabledBackground',
              cursor: 'pointer',
              transition: 'background-color 300ms',
              '&:hover': { transform: 'scale(1.2)' },
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.secondary',
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.secondary',
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default StatsBanner;
