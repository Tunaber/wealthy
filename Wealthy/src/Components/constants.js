export const FEATURES = [
  {
    id: 1,
    title: 'Трекер финансов',
    description: 'Полный контроль доходов и расходов',
    icon: 'AttachMoney',
    color: '#10b981',
    category: 'finance',
  },
  {
    id: 2,
    title: 'Ипотечный калькулятор',
    description: 'Точные расчёты платежей по кредиту',
    icon: 'AccountBalance',
    color: '#6366f1',
    category: 'tools',
  },
  {
    id: 3,
    title: 'Конвертер валют',
    description: 'Актуальные курсы в реальном времени',
    icon: 'CurrencyExchange',
    color: '#f59e0b',
    category: 'tools',
  },
  {
    id: 4,
    title: 'Финансовые новости',
    description: 'Свежие материалы и аналитика',
    icon: 'Article',
    color: '#ef4444',
    category: 'news',
  },
  {
    id: 5,
    title: 'Подкасты',
    description: 'Познавательные аудиоматериалы',
    icon: 'Headphones',
    color: '#8b5cf6',
    category: 'education',
  },
];

export const FACTS = [
  {
    id: 1,
    content: '💡 Среднестатистический человек тратит ~3 года жизни на просмотр рекламы',
    color: '#6366f1',
  },
  {
    id: 2,
    content: '💰 Откладывая 15% дохода с 25 лет, к пенсии можно накопить >$1 млн',
    color: '#10b981',
  },
  {
    id: 3,
    content: '🏦 Первые бумажные деньги появились в Китае в VII веке',
    color: '#f59e0b',
  },
  {
    id: 4,
    content: '📈 Инвестиции в S&P 500 в среднем приносят 7-10% годовых',
    color: '#8b5cf6',
  },
];

export const keyframes = {
  pulse: `
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    `,
  fadeIn: `
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    `,
};

export const TRANSACTION_TYPES = {
  INCOME: {
    value: 'INCOME',
    label: 'Доход',
    color: '#10B981',
    icon: '💰',
  },
  EXPENSE: {
    value: 'EXPENSE',
    label: 'Расход',
    color: '#EF4444',
    icon: '💸',
  },
  TRANSFER: {
    value: 'TRANSFER',
    label: 'Перевод',
    color: '#3B82F6',
    icon: '🔄',
  },
};

export const CATEGORIES = {
  FOOD: { name: 'Еда', icon: '🍕' },
  TRANSPORT: { name: 'Транспорт', icon: '🚕' },
  HOUSE: { name: 'Жилье', icon: '🏠' },
  SALARY: { name: 'Зарплата', icon: '💼' },
  ENTERTAINMENT: { name: 'Развлечения', icon: '🎮' },
  HEALTH: { name: 'Здоровье', icon: '🏥' },
  OTHER: { name: 'Другое', icon: '📌' },
};

export const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
