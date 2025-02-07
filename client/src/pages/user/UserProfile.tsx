import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxStoreHook';
import { store } from '../../redux-store/store';
import { signoutSuccess } from '../../redux-store/user/userSlice';
import { fetchUserDetails, addMember, updateName, addProfileImage } from '../../services/api';
import ImageCropper from '../../components/ImageCropper';
import PostList from '../../components/postComponents/PostList';
import UserServices from '../../components/home/UserServices';
import ConfirmationDialog from '../../components/ConfirmationDialogue';

interface Member {
  name: string;
  relation: string;
  profession: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  imageUrl: string;
  apartmentId: {
    buildingSection: string;
    apartmentNumber: string;
  };
  members: Member[];
}

const UserProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State declarations
  const [openModal, setOpenModal] = useState(false);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [relation, setRelation] = useState('');
  const [profession, setProfession] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const userState = useAppSelector((state) => state.user);
  const token = userState.currentUser.token;
  const id = userState.currentUser.user.id;
  const navigate = useNavigate();

  // Modal styles
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // Snackbar handlers
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ message, severity, open: true });
  };

  // Event handlers
  const handleAddClick = () => setOpenCropper(true);
  const handleLogout = () => setOpenLogoutDialog(true);
  
  const logoutConfirm = () => {
    store.dispatch(signoutSuccess());
    navigate('/login');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setCroppedImage(croppedUrl);

    const formData = new FormData();
    formData.append("image", croppedBlob);

    try {
      await addProfileImage(id, formData);
      setOpenCropper(false);
      setSelectedImage(null);
      await fetchUserDetailsData();
      showSnackbar('Profile image updated successfully', 'success');
    } catch (error) {
      console.error("Error updating image:", error);
      showSnackbar('Failed to update profile image', 'error');
    }
  };

  const handleAddMember = async () => {
    try {
      if (!token) throw new Error('No token found');
      await addMember(token, id, { name: memberName, relation, profession });
      await fetchUserDetailsData();
      setOpenModal(false);
      showSnackbar('Member added successfully', 'success');
      // Reset form
      setMemberName('');
      setRelation('');
      setProfession('');
    } catch (error) {
      console.error('Error adding member:', error);
      showSnackbar('Failed to add member', 'error');
    }
  };

  const handleUpdateName = async () => {
    try {
      if (!token) throw new Error('No token found');
      await updateName(token, id, firstName, lastName);
      await fetchUserDetailsData();
      setOpenNameModal(false);
      showSnackbar('Name updated successfully', 'success');
    } catch (error) {
      console.error('Error updating name:', error);
      showSnackbar('Failed to update name', 'error');
    }
  };

  const fetchUserDetailsData = async () => {
    try {
      if (!token) throw new Error('No token found');
      const data = await fetchUserDetails(id);
      setUserDetails(data);
      setFirstName(data?.firstName || '');
      setLastName(data?.lastName || '');
    } catch (error) {
      console.error('Error fetching user details:', error);
      showSnackbar('Failed to fetch user details', 'error');
    }
  };

  useEffect(() => {
    fetchUserDetailsData();
  }, [token]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Cover Photo Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '30vh', sm: '45vh' },
          backgroundImage: 'url("/src/assets/homeBG.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          mb: 8
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          onClick={handleLogout}
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}
        >
          <Logout />
        </IconButton>

        {/* Profile Avatar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}
        >
          <Avatar
            alt={userDetails?.firstName || "User"}
            src={userDetails?.imageUrl}
            sx={{
              width: { xs: 100, sm: 150 },
              height: { xs: 100, sm: 150 },
              border: '4px solid white',
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddClick}
            size="small"
            sx={{ mt: 1 }}
          >
            Add Image
          </Button>
        </Box>
      </Box>

      {/* User Info Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid 
                container 
                spacing={2}
                direction={{ xs: 'column', md: 'row' }} // Stack vertically on mobile
              >
                {/* Name and Actions - Moved to top for mobile */}
                <Grid 
                  item 
                  xs={12} 
                  md={4}
                  order={{ xs: 1, md: 2 }} // First on mobile, second on desktop
                >
                  <Stack spacing={1} alignItems={{ xs: 'center', md: 'center' }}>
                    <Typography variant="h5">
                      {userDetails?.firstName} {userDetails?.lastName}
                    </Typography>
                    <Stack 
                      direction={{ xs: 'row', sm: 'row' }} 
                      spacing={1}
                      sx={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Button variant="outlined" onClick={() => setOpenNameModal(true)}>
                        Edit Name
                      </Button>
                      <Button variant="contained" onClick={() => setOpenModal(true)}>
                        Add Member
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Contact Info - Moved to middle for mobile */}
                <Grid 
                  item 
                  xs={12} 
                  md={4}
                  order={{ xs: 2, md: 1 }} // Second on mobile, first on desktop
                >
                  <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-start' }}>
                    <Typography variant="h6">Contact Information</Typography>
                    <Typography variant="body2" align="center">
                      Apartment: {`${userDetails?.apartmentId?.buildingSection}-${userDetails?.apartmentId?.apartmentNumber}`}
                    </Typography>
                    <Typography variant="body2" align="center">
                      Phone: {userDetails?.mobileNumber}
                    </Typography>
                    <Typography variant="body2" align="center">
                      Email: {userDetails?.email}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Members - Moved to bottom for mobile */}
                <Grid 
                  item 
                  xs={12} 
                  md={4}
                  order={{ xs: 3, md: 3 }} // Third on both mobile and desktop
                >
                  <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-start' }}>
                    <Typography variant="h6">
                      Members ({userDetails?.members?.length || 0})
                    </Typography>
                    <Box sx={{ width: '100%', textAlign: { xs: 'center', md: 'left' } }}>
                      {userDetails?.members?.map((member: Member) => (
                        <Typography key={member.name} variant="body2">
                          {member.name} - {member.profession}
                        </Typography>
                      ))}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Posts and Services Section - Fixed overlapping */}
        <Box sx={{ width: '100%', mt: 3 }}>
  <Grid
    container
    spacing={{ xs: 2, md: 4 }}
  >
    {/* Main Posts Section */}
    <Grid item xs={12} md={9}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: { xs: 2, md: 3 },
          borderRadius: 1,
          boxShadow: 1,
          height: 'calc(100vh - 200px)', // Adjust based on your layout
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            px: 1
          }}
        >
          My Posts
        </Typography>
        <Box 
          sx={{ 
            flexGrow: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
          <PostList isUser={true} userid={id} />
        </Box>
      </Box>
    </Grid>

    {/* Services Sidebar */}
    <Grid 
      item 
      xs={12} 
      md={3}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: { xs: 2, md: 3 },
          borderRadius: 1,
          boxShadow: 1,
          height: 'calc(100vh - 200px)', // Match height with posts section
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            px: 1
          }}
        >
          My Services
        </Typography>
        <Box 
          sx={{ 
            flexGrow: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
          <UserServices userId={id} />
        </Box>
      </Box>
    </Grid>
  </Grid>
</Box>
      </Grid>

      {/* Add Member Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Add Member</Typography>
          <Stack spacing={2}>
            <TextField
              label="Member Name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              fullWidth
            />
            <Button 
              variant="contained" 
              onClick={handleAddMember} 
              fullWidth
              disabled={!memberName || !relation || !profession}
            >
              Add Member
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Edit Name Modal */}
      <Modal open={openNameModal} onClose={() => setOpenNameModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Edit Name</Typography>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
            <Button 
              variant="contained" 
              onClick={handleUpdateName} 
              fullWidth
              disabled={!firstName || !lastName}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Image Cropper Dialog */}
      <Dialog 
        open={openCropper} 
        onClose={() => setOpenCropper(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Upload and Crop Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            {croppedImage && (
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="h6" gutterBottom>Preview:</Typography>
                <Avatar
                  src={croppedImage}
                  alt="Cropped"
                  sx={{
                    width: 150,
                    height: 150,
                    margin: 'auto',
                    border: "2px solid #ccc",
                  }}
                />
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block", marginTop: "1rem" }}
            />
          </Box>
          {selectedImage && (
            <ImageCropper
              imageSrc={selectedImage}
              onCropComplete={handleCropComplete}
              onCancel={() => setOpenCropper(false)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCropper(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={logoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;