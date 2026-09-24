import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  Skeleton,
  styled,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '../../api';

const NewsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  width: '100%',
  margin: '0 auto',
}));

const NewsCard = styled(Card)(() => ({
  borderRadius: '12px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
}));

const NewsCardMedia = styled(CardMedia)({
  height: '185px',
  objectFit: 'cover',
});

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [readingNews, setReadingNews] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks');
        const data = await response.json();
        if (Array.isArray(data)) setBookmarked(data);
      } catch (error) {
        console.error('Не удалось загрузить закладки:', error);
      }
    };
    loadBookmarks();
  }, []);

  const categories = [
    { id: 'all', label: 'Все новости', icon: <TrendingUpIcon /> },
    { id: 'stocks', label: 'Акции', icon: <ShowChartIcon /> },
    { id: 'crypto', label: 'Криптовалюта', icon: <MonetizationOnIcon /> },
    { id: 'banking', label: 'Банки', icon: <SavingsIcon /> },
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
              'Федеральная резервная система США приняла решение сохранить базовую процентную ставку на уровне 5,25-5,5% годовых.',
            category: 'banking',
            date: '2024-03-20',
            image: '/fed-news.jpg',
            source: 'Financial Times',
            readTime: '3 мин',
          },
          {
            id: 2,
            title: 'Биткоин обновил исторический максимум',
            summary:
              'Курс биткоина впервые превысил отметку в $70 000 на фоне роста интереса институциональных инвесторов.',
            category: 'crypto',
            date: '2024-03-15',
            image: '/bitcoin-news.jpg',
            source: 'CoinDesk',
            readTime: '4 мин',
          },
          {
            id: 3,
            title: 'Акции Tesla выросли на 15% после отчета',
            summary:
              'Акции компании Tesla подскочили после публикации квартального отчета, превысившего ожидания аналитиков.',
            category: 'stocks',
            date: '2024-03-10',
            image: '/tesla-news.jpg',
            source: 'Bloomberg',
            readTime: '5 мин',
          },
          {
            id: 4,
            title: 'ЕЦБ готовится к снижению ставок',
            summary:
              'Европейский центральный банк сигнализирует о возможном смягчении монетарной политики уже в июне.',
            category: 'banking',
            date: '2024-03-05',
            image: '/ecb-news.jpg',
            source: 'Reuters',
            readTime: '4 мин',
          },
          {
            id: 5,
            title: 'Рынок акций обновил рекорды',
            summary:
              'Индекс S&P 500 впервые в истории превысил отметку 5200 пунктов на фоне роста технологических компаний.',
            category: 'stocks',
            date: '2024-02-28',
            image: '/sp500-news.jpg',
            source: 'Wall Street Journal',
            readTime: '6 мин',
          },
          {
            id: 6,
            title: 'Ethereum готовится к масштабному обновлению',
            summary:
              'Разработчики Ethereum анонсировали дату следующего крупного обновления сети — Dencun.',
            category: 'crypto',
            date: '2024-02-25',
            image: '/ethereum-news.jpg',
            source: 'Decrypt',
            readTime: '7 мин',
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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  const toggleBookmark = (id) => {
    const isBookmarked = bookmarked.includes(String(id));
    setBookmarked((prev) =>
      isBookmarked ? prev.filter((item) => String(item) !== String(id)) : [...prev, String(id)]
    );
    fetch(`/api/bookmarks/${id}`, { method: isBookmarked ? 'DELETE' : 'POST' }).catch((error) =>
      console.error('Не удалось обновить закладку:', error)
    );
  };

  const openArticle = (item) => setReadingNews(item);

  const shareNews = async (item) => {
    const url = `${window.location.origin}/news#${item.id}`;
    await copyToClipboard(url);
    setToast(`Ссылка на статью скопирована`);
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box className="fin-tool-page fin-news-page">
      <NewsContainer>
        <Box className="fin-news-toolbar" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
            sx={{ width: { xs: '100%', sm: '250px' } }}
          />

          <Box className="fin-news-categories" sx={{ display: 'flex', gap: 0.5 }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                startIcon={category.icon}
                variant={activeCategory === category.id ? 'contained' : 'outlined'}
                onClick={() => setActiveCategory(category.id)}
                size="small"
                sx={{ px: 1 }}
              >
                {category.label}
              </Button>
            ))}
          </Box>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item} sx={{ width: '100%' }}>
                <NewsCard>
                  <Skeleton variant="rectangular" height={160} />
                  <CardContent sx={{ p: 2 }}>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="100%" height={40} sx={{ mt: 1 }} />
                  </CardContent>
                </NewsCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {filteredNews.length > 0 ? (
              <Grid container spacing={2}>
                {filteredNews.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id} sx={{ width: '100%' }}>
                    <NewsCard onClick={() => openArticle(item)} sx={{ cursor: 'pointer' }}>
                      <NewsCardMedia image={item.image} title={item.title} />
                      <CardContent
                        sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={item.source}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.date} • {item.readTime}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, flexGrow: 1 }}
                        >
                          {item.summary}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 'auto',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                            color={bookmarked.includes(String(item.id)) ? 'primary' : 'default'}
                          >
                            {bookmarked.includes(String(item.id)) ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<ShareIcon />}
                              onClick={(e) => { e.stopPropagation(); shareNews(item); }}
                            >
                              Поделиться
                            </Button>
                            <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); openArticle(item); }}>
                              Читать
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </NewsCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  Новости не найдены. Попробуйте изменить параметры поиска.
                </Typography>
              </Box>
            )}
          </>
        )}
      </NewsContainer>

      <Dialog open={Boolean(readingNews)} onClose={() => setReadingNews(null)} maxWidth="md" fullWidth>
        {readingNews && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <Chip label={readingNews.source} size="small" color="primary" variant="outlined" />
                <Typography variant="caption" color="text.secondary">
                  {readingNews.date} • {readingNews.readTime}
                </Typography>
              </Box>
              <Typography variant="h5" component="h3" fontWeight={700}>
                {readingNews.title}
              </Typography>
              <IconButton onClick={() => setReadingNews(null)} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Закрыть">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                component="img"
                src={readingNews.image}
                alt={readingNews.title}
                sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <Typography paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                {readingNews.summary}
              </Typography>
              <Typography paragraph color="text.secondary">
                Аналитики Welphy советуют не принимать решения на эмоциях: следите за новостями,
                диверсифицируйте вложения и держите «подушку безопасности». Полная статья готовится
                для подписчиков кабинета.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                startIcon={bookmarked.includes(String(readingNews.id)) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={() => toggleBookmark(readingNews.id)}
              >
                {bookmarked.includes(String(readingNews.id)) ? 'В закладках' : 'В закладки'}
              </Button>
              <Button startIcon={<LinkIcon />} onClick={() => shareNews(readingNews)}>Скопировать ссылку</Button>
              <Button variant="contained" onClick={() => setReadingNews(null)}>Понятно</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={2500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewsPage;
