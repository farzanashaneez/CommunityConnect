import React, { useEffect, useState } from 'react';
import { Paper, Button, Typography, CardContent, CardMedia, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../services/api';
import { getEventStatus } from '../EventCard';

interface Event {
  _id: string;
  name: string;
  date: string;
  imageUrl: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents();
        setEvents(fetchedEvents.slice(0, 6));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Upcoming Events</Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} key={event._id}>
            <Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              {event.imageUrl && (
                <CardMedia
                  component="img"
                  sx={{
                    width: "75%",
                    height: 80,
                    objectFit: "cover",
                   
                  }}
                  image={event.imageUrl}
                  alt={event.name}
                />
              )}
              <CardContent sx={{ width: "100%", textAlign: "center" }}>
              <Typography 
  variant="body2" 
  sx={{ 
    fontWeight: "bold", 
    mb: 0, 
    lineHeight: 1.2, 
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    display: "-webkit-box", 
    WebkitLineClamp: 2, 
    WebkitBoxOrient: "vertical" 
  }}
>
  {event.name}
</Typography>

              </CardContent>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/events')}>
        See More
      </Button>
    </Paper>
  );
}
