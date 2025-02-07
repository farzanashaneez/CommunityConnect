import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  TextField, 
  Box, 
  Container 
} from '@mui/material';
import { Phone as PhoneIcon, Search as SearchIcon } from '@mui/icons-material';
import { fetchAllUsers } from '../../services/api';
import { User } from '../../types/User';

const Home: React.FC = () => {
  const [residents, setResidents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadResidents = async () => {
      const data = await fetchAllUsers();
      setResidents(data);
    };
    loadResidents();
  }, []);

  const filteredResidents = residents.filter(resident => 
    resident?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${resident?.apartmentId?.buildingSection}${resident?.apartmentId?.apartmentNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Container maxWidth="md" className='mt-10'>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search residents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
        />
      </Box>
      <List sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
  {filteredResidents.map((resident) => (
    <ListItem 
      key={resident._id} 
      divider 
      sx={{ 
        borderBottom: '1px solid #f0f0f0',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <ListItemText 
        primary={resident.firstName} 
        secondary={`${resident?.apartmentId?.buildingSection}${resident?.apartmentId?.apartmentNumber}`} 
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="call" onClick={() => window.location.href = `tel:${resident.phoneNumber}`}>

          <PhoneIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ))}
</List>

    </Container>
  );
};

export default Home;
