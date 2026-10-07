/**
 * SearchBar Component
 * Offers real-time debounced search suggestions via TMDB Autocomplete,
 * collapsible multi-attribute filter controls (Genre, Release Year, Minimum Rating),
 * and query execution with auto-routing to Search vs Discover.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, TextField, IconButton, InputAdornment, FormControl,
  Select, MenuItem, InputLabel, Chip, Tooltip, Collapse,
  Button, Autocomplete, CircularProgress, Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  TuneOutlined as TuneIcon,
} from '@mui/icons-material';
import { searchMovies, getGenres, getImageUrl, discoverMovies } from '../api/tmdb';
import { useMovie } from '../context/MovieContext';

export default function SearchBar() {
  // Context state bindings
  const {
    lastSearch, setLastSearch,
    setSearchParams,
    setSearchResults, setSearchLoading, setSearchError,
    setCurrentPage, setTotalPages,
  } = useMovie();

  // Local filter & input state
  const [query, setQuery] = useState(lastSearch || '');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Real-time Autocomplete suggestion states
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const inputRef = useRef();

  // 1. Fetch available genres list on mount
  useEffect(() => {
    getGenres()
      .then((res) => setGenres(res.data.genres || []))
      .catch(() => {});
  }, []);

  // 2. Debounced auto-complete suggestions (triggers after 300ms of user typing)
  useEffect(() => {
    if (!query || !query.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await searchMovies(query.trim(), 1);
        setSuggestions(res.data.results?.slice(0, 5) || []); // Top 5 quick matches
      } catch (err) {
        // Silently ignore suggestion errors
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 3. Main Search / Filter Execution
  const doSearch = async (q = query, page = 1) => {
    const trimmed = q.trim();
    // If search is completely blank and no filters are set, clear results
    if (!trimmed && !selectedGenre && !selectedYear && !selectedRating) {
      setSearchResults([]);
      setLastSearch('');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    setLastSearch(trimmed || 'Filtered Results');
    
    // Save search parameters to context so "Load More" can paginate properly
    setSearchParams({
      query: trimmed,
      genre: selectedGenre,
      year: selectedYear,
      rating: selectedRating,
    });
    setOpen(false); // Dismiss suggestion dropdown

    try {
      let results = [];
      let totalPgs = 1;

      if (trimmed) {
        // Keyword text search (with client-side filter refining)
        const res = await searchMovies(trimmed, page);
        results = res.data.results || [];
        totalPgs = res.data.total_pages || 1;

        if (selectedGenre) {
          results = results.filter((m) => m.genre_ids?.includes(Number(selectedGenre)));
        }
        if (selectedYear) {
          results = results.filter((m) => m.release_date?.startsWith(selectedYear));
        }
        if (selectedRating) {
          results = results.filter((m) => m.vote_average >= Number(selectedRating));
        }
      } else {
        // Multi-attribute Discover query without keyword
        const filters = {};
        if (selectedGenre) filters.with_genres = selectedGenre;
        if (selectedYear) filters.primary_release_year = selectedYear;
        if (selectedRating) filters['vote_average.gte'] = selectedRating;
        
        const res = await discoverMovies(filters, page);
        results = res.data.results || [];
        totalPgs = res.data.total_pages || 1;
      }

      setSearchResults(results);
      setCurrentPage(page);
      setTotalPages(totalPgs);
    } catch (err) {
      setSearchError('Failed to fetch search results. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // 4. Reset all search input and filter selections
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSearchResults([]);
    setLastSearch('');
    setSearchParams({
      query: '',
      genre: '',
      year: '',
      rating: '',
    });
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    inputRef.current?.focus();
  };

  // Generate recent 30 years list for year filter dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => String(currentYear - i));
  const ratings = ['9', '8', '7', '6', '5'];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        
        {/* ── Autocomplete Search Input ── */}
        <Autocomplete
          freeSolo
          fullWidth
          open={open && suggestions.length > 0}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={suggestions}
          getOptionLabel={(option) => typeof option === 'string' ? option : (option?.title || '')}
          filterOptions={(x) => x}
          inputValue={query}
          onInputChange={(event, newInputValue) => {
            setQuery(newInputValue);
          }}
          onChange={(event, newValue) => {
            if (newValue && typeof newValue !== 'string') {
              setQuery(newValue.title || '');
              doSearch(newValue.title || '');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              doSearch();
            }
          }}
          renderOption={(props, option) => {
            if (typeof option === 'string') return null;
            return (
              <li {...props} key={option?.id || Math.random()} style={{ padding: '8px 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {option?.poster_path ? (
                    <Box
                      component="img"
                      src={getImageUrl(option.poster_path, 'w92')}
                      alt={option.title}
                      sx={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : (
                    <Box sx={{ width: 40, height: 60, bgcolor: '#333', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.secondary">No Img</Typography>
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {option?.title || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {option?.release_date?.slice(0, 4)} • ⭐ {option?.vote_average?.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={inputRef}
              placeholder="Search movies, TV shows..."
              variant="outlined"
              size="medium"
              InputProps={{
                ...(params.InputProps || {}),
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <React.Fragment>
                    {loadingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                    {query && (
                      <InputAdornment position="end" sx={{ position: 'absolute', right: 40 }}>
                        <IconButton onClick={handleClear} size="small">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )}
                    {params.InputProps?.endAdornment}
                  </React.Fragment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 2, paddingRight: '60px !important' } 
              }}
            />
          )}
        />

        {/* Search Submit Button */}
        <Tooltip title="Search">
          <IconButton
            onClick={() => doSearch()}
            sx={{
              bgcolor: '#E5A00D',
              color: '#000',
              '&:hover': { bgcolor: '#C8880A' },
              width: 48,
              height: 48,
              borderRadius: 2,
              flexShrink: 0
            }}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>

        {/* Toggle Filters Button */}
        <Tooltip title="Toggle Filters">
          <IconButton onClick={() => setShowFilters((s) => !s)} color={showFilters ? 'primary' : 'default'} sx={{ flexShrink: 0 }}>
            <TuneIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Collapsible Filters Panel ── */}
      <Collapse in={showFilters}>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Genre Dropdown */}
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

          {/* Release Year Dropdown */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Minimum Rating Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Min Rating</InputLabel>
            <Select value={selectedRating} label="Min Rating" onChange={(e) => setSelectedRating(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {ratings.map((r) => <MenuItem key={r} value={r}>{r}+ ⭐</MenuItem>)}
            </Select>
          </FormControl>

          {/* Reset Filters Chip */}
          {(selectedGenre || selectedYear || selectedRating) && (
            <Chip
              label="Clear Filters"
              onDelete={() => { setSelectedGenre(''); setSelectedYear(''); setSelectedRating(''); setSearchResults([]); setLastSearch(''); }}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}

          {/* Apply Filters Button */}
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => doSearch()} 
            startIcon={<FilterIcon />}
            sx={{
              bgcolor: '#E5A00D',
              color: '#000',
              fontWeight: 700,
              '&:hover': { bgcolor: '#C8880A' }
            }}
          >
            Apply
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
