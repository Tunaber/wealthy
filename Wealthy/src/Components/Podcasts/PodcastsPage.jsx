import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Slider,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  styled,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  Favorite,
  FavoriteBorder,
  Share,
  QueueMusic,
  MoreVert,
  ArrowBack,
} from '@mui/icons-material';
import firstAudio from '../../assets/PodcastAudio/first.mp3';
import secondAudio from '../../assets/PodcastAudio/second.mp3';
import threeAudio from '../../assets/PodcastAudio/three.mp3';
import fourAudio from '../../assets/PodcastAudio/four.mp3';
import { useNavigate } from 'react-router-dom';

const PodcastContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  maxWidth: '1200px',
  margin: '0 auto',
}));

const PlayerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.primary.light,
  marginTop: theme.spacing(4),
  position: 'sticky',
  bottom: theme.spacing(3),
  zIndex: 100,
}));

const PodcastCard = styled(Paper)(({ theme, isPlaying }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  borderLeft: `4px solid ${isPlaying ? theme.palette.primary.main : 'transparent'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([
    {
      id: 1,
      title: 'Как банки обманывают на кредитных картах. Топ-5 банковских уловок',
      author: 'Финкот',
      cover: '/finance-podcast.jpg',
      duration: '32:45',
      category: 'Финансы',
      date: '2 дня назад',
      liked: true,
      audio: firstAudio,
    },
    {
      id: 2,
      title: 'Зачем инвестировать на фондовом рынке',
      author: 'Финкот',
      cover: '/crypto-podcast.jpg',
      duration: '45:12',
      category: 'Инвестиции',
      date: '5 дней назад',
      liked: false,
      audio: secondAudio,
    },
    {
      id: 4,
      title: 'Как работает кешбэк и как на нём заработать',
      author: 'Финкот',
      cover: '/tax-podcast.jpg',
      duration: '38:15',
      category: 'Налоги',
      date: '2 недели назад',
      liked: true,
      audio: fourAudio,
    },
    {
      id: 3,
      title: 'Что будет, если не платить по долгам в Канаде',
      author: 'Moneyinside.ca – Финансовые подкасты для Канадцев',
      cover: '/budget-podcast.jpg',
      duration: '28:30',
      category: 'Бюджет',
      date: '1 неделю назад',
      liked: false,
      audio: threeAudio,
    },
  ]);

  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Форматирование времени (секунды в мм:сс)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Воспроизведение/пауза
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Выбор подкаста
  const selectPodcast = (podcast) => {
    setCurrentPodcast(podcast);
    setIsPlaying(true);
    // В реальном приложении здесь бы устанавливался src audio элемента
    setTimeout(() => {
      audioRef.current.play();
    }, 0);
  };

  // Обновление прогресса воспроизведения
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Перемотка
  const handleSeek = (e, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  // Регулировка громкости
  const handleVolumeChange = (e, newValue) => {
    audioRef.current.volume = newValue / 100;
    setVolume(newValue);
  };

  // Переключение лайка
  const toggleLike = (id) => {
    setPodcasts(
      podcasts.map((podcast) =>
        podcast.id === id ? { ...podcast, liked: !podcast.liked } : podcast,
      ),
    );
    if (currentPodcast?.id === id) {
      setCurrentPodcast({ ...currentPodcast, liked: !currentPodcast.liked });
    }
  };

  // Автоматическое воспроизведение при выборе подкаста
  useEffect(() => {
    if (currentPodcast && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play();
    }
  }, [currentPodcast]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      {/* Кнопка назад */}
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
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Финансовые подкасты
      </Typography>

      <PodcastContainer>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Популярные выпуски
        </Typography>

        <List>
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              elevation={2}
              isPlaying={currentPodcast?.id === podcast.id}
              onClick={() => selectPodcast(podcast)}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    alt={podcast.title}
                    src={podcast.cover}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {podcast.title}
                      {podcast.liked ? (
                        <Favorite
                          color="error"
                          sx={{ ml: 1, verticalAlign: 'middle' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(podcast.id);
                          }}
                        />
                      ) : (
                        <FavoriteBorder
                          sx={{ ml: 1, verticalAlign: 'middle' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(podcast.id);
                          }}
                        />
                      )}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body1" color="text.primary">
                        {podcast.author}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip label={podcast.category} size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {podcast.duration} • {podcast.date}
                        </Typography>
                      </Box>
                    </>
                  }
                />
                <IconButton
                  edge="end"
                  aria-label="play"
                  color={currentPodcast?.id === podcast.id ? 'primary' : 'default'}
                >
                  {currentPodcast?.id === podcast.id && isPlaying ? (
                    <Pause fontSize="large" />
                  ) : (
                    <PlayArrow fontSize="large" />
                  )}
                </IconButton>
              </ListItem>
            </PodcastCard>
          ))}
        </List>

        {/* Невидимый audio элемент для управления воспроизведением */}
        <audio
          ref={audioRef}
          src={currentPodcast?.audio}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Фиксированный плеер внизу экрана */}
        {currentPodcast && (
          <PlayerContainer elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                alt={currentPodcast.title}
                src={currentPodcast.cover}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{currentPodcast.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentPodcast.author}
                </Typography>
              </Box>
              <IconButton onClick={() => toggleLike(currentPodcast.id)}>
                {currentPodcast.liked ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <IconButton>
                <Share />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton>
                <SkipPrevious fontSize="large" />
              </IconButton>
              <IconButton onClick={togglePlay} color="primary" sx={{ p: 2 }}>
                {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
              </IconButton>
              <IconButton>
                <SkipNext fontSize="large" />
              </IconButton>

              <Typography variant="body2" sx={{ minWidth: 40 }}>
                {formatTime(currentTime)}
              </Typography>
              <Slider
                value={currentTime}
                onChange={handleSeek}
                max={audioRef.current?.duration || 100}
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="body2" sx={{ minWidth: 40 }}>
                {formatTime(audioRef.current?.duration || 0)}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, width: 150 }}>
                <VolumeUp sx={{ mr: 1 }} />
                <Slider value={volume} onChange={handleVolumeChange} sx={{ width: 100 }} />
              </Box>
            </Box>
          </PlayerContainer>
        )}
      </PodcastContainer>
    </Box>
  );
};

export default PodcastPage;
