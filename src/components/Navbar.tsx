import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(`${path}/`);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const navItems = [
    { label: 'WHY_NOSTR', path: '/why-nostr' },
    { label: 'BUILDING_EVENTSTR', path: '/building-eventstr' }
  ];

  return (
    <Box 
      sx={{ 
        bgcolor: '#000', 
        color: '#0f0',
        borderBottom: '1px solid #0f0',
        py: 2,
        fontFamily: '"Share Tech Mono", monospace',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography variant="h5" component="h1" sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
            <Link href="/" style={{ color: '#0f0', textDecoration: 'none' }}>
              EVENTSTR
            </Link>
          </Typography>
          
          {/* Desktop Navigation */}
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              gap: 2
            }}
          >
            {navItems.map((item) => (
              <Button 
                key={item.path}
                color="inherit" 
                component={Link}
                href={item.path}
                sx={{ 
                  fontFamily: '"Share Tech Mono", monospace',
                  bgcolor: isActive(item.path) ? '#0f03' : 'transparent',
                  textDecoration: isActive(item.path) ? 'underline' : 'none',
                  '&:hover': {
                    bgcolor: isActive(item.path) ? '#0f05' : '#0f03',
                    textDecoration: 'underline',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          
          {/* Mobile Menu Button */}
          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{ 
              display: { xs: 'flex', sm: 'none' },
              color: '#0f0'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Container>
      
      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            bgcolor: '#000',
            color: '#0f0',
            borderLeft: '1px solid #0f0',
            width: '75%',
            maxWidth: '300px'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton 
            color="inherit" 
            onClick={closeMobileMenu}
            sx={{ color: '#0f0' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <Button 
                fullWidth
                color="inherit" 
                component={Link}
                href={item.path}
                onClick={closeMobileMenu}
                sx={{ 
                  fontFamily: '"Share Tech Mono", monospace',
                  py: 2,
                  justifyContent: 'flex-start',
                  pl: 3,
                  bgcolor: isActive(item.path) ? '#0f03' : 'transparent',
                  textDecoration: isActive(item.path) ? 'underline' : 'none',
                  borderRadius: 0,
                  '&:hover': {
                    bgcolor: '#0f02',
                    textDecoration: 'underline',
                  }
                }}
              >
                {item.label}
              </Button>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Navbar; 