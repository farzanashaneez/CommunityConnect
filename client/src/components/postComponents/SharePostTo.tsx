import React, { useState, useEffect } from "react";
import { User } from "../../types/User";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  TextField,
  ListItemButton,
} from "@mui/material";
import { fetchAllUsers, sharePost } from "../../services/api";
// import { socket } from '../../services/socketConnection';
import { useAppSelector } from "../../hooks/reduxStoreHook";

interface SharePostToProps {
  postid: string;
  open: boolean;
  onClose: () => void;
}

const SharePostTo: React.FC<SharePostToProps> = ({ postid, open, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState(
    `Check out this post: ${window.location.origin}/post/${postid}`
  );
  const userState = useAppSelector((state) => state.user);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendMessage = async () => {
    try {
      // Find or create chat
      const userId = userState?.currentUser.user.id;
      if (!userId) throw new Error("user Id missing");
      const sharepost = await sharePost(postid, userId, selectedUsers);

      // // Emit socket event
      // socket.emit("sendMessage", {
      //   chatId: chatId,
      //   senderId: 'YOUR_USER_ID', // Replace with actual user ID
      //   content: message,
      // });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share Post</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
        />
        <List>
          {users.map((user) => (
            <ListItemButton
              key={user._id}
              onClick={() => handleUserToggle(user._id)}
            >
              <ListItemAvatar>
                <Avatar src={user.imageUrl} alt={user.firstName} />
              </ListItemAvatar>
              <ListItemText primary={user.firstName} />
              <Checkbox
                edge="end"
                checked={selectedUsers.includes(user._id)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSendMessage}
          color="primary"
          disabled={selectedUsers.length === 0}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SharePostTo;
