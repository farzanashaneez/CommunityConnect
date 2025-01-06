import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Button, Divider, Avatar, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import { fetchUserDetails } from "../../services/api";

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

const ProfileInfo = styled(Box)({
  marginTop: "70px",
  marginBottom: "20px",
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
      <Card>
        <CoverPhoto>
          <ProfileImage src={user.imageUrl || "/src/assets/defaultProfile.jpg"} />
        </CoverPhoto>
        <CardContent>
          <ProfileInfo>
            <Grid container alignItems="center" spacing={2}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 6 }}>
                <Typography variant="h4" component="h1">
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 6 }} justifyContent="flex-end">
                <Button variant="contained" color="primary">
                  Message
                </Button>
              </Grid>
            </Grid>
          </ProfileInfo>

          <Grid container spacing={3}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Typography variant="body1">Apartment No: {user?.apartmentId?.apartmentNumber||""}</Typography>
                  <Typography variant="body1">Contact: {user.mobileNumber}</Typography>
                  <Typography variant="body1">Email: {user.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, md: 8 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Connections
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6 }}>
                      <Typography variant="body1">Members: {user.members.length}</Typography>
                    </Grid>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6 }}>
                      <Typography variant="body1">Professionals:</Typography>
                      {user.members.map((member, index) => (
                        <Typography variant="body2" key={index}>
                          - {member.profession}: {member.name}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 12px)" } }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body1">
                This is a brief description about {user.firstName} {user.lastName}. It can include personal information,
                interests, or any other relevant details.
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 12px)" } }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Typography variant="body1">
                This section can include any other relevant information about the profile.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
