import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";
import TextButton from "../../components/TextButton";
import { useSnackbar } from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/customSnackbar";
import { useCommunityContext } from "../../context/communityContext";
import { useAppSelector } from "../../hooks/reduxStoreHook";

const AdminServiceRequest: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Admin Service Requests
      </Typography>
      <Divider />
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Local Service Request" />
        <Tab label="Residential Service Request" />
      </Tabs>
      <Divider sx={{ my: 1 }} />
      {tabValue === 0 && <LocalServicesTab />}
      {tabValue === 1 && <ResidentialServicesTab />}
    </Box>
  );
};

const LocalServicesTab = () => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { completed, setCompleted } = useCommunityContext();
  const adminState = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (completed) {
      console.log("community triggered.....");
      setCompleted(false);
    }
  }, [completed, setCompleted]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: "0", md: "16px" },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Local Service Requests
        </Typography>
        <Box
          sx={{
            height: "auto",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#ffffff",
            mb: 5,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ display: "flex", height: "100%" }}>
                  <CardMedia
                    component="img"
                    sx={{ width: "75px", height: "75px", ml: 1, mt: 1 }}
                    image="/src/assets/logo1.png"
                    alt="Service"
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                      <Typography variant="body1">Service Name</Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: "400" }}>
                          requested by
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "800" }}>
                          F2-121
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 3,
                        ml: -9,
                      }}
                    >
                      <Typography variant="body2">Pending</Typography>
                      <TextButton label="Done" color="secondary" />
                      <Typography variant="body2">Completed</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </Box>
  );
};

const ResidentialServicesTab = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: "0", md: "16px" },
      }}
    >
      <Box sx={{ flex: 1, mr: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Residential Service Requests
        </Typography>
        <Box
          sx={{
            height: "100vh",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#ffffff",
            mb: 5,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 1,
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: "80px", height: "80px" }}
                    image="/src/assets/logo2.png"
                    alt="Service"
                  />
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: "800" }}>
                      Service Title
                    </Typography>
                    <Typography variant="body1">f1-230</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <TextButton label="Accept" />
                      <TextButton label="Reject" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminServiceRequest;
