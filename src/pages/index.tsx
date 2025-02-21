import { type NextPage } from 'next';
import { useNostr } from '@/hooks/useNostr';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const { 
    loginStatus, 
    userProfile, 
    error, 
    login, 
    logout, 
    isNostrAvailable 
  } = useNostr();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loginStatus === 'loading' ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : loginStatus === 'authenticated' && userProfile ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome, {userProfile.displayName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Connected with NOSTR
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 break-all">
                Public Key: {userProfile.pubkey}
              </p>
            </div>

            <Button
              variant="danger"
              className="w-full"
              onClick={logout}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Eventstr
            </h1>
            <p className="text-gray-600 mb-8">
              Connect with your NOSTR key to get started
            </p>
            
            <Button
              onClick={login}
              disabled={!isNostrAvailable}
              className="w-full"
              size="lg"
            >
              {isNostrAvailable 
                ? 'Connect with NOSTR' 
                : 'NOSTR Extension Not Found'
              }
            </Button>

            {!isNostrAvailable && (
              <p className="mt-4 text-sm text-amber-600">
                Please install a NOSTR browser extension (like nos2x or Alby) to continue
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;