import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid'; 
import { getAllServicesOfUser } from '../../services/api';
import ServiceCard from '../ServiceCard';
import { Service } from '../communityInterfaces';
import { Box, Typography } from '@mui/material';



const UserServices: React.FC<{userId:any}> = ({ userId}) => {
  const [serviceList, setServiceList] = useState<Service[]>([]);

 useEffect(()=>{
  
    const fetchServices = async () => {
      try {
        const response = await getAllServicesOfUser(userId);
        console.log("response from user Service",response)
        setServiceList(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
   fetchServices();
  }, []);

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
      {serviceList.length > 0 ? (
        serviceList.map(service => (
          <Grid container columns={1} key={service._id}>
            <ServiceCard service={service} type={'residential'} isAdmin={false} isprofile={true}/>
          </Grid>
        ))
      ) : (
        <Grid item xs={12} sx={{margin:'auto'}}>
          <Box   sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px', 
              width:'100%',
              border: '1px solid #DEDEDE',
              borderRadius: 2,
              p: 2
            }}
          >
            <Typography variant="body1">No services available</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};
    
  
  export default UserServices;