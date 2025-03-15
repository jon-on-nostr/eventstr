import React, { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface CyberTypographyProps extends TypographyProps {
  children: ReactNode;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption';
}

const CyberTypography: React.FC<CyberTypographyProps> = ({
  children,
  variant = 'body1',
  sx,
  ...rest
}) => {
  return (
    <Typography
      variant={variant}
      sx={{
        fontFamily: '"Share Tech Mono", monospace',
        ...(variant === 'h6' && { mb: 1 }),
        ...(variant === 'body2' && { mb: 3, opacity: 0.9 }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default CyberTypography;
