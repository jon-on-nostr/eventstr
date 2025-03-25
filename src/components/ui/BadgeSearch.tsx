import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Alert,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { BadgesService } from '@/services/badges';
import type { BadgeDefinition } from '@/services/badges';
import NDK from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import ErrorBoundary from '@/components/ErrorBoundary';

// Types for component props
interface BadgeSearchProps {
  ndk: NDK;
}

// Types for state management
interface BadgeSearchState {
  isLoading: boolean;
  error: string | null;
  userBadges: Array<BadgeDefinition & { status: 'pending' | 'accepted' | 'blocked' }> | null;
}

/**
 * Badge Search Component
 *
 * Allows searching for badges by npub and displays the results
 */
const BadgeSearch: React.FC<BadgeSearchProps> = ({ ndk }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [npubInput, setNpubInput] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [searchState, setSearchState] = useState<BadgeSearchState>({
    isLoading: false,
    error: null,
    userBadges: null,
  });

  // Create badge service instance with memoization to prevent recreation on rerenders
  const badgesService = useMemo(() => new BadgesService(ndk), [ndk]);

  /**
   * Validates npub input and returns a standardized format if valid
   * @param input The input string to validate
   * @returns The validated and formatted npub or null if invalid
   */
  const validateNpub = (input: string): string | null => {
    try {
      const trimmed = input.trim();

      if (!trimmed) {
        return null;
      }

      // Handle hex pubkey format
      if (!trimmed.startsWith('npub')) {
        if (/^[0-9a-f]{64}$/i.test(trimmed)) {
          // Valid hex pubkey format
          return nip19.npubEncode(trimmed);
        }
        return null;
      }

      // Handle npub format
      try {
        const decoded = nip19.decode(trimmed);
        if (decoded.type !== 'npub') {
          return null;
        }
        // Re-encode to ensure consistent format
        return nip19.npubEncode(decoded.data as string);
      } catch {
        return null;
      }
    } catch {
      // Catch any unexpected errors during validation
      return null;
    }
  };

  /**
   * Handles search for badges by npub with a timeout
   * Validates input, shows loading state, and updates results
   */
  const handleSearch = async () => {
    // Reset previous state
    setSearchState({
      isLoading: true,
      error: null,
      userBadges: null,
    });
    setInfoMessage('');

    // Validate input first
    const validNpub = validateNpub(npubInput);

    if (!validNpub) {
      setSearchState({
        isLoading: false,
        error: 'Invalid input. Please enter a valid npub or 64-character hex pubkey.',
        userBadges: null,
      });
      return;
    }

    try {
      // Set up a timeout promise that rejects after 15 seconds
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('TIMEOUT'));
        }, 15000); // 15 seconds timeout

        // Store the timeout ID in case we need to clear it
        return () => clearTimeout(timeoutId);
      });

      // Set up the badge fetching promise
      const fetchBadgesPromise = badgesService.getUserBadges(validNpub);

      // Race the fetch against the timeout
      let userBadges;
      try {
        userBadges = (await Promise.race([
          fetchBadgesPromise,
          timeoutPromise,
        ])) as (BadgeDefinition & { status: 'pending' | 'accepted' | 'blocked' })[];
      } catch (error) {
        if (error instanceof Error && error.message === 'TIMEOUT') {
          // Handle timeout specifically
          console.log('Badge search timed out after 15 seconds');
          setSearchState({
            isLoading: false,
            error: null,
            userBadges: [], // Empty array to show the "no badges found" UI
          });
          setInfoMessage(
            `The search timed out. No badges found for ${validNpub} within the time limit.`
          );
          return;
        } else {
          // Handle other errors
          console.error('Error fetching badges:', error);
          setSearchState({
            isLoading: false,
            error:
              'Unable to fetch badges. There might be an issue with the connection or Nostr relays.',
            userBadges: null,
          });
          return;
        }
      }

      // If we got here, we have results before the timeout
      // Update state with results
      setSearchState({
        isLoading: false,
        error: null,
        userBadges: userBadges,
      });

      // Display appropriate message based on results
      if (userBadges.length === 0) {
        setInfoMessage(`No badges found for ${validNpub}`);
      } else {
        setInfoMessage(
          `Found ${userBadges.length} badge${userBadges.length === 1 ? '' : 's'} for ${validNpub}`
        );
      }
    } catch (error) {
      // Catch any unexpected errors during the overall search process
      console.error('Unexpected error during badge search:', error);
      setSearchState({
        isLoading: false,
        error: 'Something went wrong. Please try again later.',
        userBadges: null,
      });
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get status color for badge chip
  const getStatusColor = (status: 'pending' | 'accepted' | 'blocked') => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'blocked':
        return 'error';
      default:
        return 'warning';
    }
  };

  // Format npub for display (truncate)
  const formatNpub = (npub: string): string => {
    return `${npub.substring(0, 8)}...${npub.substring(npub.length - 4)}`;
  };

  // Component for displaying a single badge with error handling
  const BadgeCard = ({
    badge,
  }: {
    badge: BadgeDefinition & { status: 'pending' | 'accepted' | 'blocked' };
  }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          bgcolor: '#222',
          color: '#eee',
          border: '1px solid #0f0',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 8px #0f0',
          },
        }}
      >
        {imageError ? (
          <Box
            sx={{
              height: 140,
              bgcolor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 60, color: '#0f0' }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            height="140"
            image={badge.image}
            alt={badge.name}
            sx={{ objectFit: 'contain', bgcolor: '#333', p: 1 }}
            onError={() => setImageError(true)}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#0f0' }}>
              {badge.name}
            </Typography>
            <Chip label={badge.status} size="small" color={getStatusColor(badge.status)} />
          </Box>

          <Typography variant="body2" sx={{ mb: 1, color: '#bbb' }}>
            {badge.description}
          </Typography>

          <Typography variant="caption" display="block" sx={{ color: '#999' }}>
            Creator: {formatNpub(badge.creator)}
          </Typography>

          <Typography variant="caption" display="block" sx={{ color: '#999' }}>
            Created: {new Date(badge.createdAt * 1000).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  // Skeleton loader for when results are loading
  const BadgeCardSkeleton = () => (
    <Card sx={{ height: '100%', bgcolor: '#222', border: '1px solid #333' }}>
      <Skeleton variant="rectangular" height={140} sx={{ bgcolor: '#333' }} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton width="60%" height={32} sx={{ bgcolor: '#333' }} />
          <Skeleton width="20%" height={24} sx={{ bgcolor: '#333' }} />
        </Box>
        <Skeleton width="100%" height={20} sx={{ mb: 0.5, bgcolor: '#333' }} />
        <Skeleton width="100%" height={20} sx={{ mb: 0.5, bgcolor: '#333' }} />
        <Skeleton width="70%" height={16} sx={{ mt: 1, bgcolor: '#333' }} />
        <Skeleton width="50%" height={16} sx={{ mt: 0.5, bgcolor: '#333' }} />
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary>
      <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', mb: 3, flexDirection: isMobile ? 'column' : 'row' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter npub"
            placeholder="npub1..."
            value={npubInput}
            onChange={e => setNpubInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              mb: isMobile ? 2 : 0,
              mr: isMobile ? 0 : 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0f0',
                },
                '&:hover fieldset': {
                  borderColor: '#0f0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0f0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#0f0',
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
            }}
            InputProps={{
              spellCheck: false,
              // Reset button if there's input
              endAdornment: npubInput ? (
                <Button onClick={() => setNpubInput('')} sx={{ color: '#0f0', minWidth: 'auto' }}>
                  ×
                </Button>
              ) : null,
            }}
          />

          <Button
            onClick={handleSearch}
            variant="contained"
            disabled={searchState.isLoading}
            startIcon={
              searchState.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            sx={{
              bgcolor: '#0f0',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#0c0',
              },
              '&.Mui-disabled': {
                bgcolor: '#060',
                color: '#333',
              },
              minWidth: isMobile ? '100%' : '120px',
            }}
          >
            {searchState.isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        {/* Info message */}
        {infoMessage && (
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              textAlign: 'center',
              fontStyle: 'italic',
              color: '#0f0',
              fontFamily: '"Share Tech Mono", monospace',
            }}
          >
            {infoMessage}
          </Typography>
        )}

        {/* Error message */}
        {searchState.error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: '#330000',
              color: '#ff9999',
              border: '1px solid #ff0000',
            }}
          >
            {searchState.error}
          </Alert>
        )}

        {/* Loading skeleton */}
        {searchState.isLoading && (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <BadgeCardSkeleton />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Results grid */}
        {!searchState.isLoading && searchState.userBadges && searchState.userBadges.length > 0 && (
          <Grid container spacing={3}>
            {searchState.userBadges.map(badge => (
              <Grid item xs={12} sm={6} md={4} key={badge.id}>
                <ErrorBoundary
                  fallback={
                    <Card
                      sx={{ height: '100%', bgcolor: '#331111', border: '1px solid #ff0000', p: 2 }}
                    >
                      <Typography color="#ff9999">Failed to render badge</Typography>
                    </Card>
                  }
                >
                  <BadgeCard badge={badge} />
                </ErrorBoundary>
              </Grid>
            ))}
          </Grid>
        )}

        {/* No results found state */}
        {!searchState.isLoading &&
          searchState.userBadges &&
          searchState.userBadges.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                my: 4,
                p: 3,
                border: '1px dashed #0f0',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#0f0', mb: 1, fontFamily: '"Share Tech Mono", monospace' }}
              >
                NO_BADGES_FOUND
              </Typography>
              <Typography sx={{ color: '#aaa' }}>
                This user hasn&apos;t received any badges yet or they may exist on relays that
                aren&apos;t currently connected.
              </Typography>
            </Box>
          )}
      </Box>
    </ErrorBoundary>
  );
};

export default BadgeSearch;
