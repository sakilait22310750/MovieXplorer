import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Switch,
  Button, Tooltip, useMediaQuery, Menu, MenuItem,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
} from '@mui/material';
import {
  DarkMode, LightMode,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMovie } from '../context/MovieContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { darkMode, toggleDarkMode, currentUser, logout } = useMovie();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [authMode, setAuthMode] = useState(null); // 'login', 'register', null
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openAuth = (mode) => {
    setAuthMode(mode);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1, minHeight: '60px !important' }}>

          {/* Logo */}
          <Typography
            variant="h6"
            fontWeight={900}
            letterSpacing={1}
            sx={{
              cursor: 'pointer',
              color: '#E5A00D',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              mr: 3,
            }}
            onClick={() => navigate('/')}
          >
            🎬 MovieXplorer
          </Typography>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  startIcon={link.icon}
                  onClick={() => navigate(link.path)}
                  size="small"
                  sx={{
                    color: isActive(link.path) ? '#fff' : '#aaa',
                    fontWeight: isActive(link.path) ? 700 : 400,
                    borderBottom: isActive(link.path) ? '2px solid #E5A00D' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.5,
                    '&:hover': { color: '#fff', bgcolor: 'transparent' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

{/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 0.5 }}>
              <LightMode fontSize="small" sx={{ color: '#aaa' }} />
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                size="small"
                sx={{
                  '& .MuiSwitch-thumb': { bgcolor: '#E5A00D' },
                  '& .MuiSwitch-track': { bgcolor: '#555' },
                }}
              />
              <DarkMode fontSize="small" sx={{ color: '#aaa' }} />
            </Box>
          </Tooltip>

          {/* Login / Profile Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
              {currentUser ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<PersonIcon />}
                      size="small"
                      onClick={handleMenuOpen}
                      sx={{
                        borderColor: '#E5A00D', color: '#E5A00D',
                        '&:hover': { borderColor: '#C8880A', color: '#C8880A' },
                      }}
                    >
                      {currentUser.username}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{ sx: { bgcolor: '#1a1a1a', color: '#fff', border: '1px solid #333' } }}
                    >
                      <MenuItem onClick={() => { handleMenuClose(); navigate('/favorites'); }}>
                        <ListItemIcon><FavoriteIcon fontSize="small" sx={{ color: '#E5A00D' }} /></ListItemIcon>
                        <ListItemText>Favorites</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => { handleMenuClose(); logout(); navigate('/'); }}>
                        <ListItemIcon><LoginIcon fontSize="small" sx={{ color: '#ccc' }} /></ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                <>
                  <Button
                    variant="text"
                    startIcon={<LoginIcon />}
                    onClick={() => openAuth('login')}
                    size="small"
                    sx={{ color: '#ccc', '&:hover': { color: '#fff' } }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => openAuth('register')}
                    size="small"
                    sx={{
                      bgcolor: '#E5A00D', color: '#000',
                      '&:hover': { bgcolor: '#C8880A' },
                    }}
                  >
                    Sign Up Free
                  </Button>
                </>
              )}
            </Box>
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
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: '#1a1a1a', width: 230 } }}>
        <Box sx={{ pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  onClick={() => { navigate(link.path); setDrawerOpen(false); }}
                  selected={isActive(link.path)}
                  sx={{ '&.Mui-selected': { color: '#E5A00D' } }}
                >
                  <ListItemIcon sx={{ color: isActive(link.path) ? '#E5A00D' : 'inherit' }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1, borderColor: '#333' }} />
            <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              {currentUser ? (
                <>
                  <ListItemButton onClick={() => { navigate('/favorites'); setDrawerOpen(false); }}>
                    <ListItemIcon><FavoriteIcon sx={{ color: '#E5A00D' }} /></ListItemIcon>
                    <ListItemText primary="Favorites" />
                  </ListItemButton>
                  <ListItemButton onClick={() => { logout(); setDrawerOpen(false); }}>
                    <ListItemIcon><LoginIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </>
              ) : (
                <ListItemButton onClick={() => { openAuth('login'); setDrawerOpen(false); }}>
                  <ListItemIcon><LoginIcon /></ListItemIcon>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Login/Register Dialog */}
      <AuthModal authMode={authMode} setAuthMode={setAuthMode} />
    </>
  );
}
