import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Snackbar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { login } from '../../services/api'; // Adjust the import based on your structure
import CustomModal from '../../components/CustomModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxStoreHook';
import { signinSuccess,signinFailure,signInStart } from '../../redux-store/user/userSlice';

const UserLogin: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.currentUser) {
      window.history.replaceState(null, '', '/home');
      navigate('/home');
    }
  }, [location]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      // .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("user State", userState);
        const response = await login(values.email, values.password);
        console.log(response);

          setSnackbarMessage('Logged in successfully!');
          dispatch(signinSuccess(response.data));
          setOpenSnackbar(true);
          navigate('/home');
      
      } catch (error) {
        console.error('Login failed:', error);
        setError('Login failed..!');
        setModalOpen(true);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth={false} 
     

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
        height:'100%',
      overflowX: 'hidden'
      }}>
      <Paper 
        elevation={6} 
        sx={{
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: alpha('#ffffff', 0.5),
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
       <img src={"/src/assets/Community-2.png"} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
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
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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
        </form>
      </Paper>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default UserLogin;