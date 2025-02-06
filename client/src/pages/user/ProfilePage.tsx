import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Button, Divider, Avatar, Box, Grid } from "@mui/material";
// import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import { fetchUserDetails } from "../../services/api";
import PostList from "../../components/postComponents/PostList";
import UserServices from "../../components/home/UserServices";

const CoverPhoto = styled("div")({
  height: "200px",
  backgroundImage: 'url("/src/assets/homeBG.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
});

const ProfileImage = styled(Avatar)({
  width: "120px",
  height: "120px",
  border: "4px solid white",
  position: "absolute",
  bottom: "-60px",
  left: "24px",
});


interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  imageUrl: string;
  members: Array<{
    name: string;
    relation: string;
    profession: string;
  }>;
  apartmentId:any;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the id from the URL
  const [user, setUser] = useState<User | null>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Fetch user details from API
    const fetchUserDetail = async () => {
      try {
        const response = await fetchUserDetails(id||'')
        setUser(response); // Set user data to state
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>; // Show loading text
  }

  if (!user) {
    return <Typography variant="h6">User not found</Typography>; // Show error if user not found
  }

  return (
    <Container maxWidth="xl">
    <Card elevation={3} sx={{ mb: 4, overflow: 'visible' }}>
      <CoverPhoto>
        <ProfileImage src={user.imageUrl || "/src/assets/defaultProfile.jpg"} />
      </CoverPhoto>
      <CardContent sx={{ pt: 8, px: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4" component="h1">
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary">
                  Message
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body1">Apartment No: {user?.apartmentId?.apartmentNumber || ""}</Typography>
                <Typography variant="body1">Contact: {user.mobileNumber}</Typography>
                <Typography variant="body1">Email: {user.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Connections :{user.members.length}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Members: </Typography>
                    {user.members.map((member, index) => (
                      <Typography variant="body2" key={index}>
                        -  {member.name} : {member.profession}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                   
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    
    <Divider sx={{ my: 3 }} />
    
    <Box sx={{ width: '100%', mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Typography variant="h5" fontWeight='bold' gutterBottom>Posts</Typography>
          <PostList isUser={true} userid={id}/>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="h5" fontWeight='bold' gutterBottom>Services</Typography>
          <UserServices userId={id}/>
        </Grid>
      </Grid>
    </Box>
  </Container>
  
  );
};

export default ProfilePage;
