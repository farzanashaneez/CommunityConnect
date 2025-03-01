import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Grid, 
  Divider 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';

import { useLocation } from 'react-router-dom';
import { confirmBooking, getAllBookingOfUser } from '../../services/api';
import { useAppSelector } from '../../hooks/reduxStoreHook';

 interface Booking {
    _id?: string;
    hallId: string;
    userId: string;
    otherServiceAdded: boolean;
    selectedSlot:any;
    selectedDate: Date;
    purpose:string;
    stripeSessionId:string;
    status: 'pending' | 'confirmed' | 'cancelled';
    totalPrice: number;
    paid:number;
    createdAt:Date;
}
const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const location = useLocation();
  const userState = useAppSelector((state) => state.user);
  const id = userState?.currentUser?.user?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookingOfUser(id);

        setBookings(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const bookingId = new URLSearchParams(location.search).get('booking_id');
    if (bookingId) {
      const updateBookingStatus = async () => {
        try {
          await confirmBooking(bookingId);
          // Refetch bookings to get the updated list
          const response = await getAllBookingOfUser(id);
          setBookings(response);
        } catch (err) {
          setError('Failed to update booking status');
        }
      };
      updateBookingStatus();
    }
  }, [location]);
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
return (
    <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      My Bookings
    </Typography>
    {bookings ? (
      bookings?.map((booking) => (
        <BookingListItem key={booking._id} booking={booking} />
      ))
    ) : (
      <Typography>No bookings found.</Typography>
    )}
  </Box>

  );
 
  
};

const BookingListItem: React.FC<{ booking: Booking }> = ({ booking }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'error';
        default: return 'default';
      }
    };

    return (
      <Card 
        sx={{ 
          mb: 2, 
          boxShadow: 3,
          backgroundColor: booking.status === 'confirmed' ? '#e6f5e6' : 'white'
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                Booking #{booking?._id?.slice(-6)}
              </Typography>
              <Chip 
                label={booking.status} 
                color={getStatusColor(booking.status)} 
                size="small" 
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'left' }}>
              <Typography variant="body1" color="primary.main">
                Hall: {booking.selectedSlot.hallId.name}
              </Typography>
            </Grid>
          </Grid>
  
          <Divider sx={{ my: 2 }} />
  
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  {booking.selectedSlot.title} Slot
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {new Date(booking.selectedSlot.start).toLocaleString()} - 
                  {new Date(booking.selectedSlot.end).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  Purpose: {booking.purpose}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  Total: ${booking.totalPrice} | Paid: ${booking.paid}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
export default BookingHistory;
