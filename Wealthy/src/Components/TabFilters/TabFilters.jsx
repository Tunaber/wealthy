import React from 'react';
import { Box, Chip } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const TabFilters = ({ activeTab, setActiveTab }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, flexWrap: 'wrap', gap: 1 }}>
    <Chip
      label="Все функции"
      onClick={() => setActiveTab('all')}
      color={activeTab === 'all' ? 'primary' : 'default'}
      variant={activeTab === 'all' ? 'filled' : 'outlined'}
      clickable
    />
    <Chip
      label="Финансы"
      onClick={() => setActiveTab('finance')}
      color={activeTab === 'finance' ? 'primary' : 'default'}
      variant={activeTab === 'finance' ? 'filled' : 'outlined'}
      clickable
      icon={<TrendingUp fontSize="small" />}
    />
    <Chip
      label="Инструменты"
      onClick={() => setActiveTab('tools')}
      color={activeTab === 'tools' ? 'primary' : 'default'}
      variant={activeTab === 'tools' ? 'filled' : 'outlined'}
      clickable
    />
  </Box>
);

export default TabFilters;
