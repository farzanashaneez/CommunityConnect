import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ServiceList from "../../components/ServiceList";
import ImageCropper from "../../components/ImageCropper"; // Assuming ImageCropper is a separate component
import { createService } from "../../services/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/customSnackbar";
import { useAppSelector } from "../../hooks/reduxStoreHook";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

const Services: React.FC = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const userState = useAppSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      serviceName: "",
      description: "",
      price: "",
      image: null,
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required("Service Name is required"),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .required("Description is required"),
      price: Yup.number()
        .min(0, "Price must be greater than or equal to 0")
        .required("Price is required"),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("serviceName", values.serviceName);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      if (values.image) {
        const fileName = `cropped-image-${Date.now()}.jpeg`; // Define a unique filename
        const file = new File([values.image], fileName, { type: "image/jpeg" }); // Convert Blob to File
        formData.append("image", file);
      }
      formData.append("type", "residential");
      formData.append("provider", userState.currentUser.user.id);
      try {
        await createService(formData);
        showSnackbar("Service created successfully", "success");
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
      formik.setFieldValue("image", file);
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
      setCroppedImage(croppedImageURL);
      setIsCropping(false);
    },
    [formik]
  );

  const handleCancel = () => {
    setIsCropping(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        SERVICES
      </Typography>
      <Button
        sx={{
          textTransform: "none",
          padding: 0,
          color: "primary.main",
          background: "none",
          boxShadow: "none",
        }}
        onClick={() => setAddDialogOpen(true)}
      >
        Add Service
      </Button>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "700" }}>
          Local Services
        </Typography>
        <ServiceList type="local" isAdmin={false} />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "700" }}>
          Residential Services
        </Typography>
        <ServiceList type="residential" isAdmin={false} />
      </Box>

      {/* Add Service Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #e0e0e0",
            py: 2,
            backgroundColor: "primary.light",
            color: "white",
            fontWeight: 500,
          }}
        >
          Add New Service
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ padding: 3 }}>
            {!isCropping ? (
              <>
                {!croppedImage ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      mb: 2,
                      border: "1px dashed #ccc",
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Upload and Crop an Image
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1 }}
                    >
                      Select Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      Image Preview
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        style={{
                          width: "auto",
                          height: "120px",
                          display: "block",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {formik.touched.image && formik.errors.image && (
                  <Typography
                    color="error"
                    variant="caption"
                    display="block"
                    sx={{ mb: 1, textAlign: "center" }}
                  >
                    {formik.errors.image as string}
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

            <TextField
              fullWidth
              label="Service Name"
              variant="outlined"
              sx={{ mb: 2 }}
              {...formik.getFieldProps("serviceName")}
              error={
                formik.touched.serviceName && Boolean(formik.errors.serviceName)
              }
              helperText={
                formik.touched.serviceName && formik.errors.serviceName
              }
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
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              type="number"
              sx={{ mb: 3 }}
              {...formik.getFieldProps("price")}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<AddIcon />}
              >
                Add Service
              </Button>
            </Box>
          </Box>
        </form>
      </Dialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </Box>
  );
};

export default Services;
