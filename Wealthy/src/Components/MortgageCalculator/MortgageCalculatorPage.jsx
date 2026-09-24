import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Slider,
  Select,
  MenuItem,
  Button,
  Divider,
  Grid,
  InputAdornment,
  styled,
} from '@mui/material';
import {
  AttachMoney,
  Percent,
  CalendarToday,
  Home,
  TrendingUp,
  Payment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CalculatorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  maxWidth: '800px',
  margin: '0 auto',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.primary.light,
  marginTop: theme.spacing(3),
}));

const MortgageCalculator = () => {
  const navigate = useNavigate();
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanTerm, setLoanTerm] = useState(15);
  const [interestRate, setInterestRate] = useState(7.5);
  const [paymentType, setPaymentType] = useState('annuity');

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [navigate]);

  const calculateMonthlyPayment = () => {
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTerm * 12;

    if (paymentType === 'annuity') {
      // Аннуитетный платеж
      return (
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      );
    } else {
      // Дифференцированный платеж (первый месяц)
      return loanAmount / months + loanAmount * monthlyRate;
    }
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPayment - (propertyPrice - downPayment);

  const handlePropertyPriceChange = (e, newValue) => {
    setPropertyPrice(newValue || e.target.value);
    if (downPayment > newValue * 0.9) {
      setDownPayment(Math.floor(newValue * 0.1));
    }
  };

  const handleDownPaymentPercentChange = (percent) => {
    setDownPayment(Math.floor((propertyPrice * percent) / 100));
  };

  return (
    <Box className="fin-tool-page fin-mortgage-page">
      <CalculatorContainer>
        <SectionTitle variant="h5">
          <Home fontSize="medium" /> Параметры недвижимости
        </SectionTitle>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Стоимость недвижимости</Typography>
            <TextField
              fullWidth
              type="number"
              value={propertyPrice}
              onChange={handlePropertyPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
              }}
            />
            <Slider
              value={propertyPrice}
              onChange={handlePropertyPriceChange}
              min={1000000}
              max={20000000}
              step={100000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)} млн`}
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Первоначальный взнос</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {[10, 15, 20, 30].map((percent) => (
                <Button
                  key={percent}
                  variant={
                    downPayment >= (propertyPrice * percent) / 100 ? 'contained' : 'outlined'
                  }
                  onClick={() => handleDownPaymentPercentChange(percent)}
                >
                  {percent}%
                </Button>
              ))}
            </Box>
            <TextField
              fullWidth
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
              }}
            />
            <Slider
              value={downPayment}
              onChange={(e, newValue) => setDownPayment(newValue)}
              min={0}
              max={propertyPrice * 0.9}
              step={100000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)} млн`}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <SectionTitle variant="h5">
          <TrendingUp fontSize="medium" /> Условия кредита
        </SectionTitle>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Срок кредита</Typography>
            <TextField
              fullWidth
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">лет</InputAdornment>,
              }}
            />
            <Slider
              value={loanTerm}
              onChange={(e, newValue) => setLoanTerm(newValue)}
              min={1}
              max={30}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Процентная ставка</Typography>
            <TextField
              fullWidth
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <Slider
              value={interestRate}
              onChange={(e, newValue) => setInterestRate(newValue)}
              min={1}
              max={15}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Тип платежей</Typography>
            <Select fullWidth value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <MenuItem value="annuity">Аннуитетный (равные платежи)</MenuItem>
              <MenuItem value="differentiated">Дифференцированный (уменьшающиеся платежи)</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <SectionTitle variant="h5">
          <Payment fontSize="medium" /> Результаты расчета
        </SectionTitle>

        <ResultCard>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Ежемесячный платеж:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {monthlyPayment.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Сумма кредита:
              </Typography>
              <Typography variant="h5">
                {(propertyPrice - downPayment).toLocaleString('ru-RU', {
                  maximumFractionDigits: 0,
                })}{' '}
                ₽
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1">Общая переплата:</Typography>
              <Typography variant="h6">
                {totalInterest.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1">Общая сумма выплат:</Typography>
              <Typography variant="h6">
                {totalPayment.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
              </Typography>
            </Grid>
          </Grid>
        </ResultCard>
      </CalculatorContainer>
    </Box>
  );
};

export default MortgageCalculator;
