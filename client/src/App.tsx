import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

import { useAppSelector } from './hooks/reduxStoreHook';
import AdminLogin from './pages/admin/AdminLogin';
import UserLogin from './pages/user/UserLogin';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import {theme} from '../src/theme'; 

const App: React.FC = () => {
  const adminState = useAppSelector((state) => state.admin);
  const userState=useAppSelector((state)=>state.user)
console.log("======",adminState)
 // const user='admin';
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
    <Router>
    <Routes>
    <Route path="/login" element={<UserLogin />} />
      <Route path="/*" element={userState.currentUser!==null ? <UserRoutes /> : <Navigate to={"/login"}/>} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admin/*" element={adminState.currentAdmin!==null ? <AdminRoutes /> : <Navigate to={"/adminlogin"} />} />

    </Routes>
  </Router>
  </ThemeProvider>
  );
};

export default App;