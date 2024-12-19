import React, { useEffect, useState } from 'react';

import { Drawer, List, ListItem, ListItemText, Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { alpha, styled } from '@mui/material/styles';
import { socket } from '../../services/socketConnection';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '300px',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderLeft: '1px solid ' + alpha(theme.palette.divider, 0.1),
  },
}));



interface NavSidebarProps {
  open: boolean;
  onClose: () => void;
  notifications: string[];
}

const NotificationSidebar: React.FC<NavSidebarProps> = ({ open, onClose, notifications }) => {
  // const [notificationstate, setNotificationstate] = useState([]);

  useEffect(() => {

    // Listen for notification updates
    socket.on('notificationUpdate', (newNotification) => {
      //setNotificationstate((prevNotifications) => [...prevNotifications, newNotification]);
      console.log('New notification received:', newNotification);
    });

    // Cleanup on unmount
    return () => {
      socket.off('notificationUpdate');
    };
  }, []);

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index}>
            <ListItemText primary={notification} />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default NotificationSidebar;
