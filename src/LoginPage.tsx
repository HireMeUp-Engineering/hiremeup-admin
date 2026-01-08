import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
    } catch (error: any) {
      notify(
        error?.message || 'Invalid credentials. Please check your email and password.',
        { type: 'error' }
      );
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #211B43 0%, #1C4A72 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          minWidth: { xs: '100%', sm: 400 },
          maxWidth: 500,
          boxShadow: '0 8px 32px rgba(135, 89, 242, 0.3)',
          borderRadius: 3,
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#211B43',
            padding: 4,
            textAlign: 'center',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <img
            src="/logo.png"
            alt="HireMeUp"
            style={{
              height: '50px',
              maxWidth: '200px',
              marginBottom: '16px',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            Admin Panel
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: 1,
            }}
          >
            Sign in to access the dashboard
          </Typography>
        </Box>

        <CardContent sx={{ padding: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#8759F2' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#8759F2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8759F2',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8759F2',
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#8759F2' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#8759F2' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#8759F2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8759F2',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8759F2',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#8759F2',
                color: 'white',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(135, 89, 242, 0.4)',
                '&:hover': {
                  backgroundColor: '#6842c9',
                  boxShadow: '0 6px 16px rgba(135, 89, 242, 0.5)',
                },
                '&:disabled': {
                  backgroundColor: '#8759F2',
                  opacity: 0.6,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box sx={{ marginTop: 3, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#8997A4',
                fontSize: '12px',
              }}
            >
              Authorized admin access only
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ marginTop: 3, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
          }}
        >
          © 2024 HireMeUp. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
