import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import ServiceList from "../../components/ServiceList";
import ImageCropper from "../../components/ImageCropper";
import { createService } from "../../services/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/customSnackbar";
import { useCommunityContext } from "../../context/communityContext";
import { useAppSelector } from "../../hooks/reduxStoreHook";
import { Service } from "../../components/communityInterfaces";

const AdminServices: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Admin Services
      </Typography>
      <Divider />
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Local Services" />
        <Tab label="Residential Services" />
      </Tabs>
      <Divider sx={{ my: 1 }} />
      {tabValue === 0 && <LocalServicesTab />}
      {tabValue === 1 && <ResidentialServicesTab />}
    </Box>
  );
};

const LocalServicesTab = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { completed, setCompleted } = useCommunityContext();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const adminState = useAppSelector((state) => state.admin);
  const [updateTrigger, setUpdateTrigger] = useState(0);

const [newService,setNewService]=useState<Service|null>(null)
  useEffect(() => {
    if (completed) {
      setCompleted(false);
    }
  }, [completed, setCompleted]);

 

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
        formData.append("provider", adminState.currentAdmin.user.id);
      }
      try {
        const response=await createService(formData);
        showSnackbar("Service created successfully", "success");
        resetForm();
        setCroppedImage(null);
        setUpdateTrigger((prev) => prev + 1);
        // setCompleted(true);
       setNewService(response)
        setAddDialogOpen(false);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: "0", md: "16px" },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Available Services</Typography>
          <Button
            variant="text"
            color="primary"
            onClick={() => setAddDialogOpen(true)}
            sx={{ mb: 2, fontSize: "18px", mr: 2 }}
          >
            + New Service
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            maxHeight: "100vh",
            height: "auto",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "8px",
          }}
        >
          <ServiceList
            type="local"
            update={updateTrigger}
            isAdmin={true}
            newService={newService}
          />
        </Box>
      </Box>
      <Dialog open={isAddDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
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
                  {formik.touched.image && formik.errors.image && (
                    <Typography color="error">
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
            </Box>
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
              type="number"
              sx={{ mb: 2 }}
              {...formik.getFieldProps("price")}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Service
            </Button>
          
          </form>
        </DialogContent>
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

const ResidentialServicesTab = () => {
  return (
    <Box
      sx={{
        display: "flex",
        // flexDirection: { xs: "column", md: "row" },
        flexDirection: "column",
        gap: { xs: "0", md: "16px" },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
          Accepted Services
        </Typography>
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
          <ServiceList
            type="residential"
            status="granted"
            update={1}
            isAdmin={true}
          />
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
          Rejected Services
        </Typography>
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
          <ServiceList
            type="residential"
            status="rejected"
            update={1}
            isAdmin={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminServices;
