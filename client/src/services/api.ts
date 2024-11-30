import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

export const fetchAllApartments = async () => {
  const response = await axios.get(`${API_URL}/apartments`);
  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};