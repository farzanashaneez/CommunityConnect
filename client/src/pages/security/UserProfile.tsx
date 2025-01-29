import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  IconButton,
  Avatar,
  styled,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { addProfileImage, fetchUserDetails, updateName } from '../../services/api';
import { useAppSelector } from '../../hooks/reduxStoreHook';
import { User } from '../../types/User';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const ProfileImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: '0 auto',
  marginBottom: theme.spacing(3),
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: `2px solid ${theme.palette.primary.main}`,
}));

const EditImageButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(0),
  right: theme.spacing(0),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserProfile = () => {
  const securityState = useAppSelector((state) => state.security);
  const token = securityState.currentSecurity.token;
  const id = securityState.currentSecurity.user.id;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [userUpdated,setUserUpdated]=useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUserDetails(id);
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [id,userUpdated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       await updateName(
        token,
        id,
        formData.firstName,
        formData.lastName
      );
      setUserUpdated(true);
      setEditDialogOpen(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleImageUpdate = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      await addProfileImage(id, formData);
      setUserUpdated(true);
      setImageDialogOpen(false);
    } catch (err) {
      setError('Failed to update profile image');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">User data not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StyledPaper elevation={3}>
        <ProfileImageContainer>
          <ProfileImage
            src={user.imageUrl}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <EditImageButton
            color="primary"
            onClick={() => setImageDialogOpen(true)}
            size="small"
          >
            <CameraAltIcon />
          </EditImageButton>
        </ProfileImageContainer>

        <Typography variant="h4" align="center" gutterBottom>
          {user.firstName} {user.lastName}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Email:</strong> {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Apartment:</strong> {user.apartmentId?.buildingSection}-
              {user.apartmentId?.apartmentNumber}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Name
          </Button>
        </Box>
      </StyledPaper>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleProfileUpdate}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box mt={2}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image-file"
              type="file"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            />
            <label htmlFor="upload-image-file">
              <Button variant="outlined" component="span" fullWidth>
                Choose Image
              </Button>
            </label>
            {selectedImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {selectedImage.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImageUpdate}
            disabled={!selectedImage}
            variant="contained"
            color="primary"
          >
            Save Image
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;