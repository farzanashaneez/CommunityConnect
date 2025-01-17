import React, { useEffect, useState } from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { 
  List, 
  ListItemText, 
  Avatar, 
  ListItemButton,
  Box,
  Typography
} from '@mui/material';
import { socket } from '../../services/socketConnection';
import { useAppSelector } from '../../hooks/reduxStoreHook';

interface Chat {
  _id: string;
  participants: any;
  lastMessage?: string;
  name?:string
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat;
  onSelectChat: (chat: Chat) => void;
  isMobile: boolean;
  onDrawerClose?: () => void;

  isgroup?:boolean
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat, isMobile, onDrawerClose, isgroup = true }) => {
  const [onlineUsers, setOnlineUsers] = useState<[userId:string, isOnline:boolean][]>([]);

  const userState = useAppSelector((state) => state.user);
  const id = userState.currentUser.user.id;
  useEffect(() => {
    console.log('chatlist',chats)
    socket.on("onlineStatusUpdate", (onlineStatus) => {
      setOnlineUsers(onlineStatus);
      console.log("Online users ", onlineStatus);
    });

    return () => {
      socket.off("onlineStatusUpdate");
    };
  }, [chats,onlineUsers]);

//   const isUserOnline = (selectedChat: any) => {
// console.log(selectedChat,",,,,,,,",onlineUsers)
//     let flag=false;
//     if(selectedChat?.participants[0]?._id !== id){
//     flag= onlineUsers.includes(selectedChat?.participants[0]?._id)
//     }
//     else if(selectedChat?.participants[1]?._id !== id){
//       flag= onlineUsers.includes(selectedChat?.participants[1]?._id)

//     }
//     return flag
    
//   }
  

  return (
    <List sx={{ 
      width: '100%', 
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
    }}>
      {chats.map((chat: any) => (
        <ListItemButton
          key={chat._id}
          onClick={() => {
            onSelectChat(chat);
            if (isMobile && onDrawerClose) onDrawerClose();
          }}
          selected={selectedChat && selectedChat._id === chat._id}
        >
          <Box position="relative">
            <Avatar sx={{ mr: 2 }}>
              {chat.participants[0]?.imageUrl 
                ? <img src={chat.participants[0].imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
                : chat.participants[0]?.firstname?.charAt(0) || 'N/A'}
            </Avatar>
            {!isgroup && onlineUsers.some(
  ([userId, isOnline]) => 
    isOnline && 
    (userId === chat?.participants[0]?._id || userId === chat?.participants[1]?._id) &&
    userId !== id
) && (
              <FiberManualRecordIcon 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  color: 'green', 
                  fontSize: 12 
                }} 
              />
            )}
          </Box>
          {chat.messages?.[0]?.status==='read'?
          <ListItemText 
            primary={
              isgroup
                ? (chat.isgroup ? chat.groupName : chat.participants[0]?.firstName || `${chat.participants[1]?.apartmentId.buildingSection}${chat.participants[1]?.apartmentId.apartmentNumber}`)
                :(chat.participants[0]._id===id? (chat.participants[1]?.firstName || `${chat.participants[1]?.apartmentId.buildingSection}${chat.participants[1]?.apartmentId.apartmentNumber}`): (chat.participants[0]?.firstName || `${chat.participants[0]?.apartmentId.buildingSection}${chat.participants[0]?.apartmentId.apartmentNumber}`))
            }
            secondary={chat.messages?.[0]?.content ? chat.messages?.[0]?.content?.substring(0, 12) + "..." : ""}
            />
          :
          <ListItemText 
          primary={
            isgroup
              ? (chat.isgroup ? chat.groupName : chat.participants[0]?.firstName || `${chat.participants[1]?.apartmentId.buildingSection}${chat.participants[1]?.apartmentId.apartmentNumber}`)
              :(chat.participants[0]._id===id? (chat.participants[1]?.firstName || `${chat.participants[1]?.apartmentId.buildingSection}${chat.participants[1]?.apartmentId.apartmentNumber}`): (chat.participants[0]?.firstName || `${chat.participants[0]?.apartmentId.buildingSection}${chat.participants[0]?.apartmentId.apartmentNumber}`))
          }
          secondary= {<Typography variant="body1" fontWeight="bold">{chat.messages?.[0]?.content ? chat.messages?.[0]?.content?.substring(0, 12) + "..." : ""}</Typography>}
        />
}
        </ListItemButton>
      ))}
    </List>
  );
}

export default ChatList;
