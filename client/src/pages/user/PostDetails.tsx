import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post, PostProps } from '../../components/postComponents/Post';
import { getPostById } from '../../services/api'; // Assume this function exists to fetch post details
import { Box, Typography, CircularProgress } from '@mui/material';

const PostDetails: React.FC = () => {
  const { postid } = useParams<{ postid: string }>();
  const [post, setPost] = useState<PostProps['post'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (postid) {
        try {
          const postData = await getPostById(postid);
          setPost(postData);
        } catch (error) {
          console.error('Error fetching post:', error);
          // Handle error (e.g., show error message)
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchPost();
  }, [postid]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    ); // Show loading spinner while fetching data
  }

  if (!post) {
    return <Typography variant="h6" align="center">Post not found.</Typography>; // Handle case where post is not found
  }

  return (
    <Box sx={{ padding: 7, paddingTop:3 }}>
       <Post post={post}/>
    
    </Box>
  );
};

export default PostDetails;
