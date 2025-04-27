import React, { useState, useMemo } from 'react';
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
import { Add, ArrowBackIos, ArrowForwardIos, Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';

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
  fontWeight: 600, // Полужирный для лучшей читаемости
  flexGrow: 1,
  textShadow: '0 1px 1px rgba(255,255,255,0.7)', // Легкая тень для контраста
});

// Обновил стили кнопок действий
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
    fontSize: '1rem', // Чуть больше иконки
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
    return day === 0 ? 6 : day - 1; // Adjust to start week on Monday
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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  };

  const getLastSixMonths = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date);
    }
    return months;
  };

  const chartData = useMemo(() => {
    const months = getLastSixMonths();
    const incomeData = months.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getFullYear() === month.getFullYear() &&
          transactionDate.getMonth() === month.getMonth() &&
          t.type === 'income'
        );
      });
      return monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    });

    const expenseData = months.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getFullYear() === month.getFullYear() &&
          transactionDate.getMonth() === month.getMonth() &&
          t.type === 'expense'
        );
      });
      return monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    });

    return {
      months: months.map((m) => m.toLocaleString('default', { month: 'short' })),
      income: incomeData,
      expenses: expenseData,
    };
  }, [transactions]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<CalendarDayCell key={`empty-${i}`} isCurrentMonth={false} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();

      const dayTransactions = transactions.filter(
        (t) => t.date && new Date(t.date).toDateString() === date.toDateString(),
      );

      days.push(
        <CalendarDayCell
          key={day}
          isCurrentMonth={true}
          isToday={isToday}
          onClick={() => handleDateClick(date)}
        >
          <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
            {day}
          </Typography>
          {dayTransactions.map((t) => (
            <TransactionItem key={t.id} type={t.type} onClick={(e) => e.stopPropagation()}>
              <TransactionText>
                {t.category}: {t.amount} ₽
              </TransactionText>
              <TransactionActions>
                <IconButton size="small" onClick={() => handleEditTransaction(t)} color="primary">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteClick(t)} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </TransactionActions>
            </TransactionItem>
          ))}
        </CalendarDayCell>,
      );
    }

    return days;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Финансовый календарь
      </Typography>

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
