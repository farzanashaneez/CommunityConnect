import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { fetchUserDetails, getQRData, verifyQRcode } from "../../services/api";
import { User } from "../../types/User";

// Define the User type


const UserVerificationPage: React.FC = () => {
  // Get the `id` parameter from the URL
  const { id } = useParams<{ id: string }>();

  // State to store user data and loading/error status
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const response = await verifyQRcode(id as string);
console.log(response.userId.userId)
        setUser(response.userId.userId);
      } catch (err) {
        setError("Verification Failed: User not found");
      } finally {
        setLoading(false);
      }
    };

   if(id) fetchUser();
  }, [id]);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Display error message if user not found
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection={'column'}  minHeight="100vh">
        <Card sx={{ minWidth: 342,maxWidth:400, textAlign: "center", padding:10 }}>
        <CardContent>
       <Typography  variant="h4" // Larger font size
            color="error"
            sx={{ mt: 2, fontWeight: "bold" }} // Add bold and margin
          >❌</Typography>
        <Typography
            variant="h4" // Larger font size
            color="error"
            sx={{ mt: 2, fontWeight: "bold" }} // Add bold and margin
          >
            Verification Failed 
          </Typography>
          </CardContent>
          </Card>
      </Box>
    );
  }

  // Display user details in a card
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 345, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone: {user?.mobileNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Apartment: {user?.apartmentId?.buildingSection}-{user?.apartmentId?.apartmentNumber}
          </Typography>
          <Typography
            variant="h4" // Larger font size
            color="green"
            sx={{ mt: 2, fontWeight: "bold" }} // Add bold and margin
          >
            Verified ✅
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserVerificationPage;