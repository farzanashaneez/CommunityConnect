import  { useState, useEffect } from 'react';
import { Post, PostProps } from './Post';
import { fetchAllPosts, fetchAllPostsOfUser } from '../../services/api';
import { useCommunityContext } from '../../context/communityContext';
import { Box, Typography } from '@mui/material';

export default function PostList({isUser=false,userid=''}) {
  const [posts, setPosts] = useState<PostProps['post'][]>([]);
  const { updateMediaPosts,postUpdated } = useCommunityContext();
 
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchAllPosts();
        setPosts(fetchedPosts);
        updateMediaPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    const loadPostsOfUser = async () => {
      try {
        const fetchedPosts = await fetchAllPostsOfUser(userid);
        setPosts(fetchedPosts);
        updateMediaPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    isUser?loadPostsOfUser():loadPosts();
  }, [postUpdated]);
  const handlePostUpdate = (updatedPost: PostProps['post']) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
    updateMediaPosts(posts);
  };
  return (
    <div className="space-y-4 max-h-0.5 px-1 ">
      {posts.length > 0 ? (
      posts.map((post) => (
        <Post key={post._id} post={post} onPostUpdate={handlePostUpdate} />
      ))
    ) : (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px', 
          border: '1px solid #DEDEDE',
          borderRadius: 2,
          p: 2
        }}
      >
        <Typography variant="body1">No posts available</Typography>
      </Box>
    )}
    </div>
  );
}
