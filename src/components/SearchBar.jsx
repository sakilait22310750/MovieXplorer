import React, { useState, useEffect, useRef } from 'react';
import {
  Box, TextField, IconButton, InputAdornment, FormControl,
  Select, MenuItem, InputLabel, Chip, Tooltip, Collapse,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  TuneOutlined as TuneIcon,
} from '@mui/icons-material';
import { searchMovies, getGenres } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

export default function SearchBar() {
  const {
    lastSearch, setLastSearch,
    setSearchResults, setSearchLoading, setSearchError,
    setCurrentPage, setTotalPages,
  } = useMovie();

  const [query, setQuery] = useState(lastSearch || '');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef();

  // Load genres on mount
  useEffect(() => {
    getGenres()
      .then((res) => setGenres(res.data.genres || []))
      .catch(() => {});
  }, []);

  const doSearch = async (q = query, page = 1) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setSearchLoading(true);
    setSearchError('');
    setLastSearch(trimmed);

    try {
      const res = await searchMovies(trimmed, page);
      let results = res.data.results || [];

      // Client-side filtering
      if (selectedGenre) {
        results = results.filter((m) =>
          m.genre_ids?.includes(Number(selectedGenre))
        );
      }
      if (selectedYear) {
        results = results.filter((m) =>
          m.release_date?.startsWith(selectedYear)
        );
      }
      if (selectedRating) {
        results = results.filter((m) =>
          m.vote_average >= Number(selectedRating)
        );
      }

      setSearchResults(results);
      setCurrentPage(res.data.page || 1);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      setSearchError('Failed to fetch search results. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setLastSearch('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    inputRef.current?.focus();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => String(currentYear - i));
  const ratings = ['9', '8', '7', '6', '5'];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Search movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          variant="outlined"
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ borderRadius: 2 }}
        />
        <Tooltip title="Search">
          <IconButton
            color="primary"
            onClick={() => doSearch()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              width: 48,
              height: 48,
            }}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Filters">
          <IconButton onClick={() => setShowFilters((s) => !s)} color={showFilters ? 'primary' : 'default'}>
            <TuneIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Collapse in={showFilters}>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenre}
              label="Genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Min Rating</InputLabel>
            <Select value={selectedRating} label="Min Rating" onChange={(e) => setSelectedRating(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {ratings.map((r) => <MenuItem key={r} value={r}>{r}+ ⭐</MenuItem>)}
            </Select>
          </FormControl>

          {(selectedGenre || selectedYear || selectedRating) && (
            <Chip
              label="Clear Filters"
              onDelete={() => { setSelectedGenre(''); setSelectedYear(''); setSelectedRating(''); }}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}

          <Button variant="contained" size="small" onClick={() => doSearch()} startIcon={<FilterIcon />}>
            Apply
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
