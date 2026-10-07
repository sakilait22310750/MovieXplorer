/**
 * Home Page
 * Main landing page featuring:
 * 1. Plex-style Cinematic Hero with animated poster collage and elegant title banner
 * 2. SearchBar with instant autocompletion and collapsible filters
 * 3. Search results MovieGrid when active
 * 4. Trending Section with "Trending This Week" + 5 Genre Carousels (Action, Comedy, Horror, Sci-Fi, Animation) when idle
 */

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';
import MovieGrid from '../components/MovieGrid';
import { useMovie } from '../context/MovieContext';
import { getTrending, getImageUrl } from '../api/tmdb';

export default function Home() {
  const { lastSearch, searchResults, setLastSearch, setSearchResults, setSearchParams } = useMovie();
  const [heroPosterUrls, setHeroPosterUrls] = useState([]);

  // 1. Reset any leftover search queries when returning to Home so trending carousels display cleanly
  useEffect(() => {
    setLastSearch('');
    setSearchResults([]);
    setSearchParams({ query: '', genre: '', year: '', rating: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch top trending movie posters to build the dynamic background collage
  useEffect(() => {
    getTrending()
      .then((res) => {
        const posters = (res.data.results || [])
          .filter((m) => m.poster_path)
          .slice(0, 18)
          .map((m) => getImageUrl(m.poster_path, 'w342'));
        setHeroPosterUrls(posters);
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      {/* ── 1. Plex-Style Cinematic Hero Header ── */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 320, md: 420 },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#0d0d0d',
        }}
      >
        {/* Dynamic Poster Collage — Right-Aligned Background */}
        {heroPosterUrls.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              right: { xs: '-60%', sm: '-20%', md: '0%' },
              top: 0,
              bottom: 0,
              width: { xs: '100%', md: '62%' },
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              transform: 'skewX(-4deg)',
              opacity: 0.65,
              pointerEvents: 'none',
            }}
          >
            {/* Collage Column 1 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: '-40px' }}>
              {heroPosterUrls.slice(0, 6).map((url, i) => (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt=""
                  sx={{ width: 130, height: 195, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                />
              ))}
            </Box>
            {/* Collage Column 2 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: '30px' }}>
              {heroPosterUrls.slice(6, 12).map((url, i) => (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt=""
                  sx={{ width: 130, height: 195, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                />
              ))}
            </Box>
            {/* Collage Column 3 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: '-20px' }}>
              {heroPosterUrls.slice(12, 18).map((url, i) => (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt=""
                  sx={{ width: 130, height: 195, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Dark Vignette Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #0d0d0d 45%, rgba(13,13,13,0.7) 65%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero Branding & Headline Typography */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 6 }}>
          <Box sx={{ maxWidth: 520 }}>
            <Typography
              variant="h3"
              fontWeight={900}
              lineHeight={1.2}
              sx={{ 
                color: '#fff', 
                mb: 2, 
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: '"Georgia", "Times New Roman", serif',
                letterSpacing: '0.5px'
              }}
            >
              Discover millions of movies, explore trending titles, and save your favorites.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── 2. Search Bar + Content Sections ── */}
      <Container maxWidth="xl" sx={{ py: 4 }} id="search-section">
        <SearchBar />

        {/* Search Results Display View (Active Query) */}
        {searchResults.length > 0 && (
          <Box mb={5}>
            <Divider sx={{ mb: 3, borderColor: '#333' }} />
            <MovieGrid title={`Results for "${lastSearch}"`} />
          </Box>
        )}

        {/* Default Browse View: Trending This Week + 5 Genre Carousels (Idle) */}
        {searchResults.length === 0 && <TrendingSection />}
      </Container>
    </Box>
  );
}
