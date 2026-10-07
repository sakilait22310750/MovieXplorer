import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box, Typography, Card, CardMedia, Chip, Skeleton,
  IconButton, Tooltip,
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Star as StarIcon,
  Favorite, FavoriteBorder, LocalFireDepartment as FireIcon,
  FlashOn as ActionIcon,
  TheaterComedy as ComedyIcon,
  Nightlight as HorrorIcon,
  RocketLaunch as SciFiIcon,
  AutoAwesome as AnimationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getTrending, getMoviesByGenre, getImageUrl } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Image';

function MovieCarouselRow({ title, icon, fetchMovies }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovie();

  useEffect(() => {
    let isMounted = true;
    fetchMovies()
      .then((res) => {
        if (isMounted) setMovies(res.data.results || []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [fetchMovies]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ mb: 4.5 }}>
      {/* Section Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        {icon}
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {/* Left Scroll Arrow */}
        <IconButton
          onClick={() => scroll(-1)}
          aria-label={`Scroll ${title} left`}
          sx={{
            position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: '#E5A00D', color: '#000' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Scrollable Movie Row */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex', gap: 2, overflowX: 'auto', pb: 1,
            scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" sx={{ minWidth: 140, height: 210, borderRadius: 2, flexShrink: 0 }} />
              ))
            : movies.map((movie) => {
                const fav = isFavorite(movie.id);
                return (
                  <Card
                    key={movie.id}
                    sx={{
                      minWidth: 140, maxWidth: 140, flexShrink: 0,
                      cursor: 'pointer', position: 'relative',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)' }
                    }}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(movie.poster_path) || PLACEHOLDER}
                      alt={movie.title}
                      sx={{ height: 210, objectFit: 'cover' }}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />

                    {/* Rating chip */}
                    <Chip
                      icon={<StarIcon sx={{ fontSize: '12px !important', color: '#E5A00D !important' }} />}
                      label={movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
                      size="small"
                      sx={{
                        position: 'absolute', top: 6, left: 6,
                        bgcolor: 'rgba(0,0,0,0.8)', color: 'white',
                        fontSize: 11, height: 22,
                      }}
                    />

                    {/* Favorite Button */}
                    <Tooltip title={fav ? 'Remove from Favorites' : 'Add to Favorites'}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
                        sx={{
                          position: 'absolute', top: 4, right: 4,
                          bgcolor: 'rgba(0,0,0,0.55)',
                          '&:hover': { bgcolor: 'rgba(229,160,13,0.85)' },
                          p: 0.5,
                        }}
                      >
                        {fav
                          ? <Favorite sx={{ color: '#E5A00D', fontSize: 16 }} />
                          : <FavoriteBorder sx={{ color: 'white', fontSize: 16 }} />
                        }
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ p: 0.8 }}>
                      <Typography variant="caption" fontWeight={600} noWrap display="block">
                        {movie.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {movie.release_date?.slice(0, 4)}
                      </Typography>
                    </Box>
                  </Card>
                );
              })}
        </Box>

        {/* Right Scroll Arrow */}
        <IconButton
          onClick={() => scroll(1)}
          aria-label={`Scroll ${title} right`}
          sx={{
            position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: '#E5A00D', color: '#000' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}

const GENRE_CONFIG = [
  { id: 28, title: 'Action', icon: <ActionIcon sx={{ color: '#E5A00D' }} /> },
  { id: 35, title: 'Comedy', icon: <ComedyIcon sx={{ color: '#E5A00D' }} /> },
  { id: 27, title: 'Horror', icon: <HorrorIcon sx={{ color: '#E5A00D' }} /> },
  { id: 878, title: 'Sci-Fi', icon: <SciFiIcon sx={{ color: '#E5A00D' }} /> },
  { id: 16, title: 'Animation', icon: <AnimationIcon sx={{ color: '#E5A00D' }} /> },
];

export default function TrendingSection() {
  const fetchTrendingWeek = useCallback(() => getTrending(), []);

  return (
    <Box sx={{ mb: 6 }}>
      {/* 1. Trending This Week */}
      <MovieCarouselRow
        title="Trending This Week"
        icon={<FireIcon sx={{ color: '#E5A00D' }} />}
        fetchMovies={fetchTrendingWeek}
      />

      {/* 2 - 6. 5 Trending Genre Rows */}
      {GENRE_CONFIG.map((section) => (
        <MovieCarouselRow
          key={section.id}
          title={section.title}
          icon={section.icon}
          fetchMovies={() => getMoviesByGenre(section.id)}
        />
      ))}
    </Box>
  );
}
