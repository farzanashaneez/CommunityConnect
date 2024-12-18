import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar,
  Paper,
  IconButton,
  Drawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ChatDetailsProps {
  selectedChat: any;
  isTablet: boolean;
  detailsOpen: boolean;
  toggleDetails: () => void;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ selectedChat, isTablet, detailsOpen, toggleDetails }) => {
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
          {selectedChat?.participants[0]?.imageUrl 
            ? <img src={selectedChat.participants[0].imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
            : selectedChat.participants[0]?.firstname?.charAt(0) || 'N/A'}
        </Avatar>
        <Typography variant="h6">
          {selectedChat?.isgroup 
            ? selectedChat.groupName 
            : selectedChat.participants[0]?.firstname || 
              `${selectedChat.participants[1]?.apartmentId?.buildingSection} ${selectedChat.participants[1]?.apartmentId?.apartmentNumber}`}
        </Typography>
      </Box>

      {/* Additional Details */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="body1">Email: {selectedChat?.email || 'N/A'}</Typography>
        <Typography variant="body1">Phone: {selectedChat?.phone || 'N/A'}</Typography>
        {/* Add more details as needed */}
      </Box>
    </Box>
  );

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
