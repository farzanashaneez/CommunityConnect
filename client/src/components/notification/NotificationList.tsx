import React from 'react';
import { Box, List, ListItem, ListItemText, Divider, Typography, ListItemButton } from '@mui/material';

interface Notification {
  id: number;
  message: string;
  seen: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (id: number) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationClick }) => {
  return (
    <Box sx={{ width: '300px', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ padding: 2 }}>Notifications</Typography>
      <Divider />
      <List>
        {notifications.map((notification) => (
          <ListItemButton
            key={notification.id}
            onClick={() => onNotificationClick(notification.id)}
            sx={{ backgroundColor: notification.seen ? 'transparent' : 'rgba(0,0,0,0.1)' }}
          >
            <ListItemText primary={notification.message} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default NotificationList;
