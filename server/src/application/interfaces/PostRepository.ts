import { Post } from "../../domain/entities/Post";

export interface PostRepository {
  createPost(post: Partial<Post>): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  updatePost(id: string, postData: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  getAllPosts(): Promise<Post[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  addLike(id: string,user:string): Promise<Post>;
  addComment(id: string, comment: Partial<Comment>): Promise<Post>;
  sharePost(postId: string,sharedby:string,sharedto:string[],shareMessage:string): Promise<Post>;
}