// import mongoose, { Model, Schema } from "mongoose";
// import { Post } from "../../domain/entities/Post";
// import { PostRepository } from "../../application/interfaces/PostRepository";

// const postSchema = new Schema<Post>({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   author: { type: String, required: true },
//   tags: { type: [String] },
//   createdAt: { type: Date, default: Date.now },
// });

// const PostModel = mongoose.model<Post>("Post", postSchema);

// export class MongoPostRepository implements PostRepository {
//   async createPost(post: Partial<Post>): Promise<Post> {
//     const newPost = new PostModel(post);
//     return newPost.save();
//   }

//   async getPostById(id: string): Promise<Post | null> {
//     return PostModel.findById(id).exec();
//   }

//   async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
//     const updatedPost = await PostModel.findByIdAndUpdate(id, postData, { new: true }).exec();
//     if (!updatedPost) {
//       throw new Error('Post not found');
//     }
//     return updatedPost;
//   }

//   async deletePost(id: string): Promise<void> {
//     const result = await PostModel.findByIdAndDelete(id).exec();
//     if (!result) {
//       throw new Error('Post not found');
//     }
//   }

//   async getAllPosts(): Promise<Post[]> {
//     return PostModel.find().exec();
//   }

//   async getPostsByTag(tag: string): Promise<Post[]> {
//     return PostModel.find({ tags: tag }).exec();
//   }
// }
