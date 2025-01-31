import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import PageNotFound from '../pages/PageNotFound';
import SecurityNavBar from '../components/security/SecurityNavBar';
import Home from '../pages/security/Home';
import ServiceRequest from '../pages/security/ServiceRequest';
import UserProfile from '../pages/security/UserProfile';
import UserVerificationPage from '../pages/security/UserVerificationPage';
// import NavBar from '../components/Navbar';
// import Home from '../pages/user/Home';
// import UserProfile from '../pages/user/UserProfile';
// import Chatroom from '../pages/user/Chatroom';
// import Events from '../pages/user/Events';
// import Announcements from '../pages/user/Announcements';
// import Services from '../pages/user/Services';
// import ProfilePage from '../pages/user/ProfilePage';
// import PostDetails from '../pages/user/PostDetails';
// import AllMediaPage from '../pages/user/AllMediaPage';
// import HallBookingCalendar from '../pages/user/HallBooking';
// import BookingHistory from '../pages/user/BookingHistory';

const SecurityRoutes: React.FC = () => {
    const location = useLocation();
   
    return (
        <Box sx={{ 
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            // backgroundColor: 'grey',
            
            overflow: 'hidden',
        }}>
         
                <SecurityNavBar />
          

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto', // To ensure scrollable content if needed
                    position: 'relative',
                    marginTop: 0,
                }}
            >
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/residents" element={<Home />} />
                    <Route path="/profile" element={<UserProfile />} />
                   <Route path='/service-requests' element={<ServiceRequest/>}/>
                   <Route path="*" element={<PageNotFound />} />
                   <Route path="/verifyQRCode/:id" element={<UserVerificationPage/>}/>


                </Routes>
            </Box>
        </Box>
    );
};

export default SecurityRoutes;
