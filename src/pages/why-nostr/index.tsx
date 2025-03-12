import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid2
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Key as KeyIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import Navbar from '../../components/NavBar';

// Custom Nostr icon component 
const NostrIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
    <path d="M8 9H10V15H8V9ZM14 9H16V15H14V9ZM7 12H17V14H7V12Z" />
  </svg>
);

// Custom Bitcoin icon component
const BitcoinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.06 11.57C17.65 10.88 17.96 10.04 17.86 9.17C17.74 8 17.18 7.1 16.33 6.67C15.79 6.4 15.19 6.3 14.59 6.3H14.56V4.77H13.08V6.3H11.05V4.77H9.56V6.3H6.81V7.95H8.47C8.99 7.95 9.32 8.16 9.32 8.71V15.37C9.32 15.97 8.99 16.15 8.47 16.15H6.81V17.77H9.56V19.35H11.05V17.77H13.08V19.35H14.56V17.77C15.34 17.77 16.1 17.67 16.78 17.27C17.86 16.68 18.53 15.57 18.5 14.25C18.5 13.03 17.96 11.97 17.06 11.57ZM11.05 7.95H14.44C15.09 7.95 15.57 8.53 15.57 9.17C15.57 9.8 15.09 10.38 14.44 10.38H11.05V7.95ZM15.22 15.93C14.55 15.93 11.05 15.93 11.05 15.93V13.08H15.22C16.04 13.08 16.71 13.7 16.71 14.5C16.71 15.3 16.04 15.93 15.22 15.93Z" />
  </svg>
);

// Custom Lightning icon component
const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 15H6L13 1V9H18L11 23V15Z" />
  </svg>
);

