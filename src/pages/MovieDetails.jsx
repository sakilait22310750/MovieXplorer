import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Chip, Button, Avatar,
  CircularProgress, Alert,
  Stack, Dialog, DialogContent, IconButton,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ArrowBack,
  PlayCircleOutlined as PlayIcon,
  Star as StarIcon,
  ArrowForwardIos, ArrowBackIosNew,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getMovieDetails, getImageUrl } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovie();
  const scrollRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getMovieDetails(id)
      .then((res) => setMovie(res.data))
      .catch(() => setError('Failed to load movie details. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (movie) {
      const timer = setTimeout(checkScroll, 300);
      return () => clearTimeout(timer);
    }
  }, [movie]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

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
  const cast = movie.credits?.cast?.slice(0, 25) || [];
  const genres = movie.genres || [];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#0f0f0f' }}>
      {/* Background Image Layer */}
      {movie.backdrop_path && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top right',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            width: { xs: '100%', md: '80%' },
            marginLeft: 'auto',
          }}
        />
      )}

      {/* Gradient Overlay Layer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: 'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.95) 55%, rgba(15,15,15,0.4) 100%)',
            md: 'linear-gradient(to right, #0f0f0f 0%, #0f0f0f 35%, rgba(15,15,15,0.8) 60%, transparent 100%)'
          },
          zIndex: 1,
        }}
      />

      {/* Content Layer */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          pt: { xs: 8, md: 12 }, 
          pb: 8,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start', mb: { xs: 2, md: 3 }, color: '#fff' }}>
          Back
        </Button>

        <Box sx={{ maxWidth: { xs: '100%', md: '55%' } }}>
          <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2.3rem', md: '3.8rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.8)', color: '#fff' }}>
            {movie.title}
          </Typography>

          {movie.tagline && (
            <Typography variant="h6" color="text.secondary" fontStyle="italic" gutterBottom sx={{ mb: 2 }}>
              "{movie.tagline}"
            </Typography>
          )}

          {/* Meta Info */}
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" mb={3} sx={{ color: '#ccc' }}>
            {movie.release_date && (
              <Typography variant="subtitle1" fontWeight={600}>
                {movie.release_date.slice(0, 4)}
              </Typography>
            )}
            
            <Typography variant="subtitle1" fontWeight={600}>
              {runtime}
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5}>
               <StarIcon sx={{ color: '#E5A00D', fontSize: 20 }} />
               <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff' }}>
                 {movie.vote_average?.toFixed(1)}
               </Typography>
            </Box>
          </Stack>
          
          {/* Genres */}
          <Box mb={3} display="flex" flexWrap="wrap" gap={1}>
             {genres.map((g) => (
                <Chip key={g.id} label={g.name} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', fontWeight: 600 }} />
             ))}
          </Box>

          {/* Buttons */}
          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            {trailer ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                onClick={() => setTrailerOpen(true)}
                sx={{
                  bgcolor: '#E5A00D',
                  color: '#000',
                  fontWeight: 800,
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { bgcolor: '#C8880A' }
                }}
              >
                Watch Trailer
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                disabled
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 800,
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Trailer Unavailable
              </Button>
            )}

            {/* Action Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  minWidth: 'auto', width: 52, height: 52, borderRadius: '50%',
                  borderColor: fav ? '#E5A00D' : 'rgba(255,255,255,0.3)',
                  color: fav ? '#E5A00D' : '#fff',
                  '&:hover': { borderColor: '#E5A00D', color: '#E5A00D', bgcolor: 'rgba(229,160,13,0.1)' }
                }}
                onClick={() => toggleFavorite(movie)}
                title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                {fav ? <Favorite /> : <FavoriteBorder />}
              </Button>
            </Box>
          </Stack>

          {/* Overview */}
          <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#ddd', mb: 4, maxWidth: 700 }}>
            {movie.overview || 'No overview available.'}
          </Typography>
        </Box>

        {/* Cast Section */}
        {cast.length > 0 && (
          <Box sx={{ mt: 3, width: '100%', position: 'relative' }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 0.5, 
                mb: 2, 
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { opacity: 0.85 }
              }}
              onClick={() => scroll('right')}
            >
              <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', fontSize: '1.25rem' }}>
                Cast of {movie.title}
              </Typography>
              <ChevronRightIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>

            <Box sx={{ position: 'relative', width: '100%' }}>
              {/* Left Scroll Arrow */}
              {canScrollLeft && (
                <IconButton
                  onClick={() => scroll('left')}
                  aria-label="Previous cast"
                  sx={{
                    position: 'absolute',
                    left: { xs: 0, sm: -16 },
                    top: '40%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(20, 20, 20, 0.9)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.8)',
                    width: 44,
                    height: 44,
                    '&:hover': {
                      bgcolor: '#E5A00D',
                      color: '#000',
                      borderColor: '#E5A00D'
                    }
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: 18 }} />
                </IconButton>
              )}

              {/* Horizontal Cast Row */}
              <Box 
                ref={scrollRef}
                onScroll={checkScroll}
                sx={{ 
                  display: 'flex !important', 
                  flexDirection: 'row !important', 
                  flexWrap: 'nowrap !important',
                  alignItems: 'flex-start',
                  gap: { xs: 2.5, sm: 3.5 }, 
                  overflowX: 'auto', 
                  overflowY: 'hidden',
                  width: '100%',
                  py: 1,
                  px: 0.5,
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' } 
                }}
              >
                {cast.map((person) => (
                  <Box 
                    key={person.id} 
                    sx={{ 
                      flex: '0 0 auto !important', 
                      width: { xs: 90, sm: 110 }, 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Avatar
                      src={getImageUrl(person.profile_path, 'w185') || undefined}
                      alt={person.name}
                      sx={{ 
                        width: { xs: 80, sm: 100 }, 
                        height: { xs: 80, sm: 100 }, 
                        mb: 1.5,
                        bgcolor: '#2b2327',
                        color: 'rgba(255,255,255,0.4)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: { xs: 45, sm: 60 } }} />
                    </Avatar>
                    <Typography 
                      variant="body2" 
                      fontWeight={700} 
                      sx={{ 
                        color: '#fff', 
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        lineHeight: 1.25,
                        mb: 0.5,
                        width: '100%',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {person.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)', 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: 1.2,
                        width: '100%',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {person.character}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Right Scroll Arrow */}
              {canScrollRight && (
                <IconButton
                  onClick={() => scroll('right')}
                  aria-label="Next cast"
                  sx={{
                    position: 'absolute',
                    right: { xs: 0, sm: -16 },
                    top: '40%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(20, 20, 20, 0.9)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.8)',
                    width: 44,
                    height: 44,
                    '&:hover': {
                      bgcolor: '#E5A00D',
                      color: '#000',
                      borderColor: '#E5A00D'
                    }
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </Container>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onClose={() => setTrailerOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, aspectRatio: '16/9', bgcolor: 'black', overflow: 'hidden' }}>
          {trailer && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ display: 'block' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
