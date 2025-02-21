import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserProfile } from '../types/nostr';
import { Avatar, Divider } from '@mui/material';

interface UserDashboardProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  profile, 
  onLogout 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar 
            src={profile.image} 
            alt={profile.displayName}
            className="w-16 h-16"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {profile.displayName}
            </h2>
            <p className="text-gray-500 text-sm">
              {profile.name}
            </p>
          </div>
        </div>

        <Divider className="my-6" />

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Public Key</h3>
            <p className="text-gray-900 font-mono text-sm break-all">
              {profile.pubkey}
            </p>
          </div>
          
          {/* Add more profile sections here */}
        </div>

        <div className="mt-8">
          <Button
            variant="danger"
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};