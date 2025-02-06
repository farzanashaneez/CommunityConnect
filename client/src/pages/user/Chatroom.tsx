import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  useMediaQuery,
  useTheme,
  Drawer,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemText,
  Checkbox,
  Button,
  ListItemButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatList from "../../components/chat/ChatList";
import ChatArea from "../../components/chat/ChatArea";
import ChatDetails from "../../components/chat/chatDetails";
import {
  createChatApi,
  fetchAllUsers,
  getChatsForUserApi,
} from "../../services/api";
import { useAppSelector } from "../../hooks/reduxStoreHook";
import { socket } from "../../services/socketConnection";
import { MenuIcon } from "lucide-react";
import { useParams } from 'react-router-dom';


interface Chat {
  _id: string;
  participants: string[];
  messages?: Message[];
  name?: string;
}

interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  apartmentId: any;
}

const ChatApp: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [updatechat,setupdateChat]=useState(0);
  // getuser from redux updatechat
  const userState = useAppSelector((state) => state.user);
  const id = userState.currentUser.user.id;
  const userId = userState.currentUser.user.id;

  // User selection state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  const [isCreatingPersonal, setIsCreatingPersonal] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [chatsadded, setChatsadded] = useState(false);
  const [selectedFromQuery, setselectedFromQuery] = useState<Chat | null>(null);



  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState({
    groupName: "",
  });
  const {chatid}=useParams();
