// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
// import UserRoutes from './routes/UserRoutes';

// import { useAppSelector } from './hooks/reduxStoreHook';
// import AdminLogin from './pages/admin/AdminLogin';
// import UserLogin from './pages/user/UserLogin';
// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';
// import {theme} from '../src/theme'; 
// import { CommunityProvider } from './context/communityContext';

// import { messaging, getToken, onMessage } from './services/firebase';

// const App: React.FC = () => {
//   const adminState = useAppSelector((state) => state.admin);
//   const userState=useAppSelector((state)=>state.user)
//   useEffect(() => {
//     registerServiceWorker();
//     requestNotificationPermission();
//     // ... other existing useEffect code ...
//   }, []); 
//   const registerServiceWorker = async () => {
//     if ('serviceWorker' in navigator) {
//       try {
//         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
//         console.log('Service Worker registered successfully:', registration);
//       } catch (error) {
//         console.error('Service Worker registration failed:', error);
//       }
//     }
//   };

//   const requestNotificationPermission = async () => {
//     console.log("Requesting notification permission");
//     try {
//       const permission = await Notification.requestPermission();
//       if (permission === 'granted') {
//         const token = await getToken(messaging, { vapidKey: 'BN5wvCCizvcqm5gCUAFnWhISLmtnChy-15htSS2RT5zJzSd8WZNJhWEmR0Fvsnfftp2TCnwt8wbhoJFerovDRKo' });
//         console.log('FCM Token:', token);
//         if (token) {
//           sendTokenToServer(token);
//         }
//       }
//     } catch (error) {
//       console.error('An error occurred while retrieving token:', error);
//     }
//   };

//   const sendTokenToServer = (token: string) => {
//     // Implement API call to send token to your server
//     console.log('Sending token to server:', token);
//   };

//   useEffect(() => {
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log('Message received:', payload);
//       if (Notification.permission === 'granted') {
//         navigator.serviceWorker.ready.then(registration => {
//           registration.showNotification(payload.notification?.title || 'New Message', {
//             body: payload.notification?.body || "You have a new message!",
//             icon: '/firebase-logo.png',
//             badge: '/badge-icon.png',
//             tag: 'new-message',
//             renotify: true,
//             requireInteraction: true
//           });
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, []);


//   return (
    
//     <ThemeProvider theme={theme}>
//       <CssBaseline/>
//       <CommunityProvider>
//     <Router>
//     <Routes>
//     <Route path="/login" element={<UserLogin />} />
//       <Route path="/*" element={userState.currentUser!==null ? <UserRoutes /> : <Navigate to={"/login"}/>} />
//       <Route path="/adminlogin" element={<AdminLogin />} />
//       <Route path="/admin/*" element={adminState.currentAdmin!==null ? <AdminRoutes /> : <Navigate to={"/adminlogin"} />} />

//     </Routes>
//   </Router>
//   </CommunityProvider>
//   </ThemeProvider>
//   );
// };

// export default App;

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
import { messaging, getToken, onMessage } from './services/firebase';

const App: React.FC = () => {
  const adminState = useAppSelector((state) => state.admin);
  const userState = useAppSelector((state) => state.user);
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
    if (Notification.permission === 'default') {
      setShowNotificationPrompt(true);
    } else if (Notification.permission === 'granted') {
      setupFCM();
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
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
    try {
      const token = await getToken(messaging, { vapidKey: 'BN5wvCCizvcqm5gCUAFnWhISLmtnChy-15htSS2RT5zJzSd8WZNJhWEmR0Fvsnfftp2TCnwt8wbhoJFerovDRKo' });
      console.log('FCM Token:', token);
      if (token) {
        sendTokenToServer(token);
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
    }
  };

  const sendTokenToServer = (token: string) => {
    // Implement API call to send token to your server
    console.log('Sending token to server:', token);
  };

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(payload.notification?.title || 'New Message', {
            body: payload.notification?.body || "You have a new message!",
            icon: '/firebase-logo.png',
            badge: '/badge-icon.png',
            tag: 'new-message',
            renotify: true,
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
          </Routes>
        </Router>
      </CommunityProvider>
    </ThemeProvider>
  );
};

export default App;
