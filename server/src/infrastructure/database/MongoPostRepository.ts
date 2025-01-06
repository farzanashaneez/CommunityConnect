import mongoose, { Model, Schema } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { PostRepository } from "../../application/interfaces/PostRepository";

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema: Schema = new Schema({
  content: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
  images: [{ type: String }],
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
      .sort({ createdAt: -1 })
      
    console.log("============", posts);
    return posts;
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await PostModel.find({ tags: tag });
    return posts.map((post) => post.toObject());
  }

  async addLike(id: string): Promise<Post> {
    const post = await PostModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) throw new Error("Post not found");
    return post.toObject();
  }

  async addComment(id: string, comment: Partial<Comment>): Promise<Post> {
    const post = await PostModel.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    if (!post) throw new Error("Post not found");
    return post.toObject();
  }

  async sharePost(
    postId: string,
    sharedby: string,
    sharedto: string[]
  ): Promise<void> {
    // Implementation depends on how you want to handle comment sharing
    // This could involve creating a new post with the shared comment, for example
  }
}
