// import React from 'react';
// import { Box, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
// import { Badge } from '@/services/nostrService';
// import { useBadges } from '@/contexts/BadgeContext';

// interface BadgeCardProps {
//   badge: Badge;
// }

// // Create a reusable BadgeCard component
// const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
//   const { loadBadgeDetails } = useBadges();

//   const handleViewDetails = () => {
//     loadBadgeDetails(badge.id);
//     // You could navigate to a badge details page here
//     // or open a modal with the badge details
//   };

//   return (
//     <Card
//       sx={{
//         bgcolor: '#1a1a1a',
//         color: '#0f0',
//         border: '1px solid #0f0',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         transition: 'transform 0.2s, box-shadow 0.2s',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: '0 4px 20px rgba(0, 255, 0, 0.2)',
//         },
//       }}
//     >
//       <Box sx={{ p: 2, textAlign: 'center' }}>
//         <img
//           src={badge.image}
//           alt={badge.name}
//           style={{
//             width: 100,
//             height: 100,
//             borderRadius: '4px',
//             margin: '0 auto',
//             objectFit: 'contain',
//           }}
//           onError={e => {
//             e.currentTarget.src = 'https://placehold.co/200x200/1a1a1a/00ff00?text=BADGE';
//           }}
//         />
//       </Box>
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography
//           variant="h6"
//           component="h3"
//           gutterBottom
//           sx={{
//             fontFamily: '"Share Tech Mono", monospace',
//             fontSize: '1rem',
//             height: '2.5rem',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             display: '-webkit-box',
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: 'vertical',
//           }}
//         >
//           {badge.name}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{
//             mb: 2,
//             fontFamily: '"Share Tech Mono", monospace',
//             height: '4.5rem',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             display: '-webkit-box',
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: 'vertical',
//           }}
//         >
//           {badge.description}
//         </Typography>
//         <Typography
//           variant="caption"
//           sx={{
//             display: 'block',
//             fontFamily: '"Share Tech Mono", monospace',
//             color: '#0f08',
//           }}
//         >
//           Created: {badge.created}
//         </Typography>
//       </CardContent>
//       <CardActions sx={{ p: 2, borderTop: '1px dashed #0f0' }}>
//         <Button
//           size="small"
//           variant="outlined"
//           fullWidth
//           onClick={handleViewDetails}
//           sx={{
//             color: '#0f0',
//             borderColor: '#0f0',
//             '&:hover': {
//               borderColor: '#0f0',
//               bgcolor: 'rgba(0,255,0,0.1)',
//             },
//           }}
//         >
//           View Details
//         </Button>
//       </CardActions>
//     </Card>
//   );
// };

// export default BadgeCard;
