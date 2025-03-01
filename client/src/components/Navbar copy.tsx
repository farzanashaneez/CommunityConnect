import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Avatar, Box, Badge } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import { Link, useNavigate } from 'react-router-dom';
import NotificationSidebar from './notification/NotificationSidebar';
import { socket } from '../services/socketConnection';
import { getAllNotification } from '../services/api';
import { useAppSelector } from '../hooks/reduxStoreHook';

export const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  marginRight: theme.spacing(3),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.75),
  backdropFilter: 'blur(8px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const NavBar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
const userstate=useAppSelector(s=>s.user)
  useEffect(() => {

    // Listen for notification updates
    socket.on('notificationUpdate', (newNotification) => {
      setNotifications((prevNotifications) => [newNotification.message,...prevNotifications, ]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('notificationUpdate');
    };
  }, []);
useEffect(()=>{
  const fetchnotification=async()=>{
    try{
      const notification=await getAllNotification(userstate.currentUser.user.id)
      setNotifications(notification);
    }
    catch(err){
    }
   
  }
  fetchnotification();

},[])


  const handleChatClick = () => {
    navigate('/chatroom');
  };

  const handleNotificationClick = () => {
    setSidebarOpen(true); // Open the sidebar when notification icon is clicked
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false); // Close the sidebar
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton component={Link} to="/" sx={{ mr: 2, p: 0 }}>
            <img src="/src/assets/logo1.png" alt="Logo" style={{ height: '40px' }} />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <StyledLink to="/">Home</StyledLink>
            <StyledLink to="/events">Events</StyledLink>
            <StyledLink to="/services">Services</StyledLink>
            <StyledLink to="/announcements">Announcements</StyledLink>
            <StyledLink to="/hallbooking">Hall</StyledLink>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledIconButton onClick={() => setSearchOpen(!searchOpen)}>
              <SearchIcon />
            </StyledIconButton>
            {searchOpen && (
              <InputBase
                placeholder="Search…"
                sx={{
                  color: 'text.primary',
                  '& .MuiInputBase-input': {
                    padding: '8px 12px',
                    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    width: '200px',
                    borderRadius: '20px',
                    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
                    '&::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.7,
                    },
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.common.white, 0.3),
                    },
                    '&:focus': {
                      backgroundColor: (theme) => alpha(theme.palette.common.white, 0.4),
                      width: '220px',
                    },
                  },
                }}
              />
            )}
            <StyledIconButton onClick={handleNotificationClick}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </StyledIconButton>
            <StyledIconButton onClick={handleChatClick}>
              <ChatIcon />
            </StyledIconButton>
            <StyledLink to="/profile">
              <Avatar
                alt="User"
                src="/path-to-user-image.jpg"
                sx={{
                  ml: 4,
                  width: 36,
                  height: 36,
                  border: (theme) => `2px solid ${theme.palette.primary.main}`,
                }}
              />
            </StyledLink>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Sidebar for notifications */}
      <NotificationSidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        notifications={notifications}
      />
    </>
  );
};

export default NavBar;
