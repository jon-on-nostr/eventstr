import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from './Button';

// Create a basic theme for testing
const theme = createTheme();

// Wrapper component to provide theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Button Component', () => {
  test('renders with primary variant by default', () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>
    );
    
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    
    render(
      <TestWrapper>
        <Button onClick={handleClick}>Click me</Button>
      </TestWrapper>
    );
    
    const button = screen.getByText('Click me');
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders secondary variant correctly', () => {
    render(
      <TestWrapper>
        <Button variant="secondary">Secondary Button</Button>
      </TestWrapper>
    );
    
    const button = screen.getByText('Secondary Button');
    expect(button).toBeInTheDocument();
  });

  test('renders tertiary variant correctly', () => {
    render(
      <TestWrapper>
        <Button variant="tertiary">Tertiary Button</Button>
      </TestWrapper>
    );
    
    const button = screen.getByText('Tertiary Button');
    expect(button).toBeInTheDocument();
  });

  test('supports disabled state', () => {
    render(
      <TestWrapper>
        <Button disabled>Disabled Button</Button>
      </TestWrapper>
    );
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  test('supports fullWidthOnMobile prop', () => {
    render(
      <TestWrapper>
        <Button fullWidthOnMobile>Full Width Button</Button>
      </TestWrapper>
    );
    
    const button = screen.getByText('Full Width Button');
    expect(button).toBeInTheDocument();
    // Note: We can't easily test CSS media queries in JSDOM
    // This would need visual regression testing or snapshot testing
  });
});