import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import {
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
  AutoGraphRounded,
  CalendarMonthRounded,
  CheckRounded,
  ChevronRightRounded,
  CreditCardRounded,
  CurrencyExchangeRounded,
  HeadphonesRounded,
  HomeRounded,
  MenuRounded,
  NewspaperRounded,
  SavingsRounded,
  ShowChartRounded,
  TuneRounded,
  WalletRounded,
} from '@mui/icons-material';
import { FEATURES } from '../constants';
import { useAuth } from '../../auth/AuthContext';
import NotificationsBell from '../Notifications/NotificationsBell';

const featureIcons = {
  'Трекер финансов': WalletRounded,
  'Ипотечный калькулятор': HomeRounded,
  'Конвертер валют': CurrencyExchangeRounded,
  Подкасты: HeadphonesRounded,
  'Финансовые новости': NewspaperRounded,
};

const routes = {
  'Трекер финансов': '/calendar',
  'Ипотечный калькулятор': '/mortgage',
  'Конвертер валют': '/converter',
  Подкасты: '/podcasts',
  'Финансовые новости': '/news',
};

const chartBars = [
  { month: 'Янв', income: 38, expense: 24 },
  { month: 'Фев', income: 49, expense: 31 },
  { month: 'Мар', income: 42, expense: 28 },
  { month: 'Апр', income: 66, expense: 38 },
  { month: 'Май', income: 55, expense: 34 },
  { month: 'Июн', income: 78, expense: 43 },
  { month: 'Июл', income: 65, expense: 36 },
  { month: 'Авг', income: 91, expense: 50 },
  { month: 'Сен', income: 73, expense: 41 },
  { month: 'Окт', income: 86, expense: 48 },
  { month: 'Ноя', income: 71, expense: 39 },
  { month: 'Дек', income: 100, expense: 55 },
];

const navItems = [
  { label: 'Обзор', icon: AutoGraphRounded, path: '/' },
  { label: 'Трекер финансов', icon: WalletRounded, path: '/calendar' },
  { label: 'Ипотечный калькулятор', icon: HomeRounded, path: '/mortgage' },
  { label: 'Конвертер валют', icon: CurrencyExchangeRounded, path: '/converter' },
  { label: 'Новости', icon: NewspaperRounded, path: '/news' },
  { label: 'Подкасты', icon: HeadphonesRounded, path: '/podcasts' },
];

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

function Sidebar({ navigate, open, onClose, user }) {
  const displayName = user?.name || 'Гость';
  const initial = String(displayName).charAt(0).toUpperCase();
  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Закрыть меню" onClick={onClose} />}
      <aside className={`fin-sidebar${open ? ' fin-sidebar--open' : ''}`}>
        <button className="fin-brand" onClick={() => { navigate('/'); onClose(); }} aria-label="Welphy — на главную">
          <span className="fin-brand__mark"><ShowChartRounded /></span>
          <span className="fin-brand__name">welphy<span>.</span></span>
        </button>

        <div className="fin-sidebar__label">МЕНЮ</div>
        <nav className="fin-nav" aria-label="Главная навигация">
          {navItems.map(({ label, icon: NavIcon, path }, index) => (
            <button
              key={path}
              className={`fin-nav__item${index === 0 ? ' is-active' : ''}`}
              onClick={() => { navigate(path); onClose(); }}
            >
              {React.createElement(NavIcon, { fontSize: 'small' })}
              <span>{label}</span>
              {index === 0 && <span className="fin-nav__active-dot" />}
            </button>
          ))}
        </nav>

        <div className="fin-sidebar__bottom">
          <div className="fin-sidebar__help">
            <span className="fin-sidebar__help-icon"><SavingsRounded /></span>
            <strong>Маленький шаг —<br />большая цель</strong>
            <span>Ваши финансы под контролем</span>
            <span className="fin-sidebar__help-art">✳</span>
          </div>
          <button className="fin-profile" onClick={() => { navigate('/auth'); onClose(); }}>
            <div className="fin-profile__avatar">{initial}</div>
            <div className="fin-profile__info"><strong>{displayName}</strong><span>{user ? user.email : 'Личный аккаунт'}</span></div>
            <TuneRounded className="fin-profile__settings" fontSize="small" />
          </button>
        </div>
      </aside>
    </>
  );
}

