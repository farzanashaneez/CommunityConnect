import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import { deleteBooking, getAllBookings } from '../../services/api';

// Define interfaces for type safety
interface Slot {
  _id: string;
  title: string;
  start: Date;
  end: Date;
}

interface Booking {
  _id: string;
  userId: any;
  selectedSlot: Slot;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  paid: number;
  createdAt: Date;
  purpose: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Replace with your actual API call
        const response = await getAllBookings()
        setBookings(response);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };

    fetchBookings();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      // Add your delete API call here
      await deleteBooking(bookingId)
      
      // Remove the deleted booking from the state
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      setSnackbar({
        open: true,
        message: 'Booking deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete booking',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bookings
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>#{booking._id.slice(-6)}</TableCell>
                  <TableCell>
                    {new Date(booking.selectedSlot.start).toLocaleDateString('en-US')}
                  </TableCell>
                  <TableCell>{booking?.userId?.firstName}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${booking.totalPrice}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewBooking(booking)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteBooking(booking._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog for Booking Details */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle>
              Booking Details #{selectedBooking._id.slice(-6)}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={selectedBooking.status}
                      color={getStatusColor(selectedBooking.status)}
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Booked on: {new Date(selectedBooking.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>{selectedBooking.selectedSlot.title} Slot</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {new Date(selectedBooking.selectedSlot.start).toLocaleString()} -
                      {new Date(selectedBooking.selectedSlot.end).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Purpose: {selectedBooking.purpose}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Total: ${selectedBooking.totalPrice} | Paid: ${selectedBooking.paid}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {/* Optionally add a delete button here */}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminBookings;
