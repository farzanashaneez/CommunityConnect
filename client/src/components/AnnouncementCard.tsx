// AnnouncementCard.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAnnouncementApi, updateAnnouncementApi } from "../services/api";
import { useSnackbar } from "../hooks/useSnackbar";
import CustomSnackbar from "./customSnackbar";
import { useCommunityContext } from "../context/communityContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ConfirmationDialog from "./ConfirmationDialogue";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  announcementtype: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  isAdmin: boolean;
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isAdmin = false,
  setAnnouncements
}) => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { deleteService, updateService } = useCommunityContext();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmAction,setConfirmAction]=useState(false);
  const [selectedId,setselectedId]=useState<string>('');


  const handleDelete = async () => {
    try {
      await deleteAnnouncementApi(selectedId);
      setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== selectedId));
      showSnackbar("Announcement deleted successfully", "success");
      deleteService(selectedId, "announcement");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showSnackbar("Failed to delete announcement.", "error");
    }
  };

  const handleEditSubmit = async (values: Announcement) => {
    try {
      const updatedAnnouncement = await updateAnnouncementApi(
        values._id,
        values
      );
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === updatedAnnouncement._id ? updatedAnnouncement : announcement
        )
      );
      updateService(updatedAnnouncement, "announcement");
      showSnackbar("Announcement updated successfully", "success");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating announcement:", error);
      showSnackbar("Failed to update announcement.", "error");
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
                setselectedId(announcement._id);
                setConfirmAction(true)
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        )}
        {announcement.imageUrl && (
          <CardMedia
            component="img"
            sx={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              mt: 2,
              mb: 0,
            }}
            image={announcement.imageUrl}
            alt={announcement.title}
          />
        )}
        <CardContent sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {announcement.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              maxHeight: "60px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {announcement.description}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Date:{" "}
            {new Date(announcement.date).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {announcement.announcementtype === "urgent" ? (
            <Typography variant="body2" sx={{ fontWeight: "400",color:'red',mb:1 }}>
              {announcement.announcementtype}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ fontWeight: "400",color:'grey',mb:1 }}>
              {announcement.announcementtype}
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
      <ConfirmationDialog
        open={confirmAction}
        onClose={() => setConfirmAction(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Do you want to continue?"
      />
      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onClose={handleDetailsClose}>
        <DialogTitle>{announcement.title}</DialogTitle>
        <DialogContent>
          {announcement.imageUrl && (
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
          )}
          <Typography>{announcement.description}</Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Date:{" "}
            {new Date(announcement.date).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
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
        <DialogTitle>Edit Announcement</DialogTitle>
        <Formik
          initialValues={{
            ...announcement,
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("description is required"),
            date: Yup.string().required("Date is required"),
          })}
          onSubmit={(values) => handleEditSubmit(values)}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <DialogContent>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  value={values.title}
                  onChange={handleChange}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="description"
                  label="description"
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

export default AnnouncementCard;
