import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import FinanceCalendar from './Components/Calendar/FinanceCalendarPage';
import MortgageCalculator from './Components/MortgageCalculator/MortgageCalculatorPage';
import CurrencyConverter from './Components/CurrencyConverter/CurrencyConverter';
import PodcastsPage from './Components/Podcasts/PodcastsPage';
import NewsPage from './Components/News/NewsPage';
import AuthPage from './Components/Auth/RegLogPage';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    return false;
  }
};


function App() {
  const isAuthenticated = isTokenValid();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <MainPage /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/auth" 
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/calendar" 
        element={isAuthenticated ? <FinanceCalendar /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/mortgage" 
        element={isAuthenticated ? <MortgageCalculator /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/converter" 
        element={isAuthenticated ? <CurrencyConverter /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/podcasts" 
        element={isAuthenticated ? <PodcastsPage /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/news" 
        element={isAuthenticated ? <NewsPage /> : <Navigate to="/auth" replace />} 
      />
    </Routes>
  );
}

export default App;
