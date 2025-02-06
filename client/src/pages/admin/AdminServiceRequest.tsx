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

import {
  getFilteredServices,
  grantServiceApi,
  rejectServiceApi,
} from "../../services/api";
import { Service } from "../../interfaces/communityInterfaces";
import ConfirmationDialog from "../../components/ConfirmationDialogue";

const AdminServiceRequest: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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
      {tabValue === 0 && <ResidentialServicesTab />}
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
