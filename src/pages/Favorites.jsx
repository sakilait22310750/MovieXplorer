import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Favorite as FavoriteIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useMovie } from '../context/MovieContext';
import { Grid } from '@mui/material';

export default function Favorites() {
  const { favorites } = useMovie();
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1.5} mb={4}>
        <FavoriteIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight={800}>
          My Favorites
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({favorites.length} {favorites.length === 1 ? 'movie' : 'movies'})
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Box textAlign="center" py={10}>
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No favorites yet!
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Browse movies and click the ❤️ heart icon to save them here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="large"
          >
            Explore Movies
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {favorites.map((movie) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
