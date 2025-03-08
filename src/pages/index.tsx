import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button, Grid, Divider } from '@mui/material';
import { Code as CodeIcon, ElectricBolt, CurrencyBitcoin } from '@mui/icons-material';

// Custom Nostr icon component 
const NostrIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
    <path d="M8 9H10V15H8V9ZM14 9H16V15H14V9ZM7 12H17V14H7V12Z" />
  </svg>
);

const Home = () => {
  return (
    <>
      {/* Terminal-style Header */}
      <Box 
        sx={{ 
          bgcolor: '#000', 
          color: '#0f0',
          borderBottom: '1px solid #0f0',
          py: 2,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h1" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
              EVENTSTR
            </Typography>
            <Box display="flex" alignItems="flex-end" flexDirection={{xs: "column", md: "row"}}>
              <Button 
                color="inherit" 
                component={Link}
                href="/why-nostr"
                sx={{ 
                  fontFamily: '"Share Tech Mono", monospace',
                  mr: 2,
                  '&:hover': {
                    bgcolor: '#0f03',
                    textDecoration: 'underline',
                  }
                }}
              >
                WHY_NOSTR
              </Button>
              <Button 
                color="inherit" 
                component={Link}
                href="/building-eventstr"
                sx={{ 
                  fontFamily: '"Share Tech Mono", monospace',
                  '&:hover': {
                    bgcolor: '#0f03',
                    textDecoration: 'underline',
                  }
                }}
              >
                BUILDING_EVENTSTR
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: '#000', 
          color: '#0f0',
          pt: 8,
          pb: 10,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontFamily: '"VT323", monospace',
                fontSize: { xs: '2.5rem', md: '4rem' },
                letterSpacing: '0.1em'
              }}
            >
              &lt;EVENTSTR/&gt;
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              gutterBottom
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                color: '#0c0',
                mb: 4
              }}
            >
              BUILDING THE DECENTRALIZED FUTURE
            </Typography>
            <Box sx={{ display: 'inline-block', border: '1px solid #0f0', p: 2, mb: 4 }}>
              <Typography 
                variant="body1" 
                component="p"
                sx={{ 
                  fontFamily: '"Share Tech Mono", monospace',
                  textAlign: 'left',
                  lineHeight: '1.7'
                }}
              >
                $ ./join_eventstr.sh<br />
                &gt; Initializing Nostr protocol<br />
                &gt; Connecting to Bitcoin network<br />
                &gt; Opening Lightning channels<br />
                &gt; Welcome to the resistance...<br />
                <Box component="span" sx={{ animation: 'blink 1s step-end infinite' }}>_</Box>
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4} gap={{xs: 8, md: 0}} justifyContent="center">
            <Grid item xs={12} md={4} textAlign="center">
              <Box>
                <NostrIcon />
              </Box>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ fontFamily: '"Share Tech Mono", monospace' }}
              >
                NOSTR
              </Typography>
              <Box 
                sx={{ 
                  border: '1px dashed #0f0', 
                  p: 2,
                  height: '100%',
                  '&:hover': {
                    borderStyle: 'solid',
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 2
                  }}
                >
                  CENSORSHIP-RESISTANT PROTOCOL
                </Typography>
                <Divider sx={{ bgcolor: '#0f0', mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace'
                  }}
                >
                  Permissionless communication
                  without central authority
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} textAlign="center">
              <Box>
                <CurrencyBitcoin />
              </Box>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ fontFamily: '"Share Tech Mono", monospace' }}
              >
                BITCOIN
              </Typography>
              <Box 
                sx={{ 
                  border: '1px dashed #0f0', 
                  p: 2,
                  height: '100%',
                  '&:hover': {
                    borderStyle: 'solid',
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 2
                  }}
                >
                  SOVEREIGN DIGITAL CURRENCY
                </Typography>
                <Divider sx={{ bgcolor: '#0f0', mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace'
                  }}
                >
                  Trustless monetary system
                  beyond state control
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} textAlign="center">
              <Box>
                <ElectricBolt />
              </Box>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ fontFamily: '"Share Tech Mono", monospace' }}
              >
                LIGHTNING
              </Typography>
              <Box 
                sx={{ 
                  border: '1px dashed #0f0', 
                  p: 2,
                  height: '100%',
                  '&:hover': {
                    borderStyle: 'solid',
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace',
                    mb: 2
                  }}
                >
                  INSTANT MICROPAYMENTS
                </Typography>
                <Divider sx={{ bgcolor: '#0f0', mb: 2 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Share Tech Mono", monospace'
                  }}
                >
                  Scaling solution with
                  near-zero fees
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ mt: 15 }}>
            <Button 
              variant="outlined" 
              size="large"
              component={Link}
              href="/building-eventstr"
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
              JOIN_THE_JOURNEY &gt;
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Manifesto Section */}
      <Box 
        sx={{ 
          bgcolor: '#0c0', 
          color: '#000',
          py: 6,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center"
            gutterBottom
            sx={{ 
              fontFamily: '"VT323", monospace',
              mb: 4
            }}
          >
            MANIFESTO
          </Typography>
          
          <Typography 
            variant="body1" 
            component="p"
            sx={{ 
              fontFamily: '"Share Tech Mono", monospace',
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            "We are building for a future where communication and exchange are free from centralized control."
          </Typography>
          
          <Box 
            sx={{ 
              border: '2px solid #000', 
              p: 3,
              bgcolor: '#000',
              color: '#0f0',
            }}
          >
            <Typography 
              variant="body1" 
              component="p"
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                mb: 2
              }}
            >
              &gt; We reject the surveillance economy
            </Typography>
            <Typography 
              variant="body1" 
              component="p"
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                mb: 2
              }}
            >
              &gt; We embrace sovereign technology
            </Typography>
            <Typography 
              variant="body1" 
              component="p"
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace',
                mb: 2
              }}
            >
              &gt; We build tools for human freedom
            </Typography>
            <Typography 
              variant="body1" 
              component="p"
              sx={{ 
                fontFamily: '"Share Tech Mono", monospace'
              }}
            >
              &gt; Join us or get left behind
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: '#000', 
          color: '#0f0',
          py: 8,
          textAlign: 'center',
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="sm">
          <CodeIcon sx={{ fontSize: 40, mb: 2 }} />
          <Typography 
            variant="h5" 
            component="h2"
            gutterBottom
            sx={{ 
              fontFamily: '"Share Tech Mono", monospace', 
              mb: 3
            }}
          >
            READY TO BEGIN?
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button 
                variant="contained"
                fullWidth 
                component={Link}
                href="/why-nostr"
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
                WHY_NOSTR
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                variant="outlined"
                fullWidth 
                component={Link}
                href="/building-eventstr"
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
                BUILDING_EVENTSTR
              </Button>
            </Grid>
          </Grid>
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

export default Home;