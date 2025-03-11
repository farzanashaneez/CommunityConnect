import { IconButton, InputBase, Box, Typography, Divider } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, styled } from "@mui/material/styles";
import CustomSnackbar from "../../components/customSnackbar";
import { useSnackbar } from "../../hooks/useSnackbar";
import EventList from "../../components/EventList";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: "8px",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));
const Events: React.FC = () => {
  const { snackbar, hideSnackbar } = useSnackbar();
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Events
      </Typography>

      <Divider sx={{ mb: 3 }} />
      <Box>
        <EventList isAdmin={false} />
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

export default Events;
