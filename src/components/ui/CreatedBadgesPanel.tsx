import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { BadgesService, BadgeDefinition } from '@/services/badges';
import NDK from '@nostr-dev-kit/ndk';
import BadgeInfoModal from '@/components/ui/BadgeInfoModal';
import ErrorBoundary from '@/components/ErrorBoundary';

// Types for component props
interface CreatedBadgesPanelProps {
  ndk: NDK;
}

/**
 * Simple CreatedBadgesPanel Component
 *
 * Displays badges created by the current user
 */
const CreatedBadgesPanel: React.FC<CreatedBadgesPanelProps> = ({ ndk }) => {
  const [modalState, setModalState] = useState({
    open: false,
    selectedBadge: null as BadgeDefinition | null,
  });

  // Badge service
  const badgesService = useMemo(() => new BadgesService(ndk), [ndk]);

  // State for badges created by the user
  const [createdBadges, setCreatedBadges] = useState<BadgeDefinition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load creator's badges
  useEffect(() => {
    const loadCreatorBadges = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // Get current user's pubkey
        if (!ndk.signer) {
          throw new Error('You must be signed in to view your created badges');
        }

        const user = await ndk.signer.user();
        if (!user.pubkey) {
          throw new Error('Could not determine your public key');
        }

        // Get badges created by this user
        const badges = await badgesService.queryBadgeDefinitions({
          creator: user.pubkey,
          limit: 50,
        });

        setCreatedBadges(badges);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading badges:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load badges');
        setIsLoading(false);
      }
    };

    loadCreatorBadges();
  }, [ndk, badgesService]);

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text fill="%23FF0000" font-size="14" font-family="sans-serif" x="10" y="50">Image Error</text></svg>';
  };

  const handleOpenModal = (badge: BadgeDefinition) => {
    setModalState({
      open: true,
      selectedBadge: badge,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      open: false,
      selectedBadge: null,
    });
  };

  return (
    <ErrorBoundary>
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#111',
          color: '#0f0',
          border: '1px solid #0f0',
          p: 3,
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontFamily: '"Share Tech Mono", monospace' }}
        >
          MY_CREATED_BADGES
        </Typography>

        {!ndk.signer && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              bgcolor: '#332700',
              color: '#ffdd99',
              border: '1px solid #ffaa00',
            }}
          >
            You must be signed in to view your created badges
          </Alert>
        )}

        {loadError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              bgcolor: '#330000',
              color: '#ff9999',
              border: '1px solid #ff0000',
            }}
          >
            {loadError}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} sx={{ color: '#0f0' }} />
          </Box>
        ) : createdBadges.length > 0 ? (
          <Grid2 container spacing={3}>
            {createdBadges.map(badge => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={badge.id}>
                <Card
                  onClick={() => handleOpenModal(badge)}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    bgcolor: '#222',
                    color: '#eee',
                    border: '1px solid #0f0',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 0 8px #0f0',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={badge.image}
                    alt={badge.name}
                    onError={handleImageError}
                    sx={{ objectFit: 'contain', bgcolor: '#333', p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ color: '#0f0', mb: 1 }}>
                      {badge.name}
                    </Typography>
                    <Typography variant="body2" color="#bbb" sx={{ mb: 2 }}>
                      {badge.description.length > 120
                        ? badge.description.substring(0, 120) + '...'
                        : badge.description}
                    </Typography>
                    <Typography variant="caption" color="#999">
                      Created: {new Date(badge.createdAt * 1000).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        ) : (
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
              NO_BADGES_CREATED
            </Typography>
            <Typography sx={{ color: '#aaa', mb: 3 }}>
              You haven&apos;t created any badges yet. Create your first badge to get started.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                color: '#0f0',
                borderColor: '#0f0',
                '&:hover': {
                  borderColor: '#0f0',
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                },
              }}
              onClick={() => {
                /* Navigate to badge creation */
              }}
            >
              Create Badge
            </Button>
          </Box>
        )}
      </Paper>
      <BadgeInfoModal
        ndk={ndk}
        badge={modalState.selectedBadge}
        isOpen={modalState.open}
        onClose={handleCloseModal}
      />
    </ErrorBoundary>
  );
};

export default CreatedBadgesPanel;
