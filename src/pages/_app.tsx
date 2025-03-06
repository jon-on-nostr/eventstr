import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Custom theme creation based on the recommended brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#5E35B1', // Deep Purple
    },
    secondary: {
      main: '#2196F3', // Electric Blue
    },
    warning: {
      main: '#FFC107', // Yellow-Orange for accent
    },
    background: {
      default: '#F8F9FA', // Very Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121', // Dark Gray
      secondary: '#424242',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.7,
    },
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        containedPrimary: {
          boxShadow: '0 4px 10px rgba(94, 53, 177, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Improving header contrast by using a light purple background instead of white
          backgroundColor: '#F5F0FF', // Light purple background
          borderBottom: '1px solid rgba(94, 53, 177, 0.1)'
        },
      },
    },
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>Nostr Learn - Educational Platform</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline normalizes styles across browsers */}
        <CssBaseline />
        {/* AnimatePresence enables animations when components enter/exit the DOM */}
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default MyApp;