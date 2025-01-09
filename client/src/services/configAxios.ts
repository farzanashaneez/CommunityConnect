import axios, { AxiosInstance } from 'axios';
import { store } from '../redux-store/store'; // Adjust this path as needed
import { loggedOut } from '../redux-store/user/adminSlice'; // Adjust import path
import { signoutSuccess,signinSuccess } from '../redux-store/user/userSlice'; // Adjust import path

const API_URL = 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();


   
    const admintoken = state.admin?.currentAdmin?.token;
    const currenttoken= state.user?.currentUser?.token;
    console.log('admin token',admintoken,config.url)
    // if (admintoken) {
    //   config.headers['Authorization'] = `Bearer ${admintoken}`;
    //config.url?.startsWith('/admin') 
    // }
    if (window.location.pathname.startsWith('/admin') && admintoken) {
      config.headers['Authorization'] = `Bearer ${admintoken}`;
    }
     else if (currenttoken) {
      config.headers['Authorization'] = `Bearer ${currenttoken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("refresh err",error)
    if (error.response?.status === 401 && error.response.data.message.toLowerCase().includes('invalid token')) {
      const state = store.getState();
      const refreshToken = state.user?.currentUser?.refreshToken;
      console.log('refrsh next',refreshToken)

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
          console.log("error response",response)
          const newAccessToken = response.data.accessToken;

          // Update the token in Redux using the signinSuccess action
          store.dispatch(signinSuccess({ ...state.user.currentUser, token: newAccessToken }));

          // Retry the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.log("refresh err",refreshError)
          store.dispatch(signoutSuccess());
        }
      } else {
        store.dispatch(loggedOut());
      }
    }
    return Promise.reject(error);
  }
);

export default api;