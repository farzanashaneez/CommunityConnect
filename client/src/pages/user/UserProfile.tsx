// src/pages/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, Avatar, Modal, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Grid2, Divider, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUserDetails, addMember, updateName, addProfileImage } from '../../services/api';
import { useAppSelector } from '../../hooks/reduxStoreHook';
import ImageCropper from '../../components/ImageCropper';
import PostList from '../../components/postComponents/PostList';
import ServiceList from '../../components/ServiceList';
import UserServices from '../../components/home/UserServices';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../components/ConfirmationDialogue';
import { store } from '../../redux-store/store';
import { signoutSuccess } from '../../redux-store/user/userSlice';

const UserProfile: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openNameModal, setOpenNameModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [relation, setRelation] = useState('');
  const [profession, setProfession] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null); // Adjust type as needed

  const userState = useAppSelector((state) => state.user);
  const token = userState.currentUser.token;
  const id = userState.currentUser.user.id;

  const [openCropper, setOpenCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const navigate = useNavigate();
  const [open,setOpen]=useState(false)

  const handleAddClick = () => {
    setOpenCropper(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setCroppedImage(croppedUrl);

    // Update the cropped image in the database
    const formData = new FormData();
    formData.append("image", croppedBlob);

    try {
      await addProfileImage(id,formData,); 
      setOpenCropper(false);
      setSelectedImage(null);
      alert("Image updated successfully!");
    } catch (error) {
      setOpenCropper(false);
      setSelectedImage(null);
      console.error("Error updating image:", error);
      alert("Failed to update the image.");
    }
  };

  const handleCancelCropper = () => {
    setOpenCropper(false);
    setSelectedImage(null);
  };

  const fetchUserDetailsData = async () => {
    try {
      if (!token) throw new Error('No token found');
      const data = await fetchUserDetails(id);
      console.log(data);
      setUserDetails(data);
      setFirstName(data?.firstName || '');
      setLastName(data?.lastName || '');
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetailsData(); // Call the function to fetch user details on component mount
  }, [token]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setMemberName('');
    setRelation('');
    setProfession('');
  };

  const handleOpenNameModal = () => setOpenNameModal(true);
  const handleCloseNameModal = () => setOpenNameModal(false);

  const handleAddMember = async () => {
    try {
      if (!token) throw new Error('No token found');
      await addMember(token, id, { name: memberName, relation, profession });
      await fetchUserDetailsData(); // Refresh user details after adding a member
      handleClose(); // Close the modal after adding
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleUpdateName = async () => {
    try {
      if (!token) throw new Error('No token found');
      await updateName(token, id,firstName, lastName);
      await fetchUserDetailsData(); 
      handleCloseNameModal();
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };
  const handleLogout = () => {
    setOpen(true)

  };
  const logoutconfirm=()=>{
    store.dispatch((signoutSuccess())) ;

    navigate('/login');
  }

  return (
    <Box sx={{ width: '100%', margin: 'auto', mt: 0, padding: '5px' }}>
      {/* Cover Photo Section */}
      <Box 
  sx={{
    position: 'relative',
    height: '45vh',
    backgroundImage: 'url("/src/assets/homeBG.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <IconButton 
    sx={{
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      }
    }}
  >
    <EditIcon />
  </IconButton>

  <Box sx={{  width: 150, height: 150, position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>
    <Avatar 
      alt={userDetails?.firstName || "User Name"} 
      src={userDetails?.imageUrl || "/path/to/default/profile-image.jpg"}
      sx={{
        width: '100%',
        height: '100%',
        border: '4px solid white',
      }} 
    />
    <Button 
      variant="text" 
      color="primary" 
      onClick={handleAddClick}
      sx={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        width:'100%'
      }}
    >
      Add Image
    </Button>
  </Box>
</Box>


      {/* User Details */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
          <Box sx={{ flex:1,flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2">Apartment Number:</Typography>
            <Typography variant="body1" sx={{fontWeight:'bold'}}>{`${userDetails?.apartmentId?.buildingSection}-${userDetails?.apartmentId?.apartmentNumber}` || "N/A"}</Typography>
            <Typography variant="subtitle2">Phone Number:</Typography>
            <Typography variant="body1" sx={{fontWeight:'bold'}}>{userDetails?.mobileNumber || "N/A"}</Typography>
            <Typography variant="subtitle2">Email:</Typography>
            <Typography variant="body1" sx={{fontWeight:'bold',fontSize:{xs:'14px',sm:'14px'}}}>{userDetails?.email || "N/A"}</Typography>
          </Box>

          <Box sx={{ flex:1,flexGrow: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ order: { xs: -1, md: 0 } }}>{userDetails?.firstName} {userDetails?.lastName}</Typography>
            <Button onClick={handleOpenNameModal} variant="text" color="primary">
              Edit Name
            </Button>
            <Button 
          variant="contained" 
          color="primary" 
          sx={{  }}
          onClick={handleOpen}
        >
          Add Member
        </Button>
          </Box>

          <Box sx={{flex:1, flexGrow: 1, textAlign: 'center',alignItems:'center' }}>
            <Typography variant="subtitle2">Members Count:</Typography>
            <Typography variant="h6">{Array.isArray(userDetails?.members) ? userDetails.members.length : "0"}</Typography>
              <Divider sx={{width:'75%',my:1}}/>        
      {Array.isArray(userDetails?.members) && userDetails.members.length > 0 ? (
              userDetails.members.map((member: any) => (
                <Typography key={member.name} variant="body2" sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}>
                  <span style={{ minWidth: '60px', textAlign: 'right', marginRight: '8px' }}>
                    {member.name}:
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    {member.profession}
                  </span>
                </Typography>
              ))
            ) : (
              <Typography variant="body2">No members found.</Typography>
            )}
          </Box>
          <Button onClick={handleLogout}><Logout/></Button>
        </Box>


       
      </Box>

      <Divider sx={{width:'95%',m:'auto',my:1,mb:3}}/>   

      <Box sx={{ width: '90%',margin:'auto',marginBottom:'15px' }}>
      <Grid container spacing={2} direction={{ xs: 'column-reverse', md: 'row' }}>
  <Grid item xs={12} sm={9}>
    <Typography variant="h5" fontWeight='bold' gutterBottom>My Posts</Typography>
    <PostList isUser={true} userid={id}/>
  </Grid>
  <Grid item xs={12} sm={2} >
    <Typography variant="h5" fontWeight='bold' gutterBottom>My Services</Typography>
    <UserServices userId={id}/>
  </Grid>
</Grid>

    </Box>
  
   

      {/* Modal for Adding Member */}
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="add-member-modal-title"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="add-member-modal-title" variant="h6" component="h2">
            Add Member
          </Typography>
          
          <TextField
            label="Member Name"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddMember} 
              sx={{ mt: 2 }}
              fullWidth
           >
              Add Member
           </Button>
        </Box>
      </Modal>

      {/* Modal for Editing Name */}
      <Modal
        open={openNameModal}
        onClose={handleCloseNameModal}
        aria-labelledby="edit-name-modal-title"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="edit-name-modal-title" variant="h6" component="h2">
            Edit Name
          </Typography>
          
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpdateName} 
              sx={{ mt: 2 }}
              fullWidth
           >
              Save Changes
           </Button>
        </Box>
      </Modal>

      <Dialog open={openCropper} onClose={handleCancelCropper} maxWidth="sm" fullWidth>
        <DialogTitle>Upload and Crop Image</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
          {croppedImage && (
          <Box >
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Cropped Image:
            </Typography>
            <Avatar
              src={croppedImage}
              alt="Cropped"
              sx={{
                width: 150,
                height: 150,
                mt: 2,
                border: "2px solid #ccc",
              }}
            />
          </Box>
        )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block", marginBottom: "1rem" }}
            />
          </Box>
          {selectedImage && (
            <ImageCropper
              imageSrc={selectedImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCancelCropper}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCropper} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={open}
        onClose={()=>{setOpen(false)}}
        onConfirm={()=>{logoutconfirm()}}
        title="loggout..!"
        message="Do you want to continue?"
      />
    </Box>
  );
};

export default UserProfile;
