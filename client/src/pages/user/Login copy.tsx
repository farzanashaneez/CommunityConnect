// import React, { useState } from 'react';
// import { 
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Link,
//   Paper,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { login, requestPasswordReset, updatePassword } from '../../services/api';

// // Validation schemas
// const loginSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Invalid email address')
//     .required('Email is required'),
//   password: Yup.string()
//     .min(8, 'Password must be at least 8 characters')
//     .required('Password is required'),
// });

// const forgotPasswordSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Invalid email address')
//     .required('Email is required'),
// });

// const updatePasswordSchema = Yup.object().shape({
//   currentPassword: Yup.string()
//     .required('Current password is required'),
//   newPassword: Yup.string()
//     .min(8, 'Password must be at least 8 characters')
//     .matches(/[0-9]/, 'Password must contain at least one number')
//     .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//     .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//     .required('New password is required'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('newPassword')], 'Passwords must match')
//     .required('Confirm password is required'),
// });

// const Login: React.FC = () => {
//   const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
//   const [updatePasswordOpen, setUpdatePasswordOpen] = useState(false);

//   const handleLogin = async (values: { email: string; password: string }, { setSubmitting, setErrors }) => {
//     try {
//       const response = await login(values.email, values.password);
//       console.log(response);
//       // Handle successful login (e.g., store token, redirect)
//     } catch (error) {
//       setErrors({ submit: 'Login failed. Please check your credentials.' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleForgotPassword = async (values: { email: string }, { setSubmitting, setErrors }) => {
//     try {
//       await requestPasswordReset(values.email);
//       setForgotPasswordOpen(false);
//       // Show success message
//     } catch (error) {
//       setErrors({ submit: 'Failed to send reset email. Please try again.' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleUpdatePassword = async (values: { currentPassword: string; newPassword: string }, { setSubmitting, setErrors }) => {
//     try {
//       await updatePassword(values.currentPassword, values.newPassword);
//       setUpdatePasswordOpen(false);
//       // Show success message
//     } catch (error) {
//       setErrors({ submit: 'Failed to update password. Please try again.' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
//           <Typography component="h1" variant="h5" align="center" gutterBottom>
//             Login
//           </Typography>

//           <Formik
//             initialValues={{ email: '', password: '' }}
//             validationSchema={loginSchema}
//             onSubmit={handleLogin}
//           >
//             {({ errors, touched, isSubmitting }) => (
//               <Form>
//                 <Field
//                   name="email"
//                   as={TextField}
//                   margin="normal"
//                   fullWidth
//                   label="Email Address"
//                   error={touched.email && !!errors.email}
//                   helperText={touched.email && errors.email}
//                 />
//                 <Field
//                   name="password"
//                   as={TextField}
//                   margin="normal"
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   error={touched.password && !!errors.password}
//                   helperText={touched.password && errors.password}
//                 />
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   sx={{ mt: 3, mb: 2 }}
//                   disabled={isSubmitting}
//                 >
//                   Login
//                 </Button>
//                 {errors.submit && (
//                   <Typography color="error" align="center">
//                     {errors.submit}
//                   </Typography>
//                 )}
//               </Form>
//             )}
//           </Formik>

//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//             <Link
//               component="button"
//               variant="body2"
//               onClick={() => setForgotPasswordOpen(true)}
//             >
//               Forgot password?
//             </Link>
//             <Link
//               component="button"
//               variant="body2"
//               onClick={() => setUpdatePasswordOpen(true)}
//             >
//               Update password
//             </Link>
//           </Box>
//         </Paper>
//       </Box>

//       {/* Forgot Password Dialog */}
//       <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
//         <DialogTitle>Reset Password</DialogTitle>
//         <DialogContent>
//           <Formik
//             initialValues={{ email: '' }}
//             validationSchema={forgotPasswordSchema}
//             onSubmit={handleForgotPassword}
//           >
//             {({ errors, touched, isSubmitting }) => (
//               <Form>
//                 <Field
//                   name="email"
//                   as={TextField}
//                   margin="normal"
//                   fullWidth
//                   label="Email Address"
//                   error={touched.email && !!errors.email}
//                   helperText={touched.email && errors.email}
//                 />
//                 <DialogActions>
//                   <Button onClick={() => setForgotPasswordOpen(false)}>Cancel</Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     Send Reset Link
//                   </Button>
//                 </DialogActions>
//                 {errors.submit && (
//                   <Typography color="error" align="center">
//                     {errors.submit}
//                   </Typography>
//                 )}
//               </Form>
//             )}
//           </Formik>
//         </DialogContent>
//       </Dialog>

//       {/* Update Password Dialog */}
//       <Dialog open={updatePasswordOpen} onClose={() => setUpdatePasswordOpen(false)}>
//         <DialogTitle>Update Password</DialogTitle>
//         <DialogContent>
//           <Formik
//             initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
//             validationSchema={updatePasswordSchema}
//             onSubmit={handleUpdatePassword}
//           >
//             {({ errors, touched, isSubmitting }) => (
//               <Form>
//                 <Field
//                   name="currentPassword"
//                   as={TextField}
//                   margin="normal"
//                   fullWidth
//                   label="Current Password"
//                   type="password"
//                   error={touched.currentPassword && !!errors.currentPassword}
//                   helperText={touched.currentPassword && errors.currentPassword}
//                 />
//                 <Field
//                   name="newPassword"
//                   as={TextField}
//                   margin="normal"
//                   fullWidth
//                   label="New Password"
//                   type="password"
//                   error={touched.newPassword && !!errors.newPassword}
//                   helperText={touched.newPassword && errors.newPassword}
//                 />
//                 <Field
//                   name="confirmPassword"
//                   as={TextField}
//                   margin="normal"
//                   fullWidth
//                   label="Confirm New Password"
//                   type="password"
//                   error={touched.confirmPassword && !!errors.confirmPassword}
//                   helperText={touched.confirmPassword && errors.confirmPassword}
//                 />
//                 <DialogActions>
//                   <Button onClick={() => setUpdatePasswordOpen(false)}>Cancel</Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     Update Password
//                   </Button>
//                 </DialogActions>
//                 {errors.submit && (
//                   <Typography color="error" align="center">
//                     {errors.submit}
//                   </Typography>
//                 )}
//               </Form>
//             )}
//           </Formik>
//         </DialogContent>
//       </Dialog>
//     </Container>
//   );
// };

// export default Login;