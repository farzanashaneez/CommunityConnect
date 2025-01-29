import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from '@mui/material';
import { fetchHallDetails, fetchAllSlots, updateSlotStatus } from '../../services/api';

const localizer = momentLocalizer(moment);

interface Hall {
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

interface Slot {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  slotType: 'HD-morning' | 'HD-evening' | 'Fullday';
  slotPrice: number;
  status: 'available' | 'booked' | 'notavailable' |'cancelled';
  bookingDetails?: {
    userId: string;
    purpose: string;
  };
}

const AdminHallAvailabilityPage: React.FC = () => {
  const { hallid } = useParams<{ hallid: string }>();
  const [hall, setHall] = useState<Hall | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (hallid) {
        const hallData = await fetchHallDetails(hallid);
        setHall(hallData);
        const slotsData = await fetchAllSlots(hallid);
        setSlots(slotsData);
      }
    };
    fetchData();
  }, [hallid]);

  const handleSelectEvent = (event: Slot) => {
    setSelectedSlot(event);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedSlot(null);
  };

  const handleUpdateSlotStatus = async (newStatus: 'available' | 'notavailable' | 'cancelled') => {
    if (selectedSlot && selectedSlot._id) {
      try {
        await updateSlotStatus(selectedSlot._id, newStatus);
        setSlots(slots.map(slot => 
          slot._id === selectedSlot._id ? { ...slot, status: newStatus } : slot
        ));
        handleCloseDetails();
      } catch (error) {
        console.error('Failed to update slot status:', error);
      }
    }
  };

  const eventStyleGetter = (event: Slot) => {
    let style: React.CSSProperties = {
      backgroundColor: '#3174ad',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    switch (event.status) {
      case 'available':
        style.backgroundColor = '#4CAF50';
        break;
      case 'booked':
        style.backgroundColor = 'red';
        break;
      case 'notavailable':
        style.backgroundColor = '#F44336';
        break;
    }

    return { style };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hall Availability Management: {hall?.name}
      </Typography>
      
      <Box sx={{ mt: 3, height: 600 }}>
        <Calendar
          localizer={localizer}
          events={slots}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          selectable
        />
      </Box>

      <Dialog open={isDetailsOpen} onClose={handleCloseDetails} fullWidth maxWidth="sm">
        <DialogTitle>Slot Details</DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <Box>
              <Typography variant="body1">
                Time: {moment(selectedSlot.start).format('MMMM Do YYYY, h:mm a')} - 
                {moment(selectedSlot.end).format('h:mm a')}
              </Typography>
              <Typography variant="body1">
                Type: {selectedSlot.slotType}
              </Typography>
              <Typography variant="body1">
                Price: ${selectedSlot.slotPrice}
              </Typography>
              <Typography variant="body1">
                Status: <Chip label={selectedSlot.status} color={
                  selectedSlot.status === 'available' ? 'success' :
                  selectedSlot.status === 'booked' ? 'warning' : 'error'
                } />
              </Typography>
              {selectedSlot.status === 'booked' && selectedSlot.bookingDetails && (
                <>
                  <Typography variant="body1">
                    Booked by: {selectedSlot.bookingDetails.userId}
                  </Typography>
                  <Typography variant="body1">
                    Purpose: {selectedSlot.bookingDetails.purpose}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedSlot?.status === 'booked' && (
            <Button onClick={() => handleUpdateSlotStatus('cancelled')} color="error">
              Cancel Booking
            </Button>
          )}
          {/* {selectedSlot?.status !== 'booked' && (
            <Button onClick={() => handleUpdateSlotStatus(selectedSlot?.status === 'available' ? 'notavailable' : 'available')} color="primary">
              Mark as {selectedSlot?.status === 'available' ? 'Not Available' : 'Available'}
            </Button>
          )} */}
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminHallAvailabilityPage;
