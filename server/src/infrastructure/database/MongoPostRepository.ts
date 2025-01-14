import mongoose, { Model, Schema } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { PostRepository } from "../../application/interfaces/PostRepository";
import ChatServices from "../../application/services/ChatService";
import UserService from "../../application/services/UserService";

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema({
  content: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId }],
  comments: [CommentSchema],
  images: [{ type: String }],
  shareCount: { type: Number, default: 0 },
  sharedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

PostSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const PostModel = mongoose.model<Post>("Post", PostSchema);

export class MongoPostRepository implements PostRepository {
  async createPost(post: Partial<Post>): Promise<Post> {
    const newPost = new PostModel(post);
    await newPost.save();
    return newPost.toObject();
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await PostModel.findById(id);
    return post ? post.toObject() : null;
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    const updatedPost = await PostModel.findByIdAndUpdate(id, postData, {
      new: true,
    });
    if (!updatedPost) throw new Error("Post not found");
    return updatedPost.toObject();
  }

  async deletePost(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await PostModel.find()
      .populate("author")
      .populate({
        path: "comments.author",
        select: "firstName lastName email imageUrl",
        transform: (doc) => {
          if (doc) {
            return {
              fullName: `${doc.firstName} ${doc.lastName}`,
              email: doc.email,
              imageUrl: doc.imageUrl,
            };
          }
          return null;
        },
      })
      .sort({ createdAt: -1 });

    console.log("============", posts);
    return posts;
  }

  async getPostsByUser(UserId: string): Promise<Post[]> {
    const posts = await PostModel.find({
      author: new mongoose.Types.ObjectId(UserId),
    });
    return posts.map((post) => post.toObject());
  }

  async addLike(id: string, user: string): Promise<Post> {
    console.log("user======>", user);

    const post = await PostModel.findById(id);
    if (!post) throw new Error("Post not found");

    let updateOperation;
    if (post.likes.includes(user)) {
      updateOperation = { $pull: { likes: user } };
    } else {
      updateOperation = { $addToSet: { likes: user } };
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, updateOperation, {
      new: true,
    })
      .populate("author")
      .populate({
        path: "comments.author",
        select: "firstName lastName email imageUrl",
        transform: (doc) =>
          doc && {
            fullName: `${doc.firstName} ${doc.lastName}`,
            email: doc.email,
            imageUrl: doc.imageUrl,
          },
      });

    if (!updatedPost) throw new Error("Failed to update post");
    return updatedPost;
  }

  async addComment(id: string, comment: Partial<Comment>): Promise<Post> {
    const post = await PostModel.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("author") // Populate the author field
      .populate({
        path: "comments.author", // Populate the author of each comment
        select: "firstName lastName email imageUrl", // Specify the fields to include
        transform: (doc) =>
          doc && {
            fullName: `${doc.firstName} ${doc.lastName}`,
            email: doc.email,
            imageUrl: doc.imageUrl,
          },
      });
    if (!post) throw new Error("Post not found");
    return post.toObject();
  }

  async sharePost(
    postId: string,
    sharedby: string,
    sharedto: string[],
    shareMessage: string
  ): Promise<Post> {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const sender = await UserService.getUser(sharedby);
      if (!sender) {
        throw new Error("Sender not found");
      }

      // const shareMessage = `${sender.firstName} shared a post with you: ${process.env.FRONTEND_URL}/post/${postId}`;

      for (const recipientId of sharedto) {
        let chat = await ChatServices.getChatbyparticipants(
          sharedby,
          recipientId
        );
        if (!chat) {
          chat = await ChatServices.createchat(
            {
              participants: [sharedby, recipientId],
              type: "personal",
              createdBy: sharedby,
            },
            "personal"
          );
        }

      if(chat){  await ChatServices.addMessage(chat._id, {
          senderId: sharedby,
          content: shareMessage,
          status: "sent",
        });
      }

        // socketService.emitToUser(recipientId, 'newMessage', { chatId: chat._id, message: shareMessage });
      }
      post.shareCount = (post.shareCount || 0) + sharedto.length;
      post.sharedBy.push(sharedby);
      await post.save();
      return post;
    } catch (error) {
      console.error("Error in sharePost:", error);
      throw error; // Re-throw the error to be handled by the route handler
    }
  }
  async findRecent(count: number): Promise<Post[]> {
    return PostModel.find().sort({ createdAt: -1 }).limit(count).exec();
  }
}
