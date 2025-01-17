import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../../hooks/reduxStoreHook';
import ProfileLink from '../ProfileLink';

interface ChatDetailsProps {
  selectedChat: any;
  isTablet: boolean;
  detailsOpen: boolean;
  toggleDetails: () => void;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ selectedChat, isTablet, detailsOpen, toggleDetails }) => {
  const userState = useAppSelector((state) => state.user);
  const id = userState.currentUser.user.id;
  const [userIndex,setUserIndex]=useState(0)
useEffect(()=>{
  setUserIndex(s=>selectedChat?.participants[userIndex]._id===id? 1 : 0 )
},[selectedChat])
  const content = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
    }}>
      {/* Avatar and Heading */}
      <Box sx={{ 
        textAlign: 'center', 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
          {selectedChat?.participants[userIndex]?.imageUrl 
            ? <img src={selectedChat.participants[userIndex].imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
            : selectedChat.participants[userIndex]?.firstname?.charAt(0) || 'N/A'}
        </Avatar>
        <Typography variant="h6">
          {selectedChat?.isgroup 
            ? selectedChat.groupName 
            :(  <ProfileLink  id={`${selectedChat.participants[userIndex]?._id}`}><span>{selectedChat.participants[userIndex]?.firstname || 
            `${selectedChat.participants[userIndex]?.apartmentId?.buildingSection} ${selectedChat.participants[userIndex]?.apartmentId?.apartmentNumber}`}</span></ProfileLink>) }
        </Typography>
      </Box>

      {/* Additional Details */}
      {selectedChat.isgroup ? (
    // For group chat: Display list of members with profile pictures and names
   <> <Typography variant='body1' sx={{m:'auto'}}>MEMBERS</Typography>
    <List>
      {selectedChat?.participants?.map((participant:any, index:number) => (
        <ProfileLink key={index} id={`${participant?._id}`}>
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar src={participant.imageUrl || ''}>
              {participant.firstName?.[0] || 'U'}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={participant.firstName || 'Unknown'}
            secondary={
              `${participant.apartmentId?.buildingSection || ''}${participant.apartmentId?.apartmentNumber || ''}`
            }
          />
        </ListItem>
        </ProfileLink>
      ))}
    </List>
    </>
  ) : (
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="body1">Email: {selectedChat?.participants[userIndex].email || 'N/A'}</Typography>
        <Typography variant="body1">Phone: {selectedChat?.participants[userIndex].mobileNumber || 'N/A'}</Typography>
        {/* Add more details as needed */}
      </Box>
  
  )}
 </Box> );

  if (!isTablet) {
    return (
      <Paper sx={{ 
        width: 300, 
        height: '100%', 
        display: { xs: 'none', md: 'block' },
        overflow: 'hidden',
      }}>
        {content}
      </Paper>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={detailsOpen}
      onClose={toggleDetails}
      sx={{ display: { md: 'none' } }}
    >
      <Box sx={{ width: 250, height: '100%' }} role="presentation">
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={toggleDetails}>
          <CloseIcon />
        </IconButton>
        {content}
      </Box>
    </Drawer>
  );
};

export default ChatDetails;
