import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CyberButtonProps extends ButtonProps {
  children: ReactNode;
}

const CyberButton: React.FC<CyberButtonProps> = ({ children, sx, ...rest }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        color: '#0f0',
        borderColor: '#0f0',
        '&:hover': {
          borderColor: '#0f0',
          bgcolor: 'rgba(0,255,0,0.1)',
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CyberButton;
