import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import FinanceCalendar from './Components/Calendar/FinanceCalendarPage';
import MortgageCalculator from './Components/MortgageCalculator/MortgageCalculatorPage';
import CurrencyConverter from './Components/CurrencyConverter/CurrencyConverter';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/calendar" element={<FinanceCalendar />} />
      <Route path="/mortgage" element={<MortgageCalculator />} />
      <Route path="/converter" element={<CurrencyConverter />} />
    </Routes>
  );
}

export default App;
