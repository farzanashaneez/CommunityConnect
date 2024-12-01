import axios, { AxiosInstance } from 'axios';
import { store } from '../redux-store/store'; // Adjust this path as needed
import { loggedOut } from '../redux-store/user/adminSlice'; // Adjust import path
import { signoutSuccess } from '../redux-store/user/userSlice'; // Adjust import path

const API_URL = 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();

    const admintoken = state.admin?.admin.token;
    const currenttoken= state.user?.currentUser?.token;
    console.log('admin token',admintoken)
    if (admintoken) {
      config.headers['Authorization'] = `Bearer ${admintoken}`;
    }
    // if (config.url?.startsWith('/admin') && admintoken) {
    //   config.headers['Authorization'] = `Bearer ${admintoken}`;
    // }
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
    if (error.response?.status === 401) {
      if (error.config.url?.startsWith('/admin')) {
        store.dispatch(loggedOut());
      } else {
        store.dispatch(signoutSuccess());
      }
    }
    return Promise.reject(error);
  }
);

export default api;