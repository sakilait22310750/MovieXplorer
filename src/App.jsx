import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MovieProvider, useMovie } from './context/MovieContext';
import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';

/**
 * ThemedApp Component
 *
 * Inner application component that consumes `MovieContext` to determine
 * whether the dark or light MUI theme should be applied. Handles global CSS
 * baseline resets, client-side routing, and main navigation structure.
 */
function ThemedApp() {
  // Read active theme mode from MovieContext
  const { darkMode } = useMovie();

  return (
    // Apply dynamic theme according to darkMode preference
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {/* MUI CssBaseline provides normalize.css and baseline background/text styling */}
      <CssBaseline />
      <BrowserRouter>
        {/* Global persistent header navigation */}
        <Navbar />
        {/* Application route switchboard */}
        <Routes>
          {/* Home Page: Hero collage, trending rows, search bar & movie discovery grid */}
          <Route path="/" element={<Home />} />
          {/* Movie Details Page: Hero backdrop, cast carousel, trailer modal & user reviews */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          {/* Favorites Page: Saved bookmarks for authenticated / guest users */}
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

/**
 * App Root Component
 *
 * Wraps the entire application with `MovieProvider` to ensure all children have
 * access to movies state, search queries, user authentication, and favorites.
 */
function App() {
  return (
    <MovieProvider>
      <ThemedApp />
    </MovieProvider>
  );
}

export default App;
