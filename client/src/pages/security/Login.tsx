import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { loginAsSecurity, updatePassword, verifyEmail } from '../../services/api';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxStoreHook';
import { loggedin, loginfailure } from '../../redux-store/user/securitySlice';

// Validation schemas using Yup
const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const securityState = useAppSelector((state) => state.security);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedId,setverifiedId]=useState('')
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (securityState.currentSecurity) {
      window.history.replaceState(null, '', '/security/');
      navigate('/security/');
    }
  }, [securityState.currentSecurity, navigate]);

  // Login form
  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginAsSecurity(values.email, values.password);
        dispatch(loggedin(response.data));
        navigate('/security/home');
      } catch (error) {
        dispatch(loginfailure());
        setSnackbar({
          open: true,
          message: 'Login failed. Please check your credentials.',
          severity: 'error'
        });[1]
      }
    },
  });

  // Forgot password form (Email verification)
  const forgotPasswordFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        const availableUser=await verifyEmail(values.email);
       if(availableUser){
        setverifiedId(availableUser._id)
         setEmailVerified(true);
        setSnackbar({
          open: true,
          message: 'Email verified successfully. You can now reset your password.',
          severity: 'success'
        });
      }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to verify email. Please try again.',
          severity: 'error'
        });[1]
      }
    },
  });

  // Reset password form
  const resetPasswordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        await updatePassword(verifiedId,values.password);
        setSnackbar({
          open: true,
          message: 'Password has been successfully reset',
          severity: 'success'
        });
        setResetPasswordOpen(false);
        setForgotPasswordOpen(false);
        setEmailVerified(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to reset password. Please try again.',
          severity: 'error'
        });[1]
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography component="h1" variant="h4" align="center">
            Community Connect
          </Typography>
          <Typography component="h1" variant="h5" align="center">
            Security Login
          </Typography>
          <Box component="form" onSubmit={loginFormik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={loginFormik.values.email}
              onChange={loginFormik.handleChange}
              error={loginFormik.touched.email && Boolean(loginFormik.errors.email)}
              helperText={loginFormik.touched.email && loginFormik.errors.email}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={loginFormik.values.password}
              onChange={loginFormik.handleChange}
              error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
              helperText={loginFormik.touched.password && loginFormik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot Password?
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={() => {
        setForgotPasswordOpen(false);
        setEmailVerified(false);
      }}>
        <DialogTitle>{emailVerified ? 'Reset Password' : 'Forgot Password'}</DialogTitle>
        <DialogContent>
          {!emailVerified ? (
            <Box component="form" onSubmit={forgotPasswordFormik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="forgot-email"
                name="email"
                label="Email Address"
                value={forgotPasswordFormik.values.email}
                onChange={forgotPasswordFormik.handleChange}
                error={forgotPasswordFormik.touched.email && Boolean(forgotPasswordFormik.errors.email)}
                helperText={forgotPasswordFormik.touched.email && forgotPasswordFormik.errors.email}
              />
            </Box>
          ) : (
            <Box component="form" onSubmit={resetPasswordFormik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="new-password"
                name="password"
                label="New Password"
                type="password"
                value={resetPasswordFormik.values.password}
                onChange={resetPasswordFormik.handleChange}
                error={resetPasswordFormik.touched.password && Boolean(resetPasswordFormik.errors.password)}
                helperText={resetPasswordFormik.touched.password && resetPasswordFormik.errors.password}
              />
              <TextField
                margin="normal"
                fullWidth
                id="confirm-password"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={resetPasswordFormik.values.confirmPassword}
                onChange={resetPasswordFormik.handleChange}
                error={resetPasswordFormik.touched.confirmPassword && Boolean(resetPasswordFormik.errors.confirmPassword)}
                helperText={resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setForgotPasswordOpen(false);
            setEmailVerified(false);
          }}>Cancel</Button>
          {!emailVerified ? (
            <Button onClick={() => forgotPasswordFormik.handleSubmit()}>Verify Email</Button>
          ) : (
            <Button onClick={() => resetPasswordFormik.handleSubmit()}>Reset Password</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
