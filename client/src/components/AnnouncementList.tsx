import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import AnnouncementCard from "./AnnouncementCard";
import { fetchAllAnnouncements } from "../services/api";
import { AnnouncementListProps ,Announcement} from "./communityInterfaces";
import { useCommunityContext } from "../context/communityContext";

const AnnouncementList: React.FC<AnnouncementListProps> = ({isAdmin=false,searchTerm='',update}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { completed, setCompleted } = useCommunityContext();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const fetchedAnnouncements = await fetchAllAnnouncements();
        setAnnouncements(fetchedAnnouncements);
        setCompleted(false)
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [completed]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={2}>
      {announcements.map((announcement) => (
        <Grid key={announcement._id} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 4, md: 2 }}>
          <AnnouncementCard announcement={announcement} isAdmin={isAdmin} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AnnouncementList;
