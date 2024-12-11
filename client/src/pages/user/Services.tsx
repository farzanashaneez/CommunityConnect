import React, { useCallback, useState } from 'react';
import {
  IconButton,
  InputBase,
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Formik, Form, useFormik } from 'formik';
import * as Yup from 'yup';
import ServiceList from '../../components/ServiceList';
import ImageCropper from '../../components/ImageCropper'; // Assuming ImageCropper is a separate component
import { createService } from '../../services/api';
import { useSnackbar } from '../../hooks/useSnackbar';
import CustomSnackbar from '../../components/customSnackbar';
import { useAppSelector } from '../../hooks/reduxStoreHook';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: '8px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const Services: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const userState=useAppSelector((state)=>state.user)



  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

 

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
    onSubmit: async (values,{resetForm}) => {
      const formData = new FormData();
      formData.append("serviceName", values.serviceName);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      if (values.image) {
        const fileName = `cropped-image-${Date.now()}.jpeg`; // Define a unique filename
        const file = new File([values.image], fileName, { type: "image/jpeg" }); // Convert Blob to File
        formData.append("image", file);
      }
      formData.append("type",'residential')
      formData.append("provider",userState.currentUser.user.id)
console.log('currentuser',userState.currentUser.user.id)
      try {
        await createService(formData);
        showSnackbar("Service created successfully", "success");
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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 0 }}>
        SERVICES
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0, mr: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledIconButton onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon sx={{ fontSize: '30px' }} />
          </StyledIconButton>
          {searchOpen && (
            <InputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                color: 'text.primary',
                '& .MuiInputBase-input': {
                  padding: '8px 12px',
                  transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                  width: '200px',
                  borderRadius: '20px',
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7,
                  },
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.3),
                  },
                  '&:focus': {
                    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.4),
                    width: '220px',
                  },
                },
              }}
            />
          )}
        </Box>
        <Button
          sx={{ textTransform: 'none', padding: 0, color: 'primary.main', background: 'none', boxShadow: 'none' }}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Service
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 ,fontWeight:'700'}}>
          Local Services
        </Typography>
        <ServiceList type="local" searchTerm={searchTerm} isAdmin={false} />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h5" sx={{ mb: 2,fontWeight:'700' }}>
          Residential Services
        </Typography>
        <ServiceList type="residential" searchTerm={searchTerm} isAdmin={false} />
      </Box>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Service</DialogTitle>
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
            helperText={formik.touched.serviceName && formik.errors.serviceName}
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
            fullWidth
            label="Price"
            variant="outlined"
            type="number"
            sx={{ mb: 2 }}
            {...formik.getFieldProps("price")}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
          <Button variant="contained" color="primary" type="submit">
            Add Service
          </Button>
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
