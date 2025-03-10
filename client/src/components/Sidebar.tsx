import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxStoreHook';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const adminState = useAppSelector((state) => state.admin);


  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "text-[#8B3A0E] font-bold" : "text-gray-900";
  };

  return (
    <nav className="w-64 bg-white h-screen fixed left-0 top-0 overflow-y-auto border-r-2">
      <div className="p-5">
        <img src="/src/assets/adminlogo.png" alt="Community Connect" className="w-full mb-6" />
        <div className="flex flex-col items-center mb-6">
          <img src="/src/assets/user.png" alt="User" className="w-20 h-20 rounded-full mb-2" />
          <span className="text-black">{adminState.currentAdmin.user.email}</span>
        </div>
        <ul className="space-y-2">
          <li><Link to="/admin/dashboard"  className={`${isActive('/admin/dashboard')} hover:text-[#8B3A0E] block py-2`}>Dashboard</Link></li>
          <li><Link to="/admin/users" className={`${isActive('/admin/users')} hover:text-[#8B3A0E] block py-2`}>Users</Link></li>
          <li><Link to="/admin/services" className={`${isActive('/admin/services')} hover:text-[#8B3A0E] block py-2`}>Services</Link></li>
          <li><Link to="/admin/servicerequest" className={`${isActive('/admin/servicerequest')} hover:text-[#8B3A0E] block py-2`}>Service Request</Link></li>
          <li><Link to="/admin/events" className={`${isActive('/admin/events')} hover:text-[#8B3A0E] block py-2`}>Events</Link></li>
          <li><Link to="/admin/announcements" className={`${isActive('/admin/announcements')} hover:text-[#8B3A0E] block py-2`}>Announcements</Link></li>
          <li><Link to="/admin/halls" className={`${isActive('/admin/halls')} hover:text-[#8B3A0E] block py-2`}>Halls</Link></li>
          <li><Link to="/admin/posts" className={`${isActive('/admin/posts')} hover:text-[#8B3A0E] block py-2`}>Posts</Link></li>
          <li><Link to="/admin/settings" className={`${isActive('/admin/settings')} hover:text-[#8B3A0E] block py-2`}>Settings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;