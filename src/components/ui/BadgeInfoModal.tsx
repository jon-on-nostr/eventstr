import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Fade,
  Grow,
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import {
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  PersonAdd as PersonAddIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { BadgesService, BadgeDefinition } from '@/services/badges';
import NDK from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import ErrorBoundary from '@/components/ErrorBoundary';

// Types for component props
interface BadgeInfoModalProps {
  ndk: NDK;
  badge: BadgeDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

// Badge assignment state type
type AssignmentState = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  npubInput: string;
  error: string | null;
};

/**
 * BadgeInfoModal Component
 *
 * Displays detailed information about a badge and allows assigning it to users
 */
const BadgeInfoModal: React.FC<BadgeInfoModalProps> = ({ ndk, badge, isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Badge service initialization
  const badgesService = new BadgesService(ndk);

  // Assignment state
  const [assignmentState, setAssignmentState] = useState<AssignmentState>({
    status: 'idle',
    npubInput: '',
    error: null,
  });

  // Flip animation state
  const [flipState, setFlipState] = useState({
    flipped: false,
    zoomed: false,
  });

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset assignment state
      setAssignmentState({
        status: 'idle',
        npubInput: '',
        error: null,
      });

      // Reset animation state
      setFlipState({
        flipped: false,
        zoomed: false,
      });
    } else {
      // Start animation sequence when modal opens
      setTimeout(() => {
        setFlipState(prev => ({ ...prev, flipped: true }));
        setTimeout(() => {
          setFlipState(prev => ({ ...prev, zoomed: true }));
        }, 400); // Start zoom after flip animation starts
      }, 100);
    }
  }, [isOpen]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignmentState(prev => ({
      ...prev,
      npubInput: e.target.value,
      error: null,
    }));
  };

  // Validate npub
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

  // Handle assignment submission
  const handleAssignBadge = async () => {
    if (!badge) return;

    // Validate input
    const validNpub = validateNpub(assignmentState.npubInput);

    if (!validNpub) {
      setAssignmentState(prev => ({
        ...prev,
        error: 'Invalid npub. Please enter a valid Nostr public key.',
      }));
      return;
    }

    // Set submitting state
    setAssignmentState(prev => ({
      ...prev,
      status: 'submitting',
      error: null,
    }));

    try {
      // Convert npub to hex pubkey
      const { data: pubkey } = nip19.decode(validNpub);

      // Award badge
      await badgesService.awardBadge(badge.id, [pubkey as string]);

      // Update state on success
      setAssignmentState(prev => ({
        ...prev,
        status: 'success',
        npubInput: '',
      }));

      // Reset success state after 3 seconds
      setTimeout(() => {
        setAssignmentState(prev => ({
          ...prev,
          status: 'idle',
        }));
      }, 3000);
    } catch (error) {
      console.error('Error assigning badge:', error);
      setAssignmentState(prev => ({
        ...prev,
        status: 'error',
        error: 'Failed to assign badge. Please try again.',
      }));
    }
  };

  // Copy badge ID to clipboard
  const copyBadgeId = () => {
    if (!badge) return;
    navigator.clipboard.writeText(badge.id);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text fill="%23FF0000" font-size="14" font-family="sans-serif" x="10" y="50">Image Error</text></svg>';
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!isOpen || !badge) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1300,
          perspective: '1000px',
        }}
        onClick={onClose}
      >
        {/* Success animation overlay */}
        {assignmentState.status === 'success' && (
          <Fade in={assignmentState.status === 'success'}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <Grow in={true} timeout={800}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 100,
                      color: '#0f0',
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(0.8)',
                          opacity: 0.7,
                        },
                        '50%': {
                          transform: 'scale(1.1)',
                          opacity: 1,
                        },
                        '100%': {
                          transform: 'scale(0.8)',
                          opacity: 0.7,
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      mt: 2,
                      color: '#0f0',
                      fontFamily: '"Share Tech Mono", monospace',
                      animation: 'fadeIn 1s',
                      '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                      },
                    }}
                  >
                    BADGE_ASSIGNED
                  </Typography>
                </Box>
              </Grow>
            </Box>
          </Fade>
        )}

        {/* Flipping Card Container */}
        <Box
          onClick={e => e.stopPropagation()}
          sx={{
            width: isMobile ? '95%' : '700px',
            height: isMobile ? '90vh' : '80vh',
            maxHeight: '700px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s',
            transform: flipState.flipped
              ? 'rotateY(180deg)' + (flipState.zoomed ? ' scale(1)' : ' scale(0.6)')
              : 'rotateY(0deg) scale(0.6)',
          }}
        >
          {/* Front of card (badge thumbnail) */}
          <Paper
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              bgcolor: '#222',
              color: '#eee',
              border: '1px solid #0f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 3,
            }}
          >
            <Box
              sx={{
                width: '70%',
                height: '60%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Image
                src={badge.image}
                alt={badge.name}
                onError={handleImageError}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ color: '#0f0', mb: 1, textAlign: 'center' }}
            >
              {badge.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#bbb', textAlign: 'center' }}>
              {badge.description.length > 100
                ? badge.description.substring(0, 100) + '...'
                : badge.description}
            </Typography>
          </Paper>

          {/* Back of card (badge details and assignment form) */}
          <Paper
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              bgcolor: '#111',
              color: '#eee',
              border: '1px solid #0f0',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #0f0',
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                {badge.name}
              </Typography>
              <IconButton onClick={onClose} size="small" sx={{ color: '#0f0' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {/* Badge Image and Info */}
              <Box
                sx={{
                  p: 2,
                  width: isMobile ? '100%' : '40%',
                  borderRight: isMobile ? 'none' : '1px solid #333',
                  borderBottom: isMobile ? '1px solid #333' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    bgcolor: '#222',
                    border: '1px solid #333',
                    p: 1,
                  }}
                >
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    onError={handleImageError}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                <Box sx={{ width: '100%', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#999', mb: 0.5 }}>
                    Badge ID:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        bgcolor: '#222',
                        p: 1,
                        borderRadius: 1,
                        color: '#0f0',
                        mr: 1,
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {badge.id.slice(0, 8)}...{badge.id.slice(-8)}
                    </Typography>
                    <Tooltip title="Copy badge ID">
                      <IconButton size="small" onClick={copyBadgeId} sx={{ color: '#0f0' }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{ color: '#999', alignSelf: 'flex-start', mb: 0.5 }}
                >
                  Description:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ccc',
                    width: '100%',
                    mb: 2,
                    p: 1,
                    bgcolor: '#222',
                    borderRadius: 1,
                    maxHeight: isMobile ? '80px' : '120px',
                    overflow: 'auto',
                  }}
                >
                  {badge.description}
                </Typography>

                <Box
                  sx={{
                    mt: 'auto',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Created: {formatDate(badge.createdAt)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    By: {badge.creator.slice(0, 6)}...
                  </Typography>
                </Box>
              </Box>

              {/* Badge Assignment Form */}
              <Box
                sx={{
                  p: 2,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: '#0f0', fontFamily: '"Share Tech Mono", monospace' }}
                >
                  ASSIGN_BADGE_TO_USER
                </Typography>

                {assignmentState.error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      bgcolor: '#330000',
                      color: '#ff9999',
                      border: '1px solid #ff0000',
                    }}
                  >
                    {assignmentState.error}
                  </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Enter npub to award"
                    placeholder="npub1..."
                    value={assignmentState.npubInput}
                    onChange={handleInputChange}
                    disabled={assignmentState.status === 'submitting'}
                    sx={{
                      mb: 1,
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
                    }}
                  />

                  <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
                    Enter the Nostr public key (npub) of the person you want to award this badge to.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Button
                    variant="contained"
                    disabled={
                      assignmentState.status === 'submitting' || !assignmentState.npubInput.trim()
                    }
                    startIcon={
                      assignmentState.status === 'submitting' ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <PersonAddIcon />
                      )
                    }
                    onClick={handleAssignBadge}
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
                      minWidth: '180px',
                      py: 1,
                    }}
                  >
                    {assignmentState.status === 'submitting' ? 'Assigning...' : 'Assign Badge'}
                  </Button>
                </Box>

                <Box sx={{ p: 2, border: '1px dashed #444', borderRadius: 2, mt: 'auto' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#0f0',
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    TIPS_FOR_ASSIGNING_BADGES
                  </Typography>
                  <ul style={{ color: '#aaa', paddingLeft: '20px', margin: 0 }}>
                    <li>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Recipients will need to accept the badge for it to appear in their
                        collection
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Badge assignments are public and recorded on the Nostr network
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        You can award the same badge to multiple recipients
                      </Typography>
                    </li>
                  </ul>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default BadgeInfoModal;
