import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import FinanceCalendar from './Components/Calendar/FinanceCalendarPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/calendar" element={<FinanceCalendar />} />
    </Routes>
  );
}

export default App;
