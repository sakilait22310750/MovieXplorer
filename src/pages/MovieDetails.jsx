import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Avatar,
  CircularProgress, Alert,
  Dialog, DialogContent, DialogTitle, IconButton, Rating,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ArrowBack,
  PlayCircleOutlined as PlayIcon,
  Star as StarIcon,
  ArrowForwardIos, ArrowBackIosNew,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
  ThumbUpOutlined as ThumbUpIcon,
  ModeCommentOutlined as CommentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getMovieDetails, getImageUrl } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

const getAvatarColor = (name = '') => {
  const colors = ['#f4511e', '#8e24aa', '#039be5', '#43a047', '#e53935', '#fb8c00', '#5e35b1', '#00acc1'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovie();
  
  const scrollRef = useRef(null);
  const reviewScrollRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [canReviewScrollLeft, setCanReviewScrollLeft] = useState(false);
  const [canReviewScrollRight, setCanReviewScrollRight] = useState(true);

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

  const checkReviewScroll = () => {
    if (reviewScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reviewScrollRef.current;
      setCanReviewScrollLeft(scrollLeft > 10);
      setCanReviewScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (movie) {
      const timer = setTimeout(() => {
        checkScroll();
        checkReviewScroll();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [movie]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const scrollReviews = (direction) => {
    if (reviewScrollRef.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      reviewScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkReviewScroll, 350);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={60} sx={{ color: '#E5A00D' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2, color: '#E5A00D' }}>
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
  const reviews = movie.reviews?.results || [];
  const genres = movie.genres || [];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#0a0a0c' }}>
      {/* Background Hero Backdrop Layer */}
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

      {/* Atmospheric Cinematic Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: 'linear-gradient(to top, #0a0a0c 0%, rgba(10,10,12,0.95) 50%, rgba(10,10,12,0.5) 100%)',
            md: 'linear-gradient(to right, #0a0a0c 0%, #0a0a0c 38%, rgba(10,10,12,0.85) 65%, transparent 100%)'
          },
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,12,0.4) 0%, transparent 30%, rgba(10,10,12,0.8) 85%, #0a0a0c 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content Layer */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          pt: { xs: 4, md: 6 }, 
          pb: 10,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {/* Back Button */}
        <Button 
          startIcon={<ArrowBack sx={{ fontSize: 18 }} />} 
          onClick={() => navigate(-1)} 
          sx={{ 
            alignSelf: 'flex-start', 
            mb: { xs: 3, md: 5 }, 
            color: 'rgba(255,255,255,0.85)',
            bgcolor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            px: 2.2,
            py: 0.6,
            textTransform: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              transform: 'translateX(-3px)',
            }
          }}
        >
          Back
        </Button>

        {/* Hero Movie Details Column */}
        <Box sx={{ maxWidth: { xs: '100%', md: '650px' } }}>
          {/* Title */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4rem' }, 
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
              color: '#ffffff',
              textShadow: '0 4px 24px rgba(0,0,0,0.9)',
              mb: 1.5,
            }}
          >
            {movie.title}
          </Typography>

          {/* Tagline */}
          {movie.tagline && (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.72)',
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '0.01em',
                lineHeight: 1.4,
                mb: 2.8,
              }}
            >
              "{movie.tagline}"
            </Typography>
          )}

          {/* Unified, Clean Metadata Row */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: { xs: 1.2, sm: 1.8 }, 
              mb: 3.5 
            }}
          >
            {/* Year */}
            {movie.release_date && (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, fontSize: '0.95rem' }}>
                {movie.release_date.slice(0, 4)}
              </Typography>
            )}

            {/* Dot separator */}
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.35)' }} />

            {/* Runtime */}
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, fontSize: '0.95rem' }}>
              {runtime}
            </Typography>

            {/* Dot separator */}
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.35)' }} />

            {/* Sleek Rating Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                bgcolor: 'rgba(229, 160, 13, 0.15)',
                border: '1px solid rgba(229, 160, 13, 0.4)',
                borderRadius: '6px',
                px: 1.2,
                py: 0.35,
                whiteSpace: 'nowrap',
              }}
            >
              <StarIcon sx={{ color: '#E5A00D', fontSize: 16 }} />
              <Typography sx={{ color: '#E5A00D', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
              </Typography>
            </Box>

            {/* Genres as elegant pill tags */}
            {genres.length > 0 && (
              <>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.35)' }} />
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                  {genres.map((g) => (
                    <Box
                      key={g.id}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '16px',
                        px: 1.4,
                        py: 0.35,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {g.name}
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>

          {/* Action Buttons Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            {trailer ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon sx={{ fontSize: 22 }} />}
                onClick={() => setTrailerOpen(true)}
                sx={{
                  bgcolor: '#E5A00D',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '1rem',
                  px: 3.8,
                  py: 1.3,
                  borderRadius: '30px',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  boxShadow: '0 6px 20px rgba(229, 160, 13, 0.35)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: '#f5ad18',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 26px rgba(229, 160, 13, 0.5)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  }
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
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.3,
                  borderRadius: '30px',
                  textTransform: 'none',
                }}
              >
                Trailer Unavailable
              </Button>
            )}

            {/* Favorite Action Button */}
            <IconButton
              onClick={() => toggleFavorite(movie)}
              title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: fav ? 'rgba(229, 160, 13, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: `1.5px solid ${fav ? '#E5A00D' : 'rgba(255, 255, 255, 0.22)'}`,
                color: fav ? '#E5A00D' : '#ffffff',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: fav ? 'rgba(229, 160, 13, 0.3)' : 'rgba(255, 255, 255, 0.16)',
                  borderColor: fav ? '#f5ad18' : 'rgba(255, 255, 255, 0.5)',
                  transform: 'scale(1.08)',
                },
              }}
            >
              {fav ? <Favorite sx={{ fontSize: 24 }} /> : <FavoriteBorder sx={{ fontSize: 24 }} />}
            </IconButton>
          </Box>

          {/* Overview Synopsis */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.82)',
              fontSize: { xs: '1rem', md: '1.08rem' },
              lineHeight: 1.75,
              fontWeight: 400,
              letterSpacing: '0.01em',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              mb: 5,
            }}
          >
            {movie.overview || 'No overview available.'}
          </Typography>
        </Box>

        {/* Cast Section */}
        {cast.length > 0 && (
          <Box sx={{ mt: 2, mb: 5, width: '100%', position: 'relative' }}>
            {/* Header with clickable chevron */}
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 0.5, 
                mb: 2.5, 
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => scroll('right')}
            >
              <Typography variant="h6" fontWeight={700} sx={{ color: '#ffffff', fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
                Cast of {movie.title}
              </Typography>
              <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 26 }} />
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
                    top: '42%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(16, 16, 20, 0.92)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.8)',
                    width: 44,
                    height: 44,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#E5A00D',
                      color: '#000000',
                      borderColor: '#E5A00D',
                      transform: 'translateY(-50%) scale(1.08)',
                    }
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: 16 }} />
                </IconButton>
              )}

              {/* Single Horizontal Cast Line */}
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
                      width: { xs: 95, sm: 115 }, 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <Avatar
                      src={getImageUrl(person.profile_path, 'w185') || undefined}
                      alt={person.name}
                      sx={{ 
                        width: { xs: 84, sm: 100 }, 
                        height: { xs: 84, sm: 100 }, 
                        mb: 1.5,
                        bgcolor: '#201b22',
                        color: 'rgba(255,255,255,0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.6)'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: { xs: 45, sm: 58 } }} />
                    </Avatar>
                    <Typography 
                      variant="body2" 
                      fontWeight={700} 
                      sx={{ 
                        color: '#ffffff', 
                        fontSize: { xs: '0.82rem', sm: '0.88rem' },
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
                        color: 'rgba(255,255,255,0.55)', 
                        fontSize: { xs: '0.72rem', sm: '0.78rem' },
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
                    top: '42%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(16, 16, 20, 0.92)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.8)',
                    width: 44,
                    height: 44,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#E5A00D',
                      color: '#000000',
                      borderColor: '#E5A00D',
                      transform: 'translateY(-50%) scale(1.08)',
                    }
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          </Box>
        )}

        {/* Ratings & Reviews Section (matching reference image) */}
        {reviews.length > 0 && (
          <Box sx={{ mt: 3, width: '100%', position: 'relative' }}>
            {/* Header with chevron */}
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 0.5, 
                mb: 2.5, 
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => scrollReviews('right')}
            >
              <Typography variant="h6" fontWeight={700} sx={{ color: '#ffffff', fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
                {movie.title} Ratings & Reviews
              </Typography>
              <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 26 }} />
            </Box>

            <Box sx={{ position: 'relative', width: '100%' }}>
              {/* Left Scroll Arrow */}
              {canReviewScrollLeft && (
                <IconButton
                  onClick={() => scrollReviews('left')}
                  aria-label="Previous reviews"
                  sx={{
                    position: 'absolute',
                    left: { xs: 0, sm: -16 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(16, 16, 20, 0.92)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.8)',
                    width: 44,
                    height: 44,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#E5A00D',
                      color: '#000000',
                      borderColor: '#E5A00D',
                      transform: 'translateY(-50%) scale(1.08)',
                    }
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: 16 }} />
                </IconButton>
              )}

              {/* Horizontal Scroll Cards Row */}
              <Box 
                ref={reviewScrollRef}
                onScroll={checkReviewScroll}
                sx={{ 
                  display: 'flex !important', 
                  flexDirection: 'row !important', 
                  flexWrap: 'nowrap !important',
                  alignItems: 'stretch',
                  gap: 2.5, 
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
                {reviews.map((rev) => {
                  const authorName = rev.author_details?.name || rev.author || 'Anonymous';
                  const initial = authorName.charAt(0).toUpperCase();
                  const ratingVal = rev.author_details?.rating ? rev.author_details.rating / 2 : 4;
                  const avatarPath = rev.author_details?.avatar_path;
                  const avatarSrc = avatarPath ? (avatarPath.startsWith('/http') ? avatarPath.slice(1) : getImageUrl(avatarPath, 'w185')) : null;

                  return (
                    <Box 
                      key={rev.id}
                      onClick={() => setSelectedReview(rev)}
                      sx={{ 
                        flex: '0 0 auto !important', 
                        width: { xs: 280, sm: 340 }, 
                        bgcolor: 'rgba(20, 22, 28, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          bgcolor: 'rgba(26, 29, 38, 0.95)',
                          borderColor: 'rgba(255, 255, 255, 0.18)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        }
                      }}
                    >
                      {/* Top: Avatar, Name & Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar
                          src={avatarSrc || undefined}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: getAvatarColor(authorName),
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: '#fff',
                          }}
                        >
                          {initial}
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={700} 
                            sx={{ color: '#fff', lineHeight: 1.2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                          >
                            {authorName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
                            {formatDate(rev.created_at)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Middle: Star Rating & Review snippet */}
                      <Box sx={{ mb: 2 }}>
                        <Rating 
                          value={ratingVal} 
                          precision={0.5} 
                          readOnly 
                          size="small" 
                          sx={{ 
                            mb: 1, 
                            '& .MuiRating-iconFilled': { color: '#ffffff' },
                            '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.2)' }
                          }} 
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.85)', 
                            fontSize: '0.9rem',
                            lineHeight: 1.55,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          "{rev.content}"
                        </Typography>
                      </Box>

                      {/* Bottom Footer: Reactions */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'rgba(255,255,255,0.5)' }}>
                            <ThumbUpIcon sx={{ fontSize: 16 }} />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'rgba(255,255,255,0.5)' }}>
                            <CommentIcon sx={{ fontSize: 16 }} />
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#E5A00D', fontWeight: 600, fontSize: '0.75rem' }}>
                          Read more
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Right Scroll Arrow */}
              {canReviewScrollRight && (
                <IconButton
                  onClick={() => scrollReviews('right')}
                  aria-label="Next reviews"
                  sx={{
                    position: 'absolute',
                    right: { xs: 0, sm: -16 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(16, 16, 20, 0.92)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.8)',
                    width: 44,
                    height: 44,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#E5A00D',
                      color: '#000000',
                      borderColor: '#E5A00D',
                      transform: 'translateY(-50%) scale(1.08)',
                    }
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </Container>

      {/* Cinematic Trailer Dialog */}
      <Dialog 
        open={trailerOpen} 
        onClose={() => setTrailerOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#000',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
          }
        }}
      >
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

      {/* Full Review Dialog Modal */}
      <Dialog
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#14161c',
            color: '#fff',
            borderRadius: '16px',
            p: 1.5,
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.9)',
          }
        }}
      >
        {selectedReview && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(selectedReview.author),
                    fontWeight: 700,
                  }}
                >
                  {selectedReview.author?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff' }}>
                    {selectedReview.author}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {formatDate(selectedReview.created_at)}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedReview(null)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Rating 
                value={selectedReview.author_details?.rating ? selectedReview.author_details.rating / 2 : 4} 
                precision={0.5} 
                readOnly 
                size="small" 
                sx={{ 
                  mb: 2, 
                  '& .MuiRating-iconFilled': { color: '#E5A00D' },
                  '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.2)' }
                }} 
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.88)', 
                  lineHeight: 1.7, 
                  fontSize: '0.98rem',
                  whiteSpace: 'pre-line' 
                }}
              >
                {selectedReview.content}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
