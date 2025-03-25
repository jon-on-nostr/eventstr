import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/system';

// Define the supported variants
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

// Extend the MUI button props with our custom props
export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: ButtonVariant;
  fullWidthOnMobile?: boolean;
}

// Create a single styled component with dynamic styles based on variant prop
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'fullWidthOnMobile',
})<ButtonProps>(({ theme, variant = 'primary', fullWidthOnMobile }) => {
  // Define styles by variant
  const variantStyles = {
    primary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
      fontWeight: 600,
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
      fontWeight: 600,
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      fontWeight: 500,
    },
  };

  // Return combined styles
  return {
    ...variantStyles[variant],
    // Add responsive styles
    width: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: fullWidthOnMobile ? '100%' : 'auto',
    },
  };
});

/**
 * Button component for Eventstr that supports primary, secondary, and tertiary styles.
 * Built on top of MUI Button with extended functionality.
 */
export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidthOnMobile = false,
  children, 
  ...props 
}) => {
  return (
    <StyledButton
      // Pass MUI's regular variant as undefined to avoid conflicts with our custom variant
      variant="text"
      // Pass our custom props
      variant={variant}
      fullWidthOnMobile={fullWidthOnMobile}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

// Default export
export default Button;