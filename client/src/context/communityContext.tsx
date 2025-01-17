import React, { createContext, useContext, useState, ReactNode } from "react";
import CustomSnackbar from "../components/customSnackbar";
import { socket } from "../services/socketConnection";
import { PostProps } from "../components/postComponents/Post";

// Define the types for the context
interface CommunityContextType {
  deleteService: (id: string,type?:string) => void;
  updateService: (updatedService: Service,type?:string) => void;
  addCompleted:(task:string)=>void;
  addedPost:(success:boolean)=>void;
  requestServiceAlert:(type?:string,isFailed?:boolean)=>void;
  deletePostAlert:(success:boolean)=>void;
  completed: boolean; // To track the completion of actions
  postUpdated:boolean;
  openSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  closeSnackbar: () => void;
  setCompleted: (status: boolean) => void; 
  setPostUpdated: (status: boolean) => void; 

  mediaPosts: PostProps['post'][];
  updateMediaPosts: (posts: PostProps['post'][]) => void;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [completed, setCompleted] = useState(false); 
  const [mediaPosts, setMediaPosts] = useState<PostProps['post'][]>([]);
  const [postUpdated,setPostUpdated]=useState(false); 

  const updateMediaPosts = (posts: PostProps['post'][]) => {
    setMediaPosts(posts.slice(0, 6));
  };

  const openSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Method to update the 'completed' state
  const handleCompleted = (status: boolean) => {
    setCompleted(status);
  };
  const handlepostUpdated= (status: boolean) => {
    setPostUpdated(status);
  };
  const deleteService = (id: string,type?:string) => {
    if(type==='event'){
      socket.emit("update",'event');

      openSnackbar("Event deleted successfully", "success");
    }
    else if(type==='announcement'){
      openSnackbar("Announcement deleted successfully", "success");
      socket.emit("update",'announcement');
      openSnackbar("Announcement deleted successfully", "success");

    }
    else{
    openSnackbar("Service deleted successfully", "success");
    socket.emit("update",'service');

  }
    handleCompleted(true); 
  };

  const updateService = (updatedService: Service,type?:string) => {
 if(type==='event'){
      openSnackbar("Event updated successfully", "success");
      socket.emit("update",'event');

    } else if(type==='announcement'){
      openSnackbar("Announcement updated successfully", "success");
      socket.emit("update",'announcement');

    }
    else{
        openSnackbar("Service updated successfully", "success");
        socket.emit("update",'service');
      }

    handleCompleted(true); 
  };
  const addCompleted=(task:string)=>{
    if(task==='event'){
      openSnackbar("Event added successfully", "success");
      socket.emit("update",'event');
    }
    else if(task==='announcement'){
      openSnackbar("Announcement added successfully", "success");
      socket.emit("update",'announcement');

      handlepostUpdated(true);
    }
    else
    openSnackbar("Service added successfully", "success");
    socket.emit("update",'service');

    handleCompleted(true); 
  };

  const addedPost = (success:boolean) => {
    if(success){
         openSnackbar("New Post added successfully", "success");
       }
       else
           openSnackbar("Error creating a new post", "error");
   
       handleCompleted(true); 
     };

  const requestServiceAlert = (type?:string,isFailed?:boolean) => {
    if(type==='service' && !isFailed){
         openSnackbar("service requested successfully", "success");
       }
       else if(isFailed){
        openSnackbar("something went wrong", "error");
       }
       else
           openSnackbar("...check context ..!", "success");
   
       handleCompleted(true); 
     };
     const deletePostAlert = (success:boolean) => {
      if(success){
           openSnackbar("you deleted a post", "success");
         }
         else
             openSnackbar("Error deleteing a post", "error");
     
         handleCompleted(true); 
       };
  
  return (
    <CommunityContext.Provider value={{ 
      deleteService, 
      updateService, 
      addCompleted,
      openSnackbar, 
      closeSnackbar, 
      addedPost,
      requestServiceAlert,
      deletePostAlert,
      completed, 
      setCompleted: handleCompleted ,
      postUpdated,
      setPostUpdated:handlepostUpdated,
      mediaPosts,
      updateMediaPosts
    }}>
      {children}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunityContext must be used within a CommunityProvider");
  }
  return context;
};
