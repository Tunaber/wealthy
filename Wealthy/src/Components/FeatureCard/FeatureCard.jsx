import React from 'react';
import { Card, CardActionArea, Box, Avatar, Typography, Button, Grow } from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FeatureCard = React.memo(({ title, description, icon, color, delay }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (title === 'Трекер финансов') {
      navigate('/calendar');
    } else if (title === 'Ипотечный калькулятор') {
      navigate('/mortgage');
    } else if (title === 'Конвертер валют') {
      navigate('/converter');
    }
  };

  return (
    <Grow in timeout={delay}>
      <Card>
        <CardActionArea sx={{ p: 3.5, height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Avatar
              sx={{
                bgcolor: color,
                mb: 3,
                width: 56,
                height: 56,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1) rotate(10deg)',
                },
              }}
            >
              {React.createElement(MuiIcons[icon], { fontSize: 'medium' })}
            </Avatar>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              align="center"
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, mb: 2 }}>
              {description}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClick}
              sx={{
                mt: 'auto',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                },
              }}
            >
              Попробовать
            </Button>
          </Box>
        </CardActionArea>
      </Card>
    </Grow>
  );
});

export default FeatureCard;
