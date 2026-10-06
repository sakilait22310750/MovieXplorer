import React from 'react';
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, IconButton, Box, Tooltip, Rating,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { getImageUrl } from '../api/tmdb';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Image';

export default function MovieCard({ movie }) {
  const { toggleFavorite, isFavorite } = useMovie();
  const navigate = useNavigate();
  const fav = isFavorite(movie.id);

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const imageUrl = getImageUrl(movie.poster_path) || PLACEHOLDER;

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative' }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      {/* Poster */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={movie.title}
        sx={{ aspectRatio: '2/3', objectFit: 'cover' }}
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />

      {/* Rating Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8, left: 8,
          bgcolor: 'rgba(0,0,0,0.8)',
          color: '#E5A00D',
          borderRadius: 1,
          px: 0.8, py: 0.3,
          display: 'flex', alignItems: 'center', gap: 0.4,
          fontSize: 13, fontWeight: 700,
        }}
      >
        <StarIcon sx={{ fontSize: 14, color: '#E5A00D' }} />
        {rating}
      </Box>

      {/* Favorite button (top-right) */}
      <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
        <Tooltip title={fav ? 'Remove from Favorites' : 'Add to Favorites'}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
            sx={{
              bgcolor: 'rgba(0,0,0,0.6)',
              '&:hover': { bgcolor: 'rgba(229,160,13,0.85)' },
            }}
          >
            {fav
              ? <Favorite sx={{ color: '#E5A00D', fontSize: 20 }} />
              : <FavoriteBorder sx={{ color: 'white', fontSize: 20 }} />
            }
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap title={movie.title}>
          {movie.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {year}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0.5, pb: 1, px: 1 }}>
        <Rating value={movie.vote_average / 2} precision={0.5} readOnly size="small" max={5} />
      </CardActions>
    </Card>
  );
}
