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
import CompactNews from '../News/CompactNews';

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const mockPodcasts = [
          { id: 1, title: 'Подкаст 1', audio: firstAudio },
          { id: 2, title: 'Подкаст 2', audio: secondAudio },
          { id: 3, title: 'Подкаст 3', audio: threeAudio },
          { id: 4, title: 'Подкаст 4', audio: fourAudio },
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

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = podcasts.findIndex((podcast) => podcast.id === currentPodcast.id);
    const nextIndex = (currentIndex + 1) % podcasts.length;
    setCurrentPodcast(podcasts[nextIndex]);
    audioRef.current.src = podcasts[nextIndex].audio;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = podcasts.findIndex((podcast) => podcast.id === currentPodcast.id);
    const previousIndex = (currentIndex - 1 + podcasts.length) % podcasts.length;
    setCurrentPodcast(podcasts[previousIndex]);
    audioRef.current.src = podcasts[previousIndex].audio;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleVolumeChange = (event, newValue) => {};

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
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
            <ListItem key={podcast.id}>
              <ListItemAvatar>
                <Avatar>{podcast.id}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={podcast.title} />
            </ListItem>
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
          <PlayerContainer elevation={3}>{/* ... existing player content ... */}</PlayerContainer>
        )}
      </PodcastContainer>

      {/* Добавляем компонент с новостями */}
      <Box sx={{ mt: 4 }}>
        <CompactNews />
      </Box>
    </Box>
  );
};

export default PodcastPage;
