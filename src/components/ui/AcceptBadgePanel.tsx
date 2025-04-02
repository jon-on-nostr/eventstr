import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { BadgesService } from '@/services/badges';
import NDK from '@nostr-dev-kit/ndk';
import { BadgeDefinition } from '@/services/badges';
import ErrorBoundary from '@/components/ErrorBoundary';
import { usePendingBadges } from '@/hooks/usePendingBadges';

interface AcceptBadgeSectionProps {
  ndk: NDK;
}

/**
 * AcceptBadgeSection Component
 *
 * Displays badges that have been awarded to the user but not yet accepted or rejected
 */
const AcceptBadgeSection: React.FC<AcceptBadgeSectionProps> = ({ ndk }) => {
  const badgesService = useMemo(() => new BadgesService(ndk), [ndk]);

  const {
    pendingBadges,
    isLoading,
    acceptBadge,
    blockBadge,
    fetchPendingBadges: refreshPendingBadges,
  } = usePendingBadges(badgesService);
  // State for badge detail modal
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    badge: BadgeDefinition | null;
  }>({
    open: false,
    badge: null,
  });

  // State for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    badge: BadgeDefinition | null;
    action: 'accept' | 'reject' | null;
  }>({
    open: false,
    badge: null,
    action: null,
  });

  // State for action feedback
  const [actionFeedback, setActionFeedback] = useState<{
    show: boolean;
    message: string;
    success: boolean;
    badgeId: string | null;
  }>({
    show: false,
    message: '',
    success: false,
    badgeId: null,
  });

  // Loading states for badge actions
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: {
      accepting: boolean;
      rejecting: boolean;
    };
  }>({});

  // Open badge detail modal
  const handleOpenDetail = (badge: BadgeDefinition) => {
    setDetailModal({
      open: true,
      badge,
    });
  };

  // Close badge detail modal
  const handleCloseDetail = () => {
    setDetailModal({
      open: false,
      badge: null,
    });
  };

  // Show confirmation dialog
  const handleShowConfirm = (badge: BadgeDefinition | null, action: 'accept' | 'reject') => {
    setConfirmDialog({
      open: true,
      badge,
      action,
    });
  };

  // Close confirmation dialog
  const handleCloseConfirm = () => {
    setConfirmDialog({
      open: false,
      badge: null,
      action: null,
    });
  };

  const handleAction = async (
    badge: BadgeDefinition | null,
    action: 'accept' | 'reject' | null
  ) => {
    // Close confirmation dialog
    handleCloseConfirm();
    if (!badge) return;

    // Set loading state
    setLoadingStates(prev => ({
      ...prev,
      [badge.id]: {
        accepting: action === 'accept',
        rejecting: action === 'reject',
      },
    }));

    try {
      // Use the hook functions instead of calling service directly
      if (action === 'accept') {
        await acceptBadge(badge.awardId);
      } else {
        await blockBadge(badge.awardId);
      }

      // Show success feedback
      setActionFeedback({
        show: true,
        message: action === 'accept' ? 'Badge accepted successfully!' : 'Badge rejected',
        success: true,
        badgeId: badge.id,
      });

      // Refresh the pending badges
      refreshPendingBadges();
    } catch (error) {
      console.error(`Error ${action}ing badge:`, error);

      // Show error feedback
      setActionFeedback({
        show: true,
        message: `Failed to ${action} badge: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        success: false,
        badgeId: badge.id,
      });
    } finally {
      // Clear loading state
      setLoadingStates(prev => {
        const newState = { ...prev };
        delete newState[badge.id];
        return newState;
      });

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setActionFeedback(prev => ({
          ...prev,
          show: false,
        }));
      }, 3000);
    }
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

  // Format creator name
  const formatCreator = (creator: string) => {
    return creator.length > 10
      ? `${creator.substring(0, 5)}...${creator.substring(creator.length - 5)}`
      : creator;
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
          PENDING_BADGES
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3,
            fontFamily: '"Share Tech Mono", monospace',
            color: '#aaa',
          }}
        >
          These badges have been awarded to you but require your acceptance.
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} sx={{ color: '#0f0' }} />
          </Box>
        ) : pendingBadges.length === 0 ? (
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
              NO_PENDING_BADGES
            </Typography>
            <Typography sx={{ color: '#aaa' }}>
              You have no pending badges to accept or reject.
            </Typography>
          </Box>
        ) : (
          <Grid2 container spacing={3}>
            {pendingBadges.map((badge, index) => (
              <Grow
                key={`${badge.id}${index}`}
                in={true}
                timeout={500}
                style={{ transformOrigin: '0 0 0' }}
              >
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: '#222',
                      color: '#eee',
                      border: '1px solid #0f0',
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    {/* "New" chip for visual indication */}
                    <Chip
                      label="Pending"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: '#0f0',
                        color: '#000',
                        fontWeight: 'bold',
                        zIndex: 1,
                      }}
                    />

                    <CardMedia
                      component="img"
                      height="140"
                      image={badge.image}
                      alt={badge.name}
                      onError={handleImageError}
                      sx={{
                        objectFit: 'contain',
                        bgcolor: '#333',
                        p: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleOpenDetail(badge)}
                    />
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="h6" component="div" sx={{ color: '#0f0', mb: 1 }}>
                        {badge.name}
                      </Typography>
                      <Typography variant="body2" color="#bbb" sx={{ mb: 2 }}>
                        {badge.description.length > 100
                          ? badge.description.substring(0, 100) + '...'
                          : badge.description}
                      </Typography>
                      <Typography variant="caption" color="#999" sx={{ display: 'block', mb: 0.5 }}>
                        From: {formatCreator(badge.creator)}
                      </Typography>
                      <Typography variant="caption" color="#999" sx={{ display: 'block', mb: 2 }}>
                        Date: {formatDate(badge.createdAt)}
                      </Typography>

                      {/* Action buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={
                            loadingStates[badge.id]?.rejecting ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          onClick={() => handleShowConfirm(badge, 'reject')}
                          disabled={
                            loadingStates[badge.id]?.accepting || loadingStates[badge.id]?.rejecting
                          }
                          sx={{
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                              borderColor: '#d32f2f',
                              backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            },
                            '&.Mui-disabled': {
                              borderColor: 'rgba(211, 47, 47, 0.3)',
                              color: 'rgba(211, 47, 47, 0.3)',
                            },
                          }}
                        >
                          {loadingStates[badge.id]?.rejecting ? 'Rejecting...' : 'Reject'}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={
                            loadingStates[badge.id]?.accepting ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          onClick={() => handleShowConfirm(badge, 'accept')}
                          disabled={
                            loadingStates[badge.id]?.accepting || loadingStates[badge.id]?.rejecting
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
                          }}
                        >
                          {loadingStates[badge.id]?.accepting ? 'Accepting...' : 'Accept'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grow>
            ))}
          </Grid2>
        )}

        {/* Badge Detail Dialog */}
        <Dialog
          open={detailModal.open}
          onClose={handleCloseDetail}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              color: '#eee',
              border: '1px solid #0f0',
              backgroundImage: 'none',
            },
          }}
        >
          {detailModal.badge && (
            <>
              <DialogTitle
                sx={{
                  borderBottom: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: '"Share Tech Mono", monospace',
                  color: '#0f0',
                }}
              >
                {detailModal.badge.name}
                <IconButton onClick={handleCloseDetail} size="small" sx={{ color: '#0f0' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      bgcolor: '#222',
                      border: '1px solid #333',
                      p: 1,
                    }}
                  >
                    <img
                      src={detailModal.badge.image}
                      alt={detailModal.badge.name}
                      onError={handleImageError}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="subtitle2" sx={{ color: '#999', mb: 0.5 }}>
                  Description:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ccc',
                    mb: 2,
                    p: 1,
                    bgcolor: '#222',
                    borderRadius: 1,
                  }}
                >
                  {detailModal.badge.description}
                </Typography>

                <Grid2 container spacing={2} sx={{ mb: 2 }}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ color: '#999', mb: 0.5 }}>
                      Creator:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#0f0',
                        p: 1,
                        bgcolor: '#222',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                      }}
                    >
                      {detailModal.badge.creator}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ color: '#999', mb: 0.5 }}>
                      Created:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#ccc',
                        p: 1,
                        bgcolor: '#222',
                        borderRadius: 1,
                      }}
                    >
                      {formatDate(detailModal.badge.createdAt)}
                    </Typography>
                  </Grid2>
                </Grid2>

                <Alert
                  severity="info"
                  icon={<InfoIcon sx={{ color: '#0f0' }} />}
                  sx={{
                    bgcolor: '#001a1a',
                    color: '#0f0',
                    border: '1px solid #0f0',
                    '& .MuiAlert-message': {
                      color: '#0f0',
                    },
                  }}
                >
                  Once accepted, this badge will appear in your badge collection and will be visible
                  to others on the Nostr network. Rejecting the badge will remove it from your
                  pending list.
                </Alert>
              </DialogContent>
              <DialogActions sx={{ borderTop: '1px solid #333', px: 3, py: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleCloseDetail();
                    handleShowConfirm(detailModal.badge, 'reject');
                  }}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    },
                  }}
                  startIcon={<CancelIcon />}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleCloseDetail();
                    handleShowConfirm(detailModal.badge, 'accept');
                  }}
                  sx={{
                    bgcolor: '#0f0',
                    color: '#000',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#0c0',
                    },
                  }}
                  startIcon={<CheckCircleIcon />}
                >
                  Accept
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={handleCloseConfirm}
          PaperProps={{
            sx: {
              bgcolor: '#111',
              color: '#eee',
              border: confirmDialog.action === 'accept' ? '1px solid #0f0' : '1px solid #f44336',
              backgroundImage: 'none',
              maxWidth: '400px',
            },
          }}
        >
          {confirmDialog.badge && (
            <>
              <DialogTitle
                sx={{
                  borderBottom: '1px solid #333',
                  color: confirmDialog.action === 'accept' ? '#0f0' : '#f44336',
                  fontFamily: '"Share Tech Mono", monospace',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {confirmDialog.action === 'accept' ? (
                  <CheckCircleIcon sx={{ mr: 1 }} />
                ) : (
                  <ErrorIcon sx={{ mr: 1 }} />
                )}
                {confirmDialog.action === 'accept' ? 'Accept Badge' : 'Reject Badge'}
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Are you sure you want to {confirmDialog.action} the badge &quot;
                  {confirmDialog.badge.name}&quot;?
                </Typography>

                {confirmDialog.action === 'accept' ? (
                  <Alert
                    severity="info"
                    icon={<InfoIcon sx={{ color: '#0f0' }} />}
                    sx={{
                      bgcolor: '#001a1a',
                      color: '#0f0',
                      border: '1px solid #0f0',
                      '& .MuiAlert-message': {
                        color: '#0f0',
                      },
                    }}
                  >
                    This badge will be added to your collection and will be visible to others on the
                    Nostr network.
                  </Alert>
                ) : (
                  <Alert
                    severity="warning"
                    sx={{
                      bgcolor: '#1a0000',
                      color: '#f44336',
                      border: '1px solid #f44336',
                      '& .MuiAlert-message': {
                        color: '#f44336',
                      },
                    }}
                  >
                    This badge will be removed from your pending list and will not appear in your
                    collection.
                  </Alert>
                )}
              </DialogContent>
              <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
                <Button onClick={handleCloseConfirm} sx={{ color: '#999' }}>
                  Cancel
                </Button>
                <Button
                  variant={confirmDialog.action === 'accept' ? 'contained' : 'outlined'}
                  color={confirmDialog.action === 'accept' ? 'primary' : 'error'}
                  onClick={() => handleAction(confirmDialog.badge, confirmDialog.action)}
                  sx={
                    confirmDialog.action === 'accept'
                      ? {
                          bgcolor: '#0f0',
                          color: '#000',
                          '&:hover': {
                            bgcolor: '#0c0',
                          },
                        }
                      : {
                          borderColor: '#f44336',
                          color: '#f44336',
                          '&:hover': {
                            borderColor: '#d32f2f',
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                          },
                        }
                  }
                >
                  {confirmDialog.action === 'accept' ? 'Accept' : 'Reject'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Action feedback */}
        {actionFeedback.show && (
          <Grow in={actionFeedback.show}>
            <Alert
              severity={actionFeedback.success ? 'success' : 'error'}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 2000,
                bgcolor: actionFeedback.success ? '#001a00' : '#1a0000',
                color: actionFeedback.success ? '#0f0' : '#f44336',
                border: `1px solid ${actionFeedback.success ? '#0f0' : '#f44336'}`,
                '& .MuiAlert-message': {
                  color: actionFeedback.success ? '#0f0' : '#f44336',
                },
              }}
            >
              {actionFeedback.message}
            </Alert>
          </Grow>
        )}
      </Paper>
    </ErrorBoundary>
  );
};

export default AcceptBadgeSection;
