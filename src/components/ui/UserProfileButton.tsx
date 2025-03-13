import React, { useState } from 'react';
import { Button, Avatar, Typography, Menu, MenuItem, Box, Divider } from '@mui/material';
import { AccountCircle as AccountIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useBadges } from '@/contexts/BadgeContext';

const UserProfileButton: React.FC = () => {
  const { currentUser, logout } = useBadges();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const displayName = currentUser.displayName || currentUser.name || 'User';
  const shortNpub = currentUser.npub ? `${currentUser.npub.substring(0, 8)}...` : '';

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          color: '#0f0',
          borderColor: '#0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            borderColor: '#0f0',
            bgcolor: 'rgba(0,255,0,0.1)',
          },
        }}
      >
        {currentUser.picture ? (
          <Avatar
            src={currentUser.picture}
            alt={displayName}
            sx={{ width: 24, height: 24, border: '1px solid #0f0' }}
          />
        ) : (
          <AccountIcon sx={{ color: '#0f0' }} />
        )}
        <Typography
          sx={{
            fontFamily: '"Share Tech Mono", monospace',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {displayName}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: '#111',
            color: '#0f0',
            border: '1px solid #0f0',
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Share Tech Mono", monospace',
              fontWeight: 'bold',
            }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Share Tech Mono", monospace',
              color: '#0f08',
              display: 'block',
            }}
          >
            {shortNpub}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#0f04' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            fontFamily: '"Share Tech Mono", monospace',
            '&:hover': {
              bgcolor: 'rgba(0,255,0,0.1)',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
          SIGN_OUT
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfileButton;
