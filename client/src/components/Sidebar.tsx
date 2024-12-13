import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "text-blue-700 font-bold" : "text-gray-900";
  };

  return (
    <nav className="w-64 bg-white h-screen fixed left-0 top-0 overflow-y-auto border-r-2">
      <div className="p-5">
        <img src="/src/assets/adminlogo.png" alt="Community Connect" className="w-full mb-6" />
        <div className="flex flex-col items-center mb-6">
          <img src="/src/assets/user.png" alt="User" className="w-20 h-20 rounded-full mb-2" />
          <span className="text-black">User Name</span>
        </div>
        <ul className="space-y-2">
          <li><Link to="/admin/dashboard" className={`${isActive('/admin/dashboard')} hover:text-blue-700 block py-2`}>Dashboard</Link></li>
          <li><Link to="/admin/users" className={`${isActive('/admin/users')} hover:text-blue-700 block py-2`}>Users</Link></li>
          <li><Link to="/admin/services" className={`${isActive('/admin/services')} hover:text-blue-700 block py-2`}>Services</Link></li>
          <li><Link to="/admin/servicerequest" className={`${isActive('/admin/servicerequest')} hover:text-blue-700 block py-2`}>Service Request</Link></li>
          <li><Link to="/admin/events" className={`${isActive('/admin/events')} hover:text-blue-700 block py-2`}>Events</Link></li>
          <li><Link to="/admin/announcements" className={`${isActive('/admin/announcements')} hover:text-blue-700 block py-2`}>Announcements</Link></li>
          <li><Link to="/admin/posts" className={`${isActive('/admin/posts')} hover:text-blue-700 block py-2`}>Posts</Link></li>
          <li><Link to="/admin/settings" className={`${isActive('/admin/settings')} hover:text-blue-700 block py-2`}>Settings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;