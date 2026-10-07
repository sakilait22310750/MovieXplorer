/**
 * TMDB API Client & Helper Service
 * Manages all network communications with The Movie Database (TMDB) REST API.
 */

import axios from 'axios';

// Environment credentials & API base URL configuration
const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Central Axios instance with predefined base configuration and API key param
const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

/**
 * Fetch top trending movies of the week.
 * @returns {Promise} Axios response containing trending movie list.
 */
export const getTrending = () => api.get('/trending/movie/week');

/**
 * Search movies by keyword with pagination.
 * @param {string} query - The search query term.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise} Axios response containing search results and total page metadata.
 */
export const searchMovies = (query, page = 1) =>
  api.get('/search/movie', { params: { query, page, include_adult: false } });

/**
 * Fetch full movie details including appended trailers, cast, and reviews in a single call.
 * @param {string|number} id - TMDB movie ID.
 * @returns {Promise} Axios response containing comprehensive movie object.
 */
export const getMovieDetails = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits,reviews' } });

/**
 * Discover popular movies belonging to a specific genre.
 * @param {string|number} genreId - TMDB genre ID.
 * @param {number} [page=1] - Page number.
 * @returns {Promise} Axios response with genre-filtered movies.
 */
export const getMoviesByGenre = (genreId, page = 1) =>
  api.get('/discover/movie', { params: { with_genres: genreId, page, sort_by: 'popularity.desc' } });

/**
 * Discover movies with custom multi-attribute filters (genres, release year, minimum rating).
 * @param {Object} filters - Query parameters object (e.g., primary_release_year, with_genres, vote_average.gte).
 * @param {number} [page=1] - Page number.
 * @returns {Promise} Axios response with filtered movie discovery results.
 */
export const discoverMovies = (filters, page = 1) =>
  api.get('/discover/movie', { params: { ...filters, page, sort_by: 'popularity.desc', include_adult: false } });

/**
 * Retrieve the full list of official TMDB movie genres.
 * @returns {Promise} Axios response containing genre IDs and names.
 */
export const getGenres = () => api.get('/genre/movie/list');

/**
 * Retrieve the current popular movies.
 * @param {number} [page=1] - Page number.
 * @returns {Promise} Axios response containing popular movie entries.
 */
export const getPopular = (page = 1) => api.get('/movie/popular', { params: { page } });

/**
 * Constructs a fully qualified image URL from TMDB poster/backdrop relative path.
 * @param {string} path - Relative image path from TMDB (e.g., "/abc123.jpg").
 * @param {string} [size='w500'] - Image resolution size ('w185', 'w342', 'w500', 'original').
 * @returns {string|null} Complete image URL or null if path is undefined.
 */
export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
