import { Post } from "../../domain/entities/Post";

export interface PostRepository {
  createPost(post: Partial<Post>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  updatePost(id: string, postData: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  getAllPosts(): Promise<Post[]>;
  getPostsByTag(tag: string): Promise<Post[]>;
}
