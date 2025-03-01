import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2'; 
import ServiceCard from './ServiceCard'; 
import { getAllServices, getFilteredServices } from '../services/api';
import { useCommunityContext } from '../context/communityContext';
import { Service, ServiceListProps } from './communityInterfaces';



const ServiceList: React.FC<ServiceListProps> = ({ type, searchTerm = '', status='granted',update ,isAdmin=false}) => {
  const [serviceList, setServiceList] = useState<Service[]>([]);
 const {completed,setCompleted}=useCommunityContext();

 useEffect(()=>{
  if (completed) {
    setCompleted(false); 
  }
    const fetchServices = async () => {
      try {
        const response = await getAllServices(type);
        setServiceList(response);
      } catch (error) {
      }
    };
    const fetchResidenceServices = async (status:string) => {
      try {
        const response = await getFilteredServices(status,type);
        setServiceList(response);
      } catch (error) {
      }
    };

    type==='local'?fetchServices():fetchResidenceServices(status)

  }, [searchTerm,update,completed]);

  return (
    <Grid container spacing={2} sx={{justifyContent:'center'}}>
      {serviceList.map(service => (
    <Grid key={service._id}  container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 4, md: 2 }}>
    <ServiceCard key={service._id} service={service} type={type} isAdmin={isAdmin}/>
        </Grid>
      ))}
    </Grid>
  );
};
    
  
  export default ServiceList;