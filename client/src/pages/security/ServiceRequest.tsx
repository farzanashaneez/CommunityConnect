import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";
import TextButton from "../../components/TextButton";
import { useCommunityContext } from "../../context/communityContext";
import {
  getAllRequestedServices,
  markAsCompleted,
} from "../../services/api";
import { Service } from "../../interfaces/communityInterfaces";
import { socket } from "../../services/socketConnection";

const ServiceRequest: React.FC = () => {

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
       Service Requests
      </Typography>
    
      <Divider sx={{ my: 1 }} />
     <LocalServicesTab />
    </Box>
  );
};

const LocalServicesTab = () => {
  // const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { completed, setCompleted } = useCommunityContext();
  const [serviceRequstArray, setServiceRequstArray] = useState<Service[]>([]);
  const [updatelist, setUpdatelist] = useState(0);

  useEffect(()=>{
      socket.on("reload", (data) => {
          setUpdatelist((p) => p + 1);
          if (data === "servicerequest") {
            setUpdatelist((p) => p + 1);
          }
        });
        return (()=>{
          socket.off("reload");
        })
      },[])

  const [serviceRequstCompletedArray, setServiceRequstCompletedArray] =
    useState<Service[]>([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await getAllRequestedServices("pending");
        setServiceRequstArray(response);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    const fetchCompletedService = async () => {
      try {
        const response = await getAllRequestedServices("completed");
        setServiceRequstCompletedArray(response);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchService();
    fetchCompletedService();
    setCompleted(false);
  }, [completed,updatelist]);

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
          Local Service Request
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
            maxHeight:'70vh'
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
                    image={item?.serviceId?.imageUrl}
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
                        {item.serviceId?.name}
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
                    image={item?.serviceId?.imageUrl}
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
                        {item.serviceId?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: "400" }}>
                        Requested by
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        {item.requestId.apartmentId.buildingSection}-
                        {item.requestId.apartmentId.apartmentNumber || "NA"}
                      </Typography>

                      <Box
                        sx={{ display: "flex", flexDirection: "column", ml: 1 }}
                      >
                          
                      </Box>
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



export default ServiceRequest;
