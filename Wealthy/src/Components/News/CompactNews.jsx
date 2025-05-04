import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Skeleton,
  styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';

const NewsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(2),
}));

const CompactNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedNewsId, setExpandedNewsId] = useState(null);

  const categories = [
    { id: 'all', label: 'Все', icon: <TrendingUpIcon fontSize="small" /> },
    { id: 'stocks', label: 'Акции', icon: <ShowChartIcon fontSize="small" /> },
    { id: 'crypto', label: 'Крипта', icon: <MonetizationOnIcon fontSize="small" /> },
    { id: 'banking', label: 'Банки', icon: <SavingsIcon fontSize="small" /> },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockNews = [
          {
            id: 1,
            title: 'ФРС оставила ключевую ставку без изменений',
            summary:
              'Федеральная резервная система США приняла решение сохранить базовую процентную ставку на уровне 5,25-5,5% годовых. Аналитики ожидали сохранения ставки, но прогнозируют возможное снижение во второй половине года.',
            category: 'banking',
            date: '20 мар 2024',
            source: 'Financial Times',
          },
          {
            id: 2,
            title: 'Биткоин обновил исторический максимум',
            summary:
              'Курс биткоина впервые превысил отметку в $70 000 на фоне роста интереса институциональных инвесторов. Капитализация крипторыка снова превысила $2 трлн.',
            category: 'crypto',
            date: '15 мар 2024',
            source: 'CoinDesk',
          },
          {
            id: 3,
            title: 'Акции Tesla выросли на 15% после отчета',
            summary:
              'Акции компании Tesla подскочили после публикации квартального отчета, превысившего ожидания аналитиков. Выручка компании составила $25.2 млрд при ожиданиях $24.3 млрд.',
            category: 'stocks',
            date: '10 мар 2024',
            source: 'Bloomberg',
          },
          {
            id: 4,
            title: 'ЕЦБ готовится к снижению ставок',
            summary:
              'Европейский центральный банк сигнализирует о возможном смягчении монетарной политики уже в июне. Инфляция в еврозоне продолжает замедляться.',
            category: 'banking',
            date: '5 мар 2024',
            source: 'Reuters',
          },
          {
            id: 5,
            title: 'Рынок акций обновил рекорды',
            summary:
              'Индекс S&P 500 впервые в истории превысил отметку 5200 пунктов на фоне роста технологических компаний. Nasdaq Composite также обновил максимум.',
            category: 'stocks',
            date: '28 фев 2024',
            source: 'Wall Street Journal',
          },
          {
            id: 6,
            title: 'Ethereum готовится к масштабному обновлению',
            summary:
              'Разработчики Ethereum анонсировали дату следующего крупного обновления сети — Dencun. Обновление должно значительно снизить комиссии в L2-сетях.',
            category: 'crypto',
            date: '25 фев 2024',
            source: 'Decrypt',
          },
        ];

        setNews(mockNews);
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const toggleBookmark = (id) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter((item) => item !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };

  const toggleExpand = (id) => {
    setExpandedNewsId(expandedNewsId === id ? null : id);
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 1.5 }}>
        Последние финансовые новости
      </Typography>

      <NewsContainer>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
        >
          <TextField
            placeholder="Поиск новостей..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '200px' }}
          />

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                startIcon={category.icon}
                variant={activeCategory === category.id ? 'contained' : 'outlined'}
                onClick={() => setActiveCategory(category.id)}
                size="small"
                sx={{ px: 1, minWidth: 'auto' }}
              >
                {category.label}
              </Button>
            ))}
          </Box>
        </Box>

        {loading ? (
          <Box>
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mb: 1.5 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="100%" height={40} />
                <Divider sx={{ my: 1.5 }} />
              </Box>
            ))}
          </Box>
        ) : (
          <List disablePadding>
            {filteredNews.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  disablePadding
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleExpand(item.id)}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip label={item.source} size="small" color="primary" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">
                          {item.date}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                      color={bookmarked.includes(item.id) ? 'primary' : 'default'}
                    >
                      {bookmarked.includes(item.id) ? (
                        <BookmarkIcon fontSize="small" />
                      ) : (
                        <BookmarkBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>

                  {expandedNewsId === item.id && (
                    <Box
                      sx={{
                        mt: 1,
                        backgroundColor: 'action.hover',
                        borderRadius: 1,
                        p: 1.5,
                        width: '100%',
                      }}
                    >
                      <Typography variant="body2">{item.summary}</Typography>
                    </Box>
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        {!loading && filteredNews.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            Новости не найдены. Попробуйте изменить параметры поиска.
          </Typography>
        )}
      </NewsContainer>
    </Box>
  );
};

export default CompactNews;
