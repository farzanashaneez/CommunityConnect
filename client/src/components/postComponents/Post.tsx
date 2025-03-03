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
import ConfirmationDialog from "../ConfirmationDialogue";
import { addComment, deletePost, likePost } from "../../services/api";
import { useCommunityContext } from "../../context/communityContext";
import SharePostTo from "./SharePostTo";
import ProfileLink from "../ProfileLink";

export interface PostProps {
  post: {
    _id: string;
    content: string;
    author: User;
    likes: [string];
    images: string[];
    createdAt: string;
    comments: Array<{
      _id: string;
      content: string;
      author: User;
      createdAt: string;
    }>;
  };
  onPostUpdate?: (updatedPost: PostProps["post"]) => void;
  onPostDelete?:((id:string)=>void)
}

export function Post({ post, onPostUpdate,onPostDelete }: PostProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const userState = useAppSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { deletePostAlert } = useCommunityContext();
  const [commentText, setCommentText] = useState("");

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const handleOpenShareDialog = (postId: string) => {
    setSelectedPostId(postId);
    setIsShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setIsShareDialogOpen(false);
    setSelectedPostId(null);
  };


  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setGalleryOpen(true);
  };

  const handleOpenDialog = (id: string) => {
    setConfirmId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setConfirmId(null);
  };

  const handleConfirm = async () => {
    try {
      if (confirmId) {
        await deletePost(confirmId);
        onPostDelete?.(confirmId)

      }
      handleCloseDialog();
      deletePostAlert(true);
    } catch (err) {
      deletePostAlert(false);
    }
  };

  const handleLike = async () => {
    try {
    
      const updatedPost = await likePost(
        post._id,
        userState?.currentUser?.user?.id
      );
      
      
      onPostUpdate?.(updatedPost);
    } catch (error) {
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const updatedPost = await addComment(post._id, {
        content: commentText,
        author: userState.currentUser.user.id,
      });
      onPostUpdate?.(updatedPost);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      <Paper elevation={3} className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center mb-4">
            <Avatar src={post?.author?.imageUrl} alt="User" className="mr-2" />
            <div>
              <Typography variant="subtitle1" component="h3">
               
                <ProfileLink  id={post.author._id}>  {post?.author?.firstName || post?.author?.email} </ProfileLink>

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
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card click
                handleOpenDialog(post._id);
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
      className="w-full h-48 sm:h-64 md:h-65 lg:80 rounded-lg object-cover cursor-pointer"
      onClick={() => handleImageClick(index)}
    />
  ))}
        </div>
        <div className="flex justify-between items-center mb-4 text-gray-500">
          <Typography variant="body2">
            {Array.isArray(post.likes) && post.likes.length>0 ? post.likes.length : post.likes || ''}{" "}
            Like
          </Typography>
          <Typography variant="body2">
            {post.comments.length} Comments
          </Typography>
        </div>
        <div className="flex justify-between border-t border-b py-2 mb-4">
         
          {post.likes.includes(userState?.currentUser?.user?.id) ? (
             <Button startIcon={<ThumbUp />} color="warning" onClick={handleLike}>
             Liked
           </Button>
          ) : (
            <Button startIcon={<ThumbUp />} color="primary" onClick={handleLike}>
            Like
          </Button>
          )}
           <Button startIcon={<ChatBubbleOutline />} color="primary">
              Comment ({post.comments.length})
            </Button>
          <Button startIcon={<Share />} color="primary" onClick={() => handleOpenShareDialog(post._id)}>
            Share
          </Button>
        </div>

        <div className="space-y-4 mb-4 min-h-1 max-h-44  overflow-auto ">
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start ">
              <Avatar
                src={comment.author.imageUrl}
                alt="Commenter"
                className="mr-2"
              />
              <div className="flex-grow bg-gray-100 rounded-lg p-2 max-w-screen-sm">
                <div className="flex justify-between items-center mb-1">
                  <Typography variant="subtitle2">
                  <ProfileLink  id={comment.author._id}>  {comment.author.fullName || comment.author.email} </ProfileLink>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </div>
                <Typography variant="body2">{comment.content}</Typography>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <Avatar
            src={userState?.currentUser?.user?.imageUrl}
            alt="Your profile"
            className="mr-2"
          />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Write a comment..."
            className="mr-2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <IconButton color="primary" onClick={handleComment}>
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
      {selectedPostId && (
        <SharePostTo
          postid={selectedPostId}
          open={isShareDialogOpen}
          onClose={handleCloseShareDialog}
        />
      )}
      <ConfirmationDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        title="Delete..! "
        message="Are you sure you want to delete this post?"
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
}
