import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Typography
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Security as SecurityIcon, Person as PersonIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Select } from '@mui/material';
import { deleteUser, fetchAllApartments, fetchAllSecurities, fetchAllUsers, register, registerSecurity } from '../../services/api';
import { User } from '../../types/User';

const validationSchema = Yup.object().shape({
  apartmentId: Yup.string().required('Apartment is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
    .required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

const securityValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

const AdminDashboard:React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [security, setSecurity] = useState<User[]>([]);
  const [apartments, setApartments] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  // New state for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string, isUser: boolean, name: string} | null>(null);

  // Pagination state
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(5);
  const [securityPage, setSecurityPage] = useState(0);
  const [securityRowsPerPage, setSecurityRowsPerPage] = useState(5);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [usersResponse, apartmentsResponse, secuurityResponse] = await Promise.all([
        fetchAllUsers(),
        fetchAllApartments(),
        fetchAllSecurities()
      ]);
      setUsers(usersResponse);
      setApartments(apartmentsResponse);
      setSecurity(secuurityResponse)
    } catch (error) {
      showSnackbar('Error fetching data');
    }
  };

  const showSnackbar = (message:string) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddUser = async (values:any, { resetForm }:any) => {
    try {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const response=await register({ ...values, password: generatedPassword });
      showSnackbar('User added successfully');
      setUsers(s=>[response.user,...s])
      resetForm();
      setOpenUserDialog(false);
    } catch (error) {
      showSnackbar('Error adding user');
    }
  };

  // New function to open delete confirmation
  const openDeleteConfirmation = (userId: string, isUser: boolean, name: string) => {
    setUserToDelete({ id: userId, isUser, name });
    setDeleteConfirmOpen(true);
  };

  // Modified to handle the actual deletion after confirmation
  const handleRemoveUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      showSnackbar('User removed successfully');
      
      if (userToDelete.isUser) {
        setUsers(s => s.filter(user => user._id !== userToDelete.id));
      } else {
        setSecurity(s => s.filter(user => user._id !== userToDelete.id));
      }
      
      // Close the confirmation dialog
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error) {
      showSnackbar('Error removing user');
      setDeleteConfirmOpen(false);
    }
  };
  
  // Function to cancel deletion
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleAddSecurity = async (values:any, { resetForm }:any) => {
    try {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const response = await registerSecurity({ ...values, password: generatedPassword});
      showSnackbar('Security staff added successfully');
      setSecurity(s=>[response.user,...s])
      resetForm();
      setOpenSecurityDialog(false);
    } catch (error) {
      console.error("Error adding user:", error);
      let errorMessage = "Error :";
      if (error instanceof Error) {
        errorMessage += ` ${(error as any).response?.data.message}`;
      }
      showSnackbar(errorMessage);
    }
  };

  // Handle page change for users
  const handleUserPageChange = (_:any, newPage: number) => {
    setUserPage(newPage);
  };

  // Handle rows per page change for users
  const handleUserRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserRowsPerPage(parseInt(event.target.value, 10));
    setUserPage(0);
  };

  // Handle page change for security
  const handleSecurityPageChange = (_: any, newPage: number) => {
    setSecurityPage(newPage);
  };

  // Handle rows per page change for security
  const handleSecurityRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityRowsPerPage(parseInt(event.target.value, 10));
    setSecurityPage(0);
  };

  // Get paginated users
  const paginatedUsers = users.slice(
    userPage * userRowsPerPage,
    userPage * userRowsPerPage + userRowsPerPage
  );

  // Get paginated security
  const paginatedSecurity = security.slice(
    securityPage * securityRowsPerPage,
    securityPage * securityRowsPerPage + securityRowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab icon={<PersonIcon />} label="Residents" />
          <Tab icon={<SecurityIcon />} label="Security" />
        </Tabs>
        
        <Box sx={{ mt: 3 }}>
          {selectedTab === 0 ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Residents List</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenUserDialog(true)}
                >
                  Add Resident
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Apartment</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobileNumber}</TableCell>
                        <TableCell>
                          {user.apartmentId 
                            ? `${user.apartmentId.buildingSection}-${user.apartmentId.apartmentNumber}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteConfirmation(user._id, true, user.firstName || user.email)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={userRowsPerPage}
                page={userPage}
                onPageChange={handleUserPageChange}
                onRowsPerPageChange={handleUserRowsPerPageChange}
              />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Security Staff</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenSecurityDialog(true)}
                >
                  Add Security Staff
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedSecurity.map((staff) => (
                      <TableRow key={staff._id}>
                        <TableCell>{staff.firstName}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.mobileNumber}</TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error" 
                            onClick={() => openDeleteConfirmation(staff._id, false, staff.firstName || staff.email)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={security.length}
                rowsPerPage={securityRowsPerPage}
                page={securityPage}
                onPageChange={handleSecurityPageChange}
                onRowsPerPageChange={handleSecurityRowsPerPageChange}
              />
            </>
          )}
        </Box>
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Resident
          <IconButton
            onClick={() => setOpenUserDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ apartmentId: '', email: '', mobileNumber: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddUser}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Select
                      fullWidth
                      name="apartmentId"
                      value={values.apartmentId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.apartmentId && Boolean(errors.apartmentId)}
                      native
                    >
                      <option value="">Select Apartment</option>
                      {apartments.map((apt:any) => (
                        <option key={apt._id} value={apt._id}>
                          {`${apt.buildingSection}-${apt.apartmentNumber} (${apt.type})`}
                        </option>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="mobileNumber"
                      label="Phone Number"
                      value={values.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                      helperText={touched.mobileNumber && errors.mobileNumber}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
                      Add Resident
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Add Security Dialog */}
      <Dialog open={openSecurityDialog} onClose={() => setOpenSecurityDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Security Staff
          <IconButton
            onClick={() => setOpenSecurityDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ email: '', mobileNumber: '', }}
            validationSchema={securityValidationSchema}
            onSubmit={handleAddSecurity}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="mobileNumber"
                      label="Phone Number"
                      value={values.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                      helperText={touched.mobileNumber && errors.mobileNumber}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
                      Add Security Staff
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-description"
      >
        <DialogTitle id="delete-confirm-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirm-description">
            Are you sure you want to delete user: {userToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveUser} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default AdminDashboard;