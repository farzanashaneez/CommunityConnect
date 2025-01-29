import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';
import AdminUser from '../pages/admin/AdminUser';
import AdminServices from '../pages/admin/AdminServices';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminPosts from '../pages/admin/AdminPosts';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminSettings from '../pages/admin/AdminSettings';
import PageNotFound from '../pages/PageNotFound';
import AdminServiceRequest from '../pages/admin/AdminServiceRequest';
import Dashboard from '../pages/admin/Dashboard';
import AdminHalls from '../pages/admin/AdminHall';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminHallAvailabilityPage from '../pages/admin/AdminHallAvailability';


const drawerWidth = 240;

const AdminRoutes: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Mobile Menu Icon */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Improves performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            boxShadow: isMobile ? theme.shadows[5] : 'none',
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
          p: { xs: 2, md: 3 },
          marginLeft: isMobile ? 0 : `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/users' element={<AdminUser />} />
          <Route path='/services' element={<AdminServices />} />
          <Route path='/events' element={<AdminEvents />} />
          <Route path='/posts' element={<AdminPosts />} />
          <Route path='/announcements' element={<AdminAnnouncements />} />
          <Route path='/halls' element={<AdminHalls />} />
          <Route path='/halls/allbooking' element={<AdminBookings />} />
          <Route path='/halls/availability/:hallid' element={<AdminHallAvailabilityPage />} />

          {/* /admin/halls/availability/:hallid */}
          <Route path='/settings' element={<AdminSettings />} />
          <Route path='/servicerequest' element={<AdminServiceRequest />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminRoutes;
