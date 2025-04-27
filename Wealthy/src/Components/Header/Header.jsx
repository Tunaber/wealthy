import React from 'react';
import { AppBar, Container, Toolbar, Button, Box } from '@mui/material';
import { AccountBalanceWallet, NotificationsActive } from '@mui/icons-material';
import Logo from './Logo';
import NotificationBadge from './NotificationBadge';

const Header = ({ onLogoClick, hasUpdates }) => (
  <AppBar
    position="sticky"
    elevation={0}
    sx={{
      bgcolor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 2,
      backdropFilter: 'blur(8px)',
    }}
  >
    <Container maxWidth="lg">
      <Toolbar disableGutters>
        <Logo onClick={onLogoClick} />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="text" color="inherit" startIcon={<AccountBalanceWallet />} sx={{ mr: 2 }}>
          Мой счёт
        </Button>
        <Box sx={{ position: 'relative' }}>
          <Button variant="text" color="inherit" startIcon={<NotificationsActive />}>
            Уведомления
          </Button>
          {hasUpdates && <NotificationBadge />}
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;
