import React, { useEffect, useState } from "react";

import { Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
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
  const userState = useAppSelector((s) => s.user);
  useEffect(() => {
    socket.on("notificationUpdate", (newNotification) => {
      console.log("New notification received:", newNotification);
    });

    return () => {
      socket.off("notificationUpdate");
    };
  }, []);

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <List>
        {notifications.map((notification, index) => (
          <ListItemButton key={index} onClick={()=>{markAsSeen(notification._id,{seenBy:userState.currentUser.user.id})}}>
            {notification.seenBy.includes(userState.currentUser.user.id) ? (
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
