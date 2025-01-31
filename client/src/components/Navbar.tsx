import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Box,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Typography,
  Container,
  styled,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Build as ServicesIcon,
  Announcement as AnnouncementIcon,
  Room as HallIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "../services/socketConnection";
import { getAllNotification, markAsSeen } from "../services/api";
import { useAppSelector } from "../hooks/reduxStoreHook";
import { QrCodeIcon } from "lucide-react";
import QRCodeGenerator from "./QRCodeGenerator";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(18, 18, 18, 0.8)",
  backdropFilter: "blur(8px)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: "space-between",
  padding: "0 24px",
});

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.04)"
      : "rgba(255, 255, 255, 0.04)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.08)"
        : "rgba(255, 255, 255, 0.08)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(["background-color", "color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

const NotificationDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 320,
    padding: theme.spacing(2),
  },
}));

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const NavBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifCount,setNotifCount] = useState(null)

  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const userState = useAppSelector((s) => s.user);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Events", path: "/events", icon: <EventIcon /> },
    { label: "Services", path: "/services", icon: <ServicesIcon /> },
    {
      label: "Announcements",
      path: "/announcements",
      icon: <AnnouncementIcon />,
    },
    { label: "Hall", path: "/hallbooking", icon: <HallIcon /> },
  ];

  useEffect(() => {
    socket.on("notificationUpdate", (newNotification) => {
      setNotifications((prev) => [newNotification.message, ...prev]);
    });

    return () => {
      socket.off("notificationUpdate");
    };
  }, []);
  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationData = await getAllNotification(
          userState.currentUser.user.id
        );
        const arr=notificationData.filter((notif:any)=>!notif.seenBy?.includes(userState.currentUser.user.id))
        setNotifCount(arr.length)
        setNotifications(notificationData);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleMarkAsSeen = async (notificationId: string) => {
    console.log("seen button clicked")
    setNotifCount(null)
    try {
      await markAsSeen(notificationId, {
        seenBy: userState.currentUser.user.id
      });
      
      // Update local state after successful API call
      setNotifications(prevNotifications =>
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
  const renderMobileDrawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={() => setMobileOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <StyledToolbar>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  color="primary"
                  edge="start"
                  onClick={() => setMobileOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box
                component={Link}
                to="/"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src="/src/assets/logo1.png"
                  alt="Logo"
                  style={{ height: "40px" }}
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path}>
                    {item.label}
                  </NavLink>
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search */}
              {/* <SearchWrapper>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </SearchWrapper> */}
              {/* Qr code */}
              <IconButton
                color="primary"
                onClick={() => setQrDialogOpen(true)} // Open QR generator page
              >
                <QrCodeIcon />
              </IconButton>
              {/* Notifications */}
              <IconButton
                color="primary"
                onClick={() => setNotificationsOpen(true)}
              >
                <Badge badgeContent={notifCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Chat */}
              <IconButton color="primary" onClick={() => navigate("/chatroom")}>
                <ChatIcon />
              </IconButton>

              {/* Profile */}
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt="User"
                  src="/path-to-user-image.jpg"
                  sx={{
                    width: 32,
                    height: 32,
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />
              </IconButton>
            </Box>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {renderMobileDrawer}
      </Drawer>

      {/* Notifications Drawer */}
      <NotificationDrawer
        anchor="right"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={() => setNotificationsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {notifications.map((notification, index) => (
             
              <ListItemButton 
            key={index}
            onClick={() => handleMarkAsSeen(notification._id)}
            sx={{
                  mb: 1,
                  borderRadius: 1,
                  backgroundColor: theme.palette.action.hover,
                }}
            
          >
            {notification?.seenBy?.includes(userState.currentUser.user.id) ? (
              <ListItemText  sx={{ mb: 1, color: theme.palette.primary.main,
              }}
               primary={notification.message} />
            ) : (
              <ListItemText
                className="text-blue-600"
                primary={notification.message}
              />
            )}
          </ListItemButton>
            ))}
          </List>
        </Box>
      </NotificationDrawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/profile");
          }}
        >
          Profile
        </MenuItem>
        {/* <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem> */}
      </Menu>
      <Dialog
      
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
         
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
         
        }}
      >
        <DialogTitle>QR Code Generator</DialogTitle>
        <DialogContent>
          <QRCodeGenerator />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavBar;
