import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper, 
  Divider, 
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { Visibility, VisibilityOff, Diamond, Lock, Email } from '@mui/icons-material';
import { login } from '../features/auth/authSlice';

// Background pattern component
const BackgroundPattern = () => (
  <Box sx={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    zIndex: -1,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(183, 139, 32, 0.1) 0%, transparent 30%)',
      animation: 'pulse 20s infinite alternate',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 75% 75%, rgba(183, 139, 32, 0.1) 0%, transparent 30%)',
      animation: 'pulse 25s infinite alternate-reverse',
    },
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '100%': { transform: 'scale(1.1)' },
    },
  }} />
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || '/';
  const redirect = from === '/login' ? '/' : from; // Prevent redirect loop
  
  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate, redirect]);
  
  // Handle login errors
  useEffect(() => {
    if (error) {
      setErrors({ submit: error });
    }
  }, [error]);
  
  // Form validation
  const validate = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };
  
  // Form submission handler
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await dispatch(login({ email, password }));
      // The useEffect will handle the redirect when isAuthenticated becomes true
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ 
        submit: error || 'Login failed. Please check your credentials and try again.' 
      });
    }
  };
  
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(45deg, #f5f7fa 0%, #e4e8f0 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <BackgroundPattern />
      <Container maxWidth="sm" sx={{ zIndex: 1, py: 4 }}>
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #b78b20 0%, #eabb11ff 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 4px 20px rgba(183, 139, 32, 0.3)',
            }}>
              <Diamond sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
                background: 'linear-gradient(45deg, #b78b20, #f5d76e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ 
                color: theme.palette.text.secondary,
                maxWidth: '80%',
                mx: 'auto',
              }}
            >
              Sign in to access your account and explore our exclusive jewelry collection
            </Typography>
          </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={submitHandler} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
            disabled={loading}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              variant="body2"
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              background: 'linear-gradient(45deg, #b78b20 0%, #f5d76e 100%)',
              boxShadow: '0 4px 15px rgba(183, 139, 32, 0.3)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(183, 139, 32, 0.4)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <Divider sx={{ my: 3, '& .MuiDivider-wrapper': { px: 2 } }}>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 500, fontSize: '0.875rem' }}>
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center', mt: 2, position: 'relative' }}>
            <Typography variant="body2" sx={{ 
              color: '#666', 
              fontWeight: 500, 
              mb: 2,
              fontSize: '0.9rem',
              position: 'relative',
              '&:before, &:after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                width: '30%',
                height: '1px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)'
              },
              '&:before': {
                left: 0
              },
              '&:after': {
                right: 0
              }
            }}>
              Don't have an account?
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #b78b20 0%, #f5d76e 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(183, 139, 32, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(183, 139, 32, 0.4)',
                    background: 'linear-gradient(45deg, #a67c1d 0%, #e6c95c 100%)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Create Account
              </Button>
              
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  textDecoration: 'none',
                  color: '#555',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  mt: 1,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
