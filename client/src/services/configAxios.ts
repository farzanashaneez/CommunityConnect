import axios, { AxiosInstance } from "axios";
import { store } from "../redux-store/store"; // Adjust this path as needed
import { loggedOut, loggedin } from "../redux-store/user/adminSlice"; // Adjust import path
import {
  loggedOut as securitylogout,
  loggedin as securityloggedin,
} from "../redux-store/user/securitySlice"; // Adjust import path

import { signoutSuccess, signinSuccess } from "../redux-store/user/userSlice"; // Adjust import path

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const admintoken = state.admin?.currentAdmin?.token;
    const currenttoken = state.user?.currentUser?.token;
    const securitytoken = state.security?.currentSecurity?.token;

   

    if (window.location.pathname.startsWith("/admin") && admintoken) {
      config.headers["Authorization"] = `Bearer ${admintoken}`;
      
    } else if (
      window.location.pathname.startsWith("/security") &&
      securitytoken
    ) {
      config.headers["Authorization"] = `Bearer ${securitytoken}`;
      
    } else if (currenttoken) {
      config.headers["Authorization"] = `Bearer ${currenttoken}`;
     
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response.data.message.toLowerCase().includes("invalid token")
    ) {
      const state = store.getState();
      let refreshToken = null;
      let tokenType = null;
      // Determine which token type was used in the original request
      const currentPageURL = window.location.pathname;

      if (currentPageURL.startsWith("/admin")) {
        refreshToken = state.admin?.currentAdmin?.refreshToken;
        tokenType = "admin";
      } else if (currentPageURL.startsWith("/security")) {
        refreshToken = state.security?.currentSecurity?.refreshToken;
        tokenType = "security";
      } else {
        refreshToken = state.user?.currentUser?.refreshToken;
        tokenType = "user";
      }

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/refresh-token`, {
            refreshToken,
            tokenType, // Send token type to backend to handle different refresh logic
          });

          const newAccessToken = response.data.accessToken;

          // Update the appropriate store section based on token type
          switch (tokenType) {
            case "admin":
              store.dispatch(
                loggedin({
                  ...state.admin.currentAdmin,
                  token: newAccessToken,
                })
              );
              break;
            case "security":
              store.dispatch(
                securityloggedin({
                  ...state.security.currentSecurity,
                  token: newAccessToken,
                })
              );
              break;
            default:
              store.dispatch(
                signinSuccess({
                  ...state.user.currentUser,
                  token: newAccessToken,
                })
              );
          }

          // Update the token in the retry request
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // Handle failed refresh by logging out the appropriate user type
          switch (tokenType) {
            case "admin":
              store.dispatch(loggedOut());
              break;
            case "security":
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
