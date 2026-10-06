import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Grid, Typography, Chip, Button, Avatar,
  CircularProgress, Alert, Divider, IconButton, Rating,
  Stack, Tooltip, Dialog, DialogContent, Paper,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ArrowBack,
  PlayCircleOutline as PlayIcon,
  Star as StarIcon, CalendarToday, AccessTime,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { getMovieDetails, getImageUrl } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

const PLACEHOLDER = 'https://via.placeholder.com/500x750?text=No+Image';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovie();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getMovieDetails(id)
      .then((res) => setMovie(res.data))
      .catch(() => setError('Failed to load movie details. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!movie) return null;

  const fav = isFavorite(movie.id);
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const genres = movie.genres || [];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <Box>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <Box
          sx={{
            width: '100%', height: { xs: 200, md: 380 },
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${getImageUrl(movie.backdrop_path, 'original')})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'flex-end',
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>

        <Grid container spacing={4}>
          {/* Poster */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              component="img"
              src={getImageUrl(movie.poster_path) || PLACEHOLDER}
              alt={movie.title}
              sx={{ width: '100%', borderRadius: 3, boxShadow: 6 }}
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />

            {/* Action Buttons */}
            <Stack spacing={1} mt={2}>
              <Button
                fullWidth
                variant={fav ? 'contained' : 'outlined'}
                color="primary"
                startIcon={fav ? <Favorite /> : <FavoriteBorder />}
                onClick={() => toggleFavorite(movie)}
              >
                {fav ? 'Saved to Favorites' : 'Add to Favorites'}
              </Button>

              {trailer && (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<PlayIcon />}
                  onClick={() => setTrailerOpen(true)}
                  sx={{ color: 'black' }}
                >
                  Watch Trailer
                </Button>
              )}
            </Stack>
          </Grid>

          {/* Details */}
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {movie.title}
            </Typography>

            {movie.tagline && (
              <Typography variant="subtitle1" color="text.secondary" fontStyle="italic" gutterBottom>
                "{movie.tagline}"
              </Typography>
            )}

            {/* Meta info */}
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" mb={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ color: '#f5c518', fontSize: 20 }} />
                <Typography fontWeight={700}>{movie.vote_average?.toFixed(1)}</Typography>
                <Typography color="text.secondary" variant="body2">
                  ({movie.vote_count?.toLocaleString()} votes)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2">{movie.release_date?.slice(0, 4)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2">{runtime}</Typography>
              </Box>
              {movie.original_language && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LanguageIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                    {movie.original_language}
                  </Typography>
                </Box>
              )}
            </Stack>

            <Rating value={movie.vote_average / 2} precision={0.5} readOnly sx={{ mb: 2 }} />

            {/* Genres */}
            <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
              {genres.map((g) => (
                <Chip key={g.id} label={g.name} color="primary" variant="outlined" size="small" />
              ))}
            </Box>

            {/* Overview */}
            <Typography variant="h6" fontWeight={700} gutterBottom>Overview</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
              {movie.overview || 'No overview available.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Cast */}
            {cast.length > 0 && (
              <>
                <Typography variant="h6" fontWeight={700} gutterBottom>Top Cast</Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {cast.map((person) => (
                    <Paper key={person.id} elevation={2} sx={{ p: 1.5, borderRadius: 2, textAlign: 'center', minWidth: 80 }}>
                      <Avatar
                        src={getImageUrl(person.profile_path, 'w185') || undefined}
                        alt={person.name}
                        sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
                      />
                      <Typography variant="caption" fontWeight={600} display="block" noWrap sx={{ maxWidth: 80 }}>
                        {person.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 80 }} display="block">
                        {person.character}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onClose={() => setTrailerOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, aspectRatio: '16/9', bgcolor: 'black' }}>
          {trailer && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ display: 'block', minHeight: 400 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