const updatechatlist=(async ()=>{
 
  await fetchChats()
  setupdateChat(s=>s+1)
  console.log(updatechat)

})
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const ondeletechat=()=>{
  setChats(prevChats=>
    prevChats.filter(chat=>chat._id!==selectedChat._id)
    )
  setSelectedChat(null)
}
  const handleUserSelect = (userId: string) => {
    if (!isCreatingPersonal) {
      // Allow multiple selections for group chat
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId)); // Deselect if already selected
      } else {
        setSelectedUsers([...selectedUsers, userId]); // Add to selected list
      }
    } else {
      // Allow only one selection for personal chat
      setSelectedUsers([userId]); // Replace with the newly selected user
    }
  };
 
  useEffect(() => {
    fetchChats();
    fetchChatsGroup();
    if (chatsadded) {
      fetchUsers();
    }
  }, [chatsadded, !dialogOpen]);
    useEffect(()=>{
      if(selectedFromQuery){
        setSelectedChat(selectedFromQuery)
      }
      console.log("Chat ID from query:", selectedFromQuery);

    },[selectedFromQuery])

    useEffect(()=>{
          socket.emit('userConnected',id)
      return(()=>{
          socket.off('userConnected')
          socket.emit('beoffline',id)
      })
    })
  const fetchChats = async () => {
    try {
      const response = await getChatsForUserApi(id, "personal");
      console.log("chat response", response);
      setChats(Array.isArray(response) ? response : []);
      setChatsadded(true);
      const selected=chats?.find(chat=>chat._id===chatid)
if (selected && (selectedFromQuery?._id !== selected._id))
setselectedFromQuery(selected)
     

    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  const fetchChatsGroup = async () => {
    try {
      const response = await getChatsForUserApi(id, "group");
      console.log("chat response", response);
      setChats(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      // setUsers(response);
      const relevantChats = chats?.filter(
        (chat: any) =>
          !chat.isgroup &&
          chat.participants.some(
            (participant: any) => participant._id === userId
          )
      );

      const otherUserIds = relevantChats?.flatMap((chat: any) =>
        chat.participants
          .filter((participant: any) => participant._id !== userId)
          .map((participant: any) => participant._id)
      );

      const filteredUsers = response.filter(
        (user: any) => !otherUserIds?.includes(user._id)
      );

      console.log(response, otherUserIds, filteredUsers, "==>");

      isCreatingPersonal ? setUsers(filteredUsers) : setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!isCreatingPersonal) {
        // Submit group chat data
        const groupData = {
          groupName: formData.groupName,
          participants: [id, ...selectedUsers],
          isgroup: true,
          createdBy: id,
        };
        console.log("group data", groupData);
        const res = await createChatApi(groupData, "group");
        setSelectedChat(res);
        console.log("selected group chat   ", res);
      } else {
        // Submit personal chat data
        const personalChatData = {
          participants: [id, ...selectedUsers],
        };
        console.log("personal data", personalChatData);
        const res = await createChatApi(personalChatData, "personal");
        console.log("selected chat   ", res);
        setSelectedChat(res);
      }
    } catch (err) {
      console.log("error", err);
    }

    setDialogOpen(false);
  };

  const handleCreatePersonalChat = () => {
    setIsCreatingPersonal(true);
    setIsCreatingGroup(false)
    setDialogOpen(true); // Open the dialog for user selection
    setSelectedUsers([]); // Reset selected users

  };

  const handleCreateGroupChat = () => {
    setIsCreatingPersonal(false);
    setIsCreatingGroup(true)
    setDialogOpen(true); // Open the dialog for user selection
    setSelectedUsers([]); // Reset selected users
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: `91vh`,
        bgcolor: "background.default",
        p: 1,
      }}
    >
      {/* Chat List */}
      {!isMobile && (
        <Paper
          sx={{
            width: 300,
            height: "100%",
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ height: "50%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  padding: 1,
                  backgroundColor: "primary.contrastText",
                  color: "primary.main",
                  fontWeight: "bold",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  flexGrow: "1",
                }}
              >
                Personal Chat
              </Typography>
              <IconButton onClick={handleCreatePersonalChat}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: "1", overflow: "auto" }}>
              <ChatList
                chats={chats?.filter((chat) => chat.participants.length === 2)}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                isMobile={isMobile}
                isgroup={false}
              />
            </Box>
          </Box>

          <Box sx={{ height: "50%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  padding: 1,
                  backgroundColor: "primary.contrastText",
                  color: "primary.main",
                  fontWeight: "bold",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  flexGrow: "1",
                }}
              >
                Group Chat
              </Typography>
              <IconButton onClick={handleCreateGroupChat}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: "1", overflow: "auto" }}>
              <ChatList
                chats={chats.filter((chat) => chat.participants.length > 2)}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                isMobile={isMobile}
              />
            </Box>
          </Box>
        </Paper>
      )}

      {/* User Selection Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogContent dividers>
            {/* Group Name Field */}
            {!isCreatingPersonal && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Group Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter group name"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  required={isCreatingGroup}
                />
              </Box>
            )}
            <Typography variant="subtitle1" gutterBottom>
              Select Participants
            </Typography>
            <List>
              {users
                ?.filter((user) => user._id !== userId)
                .map((user) => (
                  <ListItemButton
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <Checkbox
                      edge="start"
                      checked={selectedUsers.includes(user._id)}
                      tabIndex={-1}
                      disableRipple
                      disabled={
                        !isCreatingGroup &&
                        selectedUsers.length > 0 &&
                        !selectedUsers.includes(user._id)
                      }
                    />
                    <ListItemText
                      primary={
                        user.firstName ||
                        user.apartmentId?.buildingSection +
                          user.apartmentId?.apartmentNumber
                      }
                    />
                  </ListItemButton>
                ))}
            </List>
          </DialogContent>

          <DialogActions>
            <Button type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                (!isCreatingPersonal &&
                  (selectedUsers.length < 2 || !formData.groupName.trim())) ||
                (isCreatingPersonal && selectedUsers.length !== 1)
              }
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { sm: "none" } }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            isMobile={isMobile}
            onDrawerClose={() => setDrawerOpen(false)}
          />
        </Box>
      </Drawer>

      {/* Chat Area */}
      {selectedChat !== null ? (
        <ChatArea
          selectedChat={selectedChat}
          isMobile={isMobile}
          isTablet={isTablet}
          toggleDrawer={() => setDrawerOpen(!drawerOpen)}
          toggleDetails={() => setDetailsOpen(!detailsOpen)}
          onUpdateMessage={updatechatlist}
          ondeleteChat={ondeletechat}
        />
      ) : (
      <> 
      {isMobile && <IconButton edge="start" color="inherit" onClick={()=>setDrawerOpen(!drawerOpen)} >
        <MenuIcon />
      </IconButton>
      }
        <Box
          sx={{
            display: "flex",
            height: `91vh`,
            width: "100%",
            bgcolor: "background.default",
            p: 1,
          }}
        >
          <h1 className="text-center m-auto text-3xl">No Chat Selected</h1>
        </Box>
        </>
      )}

      {/* Chat Details */}
      {selectedChat && (
        <ChatDetails
          selectedChat={selectedChat}
          isTablet={isTablet}
          detailsOpen={detailsOpen}
          toggleDetails={() => setDetailsOpen(!detailsOpen)}
        />
      )}
    </Box>
  );
};

export default ChatApp;
