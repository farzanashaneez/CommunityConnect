import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import PageNotFound from '../pages/PageNotFound';
import NavBar from '../components/Navbar';
import Home from '../pages/user/Home';
import UserProfile from '../pages/user/UserProfile';
import Chatroom from '../pages/user/Chatroom';
import Events from '../pages/user/Events';
import Announcements from '../pages/user/Announcements';
import Services from '../pages/user/Services';
import ProfilePage from '../pages/user/ProfilePage';
import PostDetails from '../pages/user/PostDetails';
import AllMediaPage from '../pages/user/AllMediaPage';

const UserRoutes: React.FC = () => {
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
         
                <NavBar />
          

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
                    <Route path="*" element={<PageNotFound />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/chatroom/:chatid" element={<Chatroom />} />
                    <Route path="/chatroom/" element={<Chatroom />} />

                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/user/details/:id" element={<ProfilePage />} />
                    <Route path='/posts/:postid' element={<PostDetails/>}/>
                    <Route path='/all-media' element={<AllMediaPage/>}/>

                </Routes>
            </Box>
        </Box>
    );
};

export default UserRoutes;
