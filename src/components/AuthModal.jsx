import React, { useState, useEffect } from 'react';
import {
  Dialog, Box, Typography, TextField, Button, IconButton,
  InputAdornment, useMediaQuery, useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import { useMovie } from '../context/MovieContext';

const POSTERS = [
  'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', // Deadpool & Wolverine
  'https://image.tmdb.org/t/p/w780/1E5baAaEse26fej7uHcjOgEE2t2.jpg', // Fast X
  'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
  'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers: Infinity War
];

export default function AuthModal({ authMode, setAuthMode }) {
  const { login, register } = useMovie();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [posterIndex, setPosterIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Auto-change poster
  useEffect(() => {
    if (!authMode) return;
    const interval = setInterval(() => {
      setPosterIndex((prev) => (prev + 1) % POSTERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [authMode]);

  const handleClose = () => {
    setAuthMode(null);
    setAuthForm({ email: '', password: '' });
    setAuthError('');
  };

  const handleSubmit = () => {
    setAuthError('');
    if (!authForm.email || !authForm.password) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    // Using email as the username internally in our context
    let result;
    if (authMode === 'login') {
      result = login(authForm.email, authForm.password);
    } else {
      result = register(authForm.email, authForm.password);
    }

    if (result.success) {
      handleClose();
    } else {
      setAuthError(result.message);
    }
  };

  const isLogin = authMode === 'login';

  return (
    <Dialog 
      open={!!authMode} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          bgcolor: 'background.paper',
          height: { xs: 'auto', md: '600px' }
        }
      }}
    >
      {/* LEFT SIDE (Posters & Text) - Hidden on mobile */}
      {!isMobile && (
        <Box 
          sx={{ 
            width: '45%', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            color: '#fff',
            textAlign: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${POSTERS[posterIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'background-image 1s ease-in-out',
              zIndex: 0,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, rgba(31, 41, 55, 0.9) 0%, rgba(31, 41, 55, 0.4) 50%, rgba(31, 41, 55, 0.9) 100%)',
              zIndex: 1,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2, mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Let the streaming begin
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontSize: '1.1rem', opacity: 0.9 }}>
              Watch thousands of free movies and TV shows, as well as stream your own personal collection of movies, TV episodes, music and podcasts!
            </Typography>
          </Box>
        </Box>
      )}

      {/* RIGHT SIDE (Form) */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '55%' }, 
          p: { xs: 4, md: 6 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <IconButton 
          onClick={handleClose} 
          sx={{ position: 'absolute', top: 16, right: 16, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {isLogin ? 'Sign In' : 'Create your free account'}
          </Typography>
          {!isLogin && (
            <Typography variant="body1" color="text.secondary">
              No credit card required.
            </Typography>
          )}
        </Box>

        {!isLogin && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            By signing up or continuing to use MovieXplorer you confirm that you've read and accept the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
          </Typography>
        )}

        {authError && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
            {authError}
          </Typography>
        )}

        <TextField
          label="Email address"
          value={authForm.email}
          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          fullWidth 
          autoFocus
          margin="normal"
          variant="standard"
          sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#E5A00D' } }}
        />

        <TextField
          label={isLogin ? "Password" : "Create password"}
          type={showPassword ? 'text' : 'password'}
          value={authForm.password}
          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          fullWidth
          margin="normal"
          variant="standard"
          helperText={!isLogin ? "10 characters minimum" : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#E5A00D' } }}
        />

        {/* Password Requirements (Mockup) */}
        {!isLogin && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, mb: 4 }}>
            <Typography variant="caption" sx={{ color: authForm.password.length >= 10 ? 'success.main' : 'text.secondary' }}>
              {authForm.password.length >= 10 ? '✓' : '×'} 10 characters
            </Typography>
            <Typography variant="caption" sx={{ color: /[a-z]/.test(authForm.password) ? 'success.main' : 'text.secondary' }}>
              {/[a-z]/.test(authForm.password) ? '✓' : '×'} Lowercase letter
            </Typography>
            <Typography variant="caption" sx={{ color: /[A-Z]/.test(authForm.password) ? 'success.main' : 'text.secondary' }}>
              {/[A-Z]/.test(authForm.password) ? '✓' : '×'} Uppercase letter
            </Typography>
            <Typography variant="caption" sx={{ color: /[0-9]/.test(authForm.password) ? 'success.main' : 'text.secondary' }}>
              {/[0-9]/.test(authForm.password) ? '✓' : '×'} Number
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          sx={{ 
            mt: isLogin ? 4 : 2, 
            mb: 3, 
            bgcolor: '#E5A00D', 
            color: '#000', 
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1.1rem',
            '&:hover': { bgcolor: '#C8880A' } 
          }}
        >
          {isLogin ? 'Sign In' : 'Create an Account'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          {isLogin ? (
            <Typography variant="body2" color="text.secondary">
              Don't have an account? <span style={{ color: '#E5A00D', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthMode('register')}>Sign up</span>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Already have an account? <span style={{ color: '#E5A00D', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthMode('login')}>Sign In</span>
            </Typography>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

