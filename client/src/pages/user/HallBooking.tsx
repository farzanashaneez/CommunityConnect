import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  bookAHall,
  fetchUserDetails,
  getAllHall,
  getAllavailableSlot,
  handleStripePayment,
} from "../../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { User } from "../../types/User";
import { useAppSelector } from "../../hooks/reduxStoreHook";

const localizer = momentLocalizer(moment);

export interface Hall {
  _id: string;
  name: string;
  capacity: number;
  images: string[];
  details: string;
  price: {
    morning: number;
    evening: number;
    fullDay: number;
  };
}

export interface Slot {
  id: number;
  title: string;
  start: Date;
  end: Date;
  slotType: "HD-morning" | "HD-evening" | "Fullday";
  slotPrice: number;
  isAvailable: boolean;
}

interface BookingFormData {
  name: string;
  email: string;
  purpose: string;
}

const HallBookingPage: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [events, setEvents] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userBooking, setUserBooking] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: "",
    email: "",
    purpose: "",
  });
  const userState = useAppSelector((state) => state.user);
  const id = userState?.currentUser?.user?.id;
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch halls data
    const fetchHalls = async () => {
      // Replace this with your actual API call
      const response = await getAllHall();

      setHalls(response);
    };
    fetchHalls();
  }, []);

  useEffect(() => {
    if (selectedHall) {
      const fetchAvailableSlots = async () => {
        const numberOfDays = 30;
        const slots = await getAllavailableSlot(numberOfDays, selectedHall._id);
        setEvents(slots);
      };
      const fetchuser = async () => {
        const user = await fetchUserDetails(id);
        setUserBooking(user);
        setBookingForm((prev) => ({
          ...prev,
          email: user.email,
          name: user.firstName,
        }));
      };
      fetchAvailableSlots();
      fetchuser();
    }
  }, [selectedHall]);

  const handleSelectHall = (hall: Hall) => {
    setSelectedHall(hall);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleSelectEvent = (event: Slot) => {
    setSelectedSlot(event);
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setBookingForm({ name: "", email: "", purpose: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookSlot = async () => {
    console.log("Booking submitted:", {
      ...bookingForm,
      hall: selectedHall,
      slot: selectedSlot,
    });
    const bookindData = {
      userId: id,
      totalPrice: selectedSlot?.slotPrice,
      paid: 0,
      purpose: bookingForm.purpose,
    };
    setIsBooking(true);
    try {
      await handleStripePayment(bookindData, {
        ...selectedSlot,
        status: "booked",
      });
      // const resp = await bookAHall(bookindData, selectedSlot);
      // console.log("response booking",resp)
    } catch (err) {
      console.log("bookin error");
      setIsBooking(false);
    }

    setEvents(events.filter((event) => event.id !== selectedSlot?.id));
    handleCloseBookingForm();
  };

  const eventStyleGetter = (event: Slot) => {
    let style = {
      backgroundColor: "#3174ad",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };

    switch (event.slotType) {
      case "HD-morning":
        style.backgroundColor = "#4CAF50";
        break;
      case "HD-evening":
        style.backgroundColor = "#FFC107";
        break;
      case "Fullday":
        style.backgroundColor = "#2196F3";
        break;
    }

    return { style };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 2,
      mr: 5,
      flexDirection: isSmallScreen ? 'column' : 'row'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontSize: {
            xs: '1.5rem',
            sm: '1.8rem',
            md: '2.125rem'
          }
        }}
      >
        Available Halls
      </Typography>
      <Button 
        variant="text"  
        href="/hallbooking/history"
        sx={{
          fontSize: {
            xs: '16px',
            sm: '18px',
            md: '20px'
          },
          mt: isSmallScreen ? 2 : 0
        }}
      >
        Booking History
      </Button>
    </Box>
      <Grid container spacing={3}>
        {halls.map((hall) => (
          <Grid item xs={12} sm={6} md={4} key={hall._id}>
            <Card>
              <CardActionArea onClick={() => handleSelectHall(hall)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={hall.images[0]}
                  alt={hall.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {hall.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {hall.capacity} persons
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Hall Details Dialog */}
      <Dialog
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedHall?.name}</DialogTitle>
        <DialogContent>
          {selectedHall && (
            <Box>
              <img
                src={selectedHall.images[0]}
                alt={selectedHall.name}
                style={{ width: "100%", marginBottom: 16 }}
              />
              <Typography variant="body1" paragraph>
                {selectedHall.details}
              </Typography>
              <Typography variant="body2">
                Capacity: {selectedHall.capacity} persons
              </Typography>
              <Typography variant="body2">
                Morning Price: ${selectedHall.price.morning}
              </Typography>
              <Typography variant="body2">
                Evening Price: ${selectedHall.price.evening}
              </Typography>
              <Typography variant="body2">
                Full Day Price: ${selectedHall.price.fullDay}
              </Typography>

              <Box sx={{ mt: 3, height: 500 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  selectable
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Form Dialog */}
      <Dialog open={isBookingFormOpen} onClose={handleCloseBookingForm}>
        <DialogTitle>Book Slot</DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <Box mb={2}>
              <Typography variant="body2">
                Selected Slot:{" "}
                {moment(selectedSlot.start).format("MMMM Do YYYY, h:mm a")} -{" "}
                {moment(selectedSlot.end).format("h:mm a")}
              </Typography>
              <Typography variant="body2">
                Type: {selectedSlot.slotType}
              </Typography>
              <Typography variant="body2">
                Price:{" "}
                {selectedSlot.slotType === "HD-morning" &&
                  selectedHall?.price["morning"]}
                {selectedSlot.slotType === "HD-evening" &&
                  selectedHall?.price["evening"]}
                {selectedSlot.slotType === "Fullday" &&
                  selectedHall?.price["fullDay"]}
              </Typography>
            </Box>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={userBooking?.firstName}
            // onChange={handleInputChange}
            disabled={true}
          />
          <TextField
            margin="dense"
            name="email"
            label="Your Email"
            type="email"
            fullWidth
            variant="outlined"
            value={userBooking?.email}
            // onChange={handleInputChange}
            disabled={true}
          />
          <TextField
            margin="dense"
            name="purpose"
            label="Purpose of Booking"
            type="text"
            fullWidth
            variant="outlined"
            value={bookingForm.purpose}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingForm}>Cancel</Button>
          <Button
            onClick={handleBookSlot}
            variant="contained"
            color="primary"
            disabled={isBooking}
          >
            {isBooking ? "Booking..." : "Book Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HallBookingPage;
