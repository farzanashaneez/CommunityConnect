import { useState } from "react";
import {
  Paper,
  Avatar,
  Typography,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import {
  ThumbUp,
  ChatBubbleOutline,
  Share,
  Send,
  Clear,
} from "@mui/icons-material";
import { ImageGallery } from "./ImageGallery";
import { User } from "../../types/User";
import { useAppSelector } from "../../hooks/reduxStoreHook";

export interface PostProps {
  post: {
    _id: string;
    content: string;
    author: User;
    likes: number;
    images: string[];
    createdAt: string;
    comments: any[];
  };
}

export function Post({ post }: PostProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const userState = useAppSelector((state) => state.user);

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setGalleryOpen(true);
  };

  return (
    <Paper elevation={3} className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center mb-4">
          <Avatar src={post?.author?.imageUrl} alt="User" className="mr-2" />
          <div>
            <Typography variant="subtitle1" component="h3">
              {post?.author?.firstName || post?.author?.email}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </div>
        </div>
        {userState?.currentUser?.user?.id === post.author._id && (
          <IconButton
            size="small"
            className="absolute top-0 right-0 bg-white hover:text-red-700"
            disableRipple
            onClick={() => {
              console.log("button clicked");
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </div>
      <Typography variant="body1" className="mb-4">
        {post.content}
      </Typography>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {post.images.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Post photo ${index + 1}`}
            width={150}
            height={150}
            className="rounded-lg object-cover cursor-pointer"
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mb-4 text-gray-500">
        <Typography variant="body2">{post.likes} Likes</Typography>
        <Typography variant="body2">{post.comments.length} Comments</Typography>
      </div>
      <div className="flex justify-between border-t border-b py-2 mb-4">
        <Button startIcon={<ThumbUp />} color="primary">
          Like
        </Button>
        <Button startIcon={<ChatBubbleOutline />} color="primary">
          Comment
        </Button>
        <Button startIcon={<Share />} color="primary">
          Share
        </Button>
      </div>
      <div className="space-y-4 mb-4">
        {post.comments.map((comment, index) => (
          <div key={index} className="flex items-start">
            <Avatar src="/placeholder.svg" alt="Commenter" className="mr-2" />
            <div className="flex-grow bg-gray-100 rounded-lg p-2">
              <div className="flex justify-between items-center mb-1">
                <Typography variant="subtitle2">Commenter Name</Typography>
                <IconButton size="small">
                  <ThumbUp fontSize="small" />
                </IconButton>
              </div>
              <Typography variant="body2">Comment text</Typography>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <Avatar src="/placeholder.svg" alt="Your profile" className="mr-2" />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Write a comment..."
          className="mr-2"
        />
        <IconButton color="primary">
          <Send />
        </IconButton>
      </div>
      <ImageGallery
        images={post.images}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={initialImageIndex}
      />
    </Paper>
  );
}
