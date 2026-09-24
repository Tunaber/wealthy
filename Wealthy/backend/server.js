const express = require('express');
const cors = require('cors');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const store = require('./db');

// Инициализация приложения
const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// Текущий пользователь по токену (Authorization: Bearer <token> или x-auth-token)
function authUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : req.headers['x-auth-token'];
  return store.getUserByToken(token);
}

// Роут для получения курсов
app.get('/api/rates', async (req, res) => {
  try {
    const { from, to } = req.query;
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();

    const getCurrencyData = (currency) => {
      if (currency === 'RUB') return { Value: 1, Nominal: 1 };
      return Object.values(data.Valute).find((v) => v.CharCode === currency);
    };

    const fromData = getCurrencyData(from);
    const toData = getCurrencyData(to);

    if (!fromData || !toData) {
      return res.status(400).json({ error: 'Неверный код валюты' });
    }

    const rate = (fromData.Value / fromData.Nominal) / (toData.Value / toData.Nominal);

    res.json({
      rate: Number(rate.toFixed(6)),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

// Авторизация
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const errors = [];
    if (!name || !String(name).trim()) errors.push('Укажите имя');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Некорректная почта');
    if (!password || String(password).length < 4) errors.push('Пароль должен быть не короче 4 символов');
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });

    const result = store.createUser(name, email, password);
    if (result.error) return res.status(409).json({ error: result.error });

    const token = store.createSession(result.user.id);
    res.status(201).json({ user: result.user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = store.checkPassword(email || '', password || '');
    if (!user) return res.status(401).json({ error: 'Неверная почта или пароль' });

    const token = store.createSession(user.id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    const user = authUser(req);
    if (user) {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ')
        ? header.slice(7)
        : req.headers['x-auth-token'];
      store.deleteSession(token);
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const user = authUser(req);
  res.json({ user });
});

// Транзакции (привязаны к пользователю)
app.get('/api/transactions', (req, res) => {
  try {
    const user = authUser(req);
    const { month } = req.query;
    res.json(store.listTransactions(month, user ? String(user.id) : null));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const user = authUser(req);
    const { id, type, category, amount, date } = req.body || {};
    if (!type || !category || amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ error: 'Заполните тип, категорию и сумму' });
    }
    const tx = store.insertTransaction(
      {
        id: id ?? Date.now(),
        type,
        category,
        amount: Number(amount),
        date: date || new Date(),
      },
      user ? String(user.id) : null
    );
    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transactions/:id', (req, res) => {
  try {
    const user = authUser(req);
    const { type, category, amount, date } = req.body || {};
    if (!type || !category || amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ error: 'Заполните тип, категорию и сумму' });
    }
    const tx = store.updateTransaction(
      req.params.id,
      { type, category, amount: Number(amount), date: date || new Date() },
      user ? String(user.id) : null
    );
    if (!tx) return res.status(404).json({ error: 'Транзакция не найдена' });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  try {
    const user = authUser(req);
    const removed = store.deleteTransaction(req.params.id, user ? String(user.id) : null);
    if (!removed) return res.status(404).json({ error: 'Транзакция не найдена' });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Закладки новостей (привязаны к пользователю)
app.get('/api/bookmarks', (req, res) => {
  try {
    const user = authUser(req);
    res.json(store.listBookmarks(user ? String(user.id) : null));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookmarks/:id', (req, res) => {
  try {
    const user = authUser(req);
    res.status(201).json({ id: store.addBookmark(req.params.id, user ? String(user.id) : null) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookmarks/:id', (req, res) => {
  try {
    const user = authUser(req);
    store.removeBookmark(req.params.id, user ? String(user.id) : null);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});