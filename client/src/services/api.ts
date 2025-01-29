
import api from "./configAxios";
import { isSupported } from "firebase/messaging";
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(key);



const API_URL = 'http://192.168.0.101:5000/api';

// stripe api
export const handleStripePayment = async (bookingData:any,slotData:any): Promise<void> => {
  console.log('key',key)
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const response = await axios.post(`${API_URL}/payment/create-checkout-session`,{bookingData,slotData});
    const session = response.data;

    if (!session || !session.id) {
      throw new Error('Failed to create Stripe session');
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    console.error('Payment error:', error);
    // You might want to show an error message to the user here
  }
};


export const register = async (userData: any) => {
  const response = await api.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};
export const loginAsSecurity = async (email: string, password: string) => {
  const response = await api.post(`${API_URL}/users/security-login`, { email, password });
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

export const fetchUserDetails = async (id:string) => {
  console.log("iid",id)
  const response = await api.get(`${API_URL}/users/details/${id}`
  // , {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // }
  );
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

export const addFCMtokenToServer = async (id:string, fcmToken: { token: string; deviceInfo: string; lastUsed: Date }) => {
  if (await isSupported()){
console.log('not supported')
const response = await api.post(`${API_URL}/users/add-fcmtoken/${id}`, fcmToken);
return response.data;
};
return null;
  }

export const updateName = async (token: string,id:string,firstname:string,lastname:string) => {
  const response = await api.post(`${API_URL}/users/updatename/${id}`, {firstname,lastname}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updatePassword = async (id:string,password:string) => {
  const response = await api.post(`${API_URL}/users/updatepassword/${id}`, {password});
  return response.data;
};
export const addProfileImage = async (id:string, data:object) => {
  console.log("data====",data,id)
  const response = await api.post(`${API_URL}/users/addprofileImage/${id}`, data
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  );
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
export const getAllServicesOfUser=async(userId:string)=>{
  const response=await api.get(`${API_URL}/services/user/${userId}`);
  return response.data;
}
export const getAllRequestedServices=async(status:string)=>{
  console.log("type===>",status)
  const response=await api.get(`${API_URL}/services/getallservicerequest/${status}`);
  return response.data;
}
export const getFilteredServices=async(status:string,type:string)=>{
  console.log("status===>",status)
  const response=await api.get(`${API_URL}/services/${type}/status/${status}`);
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
export const grantServiceApi=async(id:string)=>{
  console.log("id===>",id)
  const response=await api.put(`${API_URL}/services/grantorreject/grantservice/${id}`);
  return response.data;
}
export const rejectServiceApi=async(id:string)=>{
  console.log("id===>",id)
  const response=await api.put(`${API_URL}/services/grantorreject/rejectservice/${id}`);
  return response.data;
}
export const requestService=async(id:string,reqObj:object)=>{
  console.log("id===>req Object",id,reqObj)
  const response=await api.post(`${API_URL}/services/requestservice/${id}`,reqObj);
  return response.data;
}
export const contactServiceProvider=async( serviceData: any,
  provider: string,
  requestby: string,
  shareMessage: string)=>{
    console.log("id===>req Object",serviceData,provider,requestby,shareMessage)
    const response=await api.post(`${API_URL}/services/contact-service-provider`,{serviceData,provider,requestby,shareMessage});
    return response.data;
  }

export const markAsCompleted=async(id:string)=>{
  console.log("id===>req Object",id)
  const response=await api.put(`${API_URL}/services/markservicecompleted/${id}`);
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
export const updateMessageStatus = async (chatId: string, messageIds: string[],status:string) => {
  const response = await api.put(`${API_URL}/chats/${chatId}/update-message-status`, {messageIds,status});
  return response.data;
};
// Get all chats for a user
export const getChatsForUserApi = async (userId: string,query:string) => {
  const response = await api.get(`${API_URL}/chats/user/${userId}/${query}`);
  return response.data;
};

// Delete a chat
export const deleteChatApi = async (id: string) => {
  const response = await api.delete(`${API_URL}/chats/${id}`);
  return response.data;
};

//post management
export const createPost = async (postData: any) => {
  console.log("post data",postData)

  const response = await api.post(`${API_URL}/posts`, postData);
  return response.data;
};

export const fetchAllPosts = async () => {
  const response = await api.get(`${API_URL}/posts`);
  return response.data;
};
export const fetchAllPostsOfUser=async(userId:string)=>{
  const response=await api.get(`${API_URL}/posts/user/${userId}`);
  return response.data;
}
export const sharePost=async (postid:string,userid:string,toUsers:string[])=>{
  const frontend=import.meta.env.VITE_FRONTEND_URL;
  const url = `Check out this post: <a href="${frontend}/posts/${postid}" target="_blank">${frontend}/posts/${postid}</a>`;
  const response = await api.post(`${API_URL}/posts/share-post/${postid}`,{userid,toUsers,url});
  return response.data;

}

export const getPostById = async (id: string) => {
  const response = await api.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const updatePost = async (id: string, postData: any) => {
  const response = await api.put(`${API_URL}/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`${API_URL}/posts/${id}`);
  return response.data;
};

export const likePost = async (id: string,userid:string) => {
  console.log("user======>",userid)

  const response = await api.post(`${API_URL}/posts/${id}/like`,{userid});
  return response.data;

};

export const addComment = async (id: string, commentData: any) => {
  const response = await api.post(`${API_URL}/posts/${id}/comment`, commentData);
  return response.data;
};

export const getPostsByTag = async (tag: string) => {
  const response = await api.get(`${API_URL}/posts/tag/${tag}`);
  return response.data;
};

export const shareComment = async (postId: string, commentId: string) => {
  const response = await api.post(`${API_URL}/posts/${postId}/comment/${commentId}/share`);
  return response.data;
};

export const getDashboardData=async()=>{
  const response = await api.get(`${API_URL}/getDashboardData`);
  return response.data;
}

// getting notification
export const getAllNotification=async(id:string)=>{
  const response = await api.get(`${API_URL}/notifications/filter/${id}`);
  return response.data;
}
export const markAsSeen=async(id:string,data:any)=>{
  const response = await api.put(`${API_URL}/notifications/update/${id}`,data);
  return response.data;
}

//hallbooking
export const getAllavailableSlot=async(days:number,hallid:string)=>{
  const response=await api.get(`${API_URL}/booking/slots/${hallid}/${days}`)
  return response.data;

}
export const createHall=async(hallDetails:any)=>{
  const response=await api.post(`${API_URL}/hall/create`,hallDetails)
  return response.data;
}
export const updateHall=async(hallDetails:any,hallid:string)=>{
  const response=await api.put(`${API_URL}/hall/update/${hallid}`,hallDetails)
  return response.data;
}
export const deleteHall=async(hallid:string)=>{
  const response=await api.delete(`${API_URL}/hall/delete/${hallid}`)
  return response.data;
}
export const getAllHall=async()=>{
  const response=await api.get(`${API_URL}/hall`)
  return response.data;
}
export const fetchHallDetails=async(id:string)=>{
  const response=await api.get(`${API_URL}/hall/${id}`)
  return response.data;
}
 
export const bookAHall=async(bookingData:any,slotData:any)=>{
  const response=await api.post(`${API_URL}/booking`,{bookingData,slotData})
  return response.data;
}
export const getAllBookings=async()=>{
  const response=await api.get(`${API_URL}/booking`)
  return response.data;
}
export const fetchAllSlots=async(hallid:string)=>{
  const response=await api.get(`${API_URL}/booking/slots/allslots/${hallid}/30`)
  return response.data;
}
export const updateSlotStatus=async(slotid:string,status:string)=>{
  const response=await api.put(`${API_URL}/booking/slots/update/${slotid}`,{status})
  return response.data;
}

export const getAllBookingOfUser=async(id:string)=>{
  const response=await api.get(`${API_URL}/booking/user/${id}`)
  return response.data;
}
export const confirmBooking=async(bookingId:string)=>{
  const response=await api.put(`${API_URL}/booking/update/${bookingId}`,{status:'confirmed'})
  return response.data;
}
export const deleteBooking=async(bookingId:string)=>{
  const response=await api.delete(`${API_URL}/booking/delete/${bookingId}`,)
  return response.data;
}
