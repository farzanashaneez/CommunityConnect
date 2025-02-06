import { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Box,
  CardMedia,
} from "@mui/material";
import { LineChart, Line } from "recharts";
import { getDashboardData } from "../../services/api";
import { Service, ServiceRequest } from "../../interfaces/communityInterfaces";
import { PostProps } from "../../components/postComponents/Post";
import { User } from "../../types/User";
import { useNavigate } from "react-router-dom";
import { Event } from "../../components/communityInterfaces";

// Mock data for the line charts
const mockChartData = Array.from({ length: 10 }, (_,_i) => ({
  value: Math.random() * 100,
}));
interface DashboardData {
  totalApartments: number;
  occupiedApartments: number;
  totalResidents: number;
  recentUsers: User[];
  recentServices: Service[];
  recentEvents: Event[];
  recentPosts: PostProps['post'][];
  recentServiceRequests: ServiceRequest[];
}
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalApartments: 0,
    occupiedApartments: 0,
    totalResidents: 0,
    recentUsers: [],
    recentServices: [],
    recentEvents: [],
    recentPosts: [],
    recentServiceRequests: [],
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Metrics Section */}
     
        <Grid container spacing={2} sx={{ flexWrap: "nowrap", overflowX: "auto" }}>
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Total Apartments
        </Typography>
        <Typography variant="h3" component="div" sx={{ mb: 2 }}>
          {dashboardData.totalApartments}
        </Typography>
        <Box sx={{ height: 60 }}>
          <LineChart width={200} height={60} data={mockChartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </Box>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Occupied
              </Typography>
              <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                {dashboardData.occupiedApartments}
              </Typography>
              <Box sx={{ height: 60 }}>
                <LineChart width={200} height={60} data={mockChartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total residents
              </Typography>
              <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                {dashboardData.totalResidents}
              </Typography>
              <Box sx={{ height: 60 }}>
                <LineChart width={200} height={60} data={mockChartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
</Grid>

        {/* New Residents Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper" }}>
            <CardContent>
              <div className="flex items-center justify-between">
                {" "}
                <Typography variant="h6" gutterBottom>
                  New Residents
                </Typography>
                <Button
                  onClick={() => {
                    navigate("/admin/users");
                  }}
                  className="font-semibold "
                >
                  see all
                </Button>
              </div>

              <List sx={{ maxHeight: 250, overflow: "auto" }}>
                {dashboardData.recentUsers.map((user) => (
                  <ListItem key={user._id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={user.imageUrl || "/placeholder.svg"} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.firstName || user.email}
                      secondary={`Apartment ${
                        user.apartmentId?.buildingSection || "N/A"
                      }-${user.apartmentId?.apartmentNumber || "N/A"}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Events Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper" }}>
            <CardContent>
              <div className="flex items-center justify-between">
                {" "}
                <Typography variant="h6" gutterBottom>
                  Events
                </Typography>
                <Button
                  onClick={() => {
                    navigate("/admin/events");
                  }}
                  className="font-semibold "
                >
                  see all
                </Button>
              </div>
              <Grid
                container
                spacing={2}
                sx={{ maxHeight: 250, overflow: "auto" }}
              >
                {dashboardData.recentEvents.map((event) => (
                  <Grid item xs={6} sm={3} md={6} lg={4}  key={event._id}>
                    <Card sx={{ display: "flex",flexDirection:"column", alignItems: "center", p: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ width:'100%', height: 100, borderRadius: 1 }}
                        image={event.imageUrl || "/placeholder.svg"}
                        alt={event.name || "Event"}
                      />
                      <CardContent sx={{ p: 0 }}>
                        <Typography variant="body2" fontWeight="light">
                          {`${event.name.slice(0,12)}` || "Unnamed Event"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Management Section */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "background.paper" }}>
            <CardContent>
             
              <div className="flex items-center justify-between">
                {" "}
                <Typography variant="h6" gutterBottom>
                Services
              </Typography>
                <Button
                  onClick={() => {
                    navigate("/admin/services");
                  }}
                  className="font-semibold "
                >
                  see all
                </Button>
              </div>
              <Box sx={{ display: "flex", overflowX: "auto", gap: 2 ,paddingY:'2px',marginTop:'5px'}}>
                {dashboardData.recentServices.map((service) => (
                  <Card key={service._id} sx={{ minWidth: 180,display:'flex',flexDirection:'column',alignItems:'center' }}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={service.imageUrl || "/placeholder.svg"}
                      alt={service.name || "Service"}
                      sx={{maxHeight:'100px', width:'auto'}}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">
                        {service.name || "Unnamed Service"}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Posts Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper" }}>
            <CardContent>
            
              <div className="flex items-center justify-between">
                {" "}
                <Typography variant="h6" gutterBottom>
                Posts
              </Typography>
                <Button
                  onClick={() => {
                    navigate("/admin/posts");
                  }}
                  className="font-semibold "
                >
                  see all
                </Button>
              </div>
              <List sx={{ maxHeight: 250, overflow: "auto" }}>
                {dashboardData.recentPosts.slice(0, 4).map((post) => (
                  <ListItem key={post._id}>
                    <ListItemAvatar>
                      <Avatar
                        src={post.images?.[0] || "/placeholder.svg"}
                        alt="X"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${
                        post.content?.substring(0, 20) || "No content"
                      }...`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Service Request Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Requests
              </Typography>
              <List sx={{ maxHeight: 250, overflow: "auto" }}>
                {dashboardData.recentServiceRequests
                  .slice(0, 4)
                  .map((request) => (
                    <ListItem key={request._id}>
                      <ListItemAvatar>
                        <Avatar
                          src={request.serviceId?.imageUrl || "/placeholder.svg"}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${request.serviceId.name} `}
                        secondary={`requested by ${
                          request.requestId?.firstName || "Unknown"
                        } `}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
