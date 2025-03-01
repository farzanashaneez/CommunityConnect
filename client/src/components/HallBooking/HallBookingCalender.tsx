import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllavailableSlot } from '../../services/api';

const localizer = momentLocalizer(moment);

interface Slot {
  id: number;
  title: string;
  start: Date;
  end: Date;
  slotType: 'HD-morning' | 'HD-evening' | 'Fullday';
  isAvailable:boolean
}

const HallBookingCalendar:React.FC = () => {
  const [events, setEvents] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [slotDetails, setSlotDetails] = useState<Slot | null>(null);

  useEffect(() => {
    // Fetch available slots from API
    const fetchAvailableSlots = async () => {
    
const numberOfDays = 30; 
const slots=await getAllavailableSlot(numberOfDays,'123')
      setEvents(slots);
    };
    fetchAvailableSlots();
  }, []);

  
  const handleSelectSlot = (slotInfo: SlotInfo) => {

    const selectedDate = new Date(slotInfo.start);
    setSelectedDate(selectedDate);
    const slotsForSelectedDate = events.filter(event =>
      moment(event.start).isSame(selectedDate, 'day')
    );
    setAvailableSlots(slotsForSelectedDate);
    setSlotDetails(null); // Reset slot details when selecting a new date
  };

  const handleBookSlot = (slot: Slot) => {
    // Update events to remove booked slot
    setEvents(events.filter(event => event.id !== slot.id));
    setSelectedDate(null);
    setAvailableSlots([]);
    setSlotDetails(null); // Reset slot details after booking
  };

  const handleSlotDetails = (slot: Slot) => {
    setSlotDetails(slot);
    // You can display more information about the selected slot here
    // For example:
    alert(`Slot Type: ${slot.slotType}\nTime Range: ${moment(slot.start).format('hh:mm A')} - ${moment(slot.end).format('hh:mm A')}`);
  };

  const eventStyleGetter = (event: Slot) => {
    let style = {
      backgroundColor: '#3174ad',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    switch (event.slotType) {
      case 'HD-morning':
        style.backgroundColor = '#4CAF50';
        break;
      case 'HD-evening':
        style.backgroundColor = '#FFC107';
        break;
      case 'Fullday':
        style.backgroundColor = '#2196F3';
        break;
      default:
        break;
    }

    return { style };
  };
  const handleSelectEvent = (event: Slot) => {
    setSelectedDate(event.start);
    setAvailableSlots([event]);
    setSlotDetails(event);
  };
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "800px",width:'60%',margin:'auto' }}
        eventPropGetter={eventStyleGetter}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
      />
      {selectedDate && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Available Slots for {moment(selectedDate).format("MMMM Do YYYY")}</h3>
          {availableSlots.length > 0 ? (
            availableSlots.map(slot => (
              <div key={slot.id} style={{ marginBottom: "10px" }}>
                <button onClick={() => handleBookSlot(slot)} style={{ marginRight: "10px" }}>
                  Book {slot.slotType}
                </button>
                <button onClick={() => handleSlotDetails(slot)}>
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No slots available for this date.</p>
          )}
        </div>
      )}
      {slotDetails && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h4>Selected Slot Details</h4>
          <p>Type: {slotDetails.slotType}</p>
          <p>Time Range: {moment(slotDetails.start).format("hh:mm A")} - {moment(slotDetails.end).format("hh:mm A")}</p>
          <p>Date: {moment(slotDetails.start).format("MMMM Do YYYY")}</p>
        </div>
      )}
    </div>
  );
};

export default HallBookingCalendar;
