import React, { useEffect, useRef, useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { login, verifyEmail, updatePassword, verifyOtp, requestOtp } from '../../services/api';
import CustomModal from '../../components/CustomModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxStoreHook';
import { signinSuccess } from '../../redux-store/user/userSlice';

const UserLogin: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedId, setVerifiedId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [disableResendOtp, setDisableResendOtp] = useState(false);
  const [counter, setCounter] = useState(60); // Start with 60 seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.currentUser) {
      window.history.replaceState(null, '', '/home');
      navigate('/home');
    }
  }, [location, userState.currentUser, navigate]);

  // Timer for OTP resend button
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start the timer if the resend button is disabled
    if (disableResendOtp) {
      setCounter(60); // Reset to 60 seconds when disabled
      
      intervalRef.current = setInterval(() => {
        setCounter((prevCounter) => {
          // When counter reaches 0, enable the resend button
          if (prevCounter <= 1) {
            setDisableResendOtp(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [disableResendOtp]);

  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const resetPasswordValidationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .required('OTP is required')
      .matches(/^\d{6}$/, 'OTP must be 6 digits'),
  });

  const newPasswordValidationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await login(values.email, values.password);
        setSnackbarMessage('Logged in successfully!');
        setSnackbarSeverity('success');
        dispatch(signinSuccess(response.data));
        setOpenSnackbar(true);
        navigate('/home');
      } catch (error) {
        console.error('Login failed:', error);
        setError('Login failed. Please check your credentials.');
        setModalOpen(true);
      }
    },
  });

  const forgotPasswordFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await verifyEmail(values.email);
        if (response) {
          setVerifiedId(response._id);
          setEmailVerified(true);
          // Request OTP after email is verified
          await requestOtp(response._id);
          setDisableResendOtp(true); // Disable resend button after initial OTP request
          setSnackbarMessage('Email verified. OTP sent to your email');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('Email verification failed');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: otpValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await verifyOtp(verifiedId, values.otp);
        if (response) {
          setOtpVerified(true);
          setSnackbarMessage('OTP verified successfully');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('OTP verification failed');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const resetPasswordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: newPasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        await updatePassword(verifiedId, values.password);
        setSnackbarMessage('Password reset successful');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setForgotPasswordOpen(false);
        setEmailVerified(false);
        setOtpVerified(false);
      } catch (error) {
        setSnackbarMessage('Password reset failed');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const handleResendOtp = async () => {
    // Only proceed if button is enabled
    if (!disableResendOtp) {
      setDisableResendOtp(true);
      
      try {
        await requestOtp(verifiedId);
        setSnackbarMessage('OTP resent successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage('Failed to resend OTP');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        // Even if there's an error, keep the button disabled for the cooldown period
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setEmailVerified(false);
    setOtpVerified(false);
    setDisableResendOtp(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    forgotPasswordFormik.resetForm();
    otpFormik.resetForm();
    resetPasswordFormik.resetForm();
  };

  // Format the counter as mm:ss
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Determine which form to show in the dialog
  const renderPasswordResetForm = () => {
    if (!emailVerified) {
      return (
        <form onSubmit={forgotPasswordFormik.handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="reset-email"
            name="email"
            label="Email Address"
            value={forgotPasswordFormik.values.email}
            onChange={forgotPasswordFormik.handleChange}
            onBlur={forgotPasswordFormik.handleBlur}
            error={forgotPasswordFormik.touched.email && Boolean(forgotPasswordFormik.errors.email)}
            helperText={forgotPasswordFormik.touched.email && forgotPasswordFormik.errors.email}
          />
        </form>
      );
    } else if (!otpVerified) {
      // Step 2: OTP verification form
      return (
        <form onSubmit={otpFormik.handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="otp"
            name="otp"
            label="Enter 6-digit OTP"
            value={otpFormik.values.otp}
            onChange={otpFormik.handleChange}
            onBlur={otpFormik.handleBlur}
            error={otpFormik.touched.otp && Boolean(otpFormik.errors.otp)}
            helperText={otpFormik.touched.otp && otpFormik.errors.otp}
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {disableResendOtp && (
              <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                Resend in: {formatTime(counter)}
              </Box>
            )}
            <Button 
              variant="text" 
              size="small" 
              onClick={handleResendOtp}
              disabled={disableResendOtp}
              sx={{ 
                color: '#1976d2',
                fontSize: '0.8rem',
                ml: 'auto' // Push to the right
              }}
            >
              Resend OTP
            </Button>
          </Box>
        </form>
      );
    } else {
      return (
        <form onSubmit={resetPasswordFormik.handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="new-password"
            name="password"
            label="New Password"
            type="password"
            value={resetPasswordFormik.values.password}
            onChange={resetPasswordFormik.handleChange}
            onBlur={resetPasswordFormik.handleBlur}
            error={resetPasswordFormik.touched.password && Boolean(resetPasswordFormik.errors.password)}
            helperText={resetPasswordFormik.touched.password && resetPasswordFormik.errors.password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="confirm-password"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={resetPasswordFormik.values.confirmPassword}
            onChange={resetPasswordFormik.handleChange}
            onBlur={resetPasswordFormik.handleBlur}
            error={resetPasswordFormik.touched.confirmPassword && Boolean(resetPasswordFormik.errors.confirmPassword)}
            helperText={resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword}
          />
        </form>
      );
    }
  };

  // Determine the title and button text for the dialog based on the current step
  const getDialogTitle = () => {
    if (!emailVerified) return 'Forgot Password';
    if (!otpVerified) return 'Verify OTP';
    return 'Reset Password';
  };

  const getActionButtonText = () => {
    if (!emailVerified) return 'Verify Email';
    if (!otpVerified) return 'Verify OTP';
    return 'Reset Password';
  };

  const handleDialogAction = () => {
    if (!emailVerified) {
      forgotPasswordFormik.handleSubmit();
    } else if (!otpVerified) {
      otpFormik.handleSubmit();
    } else {
      resetPasswordFormik.handleSubmit();
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth={false} 
      sx={{ 
        backgroundImage: "url('/src/assets/homeBG.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      <Paper 
        elevation={6} 
        sx={{
          padding: { xs: '20px', sm: '40px' },
          width: '100%',
          maxWidth: '400px',
          backgroundColor: alpha('#ffffff', 0.5),
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          margin: { xs: '16px', sm: 0 }
        }}
      >
        <img 
          src="/src/assets/Community-2.png" 
          alt="Logo" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            marginBottom: '20px' 
          }} 
        />
        <form onSubmit={loginFormik.handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={loginFormik.values.email}
            onChange={loginFormik.handleChange}
            onBlur={loginFormik.handleBlur}
            error={loginFormik.touched.email && Boolean(loginFormik.errors.email)}
            helperText={loginFormik.touched.email && loginFormik.errors.email}
            sx={{ backgroundColor: alpha('#ffffff', 0.7), borderRadius: '4px' }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={loginFormik.values.password}
            onChange={loginFormik.handleChange}
            onBlur={loginFormik.handleBlur}
            error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
            helperText={loginFormik.touched.password && loginFormik.errors.password}
            sx={{ backgroundColor: alpha('#ffffff', 0.7), borderRadius: '4px' }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ 
              marginTop: '24px',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#115293',
              }
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setForgotPasswordOpen(true)}
            sx={{ 
              marginTop: '8px',
              color: '#1976d2',
              '&:hover': {
                backgroundColor: alpha('#1976d2', 0.1),
              }
            }}
          >
            Forgot Password?
          </Button>
        </form>
      </Paper>

      {/* Forgot Password Dialog with multiple steps */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleCloseForgotPassword}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '400px',
            margin: { xs: '16px', sm: '32px' },
            padding: { xs: '16px', sm: '24px' }
          }
        }}
      >
        <DialogTitle>
          {getDialogTitle()}
        </DialogTitle>
        <DialogContent>
          {renderPasswordResetForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>
            Cancel
          </Button>
          <Button 
            onClick={handleDialogAction}
            variant="contained"
          >
            {getActionButtonText()}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <CustomModal 
        open={modalOpen} 
        handleClose={() => setModalOpen(false)}
        title="Login Error"
        content={error}
        onConfirm={() => setModalOpen(false)}
        confirmText="Close"
        cancelText=""
        showConfirm={true}
        showCancel={false}
      />

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserLogin;