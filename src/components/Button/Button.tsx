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

// Create styled versions of MUI button for each variant
const PrimaryButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  fontWeight: 600,
}));

const SecondaryButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  fontWeight: 600,
}));

const TertiaryButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  fontWeight: 500,
}));

// Responsive wrapper for the button
const ResponsiveButtonWrapper = styled('div')<{ fullWidthOnMobile?: boolean }>(
  ({ fullWidthOnMobile, theme }) => ({
    display: 'inline-block',
    [theme.breakpoints.down('sm')]: {
      width: fullWidthOnMobile ? '100%' : 'auto',
    },
  })
);

/**
 * Custom button component for Eventstr that supports primary, secondary, and tertiary styles.
 * Built on top of MUI Button with extended functionality.
 */
export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidthOnMobile = false,
  children, 
  ...props 
}) => {
  const ButtonComponent = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    tertiary: TertiaryButton,
  }[variant];

  return (
    <ResponsiveButtonWrapper fullWidthOnMobile={fullWidthOnMobile}>
      <ButtonComponent {...props}>
        {children}
      </ButtonComponent>
    </ResponsiveButtonWrapper>
  );
};

// Default export
export default Button;