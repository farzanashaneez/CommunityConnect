// src/pages/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, Avatar, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUserDetails,addMember } from '../../services/api';
import { useAppSelector } from '../../hooks/reduxStoreHook';

const UserProfile: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [relation, setRelation] = useState('');
  const [profession, setProfession] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null); // Adjust type as needed
const userState=useAppSelector((state)=>state.user)
  const token = userState.currentUser.token; 
const id=userState.currentUser.user.id
  const fetchUserDetailsData = async () => {
    try {
      if (!token) throw new Error('No token found');
      const data = await fetchUserDetails(token,id);
      console.log(data)
      setUserDetails(data);
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
    // Reset form fields
    setMemberName('');
    setRelation('');
    setProfession('');
  };

  const handleAddMember = async () => {
    try {
      if (!token) throw new Error('No token found');
      await addMember(token,id, { name: memberName, relation, profession });
      await fetchUserDetailsData(); // Refresh user details after adding a member
      handleClose(); // Close the modal after adding
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto', mt: 0, padding: '5px' }}>
      {/* Cover Photo Section */}
      <Box 
        sx={{
          position: 'relative',
          height: '45vh',
          backgroundImage: 'url("/src/assets/homeBG.jpg")', // Replace with your cover photo URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
         
        }}
      >
        {/* Edit Cover Photo Button */}
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

        {/* Profile Image */}
        <Avatar 
          alt={userDetails?.firstName || "User Name"} 
          src={userDetails?.imageUrl || "/path/to/default/profile-image.jpg"} // Replace with your profile image URL
          sx={{
            width: 150,
            height: 150,
            position: 'absolute',
            bottom: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            border: '4px solid white', // Optional border
          }} 
        />
      </Box>

      {/* User Details */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        {/* Apartment and Members Count Box */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
          <Box sx={{ flexGrow: 1, textAlign: 'center', backgroundColor:'red' }}>
            <Typography variant="body1">Apartment Number:</Typography>
            <Typography variant="body1">{`${userDetails?.apartmentId?.buildingSection}-${userDetails?.apartmentId?.apartmentNumber}` || "N/A"}</Typography>
            <Typography variant="body1">Phone Number:</Typography>
            <Typography variant="body1">{userDetails?.mobileNumber || "N/A"}</Typography>
            <Typography variant="body1">Email:</Typography>
            <Typography variant="body1">{userDetails?.email || "N/A"}</Typography>
          </Box>
          
          {/* Center Box for Name */}
          <Box sx={{ flexGrow: 1, textAlign: 'center', backgroundColor:'blue', display:'flex', flexDirection:'column', alignItems:'center' }}>
            {/* Responsive Typography */}
            <Typography variant="h6" sx={{ order: { xs: -1, md: 0 } }}>{userDetails?.firstName} {userDetails?.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Edit Name
            </Typography>
          </Box>

          {/* Members Count Box */}
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="body1">Members Count:</Typography>
            <Typography variant="body1">{Array.isArray(userDetails?.members) ? userDetails.members.length : "0"}</Typography>
            <Typography variant="body1">Education/Job:</Typography>
            {Array.isArray(userDetails?.members) && userDetails.members.length > 0 ? (
              userDetails.members.map((member:any) => (
                <Typography key={member.name} variant="body2">
                  {member.name}: {member.profession}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">No members found.</Typography>
            )}
          </Box>
        </Box>

        {/* Add Member Button */}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={handleOpen}
        >
          Add Member
        </Button>
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
    </Box>
  );
};

export default UserProfile;