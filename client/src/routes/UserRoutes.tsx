import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import UserLogin from '../pages/user/UserLogin';
import { Box } from '@mui/material';

const UserRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <Box sx={{ 
            width: '100vw', 
            height: '100vh', 
            overflow: 'hidden',
            backgroundColor: '#f8f8f8'
        }}>   
            <Routes>
                <Route path='/' element={<UserLogin />} />
                <Route path='/login' element={<UserLogin />} />
            </Routes>
        </Box>
    );
};

export default UserRoutes;