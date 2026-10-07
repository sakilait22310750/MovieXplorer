/**
 * MovieGrid Component
 * Displays a responsive grid of movie cards with skeleton loading placeholders,
 * error handling, empty states, and centered "Load More" pagination.
 */

import React from 'react';
import {
  Grid, Box, Typography, Skeleton, Alert, Button,
  CircularProgress,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MovieCard from './MovieCard';
import { useMovie } from '../context/MovieContext';

export default function MovieGrid({ movies, title, emptyMessage }) {
  // Consume global search and pagination state from context
  const {
    searchLoading, searchError, searchResults,
    currentPage, totalPages, loadMoreMovies,
  } = useMovie();

  // Use explicitly provided movies list (e.g. from favorites) or fallback to global search results
  const displayMovies = movies || searchResults;
  const loading = searchLoading;
  const error = searchError;

  // 1. Initial Loading State: Render animated skeleton cards
  if (loading && displayMovies.length === 0) {
    return (
      <Box>
        {title && <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>}
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
              <Skeleton variant="rectangular" sx={{ borderRadius: 2, aspectRatio: '2/3' }} />
              <Skeleton width="80%" sx={{ mt: 1 }} />
              <Skeleton width="50%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // 2. Error State: Render alert banner if search fails
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // 3. Empty State: Render helpful message when no movies match query
  if (!loading && displayMovies.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage || '🎬 No movies found. Try a different search!'}
        </Typography>
      </Box>
    );
  }

  // 4. Main Grid & Pagination Rendering
  return (
    <Box sx={{ width: '100%' }}>
      {/* Optional section title */}
      {title && (
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}

      {/* Responsive Movie Cards Grid */}
      <Grid container spacing={2}>
        {displayMovies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {/* Centered "Load More" Pagination Button for Search/Discover results */}
      {!movies && currentPage < totalPages && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            mt: 4,
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={loadMoreMovies}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={16} sx={{ color: '#E5A00D' }} /> : <ExpandMoreIcon />}
            size="large"
            sx={{
              borderColor: '#E5A00D',
              color: '#E5A00D',
              fontWeight: 700,
              px: 4,
              py: 1.2,
              borderRadius: '24px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#C8880A',
                bgcolor: 'rgba(229,160,13,0.1)',
              },
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
