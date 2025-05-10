const express = require('express');
const cors = require('cors');
const fetch = (...args) => 
  import('node-fetch').then(({default: fetch}) => fetch(...args));
// Инициализация приложения
const app = express();

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Роут для получения курсов
app.get('/api/rates', async (req, res) => {
  try {
    const { from, to } = req.query;
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();

    const getCurrencyData = (currency) => {
      if (currency === 'RUB') return { Value: 1, Nominal: 1 };
      return Object.values(data.Valute).find(v => v.CharCode === currency);
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

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});