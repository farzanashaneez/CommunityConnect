import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchAllApartments, fetchAllUsers, register } from '../../services/api';
import { Snackbar } from '@mui/material';
import UserRow from '../../components/UserRow';

const validationSchema = Yup.object().shape({
  apartmentId: Yup.string().required('Apartment is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
    .required('Email is required'),
  mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone number is required'),
});

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchApartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      console.log("users :==",response)
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchApartments = async () => {
    try {
      const response = await fetchAllApartments();
      setApartments(response);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const newUser = { ...values, password: generatedPassword };
      const response = await register(newUser);
      console.log(response);
      setSnackbarMessage('User registered successfully!');
      setOpenSnackbar(true);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
  let errorMessage = "Error :";
  if (error instanceof Error) {
    errorMessage += ` ${(error as any).response?.data.message}`;
  }
  setSnackbarMessage(errorMessage);

      setOpenSnackbar(true);
    }
    setSubmitting(false);
  };

  const handleRemoveUser = async (id: string) => {
    try {
      //remove api
      setSnackbarMessage('User removed successfully!');
      setOpenSnackbar(true);
      fetchUsers(); 
    } catch (error) {
      console.error('Error removing user:', error);
      setSnackbarMessage('Error removing user. Please try again.');
      setOpenSnackbar(true);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen p-0">
      <div className="w-1/2 bg-white rounded-lg shadow-md p-6 mr-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">List of Residents</h2>
        <div className="space-y-4">
          {users.map(user => (
            <UserRow
              key={user._id}
              imageUrl={user.imageUrl || 'https://via.placeholder.com/40'}
              name={user.firstName}
              apartmentNumber={
                user.apartmentId 
                    ? `${user.apartmentId.buildingSection}-${user.apartmentId.apartmentNumber}` 
                    : 'Unknown' // Ensure to access the correct properties
            }
              onRemove={() => handleRemoveUser(user._id)}
            />
          ))}
           
        </div>
      </div>

      <div className="w-1/2 h-fit bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add User</h2>
        <Formik
          initialValues={{
            apartmentId: '',
            email: '',
            mobileNumber: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="apartmentId" className="block text-sm font-medium text-gray-700 mb-1">Apartment</label>
                <Field
                  as="select"
                  name="apartmentId"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Apartment</option>
                  {apartments
                    .sort((a, b) => {
                      if (a.buildingSection !== b.buildingSection) {
                        return a.buildingSection.localeCompare(b.buildingSection);
                      }
                      return a.apartmentNumber - b.apartmentNumber;
                    })
                    .map(apartment => (
                      <option key={apartment._id} value={apartment._id}>
                        {apartment.buildingSection} - {apartment.apartmentNumber} ({apartment.type})
                      </option>
                    ))
                  }
                </Field>
                <ErrorMessage name="apartmentId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Field
                  type="tel"
                  name="mobileNumber"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Adding User...' : 'Add User'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ 
          vertical: 'top', 
          horizontal: 'center' 
        }}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdminUser;