import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ServiceCardProps {
  service: Service;
  type: 'local' | 'residential';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, type }) => {
  const handleActionClick = () => {
    if (type === 'local') {
      console.log('Request service:', service.name);
    } else {
      console.log('Contact provider:', service.name);
    }
  };

  return (
    <Card sx={{ 
        mb: 2, 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%', // Ensure the card takes full width
        maxWidth: '300px', // Optional: limit the maximum width
      }}>
        {service.imageUrl && (
          <CardMedia
            component="img"
            sx={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              mb: 2 // Add some margin at the bottom
            }}
            image={service.imageUrl}
            alt={service.name}
          />
        )}
        <CardContent sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {service.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Price: ${service.price}
          </Typography>
          <a 
  href="#" 
  onClick={(e) => {
    e.preventDefault();
    handleActionClick();
  }}
  style={{
    color: '#1976d2', // primary color, you can adjust this
    fontWeight: 'bold',
    cursor: 'pointer'
  }}
>
  {type === 'local' ? 'Request' : 'Contact'}
</a>
        </CardContent>
      </Card>
  );
};

export default ServiceCard;