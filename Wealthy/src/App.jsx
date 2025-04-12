import React, { useState, useMemo, useCallback } from 'react';
import { Container, Grid, Box, useMediaQuery } from '@mui/material'; // Убрали ThemeProvider и тему
import Header from './Components/Header/Header';
import FeatureCard from './Components/FeatureCard/FeatureCard';
import StatsBanner from './Components/StatsBanner/StatsBanner';
import TabFilters from './Components/TabFilters/TabFilters';
import HeroSection from './Components/HeroSection/HeroSection';
import { FEATURES } from './Components/constants';

function App() {
  const isSmallScreen = useMediaQuery('(max-width: 600px)'); // Используем useMediaQuery без темы
  const [hasUpdates, setHasUpdates] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const filteredFeatures = useMemo(() => {
    return activeTab === 'all'
      ? FEATURES
      : FEATURES.filter((feature) => feature.category === activeTab);
  }, [activeTab]);

  const handleLogoClick = useCallback(() => {
    setHasUpdates(false);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onLogoClick={handleLogoClick} hasUpdates={hasUpdates} />

      <Container maxWidth="lg" sx={{ py: isSmallScreen ? 4 : 6 }}>
        <HeroSection isSmallScreen={isSmallScreen} />
        <StatsBanner />
        <TabFilters activeTab={activeTab} setActiveTab={setActiveTab} />

        <Grid container spacing={3} justifyContent="center">
          {filteredFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.id} sx={{ display: 'flex' }}>
              <FeatureCard {...feature} delay={(index + 1) * 100} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
