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
  Button,
} from "@mui/material";
import TextButton from "../../components/TextButton";
import { useCommunityContext } from "../../context/communityContext";
import {
  getAllRequestedServices,
  getFilteredServices,
  grantServiceApi,
  markAsCompleted,
  rejectServiceApi,
} from "../../services/api";
import { Service } from "../../interfaces/communityInterfaces";
import ConfirmationDialog from "../../components/ConfirmationDialogue";

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
      
        <Tab label="Residential Service Request" />
      </Tabs>
      <Divider sx={{ my: 1 }} />
      {/* {tabValue === 0 && <LocalServicesTab />} */}
      {tabValue === 0 && <ResidentialServicesTab />}
    </Box>
  );
};

const LocalServicesTab = () => {
  // const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { completed, setCompleted } = useCommunityContext();
  const [serviceRequstArray, setServiceRequstArray] = useState<Service[]>([]);

  const [serviceRequstCompletedArray, setServiceRequstCompletedArray] =
    useState<Service[]>([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getAllRequestedServices("pending");
        setServiceRequstArray(response);
        console.log("response", response, serviceRequstArray);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    const fetchCompletedService = async () => {
      try {
        const response = await getAllRequestedServices("completed");
        setServiceRequstCompletedArray(response);
        console.log("response", response, serviceRequstArray);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchService();
    fetchCompletedService();
    setCompleted(false);
  }, [completed]);

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
            maxHeight:'100vh'
          }}
        >
           {serviceRequstArray.length>0?(<Grid container spacing={2}>
            {serviceRequstArray.map((item: any, index) => (
              <Grid item xs={12} sm={6} md={6} lg={12} xl={6} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#E5E4E2",
                    height: { md: "80px" },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "60px", sm: "60px", md: "30px" },
                      height: { xs: "60px", sm: "60px", md: "30px" },
                      borderRadius: "5%",
                      objectFit: "cover",
                    }}
                    image={item.serviceId.imageUrl}
                    alt="Service"
                  />
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "between",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {item.serviceId.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: "400" }}>
                        Requested by
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        {item.requestId.apartmentId.buildingSection}-
                        {item.requestId.apartmentId.apartmentNumber || "NA"}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <TextButton
                      label="mark as done"
                      color="secondary"
                      onClick={() => {
                        markAsCompleted(item._id);
                        setCompleted(true);
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>):(
            <Box >
              <Typography>
                No recent request found
              </Typography>
            </Box>

          )}
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Completed ServiceRequests
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
            maxHeight:'100vh'

          }}
        >
        <Grid container spacing={2}>
            {serviceRequstCompletedArray.map((item: any, index) => (
              <Grid item xs={12} sm={6} md={6} lg={12} xl={6} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#E5E4E2",
                    height: { md: "60px" },
                    paddingLeft: "5px",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "60px", sm: "60px", md: "30px" },
                      height: { xs: "60px", sm: "60px", md: "30px" },
                      borderRadius: "5%",
                      objectFit: "cover",
                    }}
                    image={item.serviceId.imageUrl}
                    alt="Service"
                  />
                  <CardContent
                    sx={{
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1">
                        {item.serviceId.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "column", ml: 1 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "400" }}>
                          requested by
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "800" }}>
                          {item.requestId.apartmentId.buildingSection +
                            -+item.requestId.apartmentId.apartmentNumber ||
                            "NA"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          
        </Box>
      </Box>
      {/* <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      /> */}
    </Box>
  );
};

const ResidentialServicesTab = () => {
  const [serviceArray, setServiceArray] = useState<Service[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getFilteredServices("pending", "residential");
        setServiceArray(response);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchService();
  }, []);

  const handleDialogOpen = (serviceId: string, type: "accept" | "reject") => {
    setSelectedServiceId(serviceId);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedServiceId(null);
    setActionType(null);
  };

  const handleConfirmAction = async () => {
    if (selectedServiceId && actionType) {
      try {
        if (actionType === "accept") {
          await grantServiceApi(selectedServiceId);
          console.log(`Service ${selectedServiceId} accepted`);
        } else {
          await rejectServiceApi(selectedServiceId);
          console.log(`Service ${selectedServiceId} rejected`);
        }
        setServiceArray(
          serviceArray.filter((service) => service._id !== selectedServiceId)
        );
      } catch (err) {
        console.error(`Error processing action: ${err}`);
      } finally {
        handleDialogClose();
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Residential Service Requests</Typography>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#fff",
          boxShadow: 1,
          borderRadius: 1,
        }}
      >
        <Grid container spacing={2}>
          {serviceArray.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80 }}
                  image={service.imageUrl}
                  alt="Service"
                />
                <CardContent>
                  <Typography variant="body1" sx={{ fontWeight: "800" }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body1">
                    {service.provider?.apartmentId?.buildingSection ?? "N/A"} -{" "}
                    {service.provider?.apartmentId?.apartmentNumber ?? "N/A"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Button
                      onClick={() =>
                        handleDialogOpen(service._id || "", "accept")
                      }
                      sx={{
                        textTransform: "none",
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() =>
                        handleDialogOpen(service._id || "", "reject")
                      }
                      sx={{
                        textTransform: "none",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmAction}
        title={actionType === "accept" ? "Accept Service" : "Reject Service"}
        message={`Are you sure you want to ${actionType} this service request?`}
        confirmText={actionType === "accept" ? "Accept" : "Reject"}
        cancelText="Cancel"
      />
    </Box>
  );
};

export default AdminServiceRequest;
