import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import {
  AutoGraphRounded,
  CalendarMonthRounded,
  ChevronRightRounded,
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
import { useAuth } from '../../auth/AuthContext';
import NotificationsBell from '../Notifications/NotificationsBell';

const navigation = [
  { label: 'Обзор', path: '/', icon: AutoGraphRounded },
  { label: 'Трекер финансов', path: '/calendar', icon: WalletRounded },
  { label: 'Ипотечный калькулятор', path: '/mortgage', icon: HomeRounded },
  { label: 'Конвертер валют', path: '/converter', icon: CurrencyExchangeRounded },
  { label: 'Новости', path: '/news', icon: NewspaperRounded },
  { label: 'Подкасты', path: '/podcasts', icon: HeadphonesRounded },
];

function Sidebar({ activePath, navigate, open, close }) {
  const { user } = useAuth();
  const displayName = user?.name || 'Гость';
  const initial = String(displayName).charAt(0).toUpperCase();

  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Закрыть меню" onClick={close} />}
      <aside className={`fin-sidebar${open ? ' fin-sidebar--open' : ''}`}>
        <button className="fin-brand" onClick={() => { navigate('/'); close(); }} aria-label="Welphy — главная">
          <span className="fin-brand__mark"><ShowChartRounded /></span>
          <span className="fin-brand__name">welphy<span>.</span></span>
        </button>
        <div className="fin-sidebar__label">МЕНЮ</div>
        <nav className="fin-nav" aria-label="Главная навигация">
          {navigation.map(({ label, path, icon: NavIcon }) => (
            <button key={path} className={`fin-nav__item${activePath === path ? ' is-active' : ''}`} onClick={() => { navigate(path); close(); }}>
              {React.createElement(NavIcon, { fontSize: 'small' })}
              <span>{label}</span>
              {activePath === path && <span className="fin-nav__active-dot" />}
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
          <button className="fin-profile" onClick={() => { navigate('/auth'); close(); }}>
            <div className="fin-profile__avatar">{initial}</div>
            <div className="fin-profile__info"><strong>{displayName}</strong><span>{user ? user.email : 'Личный аккаунт'}</span></div>
            <TuneRounded className="fin-profile__settings" fontSize="small" />
          </button>
        </div>
      </aside>
    </>
  );
}

export default function PageShell({ title, subtitle, activePath, children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const initial = user?.name ? String(user.name).charAt(0).toUpperCase() : 'А';

  return (
    <Box className="fin-app">
      <Sidebar activePath={activePath} navigate={navigate} open={menuOpen} close={closeMenu} />
      <main className="fin-main">
        <Container maxWidth={false} className="fin-content fin-page-content">
          <header className="fin-topbar">
            <Button className="fin-mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><MenuRounded /></Button>
            <div className="fin-breadcrumb">Страницы <ChevronRightRounded /> <strong>{title}</strong></div>
            <div className="fin-topbar__right">
              <span className="fin-today"><span /> Всё под контролем</span>
              <NotificationsBell />
              <button className="fin-topbar__avatar" onClick={() => navigate('/auth')} aria-label="Мой кабинет">{user ? initial : 'А'}</button>
            </div>
          </header>

          <section className="fin-page-heading">
            <div>
              <span className="fin-eyebrow">ВАШИ ФИНАНСЫ — ВАШИ ПРАВИЛА</span>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <Button className="fin-date-button" startIcon={<CalendarMonthRounded />} onClick={() => navigate('/auth')}>Мой кабинет</Button>
          </section>

          <section className="fin-page-body">{children}</section>
          <footer className="fin-footer"><span>© 2026 Welphy Finance</span><span>Ваш финансовый ритм — в балансе <span className="fin-footer__heart">✳</span></span></footer>
        </Container>
      </main>
    </Box>
  );
}
