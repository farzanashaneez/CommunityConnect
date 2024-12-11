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
import { deleteServiceApi, updateServiceApi } from "../services/api";
import { useSnackbar } from "../hooks/useSnackbar";
import CustomSnackbar from "./customSnackbar";
import { useCommunityContext } from "../context/communityContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ServiceCardProps {
  service: Service;
  type?: "local" | "residential";
  isAdmin: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  type,
  isAdmin = false,
}) => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { deleteService, updateService } = useCommunityContext();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceApi(id);
      showSnackbar("Service deleted successfully", "success");
      deleteService(id);
    } catch (error) {
      console.error("Error deleting service:", error);
      showSnackbar("Failed to delete service.", "error");
    }
  };

  const handleEditSubmit = async (values: Service) => {
    try {
      const updatedService = await updateServiceApi(values._id, values);
      updateService(updatedService); // Update context with new data
      showSnackbar("Service updated successfully", "success");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating service:", error);
      showSnackbar("Failed to update service.", "error");
    }
  };

  const handleEdit = () => setEditDialogOpen(true);
  const handleDetailsOpen = () => setDetailsDialogOpen(true);
  const handleDetailsClose = () => setDetailsDialogOpen(false);

  return (
    <>
      <Card
        onClick={handleDetailsOpen} // Open details popup when card is clicked
        sx={{
          mb: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: { xs: "100%", sm: "300px" },
          position: "relative",
          cursor: "pointer", // Indicate clickable area
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
                e.stopPropagation(); // Prevent triggering card click
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
                e.stopPropagation(); // Prevent triggering card click
                handleDelete(service._id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        {service.imageUrl && (
          <CardMedia
            component="img"
            sx={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              mt: 2,
              mb: 0,
            }}
            image={service.imageUrl}
            alt={service.name}
          />
        )}

        <CardContent sx={{ width: "100%", textAlign: "center", height: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0 }}>
            {service.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 0,
              width: "150px",
              maxHeight: "60px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {service.description}
          </Typography>

          {service.price === 0 ? (
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0 }}>
              Charge: Free
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0 }}>
              Charge: {service.price}-aed
            </Typography>
          )}
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
        <DialogTitle>{service.name}</DialogTitle>
        <DialogContent>
          {service.imageUrl && (
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                mb: 2,
              }}
              image={service.imageUrl}
              alt={service.name}
            />
          )}
          <Typography variant="body1" gutterBottom>
            {service.description}
          </Typography>
          <Typography variant="body2">
            {service.price === 0 ? "Charge: Free" : `Charge: ${service.price}-aed`}
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
        <DialogTitle>Edit Service</DialogTitle>
        <Formik
          initialValues={{
            ...service, // Include _id in initial values
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            description: Yup.string().required("Description is required"),
            price: Yup.number()
              .required("Price is required")
              .min(0, "Price cannot be negative"),
            imageUrl: Yup.string().url("Must be a valid URL"),
          })}
          onSubmit={(values) => handleEditSubmit(values)}
        >
          {({ values, errors, touched, handleChange }) => (
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
                  name="price"
                  label="Price"
                  fullWidth
                  type="number"
                  value={values.price}
                  onChange={handleChange}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  sx={{ mb: 2 }}
                />
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

export default ServiceCard;
