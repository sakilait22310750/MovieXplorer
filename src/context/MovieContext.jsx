import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { searchMovies, discoverMovies } from '../api/tmdb';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
      return null;
    }
  });

  // Favorites list - persisted per user
  const [favorites, setFavorites] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser')) || null;
      return user ? (JSON.parse(localStorage.getItem(`favorites_${user.username}`)) || []) : [];
    } catch {
      return [];
    }
  });

  // Dark mode — persisted
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  // Last search query — persisted
  const [lastSearch, setLastSearch] = useState(
    () => localStorage.getItem('lastSearch') || ''
  );

  // Search parameters for pagination
  const [searchParams, setSearchParams] = useState({
    query: '',
    genre: '',
    year: '',
    rating: '',
  });

  // Search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync favorites when user changes
  useEffect(() => {
    if (currentUser) {
      const userFavs = JSON.parse(localStorage.getItem(`favorites_${currentUser.username}`)) || [];
      setFavorites(userFavs);
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Persist last search
  useEffect(() => {
    if (lastSearch) {
      localStorage.setItem('lastSearch', lastSearch);
    }
  }, [lastSearch]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Persist favorites
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_${currentUser.username}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

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

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const loadMoreMovies = useCallback(async () => {
    if (searchLoading || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setSearchLoading(true);
    setSearchError('');

    try {
      let newResults = [];
      let totalPgs = totalPages;

      if (searchParams.query) {
        // Query search
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
        // Discover with filters
        const filters = {};
        if (searchParams.genre) filters.with_genres = searchParams.genre;
        if (searchParams.year) filters.primary_release_year = searchParams.year;
        if (searchParams.rating) filters['vote_average.gte'] = searchParams.rating;

        const res = await discoverMovies(filters, nextPage);
        newResults = res.data.results || [];
        totalPgs = res.data.total_pages || 1;
      }

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

export const useMovie = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovie must be used within MovieProvider');
  return ctx;
};
