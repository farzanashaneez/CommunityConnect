import {  Box, Typography, Divider } from "@mui/material";

import CustomSnackbar from "../../components/customSnackbar";
import { useSnackbar } from "../../hooks/useSnackbar";
import AnnouncementList from "../../components/AnnouncementList";


const Announcements: React.FC = () => {
  const { snackbar, hideSnackbar } = useSnackbar();

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Announcements
      </Typography>

      <Divider sx={{ mb: 3 }} />
      <Box>
        <AnnouncementList isAdmin={false} />
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </Box>
  );
};

export default Announcements;
