import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import { useAppSelector } from './hooks/reduxStoreHook';
import AdminLogin from './pages/admin/AdminLogin';
import UserLogin from './pages/user/UserLogin';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Button } from '@mui/material';
import { theme } from '../src/theme';
import { CommunityProvider } from './context/communityContext';
import SecurityRoutes from './routes/SecurityRoutes';
import Login from './pages/security/Login';
import { initializeMessaging, getMessagingToken, subscribeToMessages } from './services/firebase';
import { addFCMtokenToServer } from './services/api';

const VAPID_KEY = 'BN5wvCCizvcqm5gCUAFnWhISLmtnChy-15htSS2RT5zJzSd8WZNJhWEmR0Fvsnfftp2TCnwt8wbhoJFerovDRKo';

const App: React.FC = () => {
  const adminState = useAppSelector((state) => state.admin);
  const userState = useAppSelector((state) => state.user);
  const securityState = useAppSelector((state) => state.security);

  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  
  useEffect(() => {
    registerServiceWorker();
    checkNotificationPermission();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
        console.log('Service Worker registered successfully:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const checkNotificationPermission = () => {
    if (Notification?.permission === 'default') {
      setShowNotificationPrompt(true);
    } else if (Notification?.permission === 'granted') {
      setupFCM();
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification?.requestPermission();
      if (permission === 'granted') {
        setShowNotificationPrompt(false);
        setupFCM();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('An error occurred while requesting permission:', error);
    }
  };

  const setupFCM = async () => {
    const currentPath = window.location.pathname;
    const isRestrictedRoute = currentPath.startsWith('/admin') || 
                            (currentPath.startsWith('/security') && !userState.currentUser);

    if (!isRestrictedRoute) {
      try {
        // Initialize messaging first
        await initializeMessaging();
        
        // Get the FCM token using the new function
        const token = await getMessagingToken(VAPID_KEY);
        
        if (token) {
          console.log('FCM Token:', token);
          await sendTokenToServer(token);
        }
      } catch (error) {
        console.error('An error occurred while setting up FCM:', error);
      }
    }
  };

  const sendTokenToServer = async (token: string) => {
    console.log('Sending token to server:', token);
    const platform = (navigator as any)?.userAgentData?.platform || navigator?.platform || 'unknown';
    
    try {
      if (userState.currentUser?.user?.id) {
        await addFCMtokenToServer(userState.currentUser.user.id, {
          token,
          deviceInfo: platform,
          lastUsed: new Date()
        });
        
      }
      if (securityState.currentSecurity?.user?.id) {
        await addFCMtokenToServer(securityState.currentSecurity.user.id, {
          token,
          deviceInfo: platform,
          lastUsed: new Date()
        });
      }
    } catch (err) {
      console.error('Error sending token to server:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToMessages((payload) => {
      console.log('Message received:', payload);
      if (Notification?.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(payload.notification?.title || 'New Message', {
            body: payload.notification?.body || "You have a new message!",
            icon: '/firebase-logo.png',
            badge: '/badge-icon.png',
            tag: 'new-message',
            requireInteraction: true
          });
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CommunityProvider>
        {showNotificationPrompt && (
          <Button onClick={requestNotificationPermission}>
            Enable Notifications
          </Button>
        )}
        <Router>
          <Routes>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/*" element={userState.currentUser !== null ? <UserRoutes /> : <Navigate to={"/login"} />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/admin/*" element={adminState.currentAdmin !== null ? <AdminRoutes /> : <Navigate to={"/adminlogin"} />} />
            <Route path="/security/*" element={securityState.currentSecurity !== null ? <SecurityRoutes /> : <Navigate to={"/securitylogin"} />} />
            <Route path="/securitylogin" element={<Login />} />
          </Routes>
        </Router>
      </CommunityProvider>
    </ThemeProvider>
  );
};

export default App;