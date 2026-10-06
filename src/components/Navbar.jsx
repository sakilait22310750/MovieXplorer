import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Switch,
  Button, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, InputAdornment, useMediaQuery,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import {
  DarkMode, LightMode,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Visibility, VisibilityOff,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMovie } from '../context/MovieContext';

export default function Navbar() {
  const { darkMode, toggleDarkMode, currentUser, login, register, logout } = useMovie();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [authMode, setAuthMode] = useState(null); // 'login', 'register', null
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const handleAuthSubmit = () => {
    setAuthError('');
    if (!authForm.username || !authForm.password) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    let result;
    if (authMode === 'login') {
      result = login(authForm.username, authForm.password);
    } else {
      result = register(authForm.username, authForm.password);
    }

    if (result.success) {
      setAuthMode(null);
      setAuthForm({ username: '', password: '' });
    } else {
      setAuthError(result.message);
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthForm({ username: '', password: '' });
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Favorites', path: '/favorites', icon: <FavoriteIcon fontSize="small" /> },
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

          {/* Search icon */}
          {!isMobile && (
            <Tooltip title="Search">
              <IconButton color="inherit" onClick={() => navigate('/')} sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}

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
                    sx={{
                      borderColor: '#E5A00D', color: '#E5A00D',
                      '&:hover': { borderColor: '#C8880A', color: '#C8880A' },
                    }}
                  >
                    {currentUser.username}
                  </Button>
                  <Button
                    variant="text"
                    onClick={logout}
                    size="small"
                    sx={{ color: '#ccc', '&:hover': { color: '#fff' } }}
                  >
                    Logout
                  </Button>
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
            <ListItem disablePadding>
              {currentUser ? (
                <ListItemButton onClick={() => { logout(); setDrawerOpen(false); }}>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary={`Logout (${currentUser.username})`} />
                </ListItemButton>
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
      <Dialog open={!!authMode} onClose={() => setAuthMode(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: '#1a1a1a', border: '1px solid #333' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#E5A00D', pb: 1 }}>
          {authMode === 'login' ? '🎬 Sign in to MovieXplorer' : '🎬 Create Account'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          {authError && <Typography color="error" variant="body2">{authError}</Typography>}
          
          <TextField
            label="Username"
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
            fullWidth autoFocus
            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#E5A00D' } }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
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
            onKeyDown={(e) => e.key === 'Enter' && handleAuthSubmit()}
            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#E5A00D' } }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: -1 }}>
            {authMode === 'login' ? (
              <Typography variant="body2" color="text.secondary">
                Don't have an account? <span style={{ color: '#E5A00D', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => openAuth('register')}>Sign up</span>
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Already have an account? <span style={{ color: '#E5A00D', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => openAuth('login')}>Sign in</span>
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAuthMode(null)} sx={{ color: '#aaa' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAuthSubmit}
            sx={{ bgcolor: '#E5A00D', color: '#000', '&:hover': { bgcolor: '#C8880A' } }}
          >
            {authMode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
