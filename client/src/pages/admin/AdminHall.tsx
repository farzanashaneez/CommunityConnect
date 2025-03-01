import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomSnackbar from "../../components/customSnackbar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { createHall, deleteHall, getAllHall, updateHall } from "../../services/api";
import HallCard from "../../components/HallBooking/HallCard";

export interface Hall {
  _id?: string;
  name: string;
  details: string;
  price: {
    morning: number;
    evening: number;
    fullDay: number;
  };
  availableSlots: {
    morning: boolean;
    evening: boolean;
    fullDay: boolean;
  };
  capacity: number;
  images: string[];
  bookings?: any[];
}

const AdminHalls: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [availableSlots, setavailableSlots] = useState({
    morning: false,
    evening: false,
    fullDay: false,
  });
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchHalls = async () => {
      const response = await getAllHall();
      setHalls(response);
    };
    fetchHalls();
  }, []);
  const hallValidationSchema = Yup.object({
    name: Yup.string().required("Hall name is required"),
    capacity: Yup.number()
      .positive("Capacity must be positive")
      .required("Capacity is required"),
    details: Yup.string().required("Hall details are required"),
    availableSlots: Yup.object({
      morning: Yup.boolean(),
      evening: Yup.boolean(),
      fullDay: Yup.boolean(),
    }).test(
      "at-least-one-slot",
      "At least one booking slot must be selected",
      (availableSlots) =>
        availableSlots.morning ||
        availableSlots.evening ||
        availableSlots.fullDay
    ),
    price: Yup.object({
      morning: availableSlots.morning
        ? Yup.number()
            .positive("Morning price must be positive")
            .required("Morning price is required")
        : Yup.number(),
      evening: availableSlots.evening
        ? Yup.number()
            .positive("Evening price must be positive")
            .required("Evening price is required")
        : Yup.number(),
      fullDay: availableSlots.fullDay
        ? Yup.number()
            .positive("Full day price must be positive")
            .required("Full day price is required")
        : Yup.number(),
    }),
  });

  const formik = useFormik<Hall>({
    initialValues: {
      name: "",
      capacity: 0,
      details: "",
      price: {
        morning: 0,
        evening: 0,
        fullDay: 0,
      },
      availableSlots: {
        morning: false,
        evening: false,
        fullDay: false,
      },
      images: [],
    },
    validationSchema: hallValidationSchema,
    onSubmit: async (values: any) => {
      if (selectedHall) {
       try{
        const id=selectedHall?._id || ''
        const res=await updateHall(values,id)
        setHalls(
          halls.map((hall) =>
            hall._id === res._id ? res : hall
          )
        );
        showSnackbar("Hall updated successfully", "success");

       }
       catch(err){
        showSnackbar("errror in updating", "error");

       }

       
      } else {
        // Add new hall
        try {
          const formData = new FormData();

          const flattenObject = (obj: any, parentKey = "") => {
            Object.keys(obj).forEach((key) => {
              const value = obj[key];
              const newKey = parentKey ? `${parentKey}[${key}]` : key;

              if (
                value !== null &&
                typeof value === "object" &&
                !(value instanceof File)
              ) {
                flattenObject(value, newKey);
              } else {
                formData.append(newKey, value);
              }
            });
          };

          // Flatten non-file fields
          flattenObject(values);

          // Append files
          imageFiles.forEach((file) => {
            formData.append(`images`, file);
          });

          const response = await createHall(formData);
          setHalls([...halls, response]);
        } catch (err) {
        }
        showSnackbar("Hall added successfully", "success");
      }

      // Reset form and dialog
      setAddDialogOpen(false);
      setSelectedHall(null);
      setImageFiles([]);
      formik.resetForm();
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
      setImageFiles([...imageFiles, ...newFiles]);
    }
  };

  const handleDeleteHall = async (hallId: string) => {
    try {
      await deleteHall(hallId);
      showSnackbar("Hall deleted successfully", "success");
    } catch (err) {
      showSnackbar("error happens while deleting ", "error");
    }
    setHalls(halls.filter((hall) => hall._id !== hallId));
  };

  const handleEditHall = (hall: Hall) => {
const item=halls.find((item)=>hall._id===item._id)
if(item){
    setSelectedHall(item);
    setavailableSlots(item.availableSlots);
    formik.setValues(item);
    setAddDialogOpen(true);
    setImageFiles([]); 
}
  };

  const openAddHallDialog = () => {
    setSelectedHall(null);
    formik.resetForm();
    setImageFiles([]);
    setAddDialogOpen(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Hall Management
      </Typography>

      <Button variant="contained" color="primary" onClick={openAddHallDialog}>
        Add New Hall
      </Button>
      <Button variant="text" color="primary" href="/admin/halls/allbooking">
       Show all Booking
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {halls.map((hall) => (
          <Grid item xs={12} sm={6} md={4} key={hall._id}>
            <HallCard
              hall={hall}
              onEdit={handleEditHall}
              onDelete={handleDeleteHall}

            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedHall ? "Edit Hall" : "Add New Hall"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hall Name"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Capacity"
                {...formik.getFieldProps("capacity")}
                error={
                  formik.touched.capacity && Boolean(formik.errors.capacity)
                }
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Hall Details"
                {...formik.getFieldProps("details")}
                error={formik.touched.details && Boolean(formik.errors.details)}
                helperText={formik.touched.details && formik.errors.details}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Available Booking Slots</Typography>
              <Grid container>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.availableSlots.morning}
                        onChange={() => {
                          formik.setFieldValue(
                            "availableSlots.morning",
                            !formik.values.availableSlots.morning
                          );
                          formik.values.availableSlots.morning
                            ? formik.setFieldValue(
                                "price.morning",
                                formik.values.price.morning
                              )
                            : formik.setFieldValue("price.morning", "0");

                          setavailableSlots((s) => ({
                            ...s,
                            morning: !formik.values.availableSlots.morning,
                          }));
                        }}
                      />
                    }
                    label="Morning Booking"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.availableSlots.evening}
                        onChange={() => {
                          formik.setFieldValue(
                            "availableSlots.evening",
                            !formik.values.availableSlots.evening
                          );
                          formik.values.availableSlots.evening
                            ? formik.setFieldValue(
                                "price.evening",
                                formik.values.price.evening
                              )
                            : formik.setFieldValue("price.evening", "0");

                          setavailableSlots((s) => ({
                            ...s,
                            evening: !formik.values.availableSlots.evening,
                          }));
                        }}
                      />
                    }
                    label="Evening Booking"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.availableSlots.fullDay}
                        onChange={() => {
                          formik.setFieldValue(
                            "availableSlots.fullDay",
                            !formik.values.availableSlots.fullDay
                          );
                          formik.values.availableSlots.fullDay
                            ? formik.setFieldValue(
                                "price.fullDay",
                                formik.values.price.fullDay
                              )
                            : formik.setFieldValue("price.fullDay", "0");
                          setavailableSlots((s) => ({
                            ...s,
                            fullDay: !formik.values.availableSlots.fullDay,
                          }));
                        }}
                      />
                    }
                    label="Full Day Booking"
                  />
                </Grid>
              </Grid>
              {formik.touched.availableSlots &&
                formik.errors.availableSlots && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {typeof formik.errors.availableSlots === "string"
                        ? formik.errors.availableSlots
                        : "Please select at least one booking slot"}
                    </Typography>
                  </Grid>
                )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Pricing</Typography>
              <Grid container spacing={2}>
                {formik.values.availableSlots.morning && (
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Morning Price"
                      {...formik.getFieldProps("price.morning")}
                      error={
                        formik.touched.price?.morning &&
                        Boolean(formik.errors.price?.morning)
                      }
                      helperText={
                        formik.touched.price?.morning &&
                        formik.errors.price?.morning
                      }
                    />
                  </Grid>
                )}

                {formik.values.availableSlots.evening && (
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Evening Price"
                      {...formik.getFieldProps("price.evening")}
                      error={
                        formik.touched.price?.evening &&
                        Boolean(formik.errors.price?.evening)
                      }
                      helperText={
                        formik.touched.price?.evening &&
                        formik.errors.price?.evening
                      }
                    />
                  </Grid>
                )}

                {formik.values.availableSlots.fullDay && (
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Full Day Price"
                      {...formik.getFieldProps("price.fullDay")}
                      error={
                        formik.touched.price?.fullDay &&
                        Boolean(formik.errors.price?.fullDay)
                      }
                      helperText={
                        formik.touched.price?.fullDay &&
                        formik.errors.price?.fullDay
                      }
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>

            {!selectedHall && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {imageFiles.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Hall Image ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ))}
                  {imageFiles.length < 5 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  )}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  {selectedHall ? "Update Hall" : "Add Hall"}
                </Button>
              </Box>
            </Grid>
          </Grid>
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

export default AdminHalls;
