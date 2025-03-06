import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  TextField,
  Box,
  Chip,
  Paper,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Framer Motion component wrappers
const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

// Animation variants for staggered children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  }
};

// Sample Nostr public key for display
const MY_NOSTR_PUBKEY = 'npub1xhdzye3dmy9u0zk5yetaue4r9lzxduvcp4skd50utjjax908p9cqwuxaaq';

// Sample latest articles for the homepage
const latestArticles = [
  {
    title: 'Understanding Nostr Events',
    snippet: 'Learn how Nostr events form the backbone of the protocol...',
    date: 'March 2, 2025',
    tag: 'Foundations'
  },
  {
    title: 'Setting Up Your First Relay',
    snippet: 'A step-by-step guide to deploying your own Nostr relay...',
    date: 'February 27, 2025',
    tag: 'Development'
  },
  {
    title: 'My Journey with NIPs',
    snippet: 'Personal reflections on implementing various Nostr Improvement Proposals...',
    date: 'February 20, 2025',
    tag: 'Learning Journal'
  }
];

// Learning paths for the "Choose Your Path" section
const learningPaths = [
  {
    title: 'For Beginners',
    description: 'Start your Nostr journey with fundamental concepts and basic usage.',
    icon: <PersonIcon sx={{ fontSize: 40 }} />,
    color: '#5E35B1', // Deep Purple
    link: '/beginners'
  },
  {
    title: 'For Developers',
    description: 'Dive into building with Nostr, from basic integrations to custom clients.',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    color: '#2196F3', // Electric Blue
    link: '/developers'
  },
  {
    title: 'For Educators',
    description: 'Learn how to teach Nostr concepts and build community resources.',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    color: '#FFC107', // Yellow-Orange
    link: '/educators'
  }
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  
  const handleCopyPublicKey = () => {
    navigator.clipboard.writeText(MY_NOSTR_PUBKEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Navigation Header - Improved contrast with light purple background */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
              eVENTSTR
            </Typography>
          </motion.div>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex' }}>
            {['Resources', 'Learning Paths', 'Community', 'Journal'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -3 }}
              >
                <Button color="inherit" sx={{ mx: 1, color: 'text.primary' }}>{item}</Button>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button variant="contained" color="primary" sx={{ ml: 2 }}>
                Get Started
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <MotionBox 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          py: 12, 
          px: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(94,53,177,0.08) 0%, rgba(33,150,243,0.08) 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="md">
          <MotionTypography 
            variant="h1" 
            gutterBottom 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            Own Your Voice with <Box component="span" sx={{ color: 'primary.main' }}>Nostr</Box>
          </MotionTypography>
          
          <MotionTypography 
            variant="h5" 
            color="text.secondary" 
            paragraph 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            sx={{ mb: 4 }}
          >
            Join the movement toward digital sovereignty. Start building your Nostr presence today.
          </MotionTypography>
          
          <MotionBox 
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="contained" color="primary" size="large">
                Start Learning
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outlined" color="primary" size="large">
                Join Community
              </Button>
            </motion.div>
          </MotionBox>
          
          <MotionPaper 
            elevation={0} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            sx={{ 
              p: 2, 
              display: 'inline-flex', 
              alignItems: 'center', 
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
              My Nostr Key:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {MY_NOSTR_PUBKEY.substring(0, 12)}...{MY_NOSTR_PUBKEY.substring(MY_NOSTR_PUBKEY.length - 6)}
            </Typography>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton size="small" onClick={handleCopyPublicKey} sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" color={copied ? "primary" : "inherit"} />
              </IconButton>
            </motion.div>
          </MotionPaper>
        </Container>
      </MotionBox>

      {/* Choose Your Path Section */}
      <MotionContainer 
        maxWidth="lg" 
        sx={{ py: 8 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <MotionTypography 
          variant="h2" 
          align="center" 
          gutterBottom 
          variants={itemVariants}
          sx={{ mb: 6 }}
        >
          Choose Your Path
        </MotionTypography>
        
        <Grid container spacing={4}>
          {learningPaths.map((path, index) => (
            <MotionGrid item xs={12} md={4} key={index} variants={itemVariants}>
              <MotionCard 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  transition: { duration: 0.3 }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  pt: 4,
                  pb: 2
                }}>
                  <MotionBox 
                    sx={{ 
                      bgcolor: `${path.color}20`, // Using hex opacity
                      color: path.color,
                      p: 2,
                      borderRadius: '50%'
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      transition: { duration: 0.3, type: "spring" }
                    }}
                  >
                    {path.icon}
                  </MotionBox>
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h4" component="h3">
                    {path.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {path.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outlined" color="primary" href={path.link} endIcon={<ChevronRightIcon />}>
                      View Path
                    </Button>
                  </motion.div>
                </CardActions>
              </MotionCard>
            </MotionGrid>
          ))}
        </Grid>
      </MotionContainer>
      
      {/* Latest Content Section */}
      <MotionBox 
        sx={{ bgcolor: 'background.paper', py: 8 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <MotionTypography 
              variant="h3" 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Latest Content
            </MotionTypography>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <Button color="primary" endIcon={<ChevronRightIcon />}>
                View All
              </Button>
            </motion.div>
          </Box>
          
          <MotionGrid 
            container 
            spacing={4}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {latestArticles.map((article, index) => (
              <MotionGrid item xs={12} md={4} key={index} variants={itemVariants}>
                <MotionCard 
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  whileHover={{ 
                    y: -8, 
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Chip
                          label={article.tag}
                          size="small"
                          sx={{ 
                            bgcolor: 
                              article.tag === 'Foundations' ? `${theme.palette.primary.main}15` : 
                              article.tag === 'Development' ? `${theme.palette.secondary.main}15` : 
                              `${theme.palette.warning.main}15`,
                            color: 
                              article.tag === 'Foundations' ? theme.palette.primary.main : 
                              article.tag === 'Development' ? theme.palette.secondary.main : 
                              theme.palette.warning.main,
                          }}
                        />
                      </motion.div>
                      <Typography variant="caption" color="text.secondary">
                        {article.date}
                      </Typography>
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.snippet}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <motion.div whileHover={{ x: 3 }}>
                      <Button size="small" color="primary">Read More</Button>
                    </motion.div>
                  </CardActions>
                </MotionCard>
              </MotionGrid>
            ))}
          </MotionGrid>
        </Container>
      </MotionBox>
      
      {/* Newsletter / Stay Connected Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <MotionPaper
          elevation={0}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            borderRadius: 4,
            backgroundColor: 'primary.main',
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Background decoration elements */}
          <MotionBox
            sx={{ 
              position: 'absolute', 
              width: 300, 
              height: 300, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', 
              top: -100, 
              right: -100 
            }}
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: [0, 45, 0] 
            }}
            transition={{ 
              duration: 20, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          
          <MotionBox
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <RssFeedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
          </MotionBox>
          
          <MotionTypography 
            variant="h3" 
            gutterBottom
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Stay Connected
          </MotionTypography>
          
          <MotionTypography 
            variant="h6" 
            sx={{ mb: 4, opacity: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Follow my Nostr journey and get notified when new educational content is published
          </MotionTypography>
          
          <MotionBox 
            sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, maxWidth: 500, mx: 'auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your Nostr public key..."
              sx={{ 
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                color="warning" 
                sx={{ 
                  px: 4,
                  py: { xs: 1.5, sm: 2 },
                  whiteSpace: 'nowrap'
                }}
              >
                Follow Updates
              </Button>
            </motion.div>
          </MotionBox>
        </MotionPaper>
      </Container>
      
      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                eventstr
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                An educational journey through the decentralized world of Nostr.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Learning Paths
              </Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>For Beginners</Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>For Developers</Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>For Educators</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>Nostr Basics</Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>NIPs Explained</Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>Tool Directory</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Connect
              </Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>Nostr: {MY_NOSTR_PUBKEY.substring(0, 8)}...</Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>GitHub</Typography>
              <Typography component="a" href="#" variant="body2" display="block" sx={{ mb: 1, color: 'text.secondary', textDecoration: 'none' }}>Community Chat</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Nostr Learn. Open source educational content.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;