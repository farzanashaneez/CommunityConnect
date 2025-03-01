import React, { useEffect, useState } from "react";

import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { socket } from "../../services/socketConnection";
import { useAppSelector } from "../../hooks/reduxStoreHook";
import { markAsSeen } from "../../services/api";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "300px",
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderLeft: "1px solid " + alpha(theme.palette.divider, 0.1),
  },
}));

interface NavSidebarProps {
  open: boolean;
  onClose: () => void;
  notifications: any[];
}

const NotificationSidebar: React.FC<NavSidebarProps> = ({
  open,
  onClose,
  notifications,
}) => {
  // Add state to track seen notifications locally
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const userState = useAppSelector((s) => s.user);

  useEffect(() => {
    socket.on("notificationUpdate", (newNotification) => {
    });

    return () => {
      socket.off("notificationUpdate");
    };
  }, []);
  // Update local state when props change
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleMarkAsSeen = async (notificationId: string) => {
    try {
      await markAsSeen(notificationId, {
        seenBy: userState.currentUser.user.id
      });
      
      // Update local state after successful API call
      setLocalNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif._id === notificationId
            ? {
                ...notif,
                seenBy: [...(notif.seenBy || []), userState.currentUser.user.id]
              }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <List>
        {localNotifications.map((notification, index) => (
          <ListItemButton 
            key={index}
            onClick={() => handleMarkAsSeen(notification._id)}
            
            
          >
            {notification?.seenBy?.includes(userState.currentUser.user.id) ? (
              <ListItemText primary={notification.message} />
            ) : (
              <ListItemText
                className="text-blue-600"
                primary={notification.message}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default NotificationSidebar;
