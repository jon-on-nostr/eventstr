import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';


const cypherpunkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00', // Terminal green
    },
    secondary: {
      main: '#00ccff', // Cyan
    },
    error: {
      main: '#ff0000', // Red
    },
    warning: {
      main: '#ffcc00', // Yellow
    },
    info: {
      main: '#00ccff', // Cyan
    },
    success: {
      main: '#00ff00', // Green
    },
    background: {
      default: '#000000', // Black
      paper: '#111111', // Dark Gray
    },
    text: {
      primary: '#00ff00', // Terminal green
      secondary: '#00cc00', // Slightly darker green
    },
    divider: '#00ff00', // Terminal green
  },
  typography: {
    fontFamily: '"Share Tech Mono", monospace',
    h1: {
      fontFamily: '"VT323", monospace',
    },
    h2: {
      fontFamily: '"VT323", monospace',
    },
    h3: {
      fontFamily: '"Share Tech Mono", monospace',
    },
    h4: {
      fontFamily: '"VT323", monospace',
    },
    h5: {
      fontFamily: '"Share Tech Mono", monospace',
    },
    h6: {
      fontFamily: '"Share Tech Mono", monospace',
    },
    button: {
      fontFamily: '"Share Tech Mono", monospace',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#00ff00',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width:1200px)': {
            maxWidth: '1000px',
          },
        },
      },
    },
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>eVENTSTR</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <ThemeProvider theme={cypherpunkTheme}>
        {/* CssBaseline normalizes styles across browsers */}
        <CssBaseline />
        {/* AnimatePresence enables animations when components enter/exit the DOM */}
        <AnimatePresence mode="wait" initial={false}>
          {/* <Layout> */}
            <Component {...pageProps} key={router.route} />
          {/* </Layout> */}
        </AnimatePresence>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default MyApp;