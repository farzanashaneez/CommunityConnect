import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

import { useAppSelector } from './hooks/reduxStoreHook';
import AdminLogin from './pages/admin/AdminLogin';

const App: React.FC = () => {
  const adminState = useAppSelector((state) => state.admin);
console.log("======",adminState)
 // const user='admin';
  return (
    <Router>
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admin/*" element={adminState.currentAdmin!==null ? <AdminRoutes /> : <Navigate to={"/adminlogin"} />} />

    </Routes>
  </Router>
  );
};

export default App;