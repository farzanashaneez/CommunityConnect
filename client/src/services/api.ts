
import api from "./configAxios";


const API_URL = 'http://localhost:5000/api';


export const register = async (userData: any) => {
  const response = await api.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

export const fetchAllApartments = async () => {
  const response = await api.get(`${API_URL}/apartments`);
  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await api.get(`${API_URL}/users`);
  return response.data;
};

export const fetchUserDetails = async (token: string,id:string) => {
  console.log("iid",id)
  const response = await api.get(`${API_URL}/users/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addMember = async (token: string,id:string, memberData: { name: string; relation: string; profession: string }) => {
  const response = await api.post(`${API_URL}/users/members/${id}`, memberData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createService=async(servicedata:any)=>{
  console.log("servicedata",servicedata)
  const response=await api.post(`${API_URL}/services/upload`,servicedata);
  return response.data;
}

