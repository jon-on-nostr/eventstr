import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormHelperText,
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { BadgesService } from '@/services/badges';
import NDK from '@nostr-dev-kit/ndk';
import ErrorBoundary from '@/components/ErrorBoundary';

// Types for component props
interface BadgeCreationFormProps {
  ndk: NDK;
  onSuccess?: (badgeId: string) => void;
}

// Form state types
interface FormState {
  name: string;
  description: string;
  image: string;
  thumbnail?: string;
}

// Form validation types
interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
}

// Form submission state
type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; badgeId: string }
  | { status: 'error'; error: string };

/**
 * Badge Creation Form Component
 *
 * Allows signed-in users to create new Nostr badges
 */
const BadgeCreationForm: React.FC<BadgeCreationFormProps> = ({ ndk, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [formState, setFormState] = useState<FormState>({
    name: '',
    description: '',
    image: '',
    thumbnail: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Image preview state
  const [imagePreviewError, setImagePreviewError] = useState<boolean>(false);
  const [thumbnailPreviewError, setThumbnailPreviewError] = useState<boolean>(false);

  // Submission state
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: 'idle' });

  // Create badge service instance with memoization to prevent recreation on rerenders
  const badgesService = useMemo(() => new BadgesService(ndk), [ndk]);

  // Check if user is signed in
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  // Effect to check if user is signed in
  useEffect(() => {
    const checkSignerStatus = async () => {
      try {
        const hasValidSigner = !!ndk.signer;
        setIsSignedIn(hasValidSigner);
      } catch (error) {
        console.error('Error checking signer status:', error);
        setIsSignedIn(false);
      }
    };

    checkSignerStatus();
  }, [ndk]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Reset preview error when image URL changes
    if (name === 'image') {
      setImagePreviewError(false);
    }
    if (name === 'thumbnail') {
      setThumbnailPreviewError(false);
    }

    // Update form state
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate name
    if (!formState.name.trim()) {
      newErrors.name = 'Badge name is required';
      isValid = false;
    } else if (formState.name.length > 50) {
      newErrors.name = 'Badge name must be less than 50 characters';
      isValid = false;
    }

    // Validate description
    if (!formState.description.trim()) {
      newErrors.description = 'Badge description is required';
      isValid = false;
    } else if (formState.description.length > 500) {
      newErrors.description = 'Badge description must be less than 500 characters';
      isValid = false;
    }

    // Validate image URL
    if (!formState.image.trim()) {
      newErrors.image = 'Badge image URL is required';
      isValid = false;
    } else {
      try {
        new URL(formState.image); // Check if URL is valid
      } catch (e) {
        newErrors.image = 'Please enter a valid URL';
        isValid = false;
      }
    }

    // Validate thumbnail URL if provided
    if (formState.thumbnail && formState.thumbnail.trim()) {
      try {
        new URL(formState.thumbnail); // Check if URL is valid
      } catch (e) {
        newErrors.thumbnail = 'Please enter a valid URL or leave empty';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is signed in
    if (!isSignedIn) {
      setSubmissionState({
        status: 'error',
        error: 'You must be signed in to create a badge',
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set submitting state
    setSubmissionState({ status: 'submitting' });

    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 15000);
      });

      // Create badge promise
      const createBadgePromise = badgesService.createBadge({
        name: formState.name.trim(),
        description: formState.description.trim(),
        image: formState.image.trim(),
        ...(formState?.thumbnail?.trim() ? { thumbnail: formState.thumbnail.trim() } : {}),
      });

      // Race the promises
      const badgeEvent = (await Promise.race([createBadgePromise, timeoutPromise])) as {
        id: string;
      };

      // Success
      setSubmissionState({
        status: 'success',
        badgeId: badgeEvent.id,
      });

      // Call onSuccess prop if provided
      if (onSuccess) {
        onSuccess(badgeEvent.id);
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormState({
          name: '',
          description: '',
          image: '',
          thumbnail: '',
        });
        setSubmissionState({ status: 'idle' });
      }, 3000);
    } catch (error) {
      console.error('Error creating badge:', error);
      setSubmissionState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to create badge. Please try again.',
      });
    }
  };

  // Handle image preview error
  const handleImageError = () => {
    setImagePreviewError(true);
  };

  // Handle thumbnail preview error
  const handleThumbnailError = () => {
    setThumbnailPreviewError(true);
  };

  return (
    <ErrorBoundary>
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#111',
          color: '#0f0',
          border: '1px solid #0f0',
          p: 3,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Success animation overlay */}
        {submissionState.status === 'success' && (
          <Fade in={submissionState.status === 'success'}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <Grow in={true} timeout={800}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 100,
                      color: '#0f0',
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(0.8)',
                          opacity: 0.7,
                        },
                        '50%': {
                          transform: 'scale(1.1)',
                          opacity: 1,
                        },
                        '100%': {
                          transform: 'scale(0.8)',
                          opacity: 0.7,
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      mt: 2,
                      color: '#0f0',
                      fontFamily: '"Share Tech Mono", monospace',
                      animation: 'fadeIn 1s',
                      '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                      },
                    }}
                  >
                    BADGE_CREATED
                  </Typography>
                </Box>
              </Grow>

              {/* Simple animation alternative */}
              <Grow in={true} timeout={1000}>
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 100,
                    color: '#0f0',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(0.95)',
                        boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)',
                      },
                      '70%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 10px rgba(0, 255, 0, 0)',
                      },
                      '100%': {
                        transform: 'scale(0.95)',
                        boxShadow: '0 0 0 0 rgba(0, 255, 0, 0)',
                      },
                    },
                  }}
                />
              </Grow>
              <Typography
                variant="h5"
                sx={{
                  mt: 2,
                  color: '#0f0',
                  fontFamily: '"Share Tech Mono", monospace',
                  textAlign: 'center',
                }}
              >
                BADGE_CREATED
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  color: '#0f0',
                  fontFamily: '"Share Tech Mono", monospace',
                  textAlign: 'center',
                }}
              >
                Badge ID: {submissionState.badgeId.slice(0, 8)}...
                {submissionState.badgeId.slice(-8)}
              </Typography>
            </Box>
          </Fade>
        )}

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontFamily: '"Share Tech Mono", monospace' }}
        >
          CREATE_BADGE
        </Typography>

        {!isSignedIn && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              bgcolor: '#332700',
              color: '#ffdd99',
              border: '1px solid #ffaa00',
            }}
          >
            You must be signed in to create a badge
          </Alert>
        )}

        {submissionState.status === 'error' && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              bgcolor: '#330000',
              color: '#ff9999',
              border: '1px solid #ff0000',
            }}
          >
            {submissionState.error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Badge Name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={submissionState.status === 'submitting' || !isSignedIn}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errors.name ? '#ff0000' : '#0f0',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.name ? '#ff0000' : '#0f0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.name ? '#ff0000' : '#0f0',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: errors.name ? '#ff0000' : '#0f0',
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                },
                '& .MuiFormHelperText-root': {
                  color: errors.name ? '#ff0000' : '#999',
                },
              }}
              inputProps={{ maxLength: 50 }}
            />
            <FormHelperText sx={{ color: '#999', ml: 1 }}>
              {formState.name.length}/50 characters
            </FormHelperText>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Badge Description"
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={submissionState.status === 'submitting' || !isSignedIn}
              multiline
              rows={3}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errors.description ? '#ff0000' : '#0f0',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.description ? '#ff0000' : '#0f0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.description ? '#ff0000' : '#0f0',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: errors.description ? '#ff0000' : '#0f0',
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                },
                '& .MuiFormHelperText-root': {
                  color: errors.description ? '#ff0000' : '#999',
                },
              }}
              inputProps={{ maxLength: 500 }}
            />
            <FormHelperText sx={{ color: '#999', ml: 1 }}>
              {formState.description.length}/500 characters
            </FormHelperText>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            <Box sx={{ flex: 1, mr: isMobile ? 0 : 2, mb: isMobile ? 3 : 0 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Badge Image URL"
                name="image"
                value={formState.image}
                onChange={handleInputChange}
                error={!!errors.image}
                helperText={errors.image}
                disabled={submissionState.status === 'submitting' || !isSignedIn}
                placeholder="https://example.com/badge-image.png"
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.image ? '#ff0000' : '#0f0',
                    },
                    '&:hover fieldset': {
                      borderColor: errors.image ? '#ff0000' : '#0f0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: errors.image ? '#ff0000' : '#0f0',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: errors.image ? '#ff0000' : '#0f0',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiFormHelperText-root': {
                    color: errors.image ? '#ff0000' : '#999',
                  },
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Thumbnail URL (Optional)"
                name="thumbnail"
                value={formState.thumbnail}
                onChange={handleInputChange}
                error={!!errors.thumbnail}
                helperText={errors.thumbnail}
                disabled={submissionState.status === 'submitting' || !isSignedIn}
                placeholder="https://example.com/badge-thumbnail.png"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.thumbnail ? '#ff0000' : '#0f0',
                    },
                    '&:hover fieldset': {
                      borderColor: errors.thumbnail ? '#ff0000' : '#0f0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: errors.thumbnail ? '#ff0000' : '#0f0',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: errors.thumbnail ? '#ff0000' : '#0f0',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiFormHelperText-root': {
                    color: errors.thumbnail ? '#ff0000' : '#999',
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                width: isMobile ? '100%' : '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ mb: 1, color: '#0f0', alignSelf: 'center' }}>
                Image Preview
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  height: '150px',
                  border: '1px dashed #0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundColor: '#222',
                  mb: 1,
                }}
              >
                {formState.image ? (
                  imagePreviewError ? (
                    <ErrorOutlineIcon sx={{ fontSize: 40, color: '#f00' }} />
                  ) : (
                    <img
                      src={formState.image}
                      alt="Badge Preview"
                      onError={handleImageError}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  )
                ) : (
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    No image URL provided
                  </Typography>
                )}
              </Box>

              {formState.thumbnail && (
                <>
                  <Typography
                    variant="caption"
                    sx={{ mb: 1, mt: 1, color: '#0f0', alignSelf: 'center' }}
                  >
                    Thumbnail Preview
                  </Typography>

                  <Box
                    sx={{
                      width: '80px',
                      height: '80px',
                      border: '1px dashed #0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      backgroundColor: '#222',
                    }}
                  >
                    {thumbnailPreviewError ? (
                      <ErrorOutlineIcon sx={{ fontSize: 20, color: '#f00' }} />
                    ) : (
                      <img
                        src={formState.thumbnail}
                        alt="Thumbnail Preview"
                        onError={handleThumbnailError}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submissionState.status === 'submitting' || !isSignedIn}
              startIcon={
                submissionState.status === 'submitting' ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddCircleOutlineIcon />
                )
              }
              sx={{
                bgcolor: '#0f0',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#0c0',
                },
                '&.Mui-disabled': {
                  bgcolor: '#060',
                  color: '#333',
                },
                minWidth: '180px',
                py: 1,
              }}
            >
              {submissionState.status === 'submitting' ? 'Creating...' : 'Create Badge'}
            </Button>
          </Box>
        </form>
      </Paper>
    </ErrorBoundary>
  );
};

export default BadgeCreationForm;
