require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Инициализация Express
const app = express();

// Конфигурация подключения к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS, 
  port: process.env.DB_PORT,
  ssl: false, 
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

// Проверка подключения к БД
const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Успешное подключение к базе данных');
  } catch (err) {
    console.error('❌ Ошибка подключения к базе данных:', err.message);
    process.exit(1);
  }
};

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Обработка CORS предварительных запросов
app.options('*', cors());

// Маршрут регистрации
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Валидация входных данных
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // Проверка существующего пользователя
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [name, email, hashedPassword]
    );

    // Генерация JWT
    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].username,
        email: newUser.rows[0].email,
        createdAt: newUser.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Маршрут авторизации
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Генерация токена с дополнительными данными
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Ошибка авторизации:', error.stack); // Добавлен вывод stack trace
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Маршрут получения курсов валют
app.get('/api/rates', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Не указаны валюты для конвертации' });
    }

    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();

    const getCurrencyData = (currency) => {
      if (currency === 'RUB') return { Value: 1, Nominal: 1 };
      return Object.values(data.Valute).find(v => v.CharCode === currency);
    };

    const fromData = getCurrencyData(from.toUpperCase());
    const toData = getCurrencyData(to.toUpperCase());

    if (!fromData || !toData) {
      return res.status(400).json({ error: 'Указана неверная валюта' });
    }

    const rate = (fromData.Value / fromData.Nominal) / (toData.Value / toData.Nominal);
    
    res.json({
      rate: Number(rate.toFixed(6)),
      lastUpdated: new Date().toISOString(),
      from: from.toUpperCase(),
      to: to.toUpperCase()
    });

  } catch (error) {
    console.error('Ошибка получения курсов:', error.message);
    res.status(500).json({ error: 'Ошибка получения данных о курсах валют' });
  }
});

// Добавляем middleware для проверки аутентификации
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Недействительный токен' });
    req.user = user;
    next();
  });
};

// Роуты для работы с транзакциями
app.post('/api/transactions', authenticateUser, async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, category, amount, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.userId, type, category, amount, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания транзакции:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/transactions', authenticateUser, async (req, res) => {
  try {
    const { month, year } = req.query;
    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3`,
      [req.user.userId, month, year]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения транзакций:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/transactions/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, date } = req.body;
    const result = await pool.query(
      `UPDATE transactions 
       SET type = $1, category = $2, amount = $3, date = $4 
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
      [type, category, amount, date, id, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления транзакции:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/transactions/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка удаления транзакции:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка непредвиденных ошибок
app.use((err, req, res, next) => {
  console.error('⚠️ Глобальная ошибка:', err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
const startServer = async () => {
  try {
    await checkDatabaseConnection();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('⛔ Ошибка запуска сервера:', error.message);
    process.exit(1);
  }
};

startServer();