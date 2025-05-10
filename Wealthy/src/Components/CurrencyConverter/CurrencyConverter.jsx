import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Grid,
  CircularProgress,
  styled,
  Button,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EuroIcon from '@mui/icons-material/Euro';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ConverterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  maxWidth: '800px',
  margin: '0 auto',
}));

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.primary.light,
  marginTop: theme.spacing(3),
}));

const CurrencyIcon = ({ currency }) => {
  const icons = {
    USD: <AttachMoneyIcon />,
    EUR: <EuroIcon />,
    GBP: <CurrencyPoundIcon />,
    JPY: <CurrencyYenIcon />,
    RUB: <CurrencyRubleIcon />,
  };

  return icons[currency] || <AttachMoneyIcon />;
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');

  const currencies = [
    { code: 'USD', name: 'Доллар США' },
    { code: 'EUR', name: 'Евро' },
    { code: 'GBP', name: 'Фунт стерлингов' },
    { code: 'JPY', name: 'Японская иена' },
    { code: 'RUB', name: 'Российский рубль' },
    { code: 'CNY', name: 'Китайский юань' },
    { code: 'CHF', name: 'Швейцарский франк' },
    { code: 'AUD', name: 'Австралийский доллар' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchExchangeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `/api/rates?from=${fromCurrency}&to=${toCurrency}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при получении данных');
      }
      
      const data = await response.json();
      setExchangeRate(data.rate);
      setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
      
    } catch (err) {
      console.error('Ошибка при получении курса:', err);
      setError(err.message);
      setExchangeRate(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate ? (amount * exchangeRate).toFixed(4) : '...';

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          left: 20,
          top: 20,
          backgroundColor: 'rgba(255,255,255,0.9)',
          zIndex: 10,
          '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Конвертер валют
      </Typography>

      <ConverterContainer>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" gutterBottom>
              У меня есть
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyIcon currency={fromCurrency} />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              fullWidth
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              sx={{ mt: 2 }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleSwapCurrencies}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <SwapHorizIcon fontSize="large" />
            </IconButton>
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" gutterBottom>
              Я получу
            </Typography>
            <TextField
              fullWidth
              value={convertedAmount}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyIcon currency={toCurrency} />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              fullWidth
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              sx={{ mt: 2 }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <ResultCard>
          <Typography variant="h6" gutterBottom>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Курс: 1 {fromCurrency} = {exchangeRate?.toFixed(6) || '...'} {toCurrency}
          </Typography>
          
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              Ошибка: {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">Обновление курса...</Typography>
            </Box>
          ) : (
            <Typography variant="caption" display="block" mt={1}>
              Обновлено: {lastUpdated}
            </Typography>
          )}
        </ResultCard>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<CompareArrowsIcon />}
            onClick={fetchExchangeRate}
            disabled={loading}
          >
            Обновить курсы
          </Button>
        </Box>
      </ConverterContainer>
    </Box>
  );
};

export default CurrencyConverter;