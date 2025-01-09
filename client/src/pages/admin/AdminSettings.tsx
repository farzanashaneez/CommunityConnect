import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loggedOut } from '../../redux-store/user/adminSlice';
import { store } from '../../redux-store/store';
import ConfirmationDialog from '../../components/ConfirmationDialogue';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [open,setOpen]=useState(false)

  const handleLogout = () => {
    setOpen(true)

  };
  const logoutconfirm=()=>{
    store.dispatch(loggedOut()) ;

    navigate('/adminlogin');
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Settings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
      <ConfirmationDialog
        open={open}
        onClose={()=>{setOpen(false)}}
        onConfirm={()=>{logoutconfirm()}}
        title="loggout..!"
        message="Do you want to continue?"
      />
    </Container>
  );
};

export default AdminSettings;
