import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from '@mui/material';
import ServiceList from '../../components/ServiceList'; // Import ServiceList component

const AdminServices: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Admin Services
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Local Services" />
        <Tab label="Residential Services" />
      </Tabs>

      {tabValue === 0 && <LocalServicesTab />}
      {tabValue === 1 && <ResidentialServicesTab />}
    </Box>
  );
};

const LocalServicesTab = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Left Side - List of Local Service Requests */}
      <Box sx={{ flex: 1, mr: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Local Service Requests</Typography>
        <Box
         sx={{
          height: '100vh', // Fixed height for scrolling
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '8px',
        }}
        >
          {/* Example of a service request */}
          {[...Array(5)].map((_, index) => (
            <Card key={index} sx={{ display: 'flex', mb: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: '100px', height: '100px' }}
                image="/path-to-image.jpg" // Replace with actual image path
                alt="Service"
              />
              <CardContent>
                <Typography variant="body1">Service Name (Apartment #)</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Button variant="contained" color="primary">Pending</Button>
                  <Button variant="outlined" color="secondary">Completed</Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Right Side - Add New Service Form */}
      <Box sx={{ flex: 1, ml: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Service</Typography>
        <TextField fullWidth label="Service Name" variant="outlined" sx={{ mb: 2 }} />
        <TextField fullWidth label="Description" variant="outlined" multiline rows={3} sx={{ mb: 2 }} />
        <TextField fullWidth label="Price" variant="outlined" type="number" sx={{ mb: 2 }} />
        
        {/* Image Upload */}
        <input type="file" accept="image/*" style={{ marginBottom: '16px' }} />
        
        <Button variant="contained" color="primary">Add Service</Button>

        {/* List of Services using ServiceList */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6">Available Services</Typography>
        
        {/* Use ServiceList component to display services */}
       < Box sx={{
            height: '100vh', // Fixed height for scrolling
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '8px',
          }}>
        <ServiceList  type="local" searchTerm="" /> {/* Pass appropriate searchTerm if needed */}

          </Box>
      </Box>
    </Box>
  );
};

const ResidentialServicesTab = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Left Side - List of Residential Service Requests */}
      <Box sx={{ flex: 1, mr: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Residential Service Requests</Typography>
        
        <Box
          sx={{
            height: '100vh', // Fixed height for scrolling
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '8px',
          }}
        >
          {/* Example of a service request */}
          {[...Array(5)].map((_, index) => (
            <Card key={index} sx={{ display: 'flex', mb: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: '100px', height: '100px' }}
                image="/path-to-image.jpg" // Replace with actual image path
                alt="Service"
              />
              <CardContent>
                <Typography variant="body1">Service Title (Apartment #)</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Button variant="contained" color="primary">Accept</Button>
                  <Button variant="outlined" color="secondary">Reject</Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Right Side - List of Accepted Services */}
      <Box sx={{
            height: '100vh', // Fixed height for scrolling
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '8px',
          }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Accepted Services</Typography>

        {/* Use ServiceList component to display accepted services */}
        <ServiceList type="residential" searchTerm="" /> {/* Pass appropriate searchTerm if needed */}
      </Box>
    </Box>
  );
};

export default AdminServices;