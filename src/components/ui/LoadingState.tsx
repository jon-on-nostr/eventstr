import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  size?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...', size = 40 }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CircularProgress size={size} sx={{ color: '#0f0', mb: 2 }} />
      <Typography
        variant="body2"
        sx={{
          fontFamily: '"Share Tech Mono", monospace',
          opacity: 0.7,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
