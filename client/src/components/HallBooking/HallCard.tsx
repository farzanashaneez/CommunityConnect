import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  Typography, 
  IconButton
} from '@mui/material';
import { Hall } from '../../pages/admin/AdminHall';

// interface Hall {
//   _id?: string;
//   name: string;
//   capacity: number;
//   images: string[];
//   details: string;
//   price: {
//     morning: number;
//     evening: number;
//     fullDay: number;
//   };
// }

interface HallCardProps {
  hall: Hall;
  onEdit: (hall: Hall) => void;
  onDelete: (hallId: string) => void;
}

const HallCard: React.FC<HallCardProps> = ({ hall, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleNextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % hall.images.length
    );
  };

  const handlePrevImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? hall.images.length - 1 : prevIndex - 1
    );
  };

  const handleOpenDetails = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDetailsDialogOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={handleOpenDetails}>
      {hall.images?.length > 0 && (
        <CardMedia
          component="div"
          sx={{
            height: 200,
            position: 'relative',
          }}
        >
          <img
            src={hall.images[currentImageIndex]}
            alt={hall.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {hall.images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </CardMedia>
      )}
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {hall.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <span className='font-bold'>Capacity:</span> {hall.capacity} persons
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <span className='font-bold'>Prices:</span> {hall.price.morning>0 && <span>Morning:{hall.price.morning} aed, </span>}
          {hall.price.evening>0 && <span>Evening:{hall.price.evening} aed,</span>}
          {hall.price.fullDay>0 && <span>Full Day:{hall.price.fullDay} aed</span>}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button 
              fullWidth
              variant="text" 
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(hall);
              }}
            >
              Edit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth
              variant="text" 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(hall._id!);
              }}
            >
              Delete
            </Button>
          </Grid>
          
            <Button 
              fullWidth
              variant="text" 
              color="error"
              href={`/admin/halls/availability/${hall._id}`}
              onClick={(e) => {
                e.stopPropagation();
               
              }}
            >
              show Slot details
            </Button>
        
        </Grid>
      </CardContent>

      <Dialog 
        open={isDetailsDialogOpen} 
        onClose={handleCloseDetails} 
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>{hall.name}</DialogTitle>
        <DialogContent>
          {hall.images && hall.images.length > 0 && (
            <CardMedia
              component="img"
              image={hall.images[0]}
              alt={hall.name}
              sx={{
                height: 200,
                objectFit: "cover",
                borderRadius: 1,
                mb: 2,
              }}
            />
          )}
          <Typography variant="body1" paragraph>
            {hall.details}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Capacity:
              </Typography>
              <Typography>{hall.capacity} persons</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Availability & Pricing:
              </Typography>
             {hall.price.morning>0 && <Typography>Morning: {hall.price.morning} aed</Typography>}
             {hall.price.evening>0 && <Typography>Evening: {hall.price.evening} aed</Typography>}
             {hall.price.fullDay>0 && <Typography>Full Day: {hall.price.fullDay} aed</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary" variant="contained" fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default HallCard;
