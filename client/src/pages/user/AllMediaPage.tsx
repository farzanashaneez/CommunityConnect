import React, { useEffect, useState } from 'react';
import { Container, Typography, ImageList, ImageListItem, Dialog } from '@mui/material';
import { fetchAllPosts } from '../../services/api';
import { Post, PostProps } from '../../components/postComponents/Post';

const AllMediaPage: React.FC = () => {
  const [posts, setPosts] = useState<PostProps['post'][]>([]);
  const [selectedPost, setSelectedPost] = useState<PostProps['post'] | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    loadPosts();
  }, []);

  const handlePostClick = (post: PostProps['post']) => {
    setSelectedPost(post);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Media</Typography>
      <ImageList cols={3} gap={16}>
        {posts.filter(post => post.images.length > 0).map((post) => (
          <ImageListItem key={post._id} onClick={() => handlePostClick(post)}>
         <img
           src={post.images[0]}
           alt={`Post by ${post.author.firstName}`}
           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
         />
         <Typography
           variant="caption"
           sx={{
             position: 'absolute',
             bottom: 0,
             left: 0,
             right: 0,
             bgcolor: 'rgba(0,0,0,0.5)',
             color: 'white',
             p: 1
           }}
         >
           Posted by {post.author.firstName}
         </Typography>
       </ImageListItem>
        

        ))}
      </ImageList>
      <Dialog open={!!selectedPost} onClose={() => setSelectedPost(null)} maxWidth="md" fullWidth>
        {selectedPost && <Post post={selectedPost} />}
      </Dialog>
    </Container>
  );
};

export default AllMediaPage;
