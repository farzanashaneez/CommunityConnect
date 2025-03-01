import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageCropper from "../../components/ImageCropper"; // Ensure this component is available
import { createAnnouncementApi } from "../../services/api"; // Updated API endpoint
import { useSnackbar } from "../../hooks/useSnackbar";
import { useCommunityContext } from "../../context/communityContext";
import CustomSnackbar from "../../components/customSnackbar";
import AnnouncementList from "../../components/AnnouncementList"; // Updated component

const AdminAnnouncements: React.FC = () => {
  // State management
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { addCompleted } = useCommunityContext();

  // Formik setup for managing form state
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      imageUrl: null,
      announcementtype: "", // New field for announcement type
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      imageUrl: Yup.string().required("Image is required"),
      announcementtype: Yup.string().required("Announcement type is required"),
    }),
    onSubmit: async (values, { resetForm }) => {

      try {

        // Prepare form data for API submission
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("announcementtype", values.announcementtype); // Include the new field

        if (values.imageUrl) {
          const fileName = `cropped-image-${Date.now()}.jpeg`;
          const file = new File([values.imageUrl], fileName, {
            type: "image/jpeg",
          });
          formData.append("imageUrl", file);
        }
        // API call
        await createAnnouncementApi(formData);
        addCompleted("announcement");
        showSnackbar("Announcement added successfully", "success");
        setAddDialogOpen(false);
        resetForm();
        setCroppedImage(null);
      } catch (error) {
        console.error("Error adding announcement:", error);
        showSnackbar("Failed to add announcement.", "error");
      }
    },
  });

  // Handle image upload and cropping
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result.toString());
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(file);
      formik.setFieldValue("imageUrl", file);
    }
  };

  const handleCropComplete = useCallback((croppedBlob: Blob) => {
    const croppedImageURL = URL.createObjectURL(croppedBlob);
    setCroppedImage(croppedImageURL);
    setIsCropping(false);
  }, []);

  const handleCancelCrop = () => {
    setIsCropping(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Admin Announcements
      </Typography>
      <Divider />

      {/* Button to add a new announcement */}
      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={() => setAddDialogOpen(true)}
      >
        Add New Announcement
      </Button>

      {/* Announcement list */}
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
          <AnnouncementList isAdmin />
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />

      {/* Dialog for adding a new announcement */}
      <Dialog open={isAddDialogOpen} onClose={() => setAddDialogOpen(false)}>
  <DialogTitle>Add New Announcement</DialogTitle>
  <Box sx={{ p: 3 }}> {/* Added padding here */}
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="Title"
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
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />

      {/* Announcement type dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="announcement-type-label">Announcement Type</InputLabel>
        <Select
          labelId="announcement-type-label"
          value={formik.values.announcementtype}
          onChange={(e) =>
            formik.setFieldValue("announcementtype", e.target.value)
          }
          error={
            formik.touched.announcementtype &&
            Boolean(formik.errors.announcementtype)
          }
        >
          <MenuItem value="general">General</MenuItem>
          <MenuItem value="urgent">Urgent</MenuItem>
        </Select>
        {formik.touched.announcementtype &&
          formik.errors.announcementtype && (
            <Typography color="error">
              {formik.errors.announcementtype}
            </Typography>
          )}
      </FormControl>

      {/* Image upload and crop */}
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
            onCancel={handleCancelCrop}
          />
        )}
      </Box>

      {/* Dialog actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Add Announcement
        </Button>
      </Box>
    </form>
  </Box>
</Dialog>

    </Box>
  );
};

export default AdminAnnouncements;
