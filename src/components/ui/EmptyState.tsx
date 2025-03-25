import React from 'react';
import { Box, Typography } from '@mui/material';
import NostrIcon from './NostrIcon';

interface EmptyStateProps {
  message: string;
  error?: string | null;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  error = null,
  icon = <NostrIcon sx={{ fontSize: 60, mb: 2 }} />,
}) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {icon}
      <Typography
        variant="body2"
        sx={{
          mb: 3,
          fontFamily: '"Share Tech Mono", monospace',
          opacity: 0.7,
        }}
      >
        {message}
      </Typography>
      {error && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontFamily: '"Share Tech Mono", monospace',
            opacity: 0.5,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
