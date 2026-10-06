import { createTheme } from '@mui/material/styles';

const PLEX_YELLOW = '#E5A00D';
const PLEX_YELLOW_DARK = '#C8880A';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: PLEX_YELLOW, dark: PLEX_YELLOW_DARK, contrastText: '#000' },
    secondary: { main: '#1a1a1a' },
    background: {
      default: '#f0f0f0',
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
          borderRadius: 8,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: `0 12px 30px rgba(229,160,13,0.35)`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, textTransform: 'none', fontWeight: 700 },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: PLEX_YELLOW, dark: PLEX_YELLOW_DARK, contrastText: '#000' },
    secondary: { main: '#cccccc' },
    background: {
      default: '#111111',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#999999',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#1f1f1f',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: `0 12px 30px rgba(229,160,13,0.4)`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, textTransform: 'none', fontWeight: 700 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#111111', borderBottom: '1px solid #2a2a2a' },
      },
    },
  },
});
