import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  ButtonProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ConfirmationDialog from '../ConfirmationDialogue';
import { useAppDispatch } from '../../hooks/reduxStoreHook';
import { loggedOut } from '../../redux-store/user/securitySlice';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[4],
}));

const StyledButton = styled(Button)<ButtonProps & { to?: string }>(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'transparent',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: 'none',
  marginLeft: theme.spacing(1),
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

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const SecurityNavBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(loggedOut());
    navigate('/securitylogin');
  };

  const navItems: NavItem[] = [
    { label: 'Residents', path: '/security/residents', icon: <PeopleIcon /> },
    { label: 'Service Requests', path: '/security/service-requests', icon: <BuildIcon /> },
    { label: 'Profile', path: '/security/profile', icon: <AccountCircleIcon /> },
  ];

  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 0,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
          }}
        >
          CommunityConnect Security
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              PaperProps={{
                elevation: 3,
                sx: { width: 200 }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleMenuClose}
                  sx={{ gap: 1 }}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  setLogoutDialogOpen(true);
                }}
                sx={{ gap: 1 }}
              >
                <ExitToAppIcon />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <StyledButton
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
              >
                {item.label}
              </StyledButton>
            ))}
            <StyledButton
              onClick={() => setLogoutDialogOpen(true)}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </StyledButton>
          </Box>
        )}
      </Toolbar>

      <ConfirmationDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
      />
    </StyledAppBar>
  );
};

export default SecurityNavBar;