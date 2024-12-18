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
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  ListItemButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatList from '../../components/chat/ChatList';
import ChatArea from '../../components/chat/ChatArea';
import ChatDetails from '../../components/chat/chatDetails';
import { fetchAllUsers } from '../../services/api';

interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  name?: string;
}

interface Message {
  _id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface User {
  _id: string;
  name: string;
}

const ChatApp: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | any>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreatingPersonal, setIsCreatingPersonal] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const userId = 'YOUR_USER_ID'; // Replace with actual user ID

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`/api/chats/user/${userId}`);
      setChats(Array.isArray(response.data) ? response.data : []);
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

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      console.log("response==>",response)
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreatePersonalChat = () => {
    setIsCreatingPersonal(true);
    setIsCreatingGroup(false);
    fetchUsers();
  };

  const handleCreateGroupChat = () => {
    setIsCreatingGroup(true);
    setIsCreatingPersonal(false);
    fetchUsers();
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const createNewChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await axios.post('/api/chats', {
        participants: isCreatingGroup 
          ? [userId, ...selectedUsers]
          : [userId, selectedUsers[0]],
        name: isCreatingGroup ? 'New Group Chat' : undefined
      });
      setChats([...chats, response.data]);
      setSelectedChat(response.data);
      setIsCreatingPersonal(false);
      setIsCreatingGroup(false);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

  const renderUserList = () => (
    <List>
      {users?.filter(user => user._id !== userId && !chats.some(chat => 
        chat.participants.includes(user._id) && chat.participants.length === 2
      )).map(user => (
        <ListItemButton key={user._id}  onClick={() => handleUserSelect(user._id)}>
          <Checkbox
            edge="start"
            checked={selectedUsers.includes(user._id)}
            tabIndex={-1}
            disableRipple
          />
          <ListItemText primary={user.name} />
        </ListItemButton>
      ))}
    </List>
  );

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
                  padding: 1,
                  backgroundColor: 'primary.contrastText',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  borderBottom: 1,
                  borderColor: 'divider',
                  flexGrow: 1
                }}
              >
                Personal Chat
              </Typography>
              <IconButton onClick={handleCreatePersonalChat}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {isCreatingPersonal ? (
                <>
                  {renderUserList()}
                  <Button onClick={createNewChat} disabled={selectedUsers.length !== 1}>
                    Create Chat
                  </Button>
                </>
              ) : (
                <ChatList 
                  chats={chats?.filter(chat => chat.participants.length === 2)}
                  selectedChat={selectedChat}
                  onSelectChat={setSelectedChat}
                  isMobile={isMobile}
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="h6" 
                sx={{
                  padding: 1,
                  backgroundColor: 'primary.contrastText',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  borderBottom: 1,
                  borderColor: 'divider',
                  flexGrow: 1
                }}
              >
                Group Chat
              </Typography>
              <IconButton onClick={handleCreateGroupChat}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {isCreatingGroup ? (
                <>
                  {renderUserList()}
                  <Button onClick={createNewChat} disabled={selectedUsers.length < 2}>
                    Create Group
                  </Button>
                </>
              ) : (
                <ChatList 
                  chats={chats.filter(chat => chat.participants.length > 2)}
                  selectedChat={selectedChat}
                  onSelectChat={setSelectedChat}
                  isMobile={isMobile}
                />
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ display: { sm: 'none' } }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <ChatList 
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            isMobile={isMobile}
            onDrawerClose={toggleDrawer}
          />
        </Box>
      </Drawer>

      {/* Chat Area */}
      <ChatArea 
        selectedChat={selectedChat}
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        isMobile={isMobile}
        isTablet={isTablet}
        toggleDrawer={toggleDrawer}
        toggleDetails={toggleDetails}
      />

      {/* Chat Details */}
      {selectedChat && (
        <ChatDetails 
          selectedChat={selectedChat}
          isTablet={isTablet}
          detailsOpen={detailsOpen}
          toggleDetails={toggleDetails}
        />
      )}
    </Box>
  );
};

export default ChatApp;
