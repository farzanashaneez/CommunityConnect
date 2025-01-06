import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Paper,
  useMediaQuery,
  useTheme,
  Drawer,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  ListItemButton,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatList from '../../components/chat/ChatList';
import ChatArea from '../../components/chat/ChatArea';
import ChatDetails from '../../components/chat/chatDetails';
import { createChatApi, fetchAllUsers, getChatsForUserApi } from '../../services/api';
import { useAppSelector } from '../../hooks/reduxStoreHook';

interface Chat {
  _id: string;
  participants: string[];
  messages?: Message[];
  name?: string;
}

interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  apartmentId: any;


}

const ChatApp: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | any>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  // getuser from redux
  const userState=useAppSelector((state)=>state.user)
const id=userState.currentUser.user.id;

  // User selection state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [isCreatingPersonal, setIsCreatingPersonal] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const userId = 'YOUR_USER_ID'; 
  const [formData, setFormData] = useState({
    groupName: "",
  });
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  
  const handleUserSelect = (userId: string) => {
    if (!isCreatingPersonal) {
      // Allow multiple selections for group chat
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId)); // Deselect if already selected
      } else {
        setSelectedUsers([...selectedUsers, userId]); // Add to selected list
      }
    } else {
      // Allow only one selection for personal chat
      setSelectedUsers([userId]); // Replace with the newly selected user
    }
  };
  
  

  useEffect(() => {
    fetchChats();
    fetchChatsGroup();
    fetchUsers();
  }, []);

 

  const fetchChats = async () => {
    try {
      const response = await getChatsForUserApi(id,'personal')
      console.log("chat response",response)
      setChats(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  const fetchChatsGroup = async () => {
    try {
      const response = await getChatsForUserApi(id,'group')
      console.log("chat response",response)
      setChats(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      console.log("response==>",response)
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && selectedChat) {
      try {
        const response = await axios.post(`/api/chats/${selectedChat._id}/message`, {
          senderId: userId,
          content: inputMessage
        });
        setMessages(response.data.messages);
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const handleSubmit =async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  try{
    if (!isCreatingPersonal) {
      // Submit group chat data
      const groupData = {
        groupName: formData.groupName,
        participants:[id,...selectedUsers],
        isgroup:true,
        createdBy:id
      };
     console.log('group data',groupData)
     await createChatApi(groupData,'group')
     
    } else {
      // Submit personal chat data
      const personalChatData = {
        participants:[id,...selectedUsers],
      };
      console.log('personal data',personalChatData)
      await createChatApi(personalChatData,'personal')

    }
  }
  catch(err){
console.log("error",err)
  }
   
  
    setDialogOpen(false);
  };
  
   const handleCreatePersonalChat = () => {
    setIsCreatingPersonal(true)
     setDialogOpen(true); // Open the dialog for user selection
     setSelectedUsers([]); // Reset selected users
   };

   const handleCreateGroupChat = () => {
    setIsCreatingPersonal(false)
     setDialogOpen(true); // Open the dialog for user selection
     setSelectedUsers([]); // Reset selected users
   };

  //  const handleUserSelect = (userId: string) => {
  //    setSelectedUsers(prev =>
  //      prev.includes(userId)
  //        ? prev.filter(id => id !== userId)
  //        : [...prev, userId]
  //    );
  //  };

  //  const createNewChat = async () => {
  //    if (selectedUsers.length === (isCreatingGroup ? selectedUsers.length : selectedUsers.length)) return;

  //    try {
  //      const response = await axios.post('/api/chats', {
  //        participants: isCreatingGroup 
  //          ? [userId, ...selectedUsers]
  //          : [userId, selectedUsers[0]]
  //      });
  //      setChats([...chats, response.data]);
  //      setSelectedChat(response.data);
  //      setDialogOpen(false); // Close the dialog after creating chat
  //      setSelectedUsers([]);
  //    } catch (error) {
  //      console.error('Error creating new chat:', error);
  //    }
  //  };

   return (
     <Box sx={{ display: 'flex', height: `91vh`, bgcolor: 'background.default', p:1 }}>
       {/* Chat List */}
       {!isMobile && (
         <Paper 
           sx={{ 
             width: 300, 
             height: '100%',
             display: { xs: 'none', sm: 'flex' },
             flexDirection: 'column',
             overflow: 'hidden',
           }}
         >
           <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column' }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography
                 variant="h6" 
                 sx={{
                   padding:1,
                   backgroundColor:'primary.contrastText',
                   color:'primary.main',
                   fontWeight:'bold',
                   borderBottom:'1px solid',
                   borderColor:'divider',
                   flexGrow:'1'
                 }}
               >
                 Personal Chat
               </Typography>
               <IconButton onClick={handleCreatePersonalChat}>
                 <AddIcon />
               </IconButton>
             </Box>
             <Box sx={{ flexGrow:'1',overflow:'auto'}}>
               <ChatList 
                 chats={chats?.filter(chat => chat.participants.length ===2)}
                 selectedChat={selectedChat}
                 onSelectChat={setSelectedChat}
                 isMobile={isMobile}
               />
             </Box>
           </Box>
           
           <Box sx={{ height:'50%',display:'flex',flexDirection:'column'}}>
             <Box sx={{ display:'flex',justifyContent:'space-between',alignItems:'center'}}>
               <Typography variant="h6" sx={{
                 padding:1,
                 backgroundColor:'primary.contrastText',
                 color:'primary.main',
                 fontWeight:'bold',
                 borderBottom:'1px solid',
                 borderColor:'divider',
                 flexGrow:'1'
               }}>
                 Group Chat
               </Typography>
               <IconButton onClick={handleCreateGroupChat}>
                 <AddIcon />
               </IconButton>
             </Box>
             <Box sx={{ flexGrow:'1',overflow:'auto'}}>
               <ChatList 
                 chats={chats.filter(chat=>chat.participants.length>2)}
                 selectedChat={selectedChat}
                 onSelectChat={setSelectedChat}
                 isMobile={isMobile}
               />
             </Box>
           </Box>
         </Paper>
       )}

       {/* User Selection Dialog */}
       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
  <form onSubmit={handleSubmit}>
    <DialogTitle>Create New Chat</DialogTitle>
    <DialogContent dividers>
     

      {/* Group Name Field */}
      {!isCreatingPersonal && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Group Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter group name"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
            required={isCreatingGroup}
          />
        </Box>
      )}
      <Typography variant="subtitle1" gutterBottom>
        Select Participants
      </Typography>
      <List>
        {users?.filter(user => user._id !== userId).map(user => (
          <ListItemButton key={user._id} onClick={() => handleUserSelect(user._id)}>
            <Checkbox
              edge="start"
              checked={selectedUsers.includes(user._id)}
              tabIndex={-1}
              disableRipple
              disabled={!isCreatingGroup && selectedUsers.length > 0 && !selectedUsers.includes(user._id)}
            />
            <ListItemText primary={user.firstName || user.apartmentId?.buildingSection+user.apartmentId?.apartmentNumber} />
          </ListItemButton>
        ))}
      </List>
    </DialogContent>

    <DialogActions>
      <Button type="button" onClick={() => setDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={
          (!isCreatingPersonal && (selectedUsers.length < 2 || !formData.groupName.trim())) ||
          (isCreatingPersonal && selectedUsers.length !== 1)
        }
      >
        Create
      </Button>
    </DialogActions>
  </form>
</Dialog>


       {/* Mobile Drawer */}
       <Drawer
         anchor="left"
         open={drawerOpen}
         onClose={() => setDrawerOpen(false)}
         sx={{ display: { sm: 'none' } }}
       >
         <Box sx={{ width:250 }} role="presentation">
           <ChatList 
             chats={chats}
             selectedChat={selectedChat}
             onSelectChat={setSelectedChat}
             isMobile={isMobile}
             onDrawerClose={() => setDrawerOpen(false)}
           />
         </Box>
       </Drawer>

       {/* Chat Area */}
       <ChatArea 
         selectedChat={selectedChat}
         isMobile={isMobile}
         isTablet={isTablet}
         toggleDrawer={() => setDrawerOpen(!drawerOpen)}
         toggleDetails={() => setDetailsOpen(!detailsOpen)}
       />

       {/* Chat Details */}
       {selectedChat && (
         <ChatDetails 
           selectedChat={selectedChat}
           isTablet={isTablet}
           detailsOpen={detailsOpen}
           toggleDetails={() => setDetailsOpen(!detailsOpen)}
         />
       )}
     </Box>
   );
};

export default ChatApp;
