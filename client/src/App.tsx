import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import AdminRoutes from './routes/AdminRoutes';

const App: React.FC = () => {
  const user='admin';
  return (
    <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={user === "admin" ? <AdminRoutes /> : <Navigate to={"/auth/adminlogin"} />} />

    </Routes>
  </Router>
  );
};

export default App;