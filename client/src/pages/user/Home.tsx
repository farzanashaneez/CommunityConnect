import React from 'react';
import { Box } from '@mui/material';
import PostList from '../../components/postComponents/PostList';
import LeftSidebar from '../../components/postComponents/LeftSidebar';
import Hero from '../../components/postComponents/Hero';

const Home: React.FC = () => {
  return (
    <Box>
    <Hero />
    <div className=" mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3"
        style={{
          maxHeight:"calc(100vh + 700px)",
          overflowY: "scroll",
        }}
        >
          <LeftSidebar />
        </div>
        <div
            className="md:w-2/3 my-3 overflow-y-auto "
            style={{
              height: "calc(100vh + 700px)",
              overflowY: "scroll",
              
            }}
          >
            <PostList />
          </div>
      </div>
    </div>
    </Box>
  );
};

export default Home;