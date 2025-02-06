import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import EventCard from "./EventCard";
import { getAllEvents } from "../services/api";
import { EventListProps } from "./communityInterfaces";
import { useCommunityContext } from "../context/communityContext";
import { socket } from "../services/socketConnection";

const EventList: React.FC<EventListProps> = ({
  isAdmin = false,
 
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { completed, setCompleted } = useCommunityContext();
  const [updatelist, setUpdatelist] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents();
        setEvents(fetchedEvents);
        setCompleted(false);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    socket.on("reload", (data) => {
      console.log("reload event recieved")
      setUpdatelist((p) => p + 1);

      if (data === "event") {
        setUpdatelist((p) => p + 1);
      }
    });
    return () => {
      socket.off("reload");
    };
  }, [completed, updatelist]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={2}>
      {events.map((event) => (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 6, sm: 4, md: 2 }}
        >
          <EventCard event={event} isAdmin={isAdmin} />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;
