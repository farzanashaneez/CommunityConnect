import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done"; // Single tick
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Double tick
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Sending icon
import { getChatByIdApi, sendMessageApi } from "../../services/api";
import { useAppSelector } from "../../hooks/reduxStoreHook";

const socket = io("http://localhost:5000", {
  path: "/socket.io",
  transports: ["websocket"], // Use WebSocket transport for better performance
});

interface Chat {
  _id: string;
  participants: {
    _id:string;
    imageUrl?: string;
    firstName?: string;
    apartmentId?: { buildingSection: string; apartmentNumber: string };
  }[];
  messages?: Message[];
  isgroup?: boolean;
  groupName?: string;
}

interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  status?: "sending" | "sent" | "delivered" | "read"; // Message status
}

interface ChatAreaProps {
  selectedChat: Chat;
  isMobile: boolean;
  isTablet: boolean;
  toggleDrawer: () => void;
  toggleDetails: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  isMobile,
  isTablet,
  toggleDrawer,
  toggleDetails,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const userState = useAppSelector((state) => state.user);
  const id = userState.currentUser.user.id;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to socket and fetch messages when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat?._id);
      socket.emit("joinChat", selectedChat?._id);
    }

    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      fetchMessages(selectedChat?._id);

    });

    // Cleanup on unmount
    return () => {
      socket.off("newMessage");
      socket.emit("leaveChat", selectedChat?._id);
    };
  }, [selectedChat]);
  useEffect(() => {
    scrollToBottom();
  }, [messages,selectedChat]);
  
  const fetchMessages = async (chatId: string) => {
    try {
      const response = await getChatByIdApi(chatId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    // Create a temporary message with "sending" status
    const tempMessage: Message = {
      _id: `${Date.now()}`, // Temporary ID
      senderId: id,
      content: inputMessage,
      createdAt: new Date(),
      status: "sending",
    };

    // Add the temporary message to the state
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setInputMessage(""); // Clear the input field

    try {
      const response = await sendMessageApi(selectedChat._id, {
        senderId: id,
        content: inputMessage,
        status:"sending"
      });
      // Emit the message to the server via socket
      socket.emit("sendMessage", {
        chatId: selectedChat?._id,
        senderId: id,
        content: inputMessage,
      });

      // Update the message status to "sent"
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === tempMessage._id ? { ...msg, status: "sent" } : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isMobile && (
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Avatar and Heading */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 2 }}>
            {selectedChat?.participants[0]?.imageUrl ? (
              <img
                src={selectedChat.participants[0].imageUrl}
                alt="avatar"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              selectedChat?.participants[0]?.firstName?.charAt(0) || "N/A"
            )}
          </Avatar>

          <Typography variant="h6">
            {selectedChat?.isgroup
              ? selectedChat.groupName
              : selectedChat?.participants[0]?.firstName ||
                `${selectedChat?.participants[1]?.apartmentId?.buildingSection || ""} ${
                  selectedChat?.participants[1]?.apartmentId?.apartmentNumber || ""
                }`}
          </Typography>
        </Box>

        {isTablet && selectedChat && (
          <IconButton color="inherit" onClick={toggleDetails}>
            <InfoIcon />
          </IconButton>
        )}
      </Paper>

      {/* Chat Messages Section */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
  {messages.map((message) => (
    <Box
      key={message._id}
      sx={{
        mb: 2,
        textAlign: message.senderId === id ? "right" : "left",
      }}
    >
      <Paper
        sx={{
          p: 1,
          display: "inline-block",
          backgroundColor:
            message.senderId === id ? "#DCF8C6" : "#FFFFFF",
        }}
      >
        {/* Sender's name */}
        {message.senderId !== id && (
  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#075E54' }}>
    {(() => {
      const sender = selectedChat.participants.find(p => p._id === message.senderId);
      return sender?.firstName
        ? sender?.firstName 
        : `${sender?.apartmentId?.buildingSection}${sender?.apartmentId?.apartmentNumber}` || 'Unknown';
    })()}
  </Typography>
)}
      
        <Typography variant="body1">{message.content}</Typography>
        {/* Message Status Icons */}
        {message.senderId === id && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
            {message.status === "sending" && <AccessTimeIcon fontSize="small" />}
            {message.status === "sent" && <DoneIcon fontSize="small" />}
            {message.status === "delivered" && <DoneAllIcon fontSize="small" />}
            {message.status === "read" && <DoneAllIcon fontSize="small" color="primary" />}
          </Box>
        )}
      </Paper>
    </Box>
  ))}
  <div ref={messagesEndRef} />
</Box>

      {/* Message Input Section */}
      <Paper sx={{ p: 2, display: "flex", alignItems: "flex-end" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          multiline
          maxRows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "#f0f2f5",
            },
          }}
        />
        <Button
          onClick={handleSendMessage}
          variant="contained"
          sx={{
            ml: 1,
            borderRadius: "50%",
            minWidth: "40px",
            width: "40px",
            height: "40px",
            p: 0,
          }}
        >
          <SendIcon />
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatArea;
