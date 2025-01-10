import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  ImageList,
  ImageListItem,
  Dialog,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchAllPosts, deletePost } from "../../services/api";
import { PostProps, Post } from "../../components/postComponents/Post";
import { useCommunityContext } from "../../context/communityContext";
import ConfirmationDialog from "../../components/ConfirmationDialogue";

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostProps["post"][]>([]);
  const [selectedPost, setSelectedPost] = useState<PostProps["post"] | null>(
    null
  );
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px)");
  const isLargeScreen = useMediaQuery("(max-width:1280px)");
  const { deletePostAlert } = useCommunityContext();
  const [open, setOpen] = useState(false);

  const cols = isSmallScreen ? 2 : isMediumScreen ? 3 : isLargeScreen ? 4 : 5;
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    loadPosts();
  }, []);

  const handlePostClick = (post: PostProps["post"]) => {
    setSelectedPost(post);
  };

  const handleDeleteClick = (postId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setPostToDelete(postId);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setPosts(posts.filter((post) => post._id !== postToDelete));
        deletePostAlert(true);
      } catch (error) {
        console.error("Error deleting post:", error);
        deletePostAlert(false);
      }
    }
    setOpen(false);
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpen(false);
    setPostToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <ImageList cols={cols} gap={16}>
        {posts.map((post) => (
          <ImageListItem
            key={post._id}
            onClick={() => handlePostClick(post)}
            sx={{ position: "relative" }}
          >
            {post.images && post.images.length > 0 ? (
              <img
                src={post.images[0]}
                alt={`Post by ${post?.author?.firstName || "removed user"}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.1)",
                  color: "gray",
                  fontSize: "1rem",
                }}
              >
               {post.content}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                p: 1,
              }}
            >
              Posted by {post?.author?.firstName || "removed user"}
            </Typography>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
              onClick={(e) => handleDeleteClick(post._id, e)}
            >
              <DeleteIcon />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPost && <Post post={selectedPost} />}
      </Dialog>
      <ConfirmationDialog
        open={open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post?"
      />
    </Container>
  );
};

export default AdminPosts;
