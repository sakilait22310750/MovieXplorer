/**
 * MovieContext
 * Global application state management for:
 * 1. User Authentication (Login, Register, Logout with persistent localStorage)
 * 2. Per-User Favorites bookmarking
 * 3. Theme mode (Dark / Light)
 * 4. Movie Search, Filter state, and Pagination (Load More)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { searchMovies, discoverMovies } from '../api/tmdb';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // ── Authentication State ──────────────────────────────────────────────────
  // Reads currently authenticated user from localStorage on initial load
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
      return null;
    }
  });

  // ── Favorites State ───────────────────────────────────────────────────────
  // Persisted individually per user key: favorites_<username>
  const [favorites, setFavorites] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser')) || null;
      return user ? (JSON.parse(localStorage.getItem(`favorites_${user.username}`)) || []) : [];
    } catch {
      return [];
    }
  });

  // ── Theme State ───────────────────────────────────────────────────────────
  // Tracks and persists dark/light mode preference
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  // ── Search & Filter State ─────────────────────────────────────────────────
  // Persisted query string for the active search
  const [lastSearch, setLastSearch] = useState(
    () => localStorage.getItem('lastSearch') || ''
  );

  // Active search criteria used by pagination (load more)
  const [searchParams, setSearchParams] = useState({
    query: '',
    genre: '',
    year: '',
    rating: '',
  });

  // Search results array and request statuses
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Pagination metadata
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Synchronization Effects ───────────────────────────────────────────────

  // Reload the appropriate favorites list when the logged-in user changes
  useEffect(() => {
    if (currentUser) {
      const userFavs = JSON.parse(localStorage.getItem(`favorites_${currentUser.username}`)) || [];
      setFavorites(userFavs);
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  // Persist dark mode toggle to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Persist last search query string
  useEffect(() => {
    if (lastSearch) {
      localStorage.setItem('lastSearch', lastSearch);
    }
  }, [lastSearch]);

  // Persist favorites array for current user whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_${currentUser.username}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  // Toggle dark/light theme
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ── Favorite Actions ──────────────────────────────────────────────────────

  // Toggle favorite: adds if not in list, removes if already present
  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  }, []);

  // Quick check if a given movie ID is bookmarked
  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  // ── Auth Actions ──────────────────────────────────────────────────────────

  /**
   * Register a new user account with unique email and username validation.
   */
  const register = (email, username, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email already exists' };
      }
      if (users.find(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists' };
      }
      const newUser = { email, username, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setCurrentUser({ username, email });
      localStorage.setItem('currentUser', JSON.stringify({ username, email }));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Registration failed' };
    }
  };

  /**
   * Log in an existing user with email and password matching.
   */
  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        setCurrentUser({ username: user.username, email: user.email });
        localStorage.setItem('currentUser', JSON.stringify({ username: user.username, email: user.email }));
        return { success: true };
      }
      return { success: false, message: 'Invalid email or password' };
    } catch (err) {
      return { success: false, message: 'Login failed' };
    }
  };

  /**
   * Log out active user session.
   */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // ── Pagination Actions ────────────────────────────────────────────────────

  /**
   * Fetches the next page of results for the active query or filter discover parameters.
   * Deduplicates movies by ID and appends them to searchResults.
   */
  const loadMoreMovies = useCallback(async () => {
    if (searchLoading || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setSearchLoading(true);
    setSearchError('');

    try {
      let newResults = [];
      let totalPgs = totalPages;

      if (searchParams.query) {
        // Query text search
        const res = await searchMovies(searchParams.query, nextPage);
        let items = res.data.results || [];
        totalPgs = res.data.total_pages || 1;

        if (searchParams.genre) {
          items = items.filter((m) => m.genre_ids?.includes(Number(searchParams.genre)));
        }
        if (searchParams.year) {
          items = items.filter((m) => m.release_date?.startsWith(searchParams.year));
        }
        if (searchParams.rating) {
          items = items.filter((m) => m.vote_average >= Number(searchParams.rating));
        }
        newResults = items;
      } else {
        // Discover by selected filters
        const filters = {};
        if (searchParams.genre) filters.with_genres = searchParams.genre;
        if (searchParams.year) filters.primary_release_year = searchParams.year;
        if (searchParams.rating) filters['vote_average.gte'] = searchParams.rating;

        const res = await discoverMovies(filters, nextPage);
        newResults = res.data.results || [];
        totalPgs = res.data.total_pages || 1;
      }

      // Append new movies and prevent duplicate entries
      setSearchResults((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = newResults.filter((m) => !existingIds.has(m.id));
        return [...prev, ...unique];
      });
      setCurrentPage(nextPage);
      setTotalPages(totalPgs);
    } catch (err) {
      setSearchError('Failed to load more movies.');
    } finally {
      setSearchLoading(false);
    }
  }, [searchLoading, currentPage, totalPages, searchParams]);

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
        searchParams,
        setSearchParams,
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
        loadMoreMovies,
        currentUser,
        register,
        login,
        logout,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

/**
 * Custom hook for consuming MovieContext state and actions throughout the app.
 */
export const useMovie = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovie must be used within MovieProvider');
  return ctx;
};
