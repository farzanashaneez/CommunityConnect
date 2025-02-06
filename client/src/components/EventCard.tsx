// EventCard.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteEventApi, updateEventApi } from "../services/api";
import { useSnackbar } from "../hooks/useSnackbar";
import CustomSnackbar from "./customSnackbar";
import { useCommunityContext } from "../context/communityContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MapComponent from "./map/GoogleMap";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  imageUrl: string;
  status: string;
  location: { lat: number; lng: number };
}

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
}
export const getEventStatus = (eventDate: string) => {
  const now = new Date();
  const date = new Date(eventDate);

  if (date > now) {
    return "Scheduled";
  } else if (date.toDateString() === now.toDateString()) {
    return "Ongoing";
  } else {
    return "Completed";
  }
};

const EventCard: React.FC<EventCardProps> = ({ event, isAdmin = false }) => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { deleteService, updateService } = useCommunityContext();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [selectedPlaceName, setSelectedPlaceName] = useState("");

  const handlePlaceSelected = (placeName: string) => {
    setSelectedPlaceName(placeName); // Set the selected place name
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEventApi(id);
      showSnackbar("Event deleted successfully", "success");
      deleteService(id, "event");
    } catch (error) {
      console.error("Error deleting event:", error);
      showSnackbar("Failed to delete event.", "error");
    }
  };

  const handleEditSubmit = async (values: Event) => {
    console.log("edit update");
    try {
      console.log("values", values);
      const updatedEvent = await updateEventApi(values._id, values);
      updateService(updatedEvent, "event");
      showSnackbar("Event updated successfully", "success");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      showSnackbar("Failed to update event.", "error");
    }
  };

  const handleEdit = () => setEditDialogOpen(true);
  const handleDetailsOpen = () => setDetailsDialogOpen(true);
  const handleDetailsClose = () => setDetailsDialogOpen(false);

  return (
    <>
      <Card
        onClick={handleDetailsOpen}
        sx={{
          mb: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: { xs: "100%", sm: "300px" },
          position: "relative",
          cursor: "pointer",
        }}
      >
        {isAdmin && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: "8px",
            }}
          >
            <IconButton
              aria-label="edit"
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(event._id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        {event.imageUrl && (
          <CardMedia
            component="img"
            sx={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              mt: 2,
              mb: 0,
            }}
            image={event.imageUrl}
            alt={event.name}
          />
        )}

        <CardContent
          sx={{ width: "100%", textAlign: "center", height: "auto",display:'flex',flexDirection:'column',alignItems:'center' }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0 }}>
            {event.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 0,
              width: "80%",
              maxHeight: "60px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              textAlign:'center'
            }}
          >
            {event.description}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0 }}>
            Date:{" "}
            {new Date(event.date).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0 }}>
            Status: {getEventStatus(event.date)}
          </Typography>
        </CardContent>
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={hideSnackbar}
        />
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onClose={handleDetailsClose}>
        
      
        <DialogTitle
          sx={{ fontWeight: "700", fontSize: "25px", margin: "auto" }}
        >
          {event.name}
        </DialogTitle>
        <DialogContent>
          {event.imageUrl && (
            <CardMedia
              component="img"
              sx={{
                width: "auto",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                margin: "auto",
                mb: 2,
              }}
              image={event.imageUrl}
              alt={event.name}
            />
          )}
          <Typography variant="body1" gutterBottom>
            {event.description}
          </Typography>
          <Typography variant="body2" sx={{my:2}}>
            Date:{" "}
            {new Date(event.date).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {/* <Typography variant="body2">Location: {selectedPlaceName}</Typography> Show selected place */}
        <MapComponent 
          center={{ lat: event.location.lat, lng: event.location.lng }} 
          markers={[{ lat: event.location.lat, lng: event.location.lng }]} 
          onPlaceSelected={handlePlaceSelected} // Pass the handler to MapComponent
        />
        <Typography variant="body1" >
            {selectedPlaceName}
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <Formik
          initialValues={{
            ...event,
            date: event.date.split("T")[0],
            location: event.location || { lat: null, lng: null },
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            description: Yup.string().required("Description is required"),
            date: Yup.string().required("Date is required"),
            imageUrl: Yup.string().url("Must be a valid URL"),
            location: Yup.object()
              .shape({
                lat: Yup.number().required("Latitude is required"),
                lng: Yup.number().required("Longitude is required"),
              })
              .required("Location is required"),
          })}
          onSubmit={(values) => handleEditSubmit(values)}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <DialogContent>
                <TextField
                  name="name"
                  label="Name"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="date"
                  label="Date"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={values.date}
                  onChange={handleChange}
                  error={touched.date && Boolean(errors.date)}
                  helperText={touched.date && errors.date}
                  sx={{ mb: 2 }}
                />

                {/* Map Component */}
                <MapComponent
                  center={{
                    lat: values.location.lat || 24.2232,
                    lng: values.location.lng || 55.7229,
                  }}
                  markers={
                    values.location.lat && values.location.lng
                      ? [{ lat: values.location.lat, lng: values.location.lng }]
                      : []
                  }
                  onMapClick={(e) => {
                    const lat = e.latLng?.lat() || 0;
                    const lng = e.latLng?.lng() || 0;
                    setFieldValue("location", { lat, lng });
                  }}
                />

                {/* Validation Errors for Location */}
                {touched.location && errors.location && (
                  <Typography color="error" variant="body2">
                    {errors.location.lat || errors.location.lng}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default EventCard;
