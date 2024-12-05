import React from 'react';
import { Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${'/src/assets/homeBG.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      Home
    </Box>
  );
};

export default Home;