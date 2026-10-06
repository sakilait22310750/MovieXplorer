import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';
import MovieGrid from '../components/MovieGrid';
import { useMovie } from '../context/MovieContext';
import { getTrending, getImageUrl } from '../api/tmdb';

export default function Home() {
  const { lastSearch, searchResults, setLastSearch, setSearchResults } = useMovie();
  const [heroPosterUrls, setHeroPosterUrls] = useState([]);

  // Clear last search on mount so homepage always shows trending movies
  useEffect(() => {
    setLastSearch('');
    setSearchResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch trending movies for the hero poster collage background
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
      {/* ── Plex-style Hero ── */}
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
        {/* Poster collage — right side */}
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
            {/* Column 1 */}
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
            {/* Column 2 */}
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
            {/* Column 3 */}
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

        {/* Dark gradient overlay — left fade */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #0d0d0d 45%, rgba(13,13,13,0.7) 65%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero text — left side */}
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

      {/* ── Search + Content ── */}
      <Container maxWidth="xl" sx={{ py: 4 }} id="search-section">
        <SearchBar />

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box mb={5}>
            <Divider sx={{ mb: 3, borderColor: '#333' }} />
            <MovieGrid title={`Results for "${lastSearch}"`} />
          </Box>
        )}

        {/* Trending Section */}
        {searchResults.length === 0 && <TrendingSection />}
      </Container>
    </Box>
  );
}
