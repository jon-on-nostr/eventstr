import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  Grid2,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Badge as BadgeIcon,
  Add as AddIcon,
  Login as LoginIcon,
  AssignmentInd as AssignIcon,
  CheckCircle as CheckCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/ui/LoginModal';
import NostrIcon from '@/components/ui/NostrIcon';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

// Mock badge data for UI development
const mockBadges = [
  {
    id: '1',
    name: 'Early Adopter',
    description: 'One of the first 100 users of Eventstr',
    image: 'https://placehold.co/200x200/1a1a1a/00ff00?text=EA',
    issuer: 'npub1eventstrxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    created: '2023-10-15',
  },
  {
    id: '2',
    name: 'Contributor',
    description: 'Contributed to the Eventstr codebase',
    image: 'https://placehold.co/200x200/1a1a1a/00ff00?text=DEV',
    issuer: 'npub1eventstrxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    created: '2023-11-01',
  },
  {
    id: '3',
    name: 'Meetup Attendee',
    description: 'Attended the Nostr Meetup in Austin',
    image: 'https://placehold.co/200x200/1a1a1a/00ff00?text=ATX',
    issuer: 'npub1someuserxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    created: '2023-12-05',
  },
];

// The main component that uses the badge context
const BadgesPage = () => {
  // State for the current tab
  const [currentTab, setCurrentTab] = useState(0);
  const [searchNpub, setSearchNpub] = useState('');

  const { isAuthenticated, currentUser, isLoading: authLoading, logout } = useAuth();
  const { currentProfile, isLoading: profileLoading } = useProfile();

  // Add these states to your BadgesPageContent component
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // performSearch(searchQuery);
  };

  // Add these handlers
  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Update the renderUserProfile function to use data from our hooks
  const renderUserProfile = () => {
    if (authLoading || profileLoading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={24} sx={{ color: '#0f0', mr: 2 }} />
          <Typography variant="body2" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
            Loading profile...
          </Typography>
        </Box>
      );
    }

    if (isAuthenticated && currentUser && currentProfile) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentProfile.picture ? (
            <Avatar
              src={currentProfile.picture}
              alt={currentProfile.displayName || currentProfile.name || 'User'}
              sx={{ width: 40, height: 40, border: '2px solid #0f0' }}
            />
          ) : (
            <Avatar sx={{ width: 40, height: 40, bgcolor: '#0f0', color: '#000' }}>
              {(currentProfile.displayName || currentProfile.name || 'U')[0].toUpperCase()}
            </Avatar>
          )}

          <Box>
            <Typography variant="subtitle1" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
              {currentProfile.displayName || currentProfile.name || 'Anonymous User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Share Tech Mono", monospace',
                display: 'block',
                fontSize: '0.7rem',
                opacity: 0.7,
              }}
            >
              {currentProfile.npub.substring(0, 8)}...
              {currentProfile.npub.substring(currentProfile.npub.length - 4)}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              ml: 2,
              color: '#0f0',
              borderColor: '#0f0',
              '&:hover': {
                borderColor: '#0f0',
                bgcolor: 'rgba(0,255,0,0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      );
    }

    return (
      <Button
        variant="outlined"
        startIcon={<LoginIcon />}
        onClick={handleOpenLoginModal}
        sx={{
          color: '#0f0',
          borderColor: '#0f0',
          '&:hover': {
            borderColor: '#0f0',
            bgcolor: 'rgba(0,255,0,0.1)',
          },
        }}
      >
        Login
      </Button>
    );
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#111', // Slightly different background to distinguish from main pages
          color: '#0f0',
          pt: 8,
          pb: 6,
          fontFamily: '"Share Tech Mono", monospace',
          width: '100%',
          overflowX: 'hidden',
          borderBottom: '1px solid #0f0',
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontFamily: '"VT323", monospace',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
                letterSpacing: { xs: '0.05em', md: '0.1em' },
                background: 'linear-gradient(90deg, #0f0 0%, #0f0 50%, #8a2be2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5), 0 0 15px rgba(138, 43, 226, 0.3)',
                display: 'inline-block',
                maxWidth: '100%',
                wordBreak: 'break-word',
              }}
            >
              EVENTSTR_BADGES
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{
                fontFamily: '"Share Tech Mono", monospace',
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                px: { xs: 2, sm: 0 },
              }}
            >
              Verifiable credentials for your community. Create, assign, and supercharge badges that
              bridge digital and physical worlds.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#0f0',
          py: 6,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontFamily: '"Share Tech Mono", monospace',
              mb: 4,
              textAlign: 'center',
            }}
          >
            HOW_IT_WORKS
          </Typography>

          <Stepper
            activeStep={-1}
            alternativeLabel
            sx={{
              mb: 6,
              '& .MuiStepLabel-label': {
                color: '#0f0',
                fontFamily: '"Share Tech Mono", monospace',
                mt: 1,
              },
              '& .MuiStepIcon-root': {
                color: '#0f0',
              },
              '& .MuiStepConnector-line': {
                borderColor: '#0f0',
              },
            }}
          >
            <Step>
              <StepLabel>Sign in with Nostr</StepLabel>
            </Step>
            <Step>
              <StepLabel>Create or Search Badges</StepLabel>
            </Step>
            <Step>
              <StepLabel>Assign to Recipients</StepLabel>
            </Step>
            <Step>
              <StepLabel>Accept and Display</StepLabel>
            </Step>
          </Stepper>

          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid #0f0',
                  bgcolor: '#111',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontFamily: '"Share Tech Mono", monospace' }}
                >
                  FOR_BADGE_CREATORS
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '2px solid #0f0', mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    1. Sign in with your Nostr extension or private key
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    2. Create a new badge with custom image and description
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    3. Assign badges to recipients using their npub
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    4. Track which badges have been accepted
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCurrentTab(1);
                      window.scrollTo({
                        top: document.getElementById('badge-actions')?.offsetTop || 0,
                        behavior: 'smooth',
                      });
                    }}
                    sx={{
                      color: '#0f0',
                      borderColor: '#0f0',
                      '&:hover': {
                        borderColor: '#0f0',
                        bgcolor: 'rgba(0,255,0,0.1)',
                      },
                    }}
                  >
                    Create a Badge
                  </Button>
                </Box>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid #0f0',
                  bgcolor: '#111',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontFamily: '"Share Tech Mono", monospace' }}
                >
                  FOR_BADGE_RECIPIENTS
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '2px solid #0f0', mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    1. Sign in with your Nostr extension or private key
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    2. View badges that have been assigned to you
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    3. Accept badges to add them to your collection
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    4. Display badges on your Nostr profile
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      setCurrentTab(3);
                      window.scrollTo({
                        top: document.getElementById('badge-actions')?.offsetTop || 0,
                        behavior: 'smooth',
                      });
                    }}
                    sx={{
                      color: '#0f0',
                      borderColor: '#0f0',
                      '&:hover': {
                        borderColor: '#0f0',
                        bgcolor: 'rgba(0,255,0,0.1)',
                      },
                    }}
                  >
                    Accept Badges
                  </Button>
                </Box>
              </Paper>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#0f0',
          py: 6,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="md">
          {/* Login/Search Section */}
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
            {renderUserProfile()}
          </Paper>

          {/* Search Section */}
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
              SEARCH_BADGES
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                fontFamily: '"Share Tech Mono", monospace',
              }}
            >
              Look up badges by Nostr public key (npub) to see what badges a user has earned.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Enter npub..."
                variant="outlined"
                value={searchNpub}
                onChange={e => setSearchNpub(e.target.value)}
                sx={{
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
                }}
              />
              <Button
                onClick={handleSearch}
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{
                  bgcolor: '#0f0',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#0c0',
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Paper>

          {/* Tabs for different badge actions */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#111',
              color: '#0f0',
              border: '1px solid #0f0',
              mb: 4,
            }}
            id="badge-actions"
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: '1px solid #0f0',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0f0',
                },
                '& .MuiTab-root': {
                  color: '#0f08',
                  fontFamily: '"Share Tech Mono", monospace',
                  '&.Mui-selected': {
                    color: '#0f0',
                  },
                },
              }}
            >
              <Tab
                label="MY BADGES"
                icon={<BadgeIcon />}
                iconPosition="start"
                disabled={!Boolean(currentUser)}
              />
              <Tab
                label="CREATE"
                icon={<AddIcon />}
                iconPosition="start"
                disabled={!Boolean(currentUser)}
              />
              <Tab
                label="ASSIGN"
                icon={<AssignIcon />}
                iconPosition="start"
                disabled={!Boolean(currentUser)}
              />
              <Tab
                label="ACCEPT"
                icon={<CheckCircleIcon />}
                iconPosition="start"
                disabled={!Boolean(currentUser)}
              />
            </Tabs>

            <Divider sx={{ borderColor: '#0f0' }} />

            <Box sx={{ p: 3 }}>
              {/* My Badges Tab */}
              {currentTab === 0 && (
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontFamily: '"Share Tech Mono", monospace' }}
                  >
                    MY_BADGES
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      fontFamily: '"Share Tech Mono", monospace',
                    }}
                  >
                    View all badges you&apos;ve created and received.
                  </Typography>

                  {mockBadges.length > 0 ? (
                    <>
                      <Typography
                        variant="subtitle2"
                        component="h4"
                        gutterBottom
                        sx={{
                          fontFamily: '"Share Tech Mono", monospace',
                          mt: 4,
                          mb: 2,
                        }}
                      >
                        BADGES_RECEIVED
                      </Typography>

                      <Grid2 container spacing={3}>
                        {mockBadges.map(badge => (
                          <Grid2 key={badge.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                              sx={{
                                bgcolor: '#1a1a1a',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Box sx={{ p: 2, textAlign: 'center' }}>
                                <img
                                  src={badge.image}
                                  alt={badge.name}
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '4px',
                                    margin: '0 auto',
                                  }}
                                />
                              </Box>
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  gutterBottom
                                  sx={{ fontFamily: '"Share Tech Mono", monospace' }}
                                >
                                  {badge.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mb: 2,
                                    fontFamily: '"Share Tech Mono", monospace',
                                  }}
                                >
                                  {badge.description}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    fontFamily: '"Share Tech Mono", monospace',
                                    color: '#0f08',
                                  }}
                                >
                                  Issued by: {badge.issuer.substring(0, 8)}...
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    fontFamily: '"Share Tech Mono", monospace',
                                    color: '#0f08',
                                  }}
                                >
                                  Date: {badge.created}
                                </Typography>
                              </CardContent>
                              <CardActions sx={{ p: 2, borderTop: '1px dashed #0f0' }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  sx={{
                                    color: '#0f0',
                                    borderColor: '#0f0',
                                    '&:hover': {
                                      borderColor: '#0f0',
                                      bgcolor: 'rgba(0,255,0,0.1)',
                                    },
                                  }}
                                >
                                  View Details
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid2>
                        ))}
                      </Grid2>

                      <Typography
                        variant="subtitle2"
                        component="h4"
                        gutterBottom
                        sx={{
                          fontFamily: '"Share Tech Mono", monospace',
                          mt: 4,
                          mb: 2,
                        }}
                      >
                        BADGES_CREATED
                      </Typography>

                      <Grid2 container spacing={3}>
                        {mockBadges.map(badge => (
                          <Grid2 key={badge.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                              sx={{
                                bgcolor: '#1a1a1a',
                                color: '#0f0',
                                border: '1px solid #0f0',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Box sx={{ p: 2, textAlign: 'center' }}>
                                <img
                                  src={badge.image}
                                  alt={badge.name}
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '4px',
                                    margin: '0 auto',
                                  }}
                                />
                              </Box>
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  gutterBottom
                                  sx={{ fontFamily: '"Share Tech Mono", monospace' }}
                                >
                                  {badge.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mb: 2,
                                    fontFamily: '"Share Tech Mono", monospace',
                                  }}
                                >
                                  {badge.description}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    fontFamily: '"Share Tech Mono", monospace',
                                    color: '#0f08',
                                  }}
                                >
                                  Created: {badge.created}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    fontFamily: '"Share Tech Mono", monospace',
                                    color: '#0f08',
                                  }}
                                >
                                  Assigned: 12 times
                                </Typography>
                              </CardContent>
                              <CardActions sx={{ p: 2, borderTop: '1px dashed #0f0' }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  sx={{
                                    color: '#0f0',
                                    borderColor: '#0f0',
                                    '&:hover': {
                                      borderColor: '#0f0',
                                      bgcolor: 'rgba(0,255,0,0.1)',
                                    },
                                  }}
                                >
                                  Manage Badge
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid2>
                        ))}
                      </Grid2>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <NostrIcon sx={{ fontSize: 60, mb: 2 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 3,
                          fontFamily: '"Share Tech Mono", monospace',
                          opacity: 0.7,
                        }}
                      >
                        You haven&apos;t received any badges yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default BadgesPage;