const WhyNostr = () => {
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
              WHY_DECENTRALIZE?
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
              The centralized web has failed us. Big Tech surveils, censors, and manipulates. 
              We're building a new internet—one that respects your sovereignty and privacy.
              Here's why these protocols matter.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Accordion Sections */}
      <Box 
        sx={{ 
          bgcolor: '#000', 
          color: '#0f0',
          pb: 10,
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        <Container maxWidth="md">
          {/* NOSTR Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <NostrIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                NOSTR
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                fontFamily: '"Share Tech Mono", monospace',
                borderLeft: '2px solid #0f0',
                pl: 2
              }}
            >
              Notes and Other Stuff Transmitted by Relays. A simple, open protocol that enables truly censorship-resistant communication.
            </Typography>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <KeyIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    What is Nostr and why should I care?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Nostr is a simple, open protocol that enables global, decentralized, and censorship-resistant communication.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Unlike Twitter, Facebook, or Instagram, no single entity controls Nostr. Your data isn't sold to advertisers, because it isn't collected.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  With Nostr, you own your identity through cryptographic keys. No phone numbers, no emails, no KYC. Just pure, sovereign control.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    How does Nostr protect me from censorship?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Nostr uses a network of relays (servers) that pass messages between users. If one relay censors you, simply use another.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Your cryptographic identity remains the same across all relays. No central authority can deplatform you or silence your voice.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Even if governments block relays, new ones can appear anywhere in the world. The network is resilient by design.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    How do I get started with Nostr?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Getting started with Nostr is simple. First, generate a key pair—this is your identity in the Nostr ecosystem.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Next, choose a client (like Damus, Amethyst, or Iris) and connect to some relays. These are your windows into the Nostr network.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  IMPORTANT: Backup your private key securely. If lost, your Nostr identity is gone forever. This is the price of true ownership—responsibility.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          
          {/* BITCOIN Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <BitcoinIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                BITCOIN
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                fontFamily: '"Share Tech Mono", monospace',
                borderLeft: '2px solid #0f0',
                pl: 2
              }}
            >
              The world's first and most secure decentralized digital currency. A monetary system beyond state control.
            </Typography>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <KeyIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    What makes Bitcoin different from regular money?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Bitcoin is the first truly scarce digital asset—only 21 million will ever exist. In contrast, fiat currencies can be printed at will, devaluing your savings.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Bitcoin operates on a decentralized network. No central bank, no CEO, no single point of failure. It's money that governments cannot easily seize or censor.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  When you hold Bitcoin, you're not trusting a bank or payment processor. You're trusting mathematics and open-source code that anyone can verify.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    Is Bitcoin secure? How does it work?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Bitcoin is secured by cryptography and a process called "proof of work." Thousands of computers (miners) compete to solve complex mathematical problems.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  This mining process makes the Bitcoin ledger immutable—to change history, an attacker would need more computing power than the entire network combined.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Your bitcoins are secured by private keys. If you control your keys (not your keys, not your coins), your bitcoin cannot be confiscated by any authority.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    How do I buy and store Bitcoin safely?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  You can buy Bitcoin on exchanges, but remember: exchanges are centralized entities. Once you buy, move your Bitcoin to a wallet where you control the private keys.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  For small amounts, mobile wallets like Muun or Blue Wallet are convenient. For larger holdings, consider hardware wallets like the Bitkey or Coldcard.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Backup your seed phrase (12-24 words) on metal, not paper. Store it in multiple secure locations. This is your ultimate backup if your device is lost or destroyed.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          
          {/* LIGHTNING Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <LightningIcon />
              </Box>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontFamily: '"VT323", monospace',
                }}
              >
                LIGHTNING
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                fontFamily: '"Share Tech Mono", monospace',
                borderLeft: '2px solid #0f0',
                pl: 2
              }}
            >
              A second-layer solution built on top of Bitcoin that enables instant, nearly-free transactions at global scale.
            </Typography>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <KeyIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    What is the Lightning Network and why do we need it?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  The Lightning Network is a "Layer 2" protocol built on top of Bitcoin. It allows for instant, high-volume micropayments without waiting for blockchain confirmations.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Bitcoin's base layer prioritizes security and decentralization over speed. Lightning solves this by creating payment channels between users that can handle thousands of transactions per second.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  With Lightning, you can send 1 satoshi (0.00000001 BTC) instantly with negligible fees. This enables new use cases like streaming money, pay-per-view content, and micropayments for API calls.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    Is Lightning Network secure?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Lightning inherits Bitcoin's security model but with different trade-offs. Channels are secured by on-chain Bitcoin transactions, making them cryptographically secure.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  However, Lightning requires users to be online to detect and respond to potential channel closing attempts. This is why many users use "watchtowers"—services that monitor channels on their behalf.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  For everyday spending, Lightning's security model is more than adequate. For large amounts, the base Bitcoin layer remains the most secure option.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion 
              sx={{ 
                bgcolor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                borderRadius: '0 !important',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0f0' }} />}
                sx={{ 
                  borderBottom: '1px dashed #0f0',
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    How do I start using Lightning?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  The easiest way to start is with a non-custodial Lightning wallet like Phoenix, Breez, or Muun. These handle the technical complexities while still giving you control of your funds.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  For more advanced users, running your own Lightning node (like Umbrel or RaspiBlitz) gives you maximum sovereignty and helps strengthen the network.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Once set up, you can receive payments via Lightning invoices or send payments by scanning QR codes. Many services now support Lightning payments, from exchanges to online stores.
                </Typography>
              </AccordionDetails>
            </Accordion>
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
              READY TO JOIN THE RESISTANCE?
            </Typography>
            
            <Grid2 container spacing={3} justifyContent="center">
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Button 
                  variant="outlined"
                  fullWidth 
                  component={Link}
                  href="/"
                  startIcon={<ArrowBackIcon />}
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
                  BACK_TO_HOME
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Button 
                  variant="contained"
                  fullWidth 
                  component={Link}
                  href="/building-eventstr"
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
                  BUILDING_EVENTSTR
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

export default WhyNostr; 