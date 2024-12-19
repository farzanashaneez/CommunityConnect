import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Avatar, Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import { Link, useNavigate } from 'react-router-dom';

const StyledLink = styled(Link)(({ theme }) => ({
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
const navigate=useNavigate();
  const handleChatClick = () => {
    navigate('/chatroom');
  };

  return (
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
          <StyledIconButton>
            <NotificationsIcon />
          </StyledIconButton>
          <StyledIconButton onClick={handleChatClick}>
            <ChatIcon />
          </StyledIconButton>
          <StyledLink to="/profile"> <Avatar 
            alt="User" 
            src="/path-to-user-image.jpg" 
            sx={{ 
              ml: 4, 
              width: 36, 
              height: 36, 
              border: (theme) => `2px solid ${theme.palette.primary.main}` 
            }} 
          /></StyledLink>
         
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;