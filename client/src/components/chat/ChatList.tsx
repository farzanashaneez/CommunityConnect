import React from 'react';
import { 
  List, 
  ListItemText, 
  Avatar, 
  ListItemButton,
} from '@mui/material';

interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  name?:string
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | Chat;
  onSelectChat: (chat: Chat) => void;
  isMobile: boolean;
  onDrawerClose?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat, isMobile, onDrawerClose }) => (
  <List sx={{ 
    width: '100%', 
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
  }}>
    {chats.map((chat:any) => (
      <ListItemButton
        key={chat._id}
        onClick={() => {
          onSelectChat(chat);
          if (isMobile && onDrawerClose) onDrawerClose();
        }}
        selected={selectedChat && selectedChat._id === chat._id}
      >
<Avatar sx={{ mr: 2 }}>
  {chat.participants[0]?.imageUrl 
    ? <img src={chat.participants[0].imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
    : chat.participants[0]?.firstname?.charAt(0) || 'N/A'}
</Avatar>
<ListItemText 
  primary={
    chat.isgroup 
      ? chat.groupName 
      : chat.participants[0]?.firstName || chat.participants[1]?.apartmentId.buildingSection+chat.participants[1]?.apartmentId.apartmentNumber
  }
  secondary={chat.messages?.[0]?.content ?? "No messages yet"}
  />

      </ListItemButton>
    ))}
  </List>
);

export default ChatList;
