import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, ArrowBack, ArrowBackIos, ArrowForwardIos, Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from 'react-router-dom';

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(3),
}));

const CalendarHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

const CalendarGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '8px',
});

const CalendarDayHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
  padding: '10px 0',
}));

const CalendarDayCell = styled(Box)(({ theme, isCurrentMonth, isToday }) => ({
  minHeight: '70px',
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: isToday ? theme.palette.primary.light : 'transparent',
  opacity: isCurrentMonth ? 1 : 0.5,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TransactionItem = styled(Box)(({ theme, type }) => ({
  fontSize: '0.75rem',
  padding: '2px 4px',
  margin: '2px 0',
  borderRadius: '4px',
  backgroundColor: type === 'income' ? theme.palette.success.light : theme.palette.error.light,
  color: type === 'income' ? theme.palette.success.contrastText : theme.palette.error.contrastText,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 500,
}));

const TransactionText = styled(Typography)({
  fontSize: '0.95rem',
  fontWeight: 600,
  flexGrow: 1,
  textShadow: '0 1px 1px rgba(255,255,255,0.7)',
});

const TransactionActions = styled(Box)({
  display: 'flex',
  gap: '6px',
  '& .MuiIconButton-root': {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: '4px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
});

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const StatsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(3),
}));

const StatItem = styled(Box)(({ theme, type }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  backgroundColor:
    type === 'income'
      ? theme.palette.success.light
      : type === 'expense'
      ? theme.palette.error.light
      : theme.palette.primary.light,
  color:
    type === 'income'
      ? theme.palette.success.contrastText
      : type === 'expense'
      ? theme.palette.error.contrastText
      : theme.palette.primary.contrastText,
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  marginTop: theme.spacing(3),
}));

const FinancialCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: null,
  });

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [navigate]);

  const categories = {
    income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарок', 'Другое'],
    expense: ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Одежда', 'Здоровье', 'Другое'],
  };

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewTransaction((prev) => ({
      ...prev,
      date: date,
    }));
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleTransactionSubmit = () => {
    if (!newTransaction.amount || !newTransaction.category) return;

    const transaction = {
      ...newTransaction,
      id: editingTransaction ? editingTransaction.id : Date.now(),
      amount: parseFloat(newTransaction.amount),
    };

    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? transaction : t)));
    } else {
      setTransactions([...transactions, transaction]);
    }

    setModalOpen(false);
    setNewTransaction({
      type: 'expense',
      category: '',
      amount: '',
      date: null,
    });
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date,
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setTransactions(transactions.filter((t) => t.id !== transactionToDelete.id));
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const calculateMonthlyStats = () => {
    const monthTransactions = transactions.filter((t) => {
      if (!t.date) return false;
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  };

  const getLastSixMonths = () => {
    const months = [];
    const monthNames = [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(monthNames[date.getMonth()]);
    }

    return months;
  };

  const chartData = useMemo(() => {
    const months = getLastSixMonths();
    const income = new Array(6).fill(0);
    const expenses = new Array(6).fill(0);

    transactions.forEach((t) => {
      if (!t.date) return;
      const transactionDate = new Date(t.date);
      const monthDiff =
        (currentDate.getFullYear() - transactionDate.getFullYear()) * 12 +
        currentDate.getMonth() -
        transactionDate.getMonth();

      if (monthDiff >= 0 && monthDiff < 6) {
        const index = 5 - monthDiff;
        if (t.type === 'income') {
          income[index] += t.amount;
        } else {
          expenses[index] += t.amount;
        }
      }
    });

    return {
      months,
      income,
      expenses,
    };
  }, [transactions, currentDate]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push(
        <CalendarDayCell key={`prev-${i}`} isCurrentMonth={false}>
          <Typography variant="caption">{prevMonthDays - i}</Typography>
        </CalendarDayCell>,
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const dayTransactions = transactions.filter((t) => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getDate() === date.getDate() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });

      days.push(
        <CalendarDayCell
          key={`current-${day}`}
          isCurrentMonth={true}
          isToday={isToday}
          onClick={() => handleDateClick(date)}
        >
          <Typography variant="caption">{day}</Typography>
          {dayTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} type={transaction.type}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TransactionText>
                  {transaction.amount.toLocaleString()} ₽ - {transaction.category}
                </TransactionText>
                <TransactionActions>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTransaction(transaction);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(transaction);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TransactionActions>
              </Box>
            </TransactionItem>
          ))}
        </CalendarDayCell>,
      );
    }

    return days;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ marginRight: 2 }} aria-label="Назад">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Финансовый календарь</Typography>
      </Box>

      <CalendarContainer>
        <CalendarHeader>
          <IconButton onClick={handlePrevMonth}>
            <ArrowBackIos />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIos />
          </IconButton>
        </CalendarHeader>

        <CalendarGrid>
          {daysOfWeek.map((day) => (
            <CalendarDayHeader key={day}>
              <Typography variant="subtitle2">{day}</Typography>
            </CalendarDayHeader>
          ))}
        </CalendarGrid>

        <CalendarGrid>{renderCalendar()}</CalendarGrid>
      </CalendarContainer>

      <StatsContainer>
        <StatItem type="income">
          <Typography variant="h6" gutterBottom>
            Доходы
          </Typography>
          <Typography variant="h4">{calculateMonthlyStats().income.toLocaleString()} ₽</Typography>
        </StatItem>
        <StatItem type="expense">
          <Typography variant="h6" gutterBottom>
            Расходы
          </Typography>
          <Typography variant="h4">
            {calculateMonthlyStats().expenses.toLocaleString()} ₽
          </Typography>
        </StatItem>
        <StatItem type="balance">
          <Typography variant="h6" gutterBottom>
            Баланс
          </Typography>
          <Typography variant="h4">{calculateMonthlyStats().balance.toLocaleString()} ₽</Typography>
        </StatItem>
      </StatsContainer>

      <ChartContainer>
        <Typography variant="h6" gutterBottom>
          Динамика доходов и расходов
        </Typography>
        <Box sx={{ height: 400 }}>
          <LineChart
            series={[
              {
                data: chartData.income,
                label: 'Доходы',
                color: '#10b981',
              },
              {
                data: chartData.expenses,
                label: 'Расходы',
                color: '#ef4444',
              },
            ]}
            xAxis={[{ scaleType: 'point', data: chartData.months }]}
            yAxis={[{ label: 'Сумма (₽)' }]}
            height={400}
            margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
          />
        </Box>
      </ChartContainer>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
          setNewTransaction({
            type: 'expense',
            category: '',
            amount: '',
            date: null,
          });
        }}
      >
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            {editingTransaction ? 'Редактировать транзакцию' : 'Добавить транзакцию'} на{' '}
            {selectedDate?.toLocaleDateString()}
          </Typography>

          <Box sx={{ marginBottom: 2 }}>
            <Select
              fullWidth
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value, category: '' })
              }
            >
              <MenuItem value="income">Доход</MenuItem>
              <MenuItem value="expense">Расход</MenuItem>
            </Select>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Select
              fullWidth
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Выберите категорию
              </MenuItem>
              {categories[newTransaction.type].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Сумма"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              InputProps={{ endAdornment: '₽' }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setModalOpen(false);
                setEditingTransaction(null);
                setNewTransaction({
                  type: 'expense',
                  category: '',
                  amount: '',
                  date: null,
                });
              }}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTransactionSubmit}
              disabled={!newTransaction.amount || !newTransaction.category}
              startIcon={<Add />}
            >
              {editingTransaction ? 'Сохранить' : 'Добавить'}
            </Button>
          </Box>
        </ModalContent>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить транзакцию "{transactionToDelete?.category}:{' '}
            {transactionToDelete?.amount} ₽"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialCalendar;