function GrowthChart({ compact }) {
  const bars = compact ? chartBars.slice(-6) : chartBars;
  return (
    <div className="growth-chart" aria-label="Демонстрационный график доходов и расходов">
      <div className="growth-chart__grid">
        {[0, 1, 2, 3].map((line) => <span key={line} />)}
      </div>
      <div className="growth-chart__bars">
        {bars.map(({ month, income, expense }) => (
          <div className="growth-chart__group" key={month} title={`${month}: демонстрационные данные`}>
            <div className="growth-chart__pair">
              <span className="growth-chart__bar growth-chart__bar--income" style={{ height: `${income}%` }} />
              <span className="growth-chart__bar growth-chart__bar--expense" style={{ height: `${expense}%` }} />
            </div>
            <span className="growth-chart__month">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartRange, setChartRange] = useState('year');

  const displayName = user?.name || 'Александр';
  const initial = String(displayName).charAt(0).toUpperCase();

  const filteredFeatures = useMemo(() => (
    activeTab === 'all'
      ? FEATURES
      : activeTab === 'learn'
        ? FEATURES.filter((feature) => ['news', 'education'].includes(feature.category))
      : FEATURES.filter((feature) => feature.category === activeTab)
  ), [activeTab]);

  return (
    <Box className="fin-app">
      <Sidebar navigate={navigate} open={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
      <main className="fin-main">
        <Container maxWidth={false} className="fin-content">
          <header className="fin-topbar">
            <Button className="fin-mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Открыть меню">
              <MenuRounded />
            </Button>
            <div className="fin-breadcrumb">Страницы <ChevronRightRounded /> <strong>Обзор</strong></div>
            <div className="fin-topbar__right">
              <span className="fin-today"><span /> Всё под контролем</span>
              <NotificationsBell />
              <button className="fin-topbar__avatar" onClick={() => navigate('/auth')} aria-label="Мой кабинет">{initial}</button>
            </div>
          </header>

          <section className="fin-welcome">
            <div>
              <span className="fin-eyebrow">ЧЕТВЕРГ, 24 СЕНТЯБРЯ 2026 · ДЕМО-ПАНЕЛЬ</span>
              <Typography component="h1" className="fin-welcome__title">Деньги любят <span>порядок.</span></Typography>
              <p>Рады видеть, {displayName}. Вот как выглядят ваши финансы сегодня.</p>
            </div>
            <Button
              className="fin-date-button"
              startIcon={<CalendarMonthRounded />}
              onClick={() => setChartRange((prev) => (prev === 'year' ? 'half' : 'year'))}
            >
              {chartRange === 'year' ? 'Этот год' : '6 месяцев'}
            </Button>
          </section>

          <section className="fin-stat-grid" aria-label="Ключевые показатели">
            <article className="fin-stat-card fin-stat-card--balance">
              <div className="fin-stat-card__top"><span>Общий баланс</span><span className="fin-stat-card__icon"><WalletRounded /></span></div>
              <strong className="fin-stat-card__value">{money.format(248560)}</strong>
              <div className="fin-stat-card__foot"><span className="fin-stat-card__trend"><ArrowUpwardRounded /> 12,8%</span><span>к прошлому месяцу</span></div>
              <span className="fin-stat-card__sparkline" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
            </article>
            <article className="fin-stat-card">
              <div className="fin-stat-card__top"><span>Доходы</span><span className="fin-stat-card__icon fin-stat-card__icon--green"><ArrowDownwardRounded /></span></div>
              <strong className="fin-stat-card__value">{money.format(85600)}</strong>
              <div className="fin-stat-card__foot"><span className="fin-stat-card__trend"><ArrowUpwardRounded /> 8,2%</span><span>к прошлому месяцу</span></div>
              <div className="fin-stat-card__progress"><span style={{ width: '72%' }} /></div>
            </article>
            <article className="fin-stat-card">
              <div className="fin-stat-card__top"><span>Расходы</span><span className="fin-stat-card__icon fin-stat-card__icon--orange"><CreditCardRounded /></span></div>
              <strong className="fin-stat-card__value">{money.format(32450)}</strong>
              <div className="fin-stat-card__foot"><span className="fin-stat-card__trend fin-stat-card__trend--good"><ArrowDownwardRounded /> 4,3%</span><span>к прошлому месяцу</span></div>
              <div className="fin-stat-card__progress fin-stat-card__progress--orange"><span style={{ width: '42%' }} /></div>
            </article>
          </section>

          <section className="fin-overview-grid">
            <article className="fin-panel fin-chart-panel">
              <div className="fin-panel__header">
                <div><h2>Денежный поток</h2><p>{chartRange === 'year' ? 'Ваши доходы и расходы за год' : 'Доходы и расходы за 6 месяцев'}</p></div>
                <button className="fin-chart-select" onClick={() => setChartRange((prev) => (prev === 'year' ? 'half' : 'year'))}>2026 <ChevronRightRounded /></button>
              </div>
              <div className="fin-chart-legend"><span><i className="fin-legend-dot fin-legend-dot--income" /> Доходы</span><span><i className="fin-legend-dot fin-legend-dot--expense" /> Расходы</span><span className="fin-chart-note">Демонстрационные данные</span></div>
              <GrowthChart compact={chartRange === 'half'} />
              <div className="fin-chart-summary"><span>Баланс за год</span><strong>+{money.format(53150)}</strong><span className="fin-chart-summary__badge"><ArrowUpwardRounded /> 18,6%</span></div>
            </article>

            <article className="fin-panel fin-goal-panel">
              <div className="fin-panel__header"><div><h2>Цель накоплений</h2><p>Отпуск мечты ✈️</p></div><button className="fin-more" aria-label="Настройки цели">···</button></div>
              <div className="fin-goal-ring"><div className="fin-goal-ring__inner"><SavingsRounded /><strong>68<span>%</span></strong><small>накоплено</small></div></div>
              <div className="fin-goal-amounts"><div><span>Уже отложено</span><strong>{money.format(102000)}</strong></div><div><span>Цель</span><strong>{money.format(150000)}</strong></div></div>
              <div className="fin-goal-footer"><span className="fin-goal-footer__check"><CheckRounded /></span>Вы на верном пути! Ещё немного — и цель достигнута.</div>
            </article>
          </section>

          <section className="fin-tools-section">
            <div className="fin-tools-heading"><div><span className="fin-eyebrow">ВАШИ ФИНАНСЫ — ВАШИ ПРАВИЛА</span><h2>Всё нужное — под рукой</h2><p>Инструменты, чтобы управлять деньгами с умом.</p></div><Button className="fin-all-tools" onClick={() => setActiveTab('all')}>Все инструменты <ArrowForwardRounded /></Button></div>

            <div className="fin-filter-row" role="tablist" aria-label="Категории инструментов">
              {[{ key: 'all', label: 'Все' }, { key: 'finance', label: 'Финансы' }, { key: 'tools', label: 'Инструменты' }, { key: 'learn', label: 'Полезное' }].map(({ key, label }) => (
                <button key={key} role="tab" aria-selected={activeTab === key} className={`fin-filter${activeTab === key ? ' is-active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
              ))}
            </div>

            <div className="fin-tools-grid">
              {filteredFeatures.map((feature, index) => {
                const Icon = featureIcons[feature.title] || ShowChartRounded;
                return (
                  <div key={feature.id}>
                    <button className="fin-tool-card" onClick={() => navigate(routes[feature.title] || '/')} style={{ '--tool-accent': feature.color, '--tool-delay': `${index * 55}ms` }}>
                      <span className="fin-tool-card__icon"><Icon /></span>
                      <span className="fin-tool-card__arrow"><ArrowForwardRounded /></span>
                      <strong>{feature.title}</strong>
                      <span className="fin-tool-card__description">{feature.description}</span>
                      <span className="fin-tool-card__action">Открыть <ChevronRightRounded /></span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="fin-footer"><span>© 2026 Welphy Finance</span><span>Ваш финансовый ритм — в балансе <span className="fin-footer__heart">✳</span></span></footer>
        </Container>
      </main>
    </Box>
  );
}

export default MainPage;
