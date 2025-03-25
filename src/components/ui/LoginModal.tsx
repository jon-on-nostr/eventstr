import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Key as KeyIcon, Extension as ExtensionIcon } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { loginWithExtension, loginWithPrivateKey } = useAuth();
  const [nsec, setNsec] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'select' | 'nsec'>('select');

  const handleExtensionLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await loginWithExtension();
      if (result?.success) {
        onClose();
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNsecLogin = async () => {
    if (!nsec.trim()) {
      setError('Please enter your nsec');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await loginWithPrivateKey(nsec);

      if (result?.success) {
        onClose();
        // Clear nsec from state for security
        setNsec('');
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setMode('select');
    setNsec('');
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          bgcolor: '#111',
          color: '#0f0',
          border: '1px solid #0f0',
          borderRadius: 1,
          minWidth: { xs: '90%', sm: 400 },
          maxWidth: 500,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Share Tech Mono", monospace',
          borderBottom: '1px dashed #0f0',
          pb: 2,
        }}
      >
        SIGN_IN
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: '#300',
              color: '#f88',
              border: '1px solid #f88',
              '& .MuiAlert-icon': { color: '#f88' },
            }}
          >
            {error}
          </Alert>
        )}

        {mode === 'select' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 1 }}>
              Choose your sign-in method:
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ExtensionIcon />}
              onClick={handleExtensionLogin}
              disabled={loading}
              sx={{
                color: '#0f0',
                borderColor: '#0f0',
                py: 1.5,
                fontFamily: '"Share Tech Mono", monospace',
                '&:hover': {
                  borderColor: '#0f0',
                  bgcolor: 'rgba(0,255,0,0.1)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#0f0' }} />
              ) : (
                'SIGN_IN_WITH_EXTENSION'
              )}
            </Button>

            <Divider sx={{ my: 1, borderColor: '#0f04' }}>
              <Typography
                sx={{ color: '#0f08', px: 1, fontFamily: '"Share Tech Mono", monospace' }}
              >
                OR
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<KeyIcon />}
              onClick={() => setMode('nsec')}
              disabled={loading}
              sx={{
                color: '#0f0',
                borderColor: '#0f0',
                py: 1.5,
                fontFamily: '"Share Tech Mono", monospace',
                '&:hover': {
                  borderColor: '#0f0',
                  bgcolor: 'rgba(0,255,0,0.1)',
                },
              }}
            >
              SIGN_IN_WITH_NSEC
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <Typography sx={{ fontFamily: '"Share Tech Mono", monospace', mb: 1 }}>
              Enter your nsec (private key):
            </Typography>

            <TextField
              fullWidth
              type="password"
              value={nsec}
              onChange={e => setNsec(e.target.value)}
              placeholder="nsec1..."
              autoComplete="off"
              disabled={loading}
              InputProps={{
                sx: {
                  color: '#0f0',
                  fontFamily: '"Share Tech Mono", monospace',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0f0',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0f0',
                  },
                },
                startAdornment: <KeyIcon sx={{ mr: 1, color: '#0f0' }} />,
              }}
            />

            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Share Tech Mono", monospace',
                color: '#ff5',
                mt: -1,
                bgcolor: '#332',
                p: 1,
                borderRadius: 1,
              }}
            >
              WARNING: Your nsec is your private key. Never share it with anyone. This app stores it
              only in your browser memory.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px dashed #0f0', pt: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#0f0',
            fontFamily: '"Share Tech Mono", monospace',
          }}
        >
          CANCEL
        </Button>

        {mode === 'nsec' && (
          <Button
            variant="contained"
            onClick={handleNsecLogin}
            disabled={loading || !nsec.trim()}
            sx={{
              bgcolor: '#0f0',
              color: '#000',
              fontFamily: '"Share Tech Mono", monospace',
              '&:hover': {
                bgcolor: '#0c0',
              },
              '&.Mui-disabled': {
                bgcolor: '#0f04',
                color: '#000',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'SIGN_IN'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
