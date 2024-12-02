import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Sidebar from '../components/Sidebar';
import AdminUser from '../pages/admin/AdminUser';
import AdminServices from '../pages/admin/AdminServices';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminPosts from '../pages/admin/AdminPosts';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminSettings from '../pages/admin/AdminSettings';


const AdminRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {location.pathname !== '/admin/login' && <Sidebar />}
      <div className="flex-grow overflow-auto">
        <div className={`${location.pathname !== '/admin/login' ? 'ml-64' : ''}`}>
          <header className="bg-white shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 p-4 text-start">
              ADMIN DASHBOARD
            </h1>
          </header>
          <main className="p-6">
            <Routes>
              <Route path='/dashboard' element={<AdminDashboard />} />
              <Route path='/users' element={<AdminUser />} />
              <Route path='/services' element={<AdminServices />} />
              <Route path='/events' element={<AdminEvents />} />
              <Route path='/posts' element={<AdminPosts />} />
              <Route path='/announcements' element={<AdminAnnouncements />} />
              <Route path='/settings' element={<AdminSettings />} />
              {/* Add other admin routes here */}
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;