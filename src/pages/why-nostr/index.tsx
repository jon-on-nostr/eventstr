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
  Grid2,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Key as KeyIcon,
  Code as CodeIcon,
  CurrencyBitcoin,
  ElectricBolt,
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import NostrIcon from '@/components/ui/NostrIcon';

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
          overflowX: 'hidden',
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
                px: { xs: 2, sm: 0 },
              }}
            >
              The centralized web has failed us. Big Tech surveils, censors, and manipulates.
              We&apos;re building a new internet—one that respects your sovereignty and privacy.
              Here&apos;s why these protocols matter.
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
                <NostrIcon sx={{ fontSize: 60, mb: 2 }} />
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
                pl: 2,
              }}
            >
              Notes and Other Stuff Transmitted by Relays. A simple, open protocol that enables
              truly censorship-resistant communication.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  Nostr is a simple, open protocol that enables global, decentralized, and
                  censorship-resistant communication.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Unlike Twitter, Facebook, or Instagram, no single entity controls Nostr. Your data
                  isn&apos;t sold to advertisers, because it isn&apos;t collected.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  With Nostr, you own your identity through cryptographic keys. No phone numbers, no
                  emails, no KYC. Just pure, sovereign control.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  Nostr uses a network of relays (servers) that pass messages between users. If one
                  relay censors you, simply use another.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Your cryptographic identity remains the same across all relays. No central
                  authority can deplatform you or silence your voice.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Even if governments block relays, new ones can appear anywhere in the world. The
                  network is resilient by design.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  Getting started with Nostr is simple. First, generate a key pair—this is your
                  identity in the Nostr ecosystem.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Next, choose a client (like Damus, Amethyst, or Iris) and connect to some relays.
                  These are your windows into the Nostr network.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  IMPORTANT: Backup your private key securely. If lost, your Nostr identity is gone
                  forever. This is the price of true ownership—responsibility.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* BITCOIN Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <CurrencyBitcoin />
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
                pl: 2,
              }}
            >
              The world&apos;s first and most secure decentralized digital currency. A monetary
              system beyond state control.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  Bitcoin is the first truly scarce digital asset—only 21 million will ever exist.
                  In contrast, fiat currencies can be printed at will, devaluing your savings.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Bitcoin operates on a decentralized network. No central bank, no CEO, no single
                  point of failure. It&apos;s money that governments cannot easily seize or censor.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  When you hold Bitcoin, you&apos;re not trusting a bank or payment processor.
                  You&apos;re trusting mathematics and open-source code that anyone can verify.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  Bitcoin is secured by cryptography and a process called &quot;proof of work.&quot;
                  Thousands of computers (miners) compete to solve complex mathematical problems.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  This mining process makes the Bitcoin ledger immutable—to change history, an
                  attacker would need more computing power than the entire network combined.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Your bitcoins are secured by private keys. If you control your keys (not your
                  keys, not your coins), your bitcoin cannot be confiscated by any authority.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  You can buy Bitcoin on exchanges, but remember: exchanges are centralized
                  entities. Once you buy, move your Bitcoin to a wallet where you control the
                  private keys.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  For small amounts, mobile wallets like Muun or Blue Wallet are convenient. For
                  larger holdings, consider hardware wallets like the Bitkey or Coldcard.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Backup your seed phrase (12-24 words) on metal, not paper. Store it in multiple
                  secure locations. This is your ultimate backup if your device is lost or
                  destroyed.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* LIGHTNING Section */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 2, display: 'flex' }}>
                <ElectricBolt />
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
                pl: 2,
              }}
            >
              A second-layer solution built on top of Bitcoin that enables instant, nearly-free
              transactions at global scale.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  The Lightning Network is a &quot;Layer 2&quot; protocol built on top of Bitcoin.
                  It allows for instant, high-volume micropayments without waiting for blockchain
                  confirmations.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  Bitcoin&apos;s base layer prioritizes security and decentralization over speed.
                  Lightning solves this by creating payment channels between users that can handle
                  thousands of transactions per second.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  With Lightning, you can send 1 satoshi (0.00000001 BTC) instantly with negligible
                  fees. This enables new use cases like streaming money, pay-per-view content, and
                  micropayments for API calls.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  Lightning inherits Bitcoin&apos;s security model but with different trade-offs.
                  Channels are secured by on-chain Bitcoin transactions, making them
                  cryptographically secure.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  However, Lightning requires users to be online to detect and respond to potential
                  channel closing attempts. This is why many users use &quot;watchtowers&quot; —
                  services that monitor channels on their behalf.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  For everyday spending, Lightning&apos;s security model is more than adequate. For
                  large amounts, the base Bitcoin layer remains the most secure option.
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
                  '&.Mui-expanded': {
                    borderBottom: '1px solid #0f0',
                  },
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
                  The easiest way to start is with a non-custodial Lightning wallet like Phoenix,
                  Breez, or Muun. These handle the technical complexities while still giving you
                  control of your funds.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 2 }}>
                  For more advanced users, running your own Lightning node (like Umbrel or
                  RaspiBlitz) gives you maximum sovereignty and helps strengthen the network.
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Once set up, you can receive payments via Lightning invoices or send payments by
                  scanning QR codes. Many services now support Lightning payments, from exchanges to
                  online stores.
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
                mb: 4,
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
                    },
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
                    },
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
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
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
