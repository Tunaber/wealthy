import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import FinanceCalendar from './Components/Calendar/FinanceCalendarPage';
import MortgageCalculator from './Components/MortgageCalculator/MortgageCalculatorPage';
import CurrencyConverter from './Components/CurrencyConverter/CurrencyConverter';
import PodcastsPage from './Components/Podcasts/PodcastsPage';
import NewsPage from './Components/News/NewsPage';
import PageShell from './Components/Layout/PageShell';
import AuthPage from './Components/Auth/AuthPage';
import { AuthProvider } from './auth/AuthContext';

const page = (title, subtitle, path, content) => (
  <PageShell title={title} subtitle={subtitle} activePath={path}>
    {content}
  </PageShell>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/calendar" element={page('Трекер финансов', 'Доходы и расходы — в одном удобном календаре.', '/calendar', <FinanceCalendar />)} />
        <Route path="/mortgage" element={page('Ипотечный калькулятор', 'Рассчитайте комфортный платёж и стоимость кредита.', '/mortgage', <MortgageCalculator />)} />
        <Route path="/converter" element={page('Конвертер валют', 'Переводите валюту по актуальному курсу.', '/converter', <CurrencyConverter />)} />
        <Route path="/podcasts" element={page('Финансовые подкасты', 'Идеи и знания, которые помогают деньгам расти.', '/podcasts', <PodcastsPage />)} />
        <Route path="/news" element={page('Финансовые новости', 'Главное из мира денег, рынков и экономики.', '/news', <NewsPage />)} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
