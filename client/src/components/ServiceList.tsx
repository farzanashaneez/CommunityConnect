import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2'; 
import ServiceCard from './ServiceCard'; 
import { getAllServices } from '../services/api';
import { useCommunityContext } from '../context/communityContext';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ServiceListProps {
  type: 'local' | 'residential';
  searchTerm: string;
  update?:number;
  isAdmin:boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ type, searchTerm = '',update ,isAdmin=false}) => {
  const [serviceList, setServiceList] = useState<Service[]>([]);
 const {completed,setCompleted}=useCommunityContext();

 useEffect(()=>{
  if (completed) {
    console.log("community triggere.....")
    setCompleted(false); 
  }
    const fetchServices = async () => {
      try {
        const response = await getAllServices(type);
        console.log("searchTerm",searchTerm,type,response)
        setServiceList(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [searchTerm,update,completed]);

  return (
    <Grid container spacing={2} sx={{justifyContent:'center'}}>
      {serviceList.map(service => (
    <Grid   container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 4, md: 2 }}>
    <ServiceCard key={service._id} service={service} type={type} isAdmin={isAdmin}/>
        </Grid>
      ))}
    </Grid>
  );
};
    
  
  export default ServiceList;