import React, { ReactNode } from 'react';
import { Paper, PaperProps } from '@mui/material';

interface CyberCardProps extends PaperProps {
  children: ReactNode;
}

const CyberCard: React.FC<CyberCardProps> = ({ children, sx, ...rest }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#111',
        color: '#0f0',
        border: '1px solid #0f0',
        p: 3,
        mb: 4,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default CyberCard;
