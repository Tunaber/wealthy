import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  styled,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AuthContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  maxWidth: '500px',
  margin: '0 auto',
  transition: 'all 0.3s ease',
}));

const AuthPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false,
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'remember' ? checked : value,
    });
  };

  const validateForm = () => {
    if (!isLogin && !formData.name.trim()) {
      setError('Пожалуйста, введите имя');
      return false;
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError('Введите корректный email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    return true;
  };

  const handleAuthSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    if (formData.remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }

    setSuccess(isLogin ? 'Успешный вход!' : 'Регистрация завершена!');
    if (onAuthSuccess) {
      onAuthSuccess();
    }
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(
        process.env.NODE_ENV === 'development' 
          ? `http://localhost:5000${endpoint}` 
          : endpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сервера');
      }

      if (!data.token) {
        throw new Error('Ошибка аутентификации: токен не получен');
      }

      handleAuthSuccess(data);
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        p: 3,
      }}
    >
      <AuthContainer elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {isLogin && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Запомнить меня"
              />
              <Button variant="text" size="small">
                Забыли пароль?
              </Button>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 3,
              borderRadius: '8px',
              fontSize: '1rem',
              position: 'relative',
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : isLogin ? (
              'Войти'
            ) : (
              'Зарегистрироваться'
            )}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" align="center">
            {isLogin ? 'Ещё нет аккаунта? ' : 'Уже есть аккаунт? '}
            <Button
              variant="text"
              size="small"
              onClick={toggleAuthMode}
              sx={{
                textTransform: 'none',
                fontSize: 'inherit',
                verticalAlign: 'baseline',
              }}
              disabled={loading}
            >
              {isLogin ? 'Создать аккаунт' : 'Войти'}
            </Button>
          </Typography>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </AuthContainer>
    </Box>
  );
};

export default AuthPage;