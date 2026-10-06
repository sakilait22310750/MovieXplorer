import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Switch,
  Button, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, InputAdornment, useMediaQuery,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import {
  Movie as MovieIcon,
  DarkMode, LightMode,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Visibility, VisibilityOff,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMovie } from '../context/MovieContext';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useMovie();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loginOpen, setLoginOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (loginForm.username && loginForm.password) {
      setLoggedIn(true);
      setLoginOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Favorites', path: '/favorites', icon: <FavoriteIcon /> },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar sx={{ gap: 1 }}>
          {/* Logo */}
          <MovieIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ cursor: 'pointer', flexGrow: isMobile ? 1 : 0, letterSpacing: 1 }}
            onClick={() => navigate('/')}
          >
            Movie<span style={{ color: theme.palette.primary.main }}>Xplorer</span>
          </Typography>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, ml: 3 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  startIcon={link.icon}
                  onClick={() => navigate(link.path)}
                  color={location.pathname === link.path ? 'primary' : 'inherit'}
                  variant={location.pathname === link.path ? 'contained' : 'text'}
                  size="small"
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LightMode fontSize="small" />
              <Switch checked={darkMode} onChange={toggleDarkMode} size="small" color="default" />
              <DarkMode fontSize="small" />
            </Box>
          </Tooltip>

          {/* Login Button */}
          {!isMobile && (
            <Button
              variant={loggedIn ? 'outlined' : 'contained'}
              color="primary"
              startIcon={loggedIn ? <PersonIcon /> : <LoginIcon />}
              onClick={() => !loggedIn && setLoginOpen(true)}
              size="small"
              sx={{ ml: 1 }}
            >
              {loggedIn ? loginForm.username || 'User' : 'Login'}
            </Button>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 230, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  onClick={() => { navigate(link.path); setDrawerOpen(false); }}
                  selected={location.pathname === link.path}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setLoginOpen(true); setDrawerOpen(false); }}>
                <ListItemIcon><LoginIcon /></ListItemIcon>
                <ListItemText primary={loggedIn ? 'Profile' : 'Login'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>🎬 Login to MovieXplorer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLoginOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
