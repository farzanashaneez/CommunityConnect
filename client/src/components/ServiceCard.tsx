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
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  contactServiceProvider,
  deleteServiceApi,
  requestService,
  updateServiceApi,
} from "../services/api";
import { useSnackbar } from "../hooks/useSnackbar";
import CustomSnackbar from "./customSnackbar";
import { useCommunityContext } from "../context/communityContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ConfirmationDialog from "./ConfirmationDialogue";
import { useAppSelector } from "../hooks/reduxStoreHook";
import ProfileLink from "./ProfileLink";
import { useNavigate } from "react-router-dom";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  provider:any
}

interface ServiceCardProps {
  service: Service;
  type?: "local" | "residential";
  isAdmin: boolean;
  isprofile?:boolean
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  type,
  isAdmin = false,
  isprofile =false
}) => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { deleteService, updateService } = useCommunityContext();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<object | null>(null);

  const userState = useAppSelector((state) => state.user);
  const id = userState?.currentUser?.user?.id;

  const navigate=useNavigate();
  const { requestServiceAlert } = useCommunityContext();
  const handleOpenDialog = (id: string, data: object) => {
    console.log("open section ", data, userState);
    setConfirmId(id);
    setConfirmData(data);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setConfirmId(null); // Reset ID
    setConfirmData(null); // Reset data
  };

  const handleConfirm = () => {
    try {
      if (confirmId && confirmData) {
        requestService(confirmId, confirmData); // Pass id and data to requestService
      }
      handleCloseDialog();
      requestServiceAlert("service", false);
    } catch (err) {
      requestServiceAlert("service", true);
    }
  };

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

  const handleContactProvider=async(serviceData: any, provider: string, requestby: string, shareMessage: string)=>{
try{
  const message=`I would like to know more about the service- ${serviceData.name} you provided `
const chatdata=await contactServiceProvider(serviceData,provider,requestby,message)
console.log('chat data',chatdata)
navigate(`/chatroom/${chatdata._id}`)
}
catch(err){
console.log('cannot contact',err)
}
  }
  return (
    <>
      <Card
        onClick={handleDetailsOpen} // Open details popup when card is clicked
        sx={{
          mb: 2,
          p: 2,
          pb:0,
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

        <CardContent
          sx={{ width: "100%", textAlign: "center", height: "auto" }}
        >
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
          {type === "local" && !isAdmin ? (
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card click
                handleOpenDialog(service._id, {
                  userId: userState?.currentUser.user.id,
                });
              }}
            >
              request
            </Button>
          ) : (
           <></>
          )}
       {!isprofile && service.provider._id!==id &&
       <>
        <Divider sx={{my:'5px'}}></Divider>
        {type === "residential" && (
             <Box sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
    marginTop: 'auto',
    marginBottom: '1px',
    marginLeft: '10px',
            }}>
<Typography variant="body2"> Provided by</Typography>

            
            <Box sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              bottom: 1,
              left: 10,
            }}>
              <Avatar
                src={service.provider.imageUrl}
                alt={service.provider.firstName}
                sx={{ width: 24, height: 24, marginRight: 1 }}
              >
                {service?.provider?.firstName?.charAt(0)}
              </Avatar>
              
              <ProfileLink  id={service.provider._id}> <Typography variant="body2">{service.provider.firstName}</Typography> </ProfileLink>

           { !isAdmin &&  <Button
           
           onClick={(e) => {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation();

            handleContactProvider(service,service.provider._id,id,'message'); // Call the function to open details
          }}
         >
           contact
         </Button>
}
            </Box>
            </Box>
          )}
       </>
       }   
       
         
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
          {service.name}
        </DialogTitle>
        <DialogContent>
          {service.imageUrl && (
            <CardMedia
              component="img"
              sx={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                margin: "auto",
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
            {service.price === 0
              ? "Charge: Free"
              : `Charge: ${service.price}-aed`}
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
      <ConfirmationDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        title="Confirm Request"
        message="Are you sure you want to send this request?"
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
};

export default ServiceCard;
