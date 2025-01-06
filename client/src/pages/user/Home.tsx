import React from 'react';
import { Box } from '@mui/material';
import PostList from '../../components/postComponents/PostList';
import LeftSidebar from '../../components/postComponents/LeftSidebar';
import Hero from '../../components/postComponents/Hero';

const Home: React.FC = () => {
  return (
    <Box>
    <Hero />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <LeftSidebar />
        </div>
        <div className="md:w-2/3">
          <PostList />
        </div>
      </div>
    </div>
    </Box>
  );
};

export default Home;