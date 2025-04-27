import React, { useState, useMemo } from 'react';
import { Container, Grid, Box, useMediaQuery } from '@mui/material';
import Header from '../Header/Header';
import HeroSection from '../HeroSection/HeroSection';
import StatsBanner from '../StatsBanner/StatsBanner';
import TabFilters from '../TabFilters/TabFilters';
import FeatureCard from '../FeatureCard/FeatureCard';
import { FEATURES } from '../constants';

const MainPage = () => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFeatures = useMemo(() => {
    return activeTab === 'all'
      ? FEATURES
      : FEATURES.filter((feature) => feature.category === activeTab);
  }, [activeTab]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: isSmallScreen ? 4 : 6 }}>
        <HeroSection isSmallScreen={isSmallScreen} />
        <StatsBanner />
        <TabFilters activeTab={activeTab} setActiveTab={setActiveTab} />
        <Grid container spacing={3} justifyContent="center">
          {filteredFeatures.map((feature, index) => (
            <Grid key={feature.id} sx={{ display: 'flex'}}>
              <FeatureCard {...feature} delay={(index + 1) * 100} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPage; 