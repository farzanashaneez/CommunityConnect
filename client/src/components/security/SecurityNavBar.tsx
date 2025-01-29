import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ConfirmationDialog from '../ConfirmationDialogue';
import { useAppDispatch } from '../../hooks/reduxStoreHook';
import { loggedOut } from '../../redux-store/user/securitySlice';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledButton = styled(Button)<ButtonProps & { to?: string }>(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'transparent',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:active': {
    backgroundColor: theme.palette.primary.light,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const SecurityNavBar: React.FC = () => {
  const navigate = useNavigate();
  const [open,setOpen]=useState(false)
  const dispatch=useAppDispatch()


  const handleLogout = () => {
    dispatch(loggedOut()) ;
       navigate('/securitylogin');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CommunityConnect Security
        </Typography>
        <Box>
          <StyledButton
            component={Link}
            to="/security/residents"
            startIcon={<PeopleIcon />}
          >
            Residents
          </StyledButton>
          <StyledButton
            component={Link}
            to="/security/service-requests"
            startIcon={<BuildIcon />}
          >
            Service Requests
          </StyledButton>
          <StyledButton
            component={Link}
            to="/security/profile"
            startIcon={<AccountCircleIcon />}
          >
            Profile
          </StyledButton>
          <StyledButton
            onClick={()=>{setOpen(true)}}
            startIcon={<ExitToAppIcon />}
          >
            Logout
          </StyledButton>
        </Box>
      </Toolbar>
      <ConfirmationDialog
        open={open}
        onClose={()=>{setOpen(false)}}
        onConfirm={()=>{handleLogout()}}
        title="loggout..!"
        message="Do you want to continue?"
      />
    </StyledAppBar>
  );
};

export default SecurityNavBar;
