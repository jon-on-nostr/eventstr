import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  TextField,
  Divider,
  Grid2
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  Badge as BadgeIcon,
  Send as SendIcon,
  Code as CodeIcon,
  Construction as ConstructionIcon,
  ConnectWithoutContact as ConnectIcon
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';

// Custom Nostr icon component 
const NostrIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
    <path d="M8 9H10V15H8V9ZM14 9H16V15H14V9ZM7 12H17V14H7V12Z" />
  </svg>
);

const BuildingEventstr = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: '#000', 
          color: '#0f0',
          pt: 8,
          pb: 6,
          fontFamily: '"Share Tech Mono", monospace',
          width: '100%',
          overflowX: 'hidden'
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
                wordBreak: 'break-word'
              }}
            >
              BUILDING_EVENTSTR
            </Typography>
            <Typography 
              variant="body1" 
              component="p"
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                px: { xs: 2, sm: 0 }
              }}
            >
              Eventstr is a platform for building communities that bridge the digital and non-digital worlds. 
              We&apos;re developing novel ways to connect online interactions with real-world experiences, 
              all powered by decentralized protocols.
            </Typography>
            <Box sx={{ 
              display: 'inline-block', 
              border: '1px solid #0f0', 
              p: 2, 
              mb: 4,
              maxWidth: '100%',
              overflow: 'auto'
            }}>
              <Typography 
                variant="body1" 
                component="p"
                sx={{ 
                  fontFamily: '"Share Tech Mono", monospace',
                  textAlign: 'left',
                  lineHeight: '1.7',
                  whiteSpace: 'nowrap'
                }}
              >
                $ ./init_eventstr_platform.sh<br />
                &gt; Initializing community tools<br />
                &gt; Connecting digital to physical<br />
                &gt; Deploying badge system<br />
                &gt; Ready for sovereign communities...<br />
                <Box component="span" sx={{ animation: 'blink 1s step-end infinite' }}>_</Box>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box 
        sx={{ 
          bgcolor: '#000', 
          color: '#0f0',
          pb: 10,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="md">
          {/* Vision Section */}
          <Box sx={{ mb: 10 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <ConnectIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                OUR_VISION
              </Typography>
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: '#111', 
                border: '1px solid #0f0',
                mb: 4
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  fontFamily: '"Share Tech Mono", monospace',
                }}
              >
                The internet has created incredible opportunities for connection, but often at the cost of our privacy, sovereignty, and authentic human interaction.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  fontFamily: '"Share Tech Mono", monospace',
                }}
              >
                Eventstr aims to bridge this gap by creating tools that:
              </Typography>
              <Box sx={{ pl: 2, borderLeft: '2px solid #0f0' }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  &gt; Connect online communities to real-world gatherings
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  &gt; Provide verifiable credentials without centralized authorities
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  &gt; Enable community recognition through decentralized reputation
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  &gt; Facilitate value exchange without intermediaries
                </Typography>
              </Box>
            </Paper>
            
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                fontStyle: 'italic',
                textAlign: 'center'
              }}
            >
              "We're not just building another social platform—we're creating infrastructure for sovereign communities."
            </Typography>
          </Box>
          
          {/* Badge System Section */}
          <Box sx={{ mb: 10 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <BadgeIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                NOSTR_BADGES
              </Typography>
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: '#111', 
                border: '1px solid #0f0',
                mb: 4
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontFamily: '"Share Tech Mono", monospace',
                }}
              >
                Our first tool bridges digital identity with real-world achievements through a comprehensive badge system built on Nostr.
              </Typography>
              
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box 
                    sx={{ 
                      border: '1px dashed #0f0', 
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        borderStyle: 'solid',
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Share Tech Mono", monospace',
                        mb: 2
                      }}
                    >
                      CREATE & ASSIGN
                    </Typography>
                    <Divider sx={{ bgcolor: '#0f0', mb: 2 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Share Tech Mono", monospace',
                        mb: 2,
                        flexGrow: 1
                      }}
                    >
                      Design custom badges for your community. Assign them to recognize contributions, attendance, or achievements.
                    </Typography>
                    <CodeIcon sx={{ alignSelf: 'center' }} />
                  </Box>
                </Grid2>
                
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box 
                    sx={{ 
                      border: '1px dashed #0f0', 
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        borderStyle: 'solid',
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Share Tech Mono", monospace',
                        mb: 2
                      }}
                    >
                      RECEIVE & DISPLAY
                    </Typography>
                    <Divider sx={{ bgcolor: '#0f0', mb: 2 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Share Tech Mono", monospace',
                        mb: 2,
                        flexGrow: 1
                      }}
                    >
                      Accept badges from trusted issuers. Display your achievements on your Nostr profile and compatible platforms.
                    </Typography>
                    <BadgeIcon sx={{ alignSelf: 'center' }} />
                  </Box>
                </Grid2>
              </Grid2>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  With Eventstr Badges, communities can:
                </Typography>
                
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        border: '1px solid #0f0', 
                        p: 2,
                        bgcolor: '#0f01'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Share Tech Mono", monospace',
                        }}
                      >
                        Verify event attendance
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        border: '1px solid #0f0', 
                        p: 2,
                        bgcolor: '#0f01'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Share Tech Mono", monospace',
                        }}
                      >
                        Recognize contributions
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        border: '1px solid #0f0', 
                        p: 2,
                        bgcolor: '#0f01'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Share Tech Mono", monospace',
                        }}
                      >
                        Build reputation systems
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        border: '1px solid #0f0', 
                        p: 2,
                        bgcolor: '#0f01'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Share Tech Mono", monospace',
                        }}
                      >
                        Gate access to resources
                      </Typography>
                    </Box>
                  </Grid2>
                </Grid2>
              </Box>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  href="/badges"
                  sx={{ 
                    bgcolor: '#0f0',
                    color: '#000',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#0c0',
                    }
                  }}
                >
                  EXPLORE_BADGE_SYSTEM
                </Button>
              </Box>
            </Paper>
          </Box>
          
          {/* Roadmap Section */}
          <Box sx={{ mb: 10 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <ConstructionIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                ROADMAP
              </Typography>
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: '#111', 
                border: '1px solid #0f0',
                mb: 4
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontFamily: '"Share Tech Mono", monospace',
                }}
              >
                Our development roadmap focuses on building tools that empower communities:
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 2,
                    color: '#0f0',
                    borderBottom: '1px dashed #0f0',
                    pb: 1
                  }}
                >
                  PHASE_1: BADGE_SYSTEM [IN_PROGRESS]
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 1,
                    pl: 2
                  }}
                >
                  &gt; Create, assign, and display badges on Nostr
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 1,
                    pl: 2
                  }}
                >
                  &gt; Verification mechanisms for real-world events
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    pl: 2
                  }}
                >
                  &gt; Badge explorer and directory
                </Typography>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 2,
                    color: '#0f0',
                    borderBottom: '1px dashed #0f0',
                    pb: 1
                  }}
                >
                  PHASE_2: EVENT_COORDINATION [PLANNED]
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 1,
                    pl: 2
                  }}
                >
                  &gt; Decentralized event creation and discovery
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 1,
                    pl: 2
                  }}
                >
                  &gt; Lightning-powered ticketing system
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    pl: 2
                  }}
                >
                  &gt; Attendance verification and proof
                </Typography>
              </Box>
              
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 2,
                    color: '#0f0',
                    borderBottom: '1px dashed #0f0',
                    pb: 1
                  }}
                >
                  PHASE_3: COMMUNITY_INFRASTRUCTURE [FUTURE]
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 1,
                    pl: 2
                  }}
                >
                  &gt; Reputation-based access control
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 1,
                    pl: 2
                  }}
                >
                  &gt; Community treasury and resource allocation
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    pl: 2
                  }}
                >
                  &gt; Cross-community collaboration tools
                </Typography>
              </Box>
            </Paper>
          </Box>
          
          {/* Contact Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <SendIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                CONTACT_US
              </Typography>
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: '#111', 
                border: '1px solid #0f0',
                mb: 4
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontFamily: '"Share Tech Mono", monospace',
                }}
              >
                Send us a message over Nostr. We&apos;re building in public and value your feedback.
              </Typography>
              
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <NostrIcon />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  npub1ev...xxx
                </Typography>
              </Box>
              
              <Box component="form" sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Your Nostr Public Key (npub)"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    sx: { 
                      color: '#0f0',
                      fontFamily: '"Share Tech Mono", monospace',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0f0',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0f0',
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { 
                      color: '#0f0',
                      fontFamily: '"Share Tech Mono", monospace'
                    }
                  }}
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
                
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  InputProps={{
                    sx: { 
                      color: '#0f0',
                      fontFamily: '"Share Tech Mono", monospace',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0f0',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0f0',
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { 
                      color: '#0f0',
                      fontFamily: '"Share Tech Mono", monospace'
                    }
                  }}
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
                
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button 
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{ 
                      bgcolor: '#0f0',
                      color: '#000',
                      fontFamily: '"Share Tech Mono", monospace',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#0c0',
                      }
                    }}
                  >
                    SEND_MESSAGE
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
          
          {/* Call to Action */}
          <Box textAlign="center" sx={{ mt: 10 }}>
            <Typography 
              variant="h5" 
              component="p"
              gutterBottom
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                mb: 4
              }}
            >
              JOIN US IN BUILDING THE FUTURE
            </Typography>
            
            <Grid2 container spacing={3} justifyContent="center">
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Button 
                  variant="outlined"
                  fullWidth 
                  component={Link}
                  href="/why-nostr"
                  sx={{ 
                    color: '#0f0',
                    borderColor: '#0f0',
                    fontFamily: '"Share Tech Mono", monospace',
                    '&:hover': {
                      borderColor: '#0f0',
                      bgcolor: '#0f01',
                    }
                  }}
                >
                  WHY_NOSTR
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Button 
                  variant="contained"
                  fullWidth 
                  component={Link}
                  href="/badges"
                  sx={{ 
                    bgcolor: '#0f0',
                    color: '#000',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#0c0',
                    }
                  }}
                >
                  EXPLORE_BADGES
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          bgcolor: '#111', 
          color: '#0f0',
          py: 3,
          borderTop: '1px solid #0f0',
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            component="p"
            textAlign="center"
            sx={{ fontFamily: '"Share Tech Mono", monospace' }}
          >
            [EVENTSTR] © {new Date().getFullYear()} | PRIVACY THROUGH TECHNOLOGY
          </Typography>
        </Container>
      </Box>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        body {
          margin: 0;
          background-color: #000;
          color: #0f0;
          font-family: 'Share Tech Mono', monospace;
        }
      `}</style>
    </>
  );
};

export default BuildingEventstr; 