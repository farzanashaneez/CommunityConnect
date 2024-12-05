import React, { useState } from 'react';
import { IconButton, InputBase, Box, Typography, Button, Divider } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ServiceList from '../../components/ServiceList';



const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: '8px', // Optional: Adjust padding for better clickability
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const Services: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddService = () => {
    // Logic to add a new service
    console.log('Add service clicked');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 0}}>
        SERVICES
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0,mr:4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledIconButton onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon sx={{fontSize:'30px'}}/>
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
  variant="text" // Use text variant for no background
  onClick={handleAddService}
  sx={{
   
    fontSize:'18px',
    
  }}
>
  Add Service
</Button>

      </Box>
      <Divider sx={{ mb: 3 }} />  

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Local Services</Typography>
        <ServiceList type="local" searchTerm={searchTerm} />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>Residential Services</Typography>
        <ServiceList type="residential" searchTerm={searchTerm} />
      </Box>
    </Box>
  );
};

export default Services;