import React from 'react';
import Grid from '@mui/material/Grid2'; 
import ServiceCard from './ServiceCard'; 

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ServiceListProps {
  type: 'local' | 'residential';
  searchTerm: string;
}

const mockServices: Service[] = [
  // Mock data for demonstration
  { id: '1', name: 'Plumbing', description: 'Fix leaks and pipesFix leaks and pipesFix leaks and pipesFix leaks and pipesFix leaks and pipes', price: 100, imageUrl: '/src/assets/logo1.png' },
  { id: '2', name: 'Electrical', description: 'Electrical repairs', price: 150, imageUrl: '/src/assets/logo1.png' },
  { id: '1', name: 'Plumbing', description: 'Fix leaks and pipes', price: 100, imageUrl: '/src/assets/logo1.png' },
  { id: '2', name: 'Electrical', description: 'Electrical repairs', price: 150, imageUrl: '/src/assets/logo1.png' },
  { id: '1', name: 'Plumbing', description: 'Fix leaks and pipes', price: 100, imageUrl: '/src/assets/logo1.png' },
  { id: '2', name: 'Electrical', description: 'Electrical repairs', price: 150, imageUrl: '/src/assets/logo1.png' },
  { id: '1', name: 'Plumbing', description: 'Fix leaks and pipes', price: 100, imageUrl: '/src/assets/logo1.png' },
  { id: '2', name: 'Electrical', description: 'Electrical repairs', price: 150, imageUrl: '/src/assets/logo1.png' },
];

const ServiceList: React.FC<ServiceListProps> = ({ type, searchTerm }) => {
  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {filteredServices.map(service => (
        <ServiceCard key={service.id} service={service} type={type} />
      ))}
    </Grid>
  );
};

export default ServiceList;