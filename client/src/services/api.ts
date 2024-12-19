
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

export const deleteUser=async(id:string)=>{
  console.log("id===>",id)
  const response=await api.delete(`${API_URL}/users/delete/${id}`);
  return response.data;
}

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
export const updateName = async (token: string,id:string,firstname:string,lastname:string) => {
  const response = await api.post(`${API_URL}/users/updatename/${id}`, {firstname,lastname}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const addProfileImage = async (token: string,id:string, data:object) => {
  const response = await api.post(`${API_URL}/users/addprofileImage/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const addCoverphoto = async (token: string,id:string, data:object) => {
  const response = await api.post(`${API_URL}/users/addcoverphoto/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createService=async(servicedata:any)=>{
  console.log("servicedata",servicedata)
  const response=await api.post(`${API_URL}/services`,servicedata);
  return response.data;
}

export const getAllServices=async(type:string)=>{
  console.log("type===>",type)
  const response=await api.get(`${API_URL}/services/type/${type}`);
  return response.data;
}

export const deleteServiceApi=async(id:string)=>{
  console.log("id===>",id)
  const response=await api.delete(`${API_URL}/services/delete/${id}`);
  return response.data;
}

export const updateServiceApi=async(id:string,serviceData:any)=>{
  console.log("id===>",id)
  const response=await api.put(`${API_URL}/services/update/${id}`,serviceData);
  return response.data;
}

// Announcement Management
export const createAnnouncementApi = async (announcementData: any) => {
  console.log("announcementData", announcementData);
  const response = await api.post(`${API_URL}/announcements`, announcementData);
  return response.data;
};

export const fetchAllAnnouncements = async () => {
  const response = await api.get(`${API_URL}/announcements`);
  return response.data;
};

export const deleteAnnouncementApi = async (id: string) => {
  console.log("id===>", id);
  const response = await api.delete(`${API_URL}/announcements/delete/${id}`);
  return response.data;
};

export const updateAnnouncementApi = async (id: string, announcementData: any) => {
  console.log("id===>", id);
  const response = await api.put(`${API_URL}/announcements/update/${id}`, announcementData);
  return response.data;
};

// Post Management
export const createPost = async (postData: any) => {
  console.log("postData", postData);
  const response = await api.post(`${API_URL}/posts`, postData);
  return response.data;
};

export const fetchAllPosts = async () => {
  const response = await api.get(`${API_URL}/posts`);
  return response.data;
};

export const deletePost = async (id: string) => {
  console.log("id===>", id);
  const response = await api.delete(`${API_URL}/posts/delete/${id}`);
  return response.data;
};

export const updatePost = async (id: string, postData: any) => {
  console.log("id===>", id);
  const response = await api.put(`${API_URL}/posts/update/${id}`, postData);
  return response.data;
};

// Event Management
export const createEventApi = async (eventData: any) => {
  console.log("eventData", eventData);
  const response = await api.post(`${API_URL}/events`,eventData);
  return response.data;
};

export const getAllEvents = async () => {
  const response = await api.get(`${API_URL}/events`);
  return response.data;
};

export const deleteEventApi = async (id: string) => {
  console.log("id===>", id);
  const response = await api.delete(`${API_URL}/events/delete/${id}`);
  return response.data;
};

export const updateEventApi = async (id: string, eventData: any) => {
  console.log("id===>", id);
  const response = await api.put(`${API_URL}/events/update/${id}`, eventData);
  return response.data;
};

export const createChatApi = async (participants:object,type:string) => {
  const response = await api.post(`${API_URL}/chats/${type}`, participants);
  return response.data;
};

// Get a chat by ID
export const getChatByIdApi = async (id: string) => {
  const response = await api.get(`${API_URL}/chats/${id}`);
  return response.data;
};

// Add a message to a chat
export const sendMessageApi = async (chatId: string, message: { senderId: string, content: string ,status:string}) => {
  const response = await api.post(`${API_URL}/chats/${chatId}/message`, message);
  return response.data;
};

// Get all chats for a user
export const getChatsForUserApi = async (userId: string) => {
  const response = await api.get(`${API_URL}/chats/user/${userId}`);
  return response.data;
};

// Delete a chat
export const deleteChatApi = async (id: string) => {
  const response = await api.delete(`${API_URL}/chats/${id}`);
  return response.data;
};