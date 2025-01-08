import React, { useState, useEffect } from 'react';
import { Post, PostProps } from './Post';
import { fetchAllPosts } from '../../services/api';

export default function PostList() {
  const [posts, setPosts] = useState<PostProps['post'][]>([]);

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
  const handlePostUpdate = (updatedPost: PostProps['post']) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post._id} post={post} onPostUpdate={handlePostUpdate} />
      ))}
    </div>
  );
}
