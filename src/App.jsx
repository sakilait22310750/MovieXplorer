import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MovieProvider, useMovie } from './context/MovieContext';
import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';

function ThemedApp() {
  const { darkMode } = useMovie();
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <MovieProvider>
      <ThemedApp />
    </MovieProvider>
  );
}

export default App;
