import React from 'react';
import {
  Grid, Box, Typography, Skeleton, Alert, Button,
  CircularProgress,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MovieCard from './MovieCard';
import { useMovie } from '../context/MovieContext';

export default function MovieGrid({ movies, title, emptyMessage }) {
  const {
    searchLoading, searchError, searchResults,
    currentPage, totalPages, loadMoreMovies,
  } = useMovie();

  const displayMovies = movies || searchResults;
  const loading = searchLoading;
  const error = searchError;

  // Skeleton placeholders
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!loading && displayMovies.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage || '🎬 No movies found. Try a different search!'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {displayMovies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {/* Load More Button - Centered Horizontally */}
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
