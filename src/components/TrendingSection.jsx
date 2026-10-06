import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Card, CardMedia, Chip, Skeleton,
  IconButton, Tooltip,
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Star as StarIcon,
  Favorite, FavoriteBorder, LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getTrending, getImageUrl } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Image';

export default function TrendingSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovie();

  useEffect(() => {
    getTrending()
      .then((res) => setMovies(res.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <FireIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Trending This Week
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {/* Left arrow */}
        <IconButton
          onClick={() => scroll(-1)}
          sx={{
            position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: 'primary.main', color: 'white' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Scroll container */}
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
                      icon={<StarIcon sx={{ fontSize: '12px !important', color: '#f5c518 !important' }} />}
                      label={movie.vote_average?.toFixed(1)}
                      size="small"
                      sx={{
                        position: 'absolute', top: 6, left: 6,
                        bgcolor: 'rgba(0,0,0,0.75)', color: 'white',
                        fontSize: 11, height: 22,
                      }}
                    />

                    {/* Favorite */}
                    <Tooltip title={fav ? 'Remove' : 'Favorite'}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
                        sx={{
                          position: 'absolute', top: 4, right: 4,
                          bgcolor: 'rgba(0,0,0,0.55)',
                          '&:hover': { bgcolor: 'rgba(229,9,20,0.8)' },
                          p: 0.5,
                        }}
                      >
                        {fav
                          ? <Favorite sx={{ color: '#e50914', fontSize: 16 }} />
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

        {/* Right arrow */}
        <IconButton
          onClick={() => scroll(1)}
          sx={{
            position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: 'primary.main', color: 'white' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}
