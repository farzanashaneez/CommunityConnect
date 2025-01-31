// import React, {useEffect, useState } from 'react';
// import { TextField, Button, Container, Typography, Paper, Snackbar } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import { login } from '../../services/api'; // Adjust the import based on your structure
// import CustomModal from '../../components/CustomModal';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useAppDispatch, useAppSelector } from '../../hooks/reduxStoreHook';
// import { signinSuccess } from '../../redux-store/user/userSlice';

// const UserLogin: React.FC = () => {
//   const [error, setError] = useState<string | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const userState = useAppSelector((state) => state.user);
//   const dispatch = useAppDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (userState.currentUser) {
//       window.history.replaceState(null, '', '/home');
//       navigate('/home');
//     }
//   }, [location]);

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email('Invalid email address')
//       .required('Email is required'),
//     password: Yup.string()
//       // .min(6, 'Password must be at least 6 characters')
//       .required('Password is required'),
//   });

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         console.log("user State", userState);
//         const response = await login(values.email, values.password);
//         console.log(response);

//           setSnackbarMessage('Logged in successfully!');
//           dispatch(signinSuccess(response.data));
//           setOpenSnackbar(true);
//           navigate('/home');
      
//       } catch (error) {
//         console.error('Login failed:', error);
//         setError('Login failed..!');
//         setModalOpen(true);
//       }
//     },
//   });

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   return (
//     <Container component="main" maxWidth={false} 
     

//       sx={{ 
//         backgroundImage: "url('/src/assets/homeBG.jpg')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         margin: 0,
//         padding: 0,
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         width: '100%',
//         height:'100%',
//       overflowX: 'hidden'
//       }}>
//       <Paper 
//         elevation={6} 
//         sx={{
//           padding: '40px',
//           width: '100%',
//           maxWidth: '400px',
//           backgroundColor: alpha('#ffffff', 0.5),
//           backdropFilter: 'blur(10px)',
//           borderRadius: '15px',
//           boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//         }}
//       >
//        <img src={"/src/assets/Community-2.png"} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
//         <form onSubmit={formik.handleSubmit} noValidate>
//           <TextField
//             variant="outlined"
//             margin="normal"
//             fullWidth
//             id="email"
//             name="email"
//             label="Email Address"
//             autoComplete="email"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.email && Boolean(formik.errors.email)}
//             helperText={formik.touched.email && formik.errors.email}
//             sx={{ backgroundColor: alpha('#ffffff', 0.7), borderRadius: '4px' }}
//           />
//           <TextField
//             variant="outlined"
//             margin="normal"
//             fullWidth
//             id="password"
//             name="password"
//             label="Password"
//             type="password"
//             autoComplete="current-password"
//             value={formik.values.password}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.password && Boolean(formik.errors.password)}
//             helperText={formik.touched.password && formik.errors.password}
//             sx={{ backgroundColor: alpha('#ffffff', 0.7), borderRadius: '4px' }}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             sx={{ 
//               marginTop: '24px',
//               padding: '12px',
//               fontSize: '1rem',
//               fontWeight: 'bold',
//               borderRadius: '8px',
//               backgroundColor: '#1976d2',
//               '&:hover': {
//                 backgroundColor: '#115293',
//               }
//             }}
//           >
//             Login
//           </Button>
//         </form>
//       </Paper>
//       <CustomModal 
//         open={modalOpen} 
//         handleClose={() => setModalOpen(false)}
//         title="Login Error"
//         content={error}
//         onConfirm={() => setModalOpen(false)}
//         confirmText="Close"
//         cancelText=""
//         showConfirm={true}
//         showCancel={false}
//       />
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         message={snackbarMessage}
//       />
//     </Container>
//   );
// };

// export default UserLogin;
import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { login, verifyEmail, updatePassword } from '../../services/api';
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
  const [verifiedId, setVerifiedId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
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
          setSnackbarMessage('Email verified successfully');
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

  const resetPasswordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: newPasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log('values',values.password)
        await updatePassword(verifiedId,values.password);
        setSnackbarMessage('Password reset successful');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setForgotPasswordOpen(false);
        setEmailVerified(false);
      } catch (error) {
        setSnackbarMessage('Password reset failed');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setEmailVerified(false);
    forgotPasswordFormik.resetForm();
    resetPasswordFormik.resetForm();
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

      {/* Forgot Password Dialog */}
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
          {emailVerified ? 'Reset Password' : 'Forgot Password'}
        </DialogTitle>
        <DialogContent>
          {!emailVerified ? (
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
          ) : (
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>
            Cancel
          </Button>
          <Button 
            onClick={() => 
              emailVerified 
                ? resetPasswordFormik.handleSubmit() 
                : forgotPasswordFormik.handleSubmit()
            }
            variant="contained"
          >
            {emailVerified ? 'Reset Password' : 'Verify Email'}
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