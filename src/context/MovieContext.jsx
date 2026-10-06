import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // Dark mode — persisted
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  // Favorites list — persisted
  const [favorites, setFavorites] = useState(
    () => {
      try {
        return JSON.parse(localStorage.getItem('favorites')) || [];
      } catch {
        return [];
      }
    }
  );

  // Last search query — persisted
  const [lastSearch, setLastSearch] = useState(
    () => localStorage.getItem('lastSearch') || ''
  );

  // Search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist last search
  useEffect(() => {
    if (lastSearch) {
      localStorage.setItem('lastSearch', lastSearch);
    }
  }, [lastSearch]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Add/remove favorites
  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  return (
    <MovieContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        favorites,
        toggleFavorite,
        isFavorite,
        lastSearch,
        setLastSearch,
        searchResults,
        setSearchResults,
        searchLoading,
        setSearchLoading,
        searchError,
        setSearchError,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovie must be used within MovieProvider');
  return ctx;
};
