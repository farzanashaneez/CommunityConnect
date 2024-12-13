import {
  IconButton,
  InputBase,
  Box,
  Typography,
  Button,
  Divider,
  
} from '@mui/material';import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import CustomSnackbar from '../../components/customSnackbar';
import { useSnackbar } from '../../hooks/useSnackbar';
import EventList from '../../components/EventList';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: '8px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));
const Events:React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 0 }}>
        Events      
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0, mr: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledIconButton onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon sx={{ fontSize: '30px' }} />
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
      </Box>
      <Divider sx={{ mb: 3 }} />
              <Box>
                <EventList isAdmin={false}/>
              </Box>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </Box>
  );
}

export default Events
