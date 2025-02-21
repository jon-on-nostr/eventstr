import React from 'react';
import { Alert } from '@mui/material';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  return (
    <Alert severity="error" onClose={onClose} className="mb-4">
      {message}
    </Alert>
  );
};