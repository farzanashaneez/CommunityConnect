import axios, { AxiosInstance } from 'axios';
import { store } from '../redux-store/store'; // Adjust this path as needed
import { loggedOut, loggedin } from '../redux-store/user/adminSlice'; // Adjust import path
import {  loggedOut as securitylogout ,loggedin as securityloggedin } from '../redux-store/user/securitySlice'; // Adjust import path

import { signoutSuccess,signinSuccess } from '../redux-store/user/userSlice'; // Adjust import path

const API_URL = 'http://192.168.0.101:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// api.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const admintoken = state.admin?.currentAdmin?.token;
//     const currenttoken = state.user?.currentUser?.token;
//     const securitytoken = state.security?.currentSecurity?.token;
    
//     console.log('Debug info:', {
//       path: window.location.pathname,
//       startsWithSecurity: window.location.pathname.startsWith('/security'),
//       hasSecurityToken: !!securitytoken
//     });
    
//     if (window.location.pathname.startsWith('/admin') && admintoken) {
//       config.headers['Authorization'] = `Bearer ${admintoken}`;
//       console.log('Using admin token');
//     } 
//     else if (window.location.pathname.startsWith('/security') && securitytoken) {
//       config.headers['Authorization'] = `Bearer ${securitytoken}`;
//       console.log('Using security token');
//     }
//     else if (currenttoken) {
//       config.headers['Authorization'] = `Bearer ${currenttoken}`;
//       console.log('Using current token');
//     }
    
//     // Log the final header that will be sent
//     console.log('Final Authorization header:', config.headers['Authorization']);
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const admintoken = state.admin?.currentAdmin?.token;
    const currenttoken = state.user?.currentUser?.token;
    const securitytoken = state.security?.currentSecurity?.token;
    
    // Debug all available tokens
    console.log('Available tokens:', {
      admintoken: admintoken ? 'present' : 'absent',
      currenttoken: currenttoken ? 'present' : 'absent',
      securitytoken: securitytoken ? 'present' : 'absent'
    });

    // Debug path information
    console.log('Path info:', {
      fullPath: window.location.pathname,
      adminCheck: window.location.pathname.startsWith('/admin'),
      securityCheck: window.location.pathname.startsWith('/security')
    });

    let tokenUsed = null;
    let reason = '';

    if (window.location.pathname.startsWith('/admin') && admintoken) {
      config.headers['Authorization'] = `Bearer ${admintoken}`;
      tokenUsed = 'admin';
      reason = 'Path starts with /admin and admin token exists';
    } 
    else if (window.location.pathname.startsWith('/security') && securitytoken) {
      config.headers['Authorization'] = `Bearer ${securitytoken}`;
      tokenUsed = 'security';
      reason = 'Path starts with /security and security token exists';
    }
    else if (currenttoken) {
      config.headers['Authorization'] = `Bearer ${currenttoken}`;
      tokenUsed = 'current';
      reason = 'Falling back to current token';
    }
    
    // Log the decision
    console.log('Token selection:', {
      tokenUsed,
      reason,
      finalHeader: config.headers['Authorization'] // Show just the beginning of the token
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);


// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log("refresh err",error)
//     if (error.response?.status === 401 && error.response.data.message.toLowerCase().includes('invalid token')) {
//       const state = store.getState();
//       const refreshToken = state.user?.currentUser?.refreshToken;
//       console.log('refrsh next',refreshToken)

//       if (refreshToken) {
//         try {
//           const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
//           console.log("error response",response)
//           const newAccessToken = response.data.accessToken;

//           // Update the token in Redux using the signinSuccess action
//           store.dispatch(signinSuccess({ ...state.user.currentUser, token: newAccessToken }));

//           // Retry the original request with the new token
//           error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return axios(error.config);
//         } catch (refreshError) {
//           console.log("refresh err",refreshError)
//           store.dispatch(signoutSuccess());
//         }
//       } else {
//         store.dispatch(loggedOut());
//         store.dispatch(securitylogout());
//       }
//     }
//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("refresh err", error);
    
    if (error.response?.status === 401 && error.response.data.message.toLowerCase().includes('invalid token')) {
      const state = store.getState();
      let refreshToken = null;
      let tokenType = null;
      // Determine which token type was used in the original request
      const currentPageURL = window.location.pathname;
      console.log('Current page URL:', currentPageURL);
      
      if (currentPageURL.startsWith('/admin')) {
        refreshToken = state.admin?.currentAdmin?.refreshToken;
        tokenType = 'admin';
      } 
      else if (currentPageURL.startsWith('/security')) {
        refreshToken = state.security?.currentSecurity?.refreshToken;
        tokenType = 'security';
      } 
      else {
        refreshToken = state.user?.currentUser?.refreshToken;
        tokenType = 'user';
      }

      console.log('Refresh attempt for:', {
        tokenType,
        hasRefreshToken: !!refreshToken
      });

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/refresh-token`, { 
            refreshToken,
            tokenType // Send token type to backend to handle different refresh logic
          });
          
          console.log("Refresh response", response);
          const newAccessToken = response.data.accessToken;

          // Update the appropriate store section based on token type
          switch (tokenType) {
            case 'admin':
              store.dispatch(loggedin({ 
                ...state.admin.currentAdmin, 
                token: newAccessToken 
              }));
              break;
            case 'security':
              store.dispatch(securityloggedin({ 
                ...state.security.currentSecurity, 
                token: newAccessToken 
              }));
              break;
            default:
              store.dispatch(signinSuccess({ 
                ...state.user.currentUser, 
                token: newAccessToken 
              }));
          }

          // Update the token in the retry request
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(error.config);

        } catch (refreshError) {
          console.log("refresh error", refreshError);
          // Handle failed refresh by logging out the appropriate user type
          switch (tokenType) {
            case 'admin':
              store.dispatch(loggedOut());
              break;
            case 'security':
              store.dispatch(securitylogout());
              break;
            default:
              store.dispatch(signoutSuccess());
          }
        }
      } else {
        // No refresh token available, log out all sessions
        store.dispatch(signoutSuccess());
        store.dispatch(securitylogout());
        store.dispatch(loggedOut());
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;