import  { useState } from 'react';
import { Paper, Button, ImageList, ImageListItem, Typography, Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Post, PostProps } from './Post';
import { useCommunityContext } from '../../context/communityContext';
export default function MediaGallery() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostProps['post'] | null>(null);
  const { mediaPosts } = useCommunityContext();

  const handleImageClick = (post: PostProps['post']) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Media</Typography>
      <ImageList cols={3} rowHeight={120}>
        {mediaPosts.filter(post => post.images.length > 0).map((post) => (
          <ImageListItem key={post._id} onClick={() => handleImageClick(post)}>
            <img src={post.images[0]} alt='post' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', p: 1 }}>
              : {post.author.firstName}
            </Typography>
          </ImageListItem>
        ))}
      </ImageList>
      <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/all-media')}>
        See All Media
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedPost && <Post post={selectedPost} />}
      </Dialog>
    </Paper>
  );
}
