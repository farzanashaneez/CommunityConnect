import {
  Box,
  Button,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import EventList from "../../components/EventList";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageCropper from "../../components/ImageCropper"; // Ensure you have this component
import { createEventApi } from "../../services/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useCommunityContext } from "../../context/communityContext";
import CustomSnackbar from "../../components/customSnackbar";


const AdminEvents: React.FC = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [imageSrc, setImageSrc] = useState<string | null>(null);


  const { addCompleted } = useCommunityContext();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      imageUrl: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      date: Yup.string().required("Date is required"),
      location: Yup.string().required("Location is required"),
      imageUrl: Yup.string()
        .required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.title);
      formData.append("description", values.description);
      formData.append("date", new Date(values.date).toISOString());
            formData.append("location", values.location);

      if (values.imageUrl) {
        const fileName = `cropped-image-${Date.now()}.jpeg`; // Define a unique filename
        const file = new File([values.imageUrl], fileName, {
          type: "image/jpeg",
        });

        formData.append("imageUrl",file);
      }

      try {
       
        await createEventApi(formData);
        addCompleted("event");
        setCroppedImage(null);
        setAddDialogOpen(false);
        resetForm();
      } catch (error) {
        showSnackbar("Error creating service", "error");
      }
    },
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("imageUrl", file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result.toString());
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback(
    (croppedBlob: Blob) => {


      const croppedImageURL = URL.createObjectURL(croppedBlob);
      console.log("cropped blob", croppedBlob);
      setCroppedImage(croppedImageURL);
      setIsCropping(false);

      // formik.setFieldValue('image', file);
    },
    [formik]
  );

  const handleCancel = () => {
    setIsCropping(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Admin Events
      </Typography>
      <Divider />

      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={() => setAddDialogOpen(true)}
      >
        Add New Event
      </Button>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            flex: 1,
            height: "100vh",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#ffffff",
            mb: 5,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
          }}
        >
          <EventList isAdmin={true} />
        </Box>
      </Box>
      <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={hideSnackbar}
        />
      <Dialog open={isAddDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="title"
            variant="outlined"
            fullWidth
            {...formik.getFieldProps("title")}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
            {...formik.getFieldProps("description")}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...formik.getFieldProps("date")}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            fullWidth
            {...formik.getFieldProps("location")}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            sx={{ mb: 2 }}
          />
          <Box sx={{ padding: 4, textAlign: "center" }}>
            {!isCropping ? (
              <>
                {!croppedImage && (
                  <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Upload and Crop an Image
                  </Typography>
                )}
                {croppedImage && (
                  <Box sx={{ marginTop: 0 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      Cropped Image Preview:
                    </Typography>
                    <img
                      src={croppedImage}
                      alt="Cropped"
                      style={{
                        maxWidth: "30%",
                        display: "block",
                        margin: "0 auto",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2"
                />
                {formik.touched.imageUrl && formik.errors.imageUrl && (
                  <Typography color="error">
                    {formik.errors.imageUrl as string}
                  </Typography>
                )}
              </>
            ) : (
              <ImageCropper
                imageSrc={imageSrc!}
                onCropComplete={handleCropComplete}
                onCancel={handleCancel}
              />
            )}
          </Box>

          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Event
          </Button>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminEvents;
