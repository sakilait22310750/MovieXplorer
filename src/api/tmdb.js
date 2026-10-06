import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

// Trending movies (weekly)
export const getTrending = () => api.get('/trending/movie/week');

// Search movies with pagination
export const searchMovies = (query, page = 1) =>
  api.get('/search/movie', { params: { query, page, include_adult: false } });

// Get full movie details with videos and credits
export const getMovieDetails = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } });

// Discover movies by genre
export const getMoviesByGenre = (genreId, page = 1) =>
  api.get('/discover/movie', { params: { with_genres: genreId, page, sort_by: 'popularity.desc' } });

// Get all genres list
export const getGenres = () => api.get('/genre/movie/list');

// Popular movies
export const getPopular = (page = 1) => api.get('/movie/popular', { params: { page } });

// Image base URL helper
export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
