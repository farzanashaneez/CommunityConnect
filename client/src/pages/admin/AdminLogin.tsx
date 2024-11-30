import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Snackbar } from '@mui/material';
import { login } from '../../services/api'; // Adjust the import based on your structure
import CustomModal from '../../components/CustomModal';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';



const AdminLogin: React.FC = () => {

  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
const navigate=useNavigate();
const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
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
        const response = await login(values.email, values.password);
        console.log(response);
        setSnackbarMessage('Logged in successfully!');
        setOpenSnackbar(true);
        navigate('/admin/dashboard');
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
    //   backgroundColor: 'blue', 
      backgroundImage:"url('/src/assets/admin_background.avif')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: 0,
      padding: 0,
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw'
    }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" align="center">Admin Login</Typography>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Login
          </Button>
        </form>
      </Paper>
      <CustomModal 
        open={modalOpen} 
        handleClose={() => setModalOpen(false)} 
        title="Login Error" 
        content={<div>{error}</div>} 
      />
      <CustomModal 
  open={modalOpen} 
  handleClose={() => setModalOpen(false)}
  title="Login Error"
  content={error}
  onConfirm={() => setModalOpen(false)}
  confirmText="close"
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

export default AdminLogin;