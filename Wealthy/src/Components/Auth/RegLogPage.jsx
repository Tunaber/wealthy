import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Google,
  Apple,
  Facebook,
} from '@mui/icons-material';

const AuthContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  maxWidth: '500px',
  margin: '0 auto',
}));

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false,
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'remember' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Обработка отправки формы
    console.log(isLogin ? 'Вход' : 'Регистрация', formData);
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
      <AuthContainer>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
            sx={{
              py: 1.5,
              mb: 3,
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>

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
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </Typography>
        </Box>
      </AuthContainer>
    </Box>
  );
};

export default AuthPage;
