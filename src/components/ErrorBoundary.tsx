import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors
 * and display a fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error: error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            m: 2,
            bgcolor: '#111',
            color: '#0f0',
            border: '1px solid #0f0',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontFamily: '"Share Tech Mono", monospace',
              borderBottom: '1px solid #0f0',
              pb: 1,
            }}
          >
            ERROR_DETECTED
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Share Tech Mono", monospace' }}>
            Something went wrong with this component.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              sx={{
                bgcolor: '#0f0',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#0c0',
                },
              }}
            >
              Reset Component
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              color: '#0a0',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
            }}
          >
            {this.state.error?.toString() || 'Unknown error'}
          </Typography>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
