import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '@mui/material';

interface WelcomeScreenProps {
  onLoginClick: () => void;
  isNostrAvailable: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onLoginClick, 
  isNostrAvailable 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Eventstr
        </h1>
        <p className="text-gray-600 mb-8">
          Connect with your NOSTR key to get started
        </p>
        <Button
          onClick={onLoginClick}
          disabled={!isNostrAvailable}
          className="w-full mb-4"
          size="lg"
        >
          {isNostrAvailable ? 'Login with NOSTR' : 'NOSTR Extension Not Found'}
        </Button>
        
        {!isNostrAvailable && (
          <Alert severity="warning" className="text-left">
            Please install a NOSTR browser extension (like nos2x or Alby) to continue
          </Alert>
        )}
      </Card>
    </div>
  );
};