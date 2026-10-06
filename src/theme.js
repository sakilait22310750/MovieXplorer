import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#e50914' },
    secondary: { main: '#f5c518' },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e50914' },
    secondary: { main: '#f5c518' },
    background: {
      default: '#0d0d0d',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1a1a1a',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 30px rgba(229,9,20,0.25)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#0d0d0d' },
      },
    },
  },
});
