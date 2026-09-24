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
} from '@mui/icons-material';
import firstAudio from '../../assets/PodcastAudio/first.mp3';
import secondAudio from '../../assets/PodcastAudio/second.mp3';
import threeAudio from '../../assets/PodcastAudio/three.mp3';
import fourAudio from '../../assets/PodcastAudio/four.mp3';
import CompactNews from '../News/CompactNews';

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const mockPodcasts = [
          { id: 1, title: 'Умный бюджет: с чего начать', audio: firstAudio, category: 'ПЛАНИРОВАНИЕ', color: '#d9edbd' },
          { id: 2, title: 'Деньги должны работать', audio: secondAudio, category: 'ИНВЕСТИЦИИ', color: '#dddafa' },
          { id: 3, title: 'Копить легко — это привычка', audio: threeAudio, category: 'НАКОПЛЕНИЯ', color: '#f6e3bd' },
          { id: 4, title: 'Первые шаги к финансовой свободе', audio: fourAudio, category: 'ФИНАНСОВАЯ ГРАМОТНОСТЬ', color: '#f2d5d7' },
        ];

        setPodcasts(mockPodcasts);
        setCurrentPodcast(mockPodcasts[0]);
      } catch (error) {
        console.error('Ошибка при загрузке подкастов:', error);
      }
    };

    fetchPodcasts();
  }, []);

  const handleTimeUpdate = (event) => {
    setCurrentTime(event.target.currentTime);
  };

  const handlePlayPause = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Не удалось запустить аудио:', error);
        return;
      }
    }
    setIsPlaying(!isPlaying);
  };

  const playPodcast = (podcast) => {
    setCurrentPodcast(podcast);
    setIsPlaying(true);
    setCurrentTime(0);
    window.setTimeout(() => {
      if (audioRef.current) audioRef.current.play().catch(() => setIsPlaying(false));
    }, 0);
  };

  const handleNext = () => {
    if (!currentPodcast || !podcasts.length) return;
    const currentIndex = podcasts.findIndex((podcast) => podcast.id === currentPodcast.id);
    const nextIndex = (currentIndex + 1) % podcasts.length;
    playPodcast(podcasts[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentPodcast || !podcasts.length) return;
    const currentIndex = podcasts.findIndex((podcast) => podcast.id === currentPodcast.id);
    const previousIndex = (currentIndex - 1 + podcasts.length) % podcasts.length;
    playPodcast(podcasts[previousIndex]);
  };

  const formatTime = (value) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

  return (
    <Box className="fin-tool-page fin-podcasts-page">
      <Paper className="fin-podcast-feature" elevation={0}>
        <div className="fin-podcast-feature__copy">
          <Chip label="WELPHY AUDIO · ПОДБОРКА НЕДЕЛИ" />
          <Typography variant="h4">Финансовая грамотность — это звучит.</Typography>
          <Typography variant="body2">Короткие выпуски с идеями, которые помогают спокойнее обращаться с деньгами.</Typography>
          <Button variant="contained" startIcon={<PlayArrow />} onClick={() => currentPodcast && playPodcast(currentPodcast)}>Слушать подборку</Button>
        </div>
        <div className="fin-podcast-feature__art" aria-hidden="true"><span>W</span><i /><i /><i /><i /><i /></div>
      </Paper>

      <div className="fin-podcast-layout">
        <Paper className="fin-podcast-library" elevation={0}>
          <div className="fin-podcast-section-heading"><div><Typography variant="h6">Популярные выпуски</Typography><Typography variant="body2">Выберите выпуск и нажмите play</Typography></div><Chip label={`${podcasts.length} выпуска`} size="small" /></div>
          <List className="fin-podcast-list">
            {podcasts.map((podcast, index) => (
              <ListItem key={podcast.id} disablePadding className={`fin-podcast-row${currentPodcast?.id === podcast.id ? ' is-current' : ''}`} secondaryAction={
                <div className="fin-podcast-row__actions">
                  <IconButton aria-label={favorites.includes(podcast.id) ? 'Убрать из избранного' : 'В избранное'} onClick={() => setFavorites((previous) => previous.includes(podcast.id) ? previous.filter((id) => id !== podcast.id) : [...previous, podcast.id])}>
                    {favorites.includes(podcast.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton className="fin-podcast-row__play" aria-label={`Слушать: ${podcast.title}`} onClick={() => currentPodcast?.id === podcast.id ? handlePlayPause() : playPodcast(podcast)}>
                    {currentPodcast?.id === podcast.id && isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </div>
              }>
                <ListItemAvatar><Avatar className="fin-podcast-avatar" sx={{ bgcolor: podcast.color }}>{String(index + 1).padStart(2, '0')}</Avatar></ListItemAvatar>
                <ListItemText primary={podcast.title} secondary={<Chip className="fin-podcast-category" label={podcast.category} size="small" />} />
              </ListItem>
            ))}
          </List>
          <audio ref={audioRef} src={currentPodcast?.audio} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={handleNext} />

          {currentPodcast && <div className="fin-audio-player">
            <div className="fin-audio-player__identity"><Avatar sx={{ bgcolor: currentPodcast.color }}><QueueMusic /></Avatar><div><strong>{currentPodcast.title}</strong><span>Welphy Original · Финансы</span></div></div>
            <div className="fin-audio-player__controls">
              <div className="fin-audio-player__buttons">
                <IconButton aria-label="Предыдущий выпуск" onClick={handlePrevious}><SkipPrevious /></IconButton>
                <IconButton className="fin-audio-player__main-play" aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'} onClick={handlePlayPause}>{isPlaying ? <Pause /> : <PlayArrow />}</IconButton>
                <IconButton aria-label="Следующий выпуск" onClick={handleNext}><SkipNext /></IconButton>
              </div>
              <div className="fin-audio-player__seek"><span>{formatTime(currentTime)}</span><Slider min={0} max={duration || 100} value={Math.min(currentTime, duration || 100)} onChange={(_, value) => { if (audioRef.current) audioRef.current.currentTime = value; }} aria-label="Позиция воспроизведения" /><span>{formatTime(duration)}</span></div>
            </div>
            <div className="fin-audio-player__volume"><VolumeUp /><Slider value={volume} onChange={(_, value) => { setVolume(value); if (audioRef.current) audioRef.current.volume = value / 100; }} aria-label="Громкость" /></div>
          </div>}
        </Paper>

        <aside className="fin-podcast-aside"><Paper className="fin-podcast-tip" elevation={0}><span>✳</span><strong>Пять минут сегодня — уверенность в завтрашнем дне.</strong><p>Выберите выпуск и начните с одной полезной идеи.</p></Paper><CompactNews /></aside>
      </div>
    </Box>
  );
};

export default PodcastPage;
