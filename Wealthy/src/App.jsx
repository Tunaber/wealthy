import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isTokenValid();
      setIsAuthenticated(authStatus);
      if (!authStatus && window.location.pathname !== '/auth') {
        navigate('/auth', { replace: true });
      }
    };

    checkAuth();
    
    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <MainPage /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/auth" 
        element={!isAuthenticated ? <AuthPage onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" replace />} 
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