import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, CircularProgress } from '@mui/material';
import {
  AutoGraphRounded,
  EmailRounded,
  LockRounded,
  PersonRounded,
  ShowChartRounded,
  ArrowBackRounded,
} from '@mui/icons-material';
import { login as apiLogin, register as apiRegister } from '../../api';
import { useAuth } from '../../auth/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const [mode, setMode] = useState(user ? 'account' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const nextUser =
        mode === 'register' ? await apiRegister(name, email, password) : await apiLogin(email, password);
      signIn(nextUser);
      setMode('account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setMode('login');
    setPassword('');
  };

  return (
    <Box className="fin-auth-page">
      <Box className="fin-auth-card">
        <button className="fin-auth-back" onClick={() => navigate('/')} aria-label="На главную">
          <ArrowBackRounded /> На главную
        </button>

        <div className="fin-auth-brand">
          <span className="fin-brand__mark"><ShowChartRounded /></span>
          <span className="fin-brand__name">welphy<span>.</span></span>
        </div>

        {mode === 'account' && user ? (
          <>
            <span className="fin-auth-eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>
            <h1 className="fin-auth-title">С возвращением, <span>{user.name}!</span></h1>
            <p className="fin-auth-subtitle">Вы вошли в аккаунт {user.email}. Данные и настройки привязаны к вашему профилю.</p>

            <div className="fin-auth-account">
              <div className="fin-auth-avatar">{String(user.name).charAt(0).toUpperCase()}</div>
              <div><strong>{user.name}</strong><span>{user.email}</span></div>
            </div>

            <Button className="fin-auth-submit" variant="contained" fullWidth onClick={() => navigate('/')}>
              Перейти к финансам <AutoGraphRounded />
            </Button>
            <Button className="fin-auth-logout" fullWidth onClick={handleLogout}>
              Выйти из аккаунта
            </Button>
          </>
        ) : (
          <>
            <span className="fin-auth-eyebrow">{mode === 'login' ? 'ВХОД В АККАУНТ' : 'НОВЫЙ АККАУНТ'}</span>
            <h1 className="fin-auth-title">{mode === 'login' ? 'Снова в деле.' : 'Создать кабинет.'}</h1>
            <p className="fin-auth-subtitle">
              {mode === 'login'
                ? 'Войдите, чтобы видеть свои операции, закладки и настройки.'
                : 'Зарегистрируйтесь — и мы запомним ваше финансовое состояние.'}
            </p>

            <form onSubmit={handleSubmit} className="fin-auth-form">
              {mode === 'register' && (
                <TextField
                  className="fin-auth-field"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{ startAdornment: <PersonRounded fontSize="small" /> }}
                  fullWidth
                  required
                />
              )}
              <TextField
                className="fin-auth-field"
                placeholder="Электронная почта"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ startAdornment: <EmailRounded fontSize="small" /> }}
                fullWidth
                required
              />
              <TextField
                className="fin-auth-field"
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{ startAdornment: <LockRounded fontSize="small" /> }}
                fullWidth
                required
              />

              {error && <div className="fin-auth-error">{error}</div>}

              <Button
                type="submit"
                className="fin-auth-submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
              </Button>
            </form>

            <div className="fin-auth-switch">
              {mode === 'login' ? (
                <>Нет аккаунта? <button onClick={() => switchMode('register')}>Зарегистрироваться</button></>
              ) : (
                <>Уже есть аккаунт? <button onClick={() => switchMode('login')}>Войти</button></>
              )}
            </div>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AuthPage;