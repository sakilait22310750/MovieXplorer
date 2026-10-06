import React, { useEffect } from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';
import MovieGrid from '../components/MovieGrid';
import { useMovie } from '../context/MovieContext';
import { searchMovies } from '../api/tmdb';

export default function Home() {
  const {
    lastSearch, searchResults,
    setSearchResults, setSearchLoading, setSearchError,
    setCurrentPage, setTotalPages,
  } = useMovie();

  // Restore last search on mount
  useEffect(() => {
    if (lastSearch && searchResults.length === 0) {
      setSearchLoading(true);
      setSearchError('');
      searchMovies(lastSearch)
        .then((res) => {
          setSearchResults(res.data.results || []);
          setCurrentPage(res.data.page || 1);
          setTotalPages(res.data.total_pages || 1);
        })
        .catch(() => setSearchError('Failed to restore last search.'))
        .finally(() => setSearchLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Hero */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          🎬 Discover Your Favorite Films
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search millions of movies, explore trending titles, and save your favorites.
        </Typography>
      </Box>

      {/* Search Bar */}
      <SearchBar />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box mb={5}>
          <Divider sx={{ mb: 3 }} />
          <MovieGrid title={`Results for "${lastSearch}"`} />
        </Box>
      )}

      {/* Trending Section */}
      {searchResults.length === 0 && (
        <>
          <TrendingSection />
        </>
      )}
    </Container>
  );
}
