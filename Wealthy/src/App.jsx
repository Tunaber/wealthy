import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import FinanceCalendar from './Components/Calendar/FinanceCalendarPage';
import MortgageCalculator from './Components/MortgageCalculator/MortgageCalculatorPage';
import CurrencyConverter from './Components/CurrencyConverter/CurrencyConverter';
import PodcastsPage from './Components/Podcasts/PodcastsPage';
import NewsPage from './Components/News/NewsPage';
import RegLogPage from './Components/Auth/RegLogPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/auth" element={<RegLogPage />} />
      <Route path="/calendar" element={<FinanceCalendar />} />
      <Route path="/mortgage" element={<MortgageCalculator />} />
      <Route path="/converter" element={<CurrencyConverter />} />
      <Route path="/podcasts" element={<PodcastsPage />} />
      <Route path="/news" element={<NewsPage />} />
    </Routes>
  );
}

export default App;
