import { Post } from "../../domain/entities/posts/Post";
import { PostRepository } from "../interfaces/PostRepository";

export class PostUseCase {
    constructor(private postRepository: PostRepository) {}
  
    async createPost(postData: Partial<Post>): Promise<Post> {
      return this.postRepository.createPost(postData);
    }
  
    async getPostById(id: string): Promise<Post | null> {
      return this.postRepository.getPostById(id);
    }
  
    async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
      return this.postRepository.updatePost(id, postData);
    }
  
    async deletePost(id: string): Promise<void> {
      return this.postRepository.deletePost(id);
    }
  
    async getAllPosts(): Promise<Post[]> {
      return this.postRepository.getAllPosts();
    }
  
    async getPostsByUser(userId: string): Promise<Post[]> {
      return this.postRepository.getPostsByUser(userId);
    }
  
    async addLike(id: string,user:string): Promise<Post> {
      return this.postRepository.addLike(id,user);
    }
  
    async addComment(id: string, comment: Partial<Comment>): Promise<Post> {
      return this.postRepository.addComment(id, comment);
    }
  
    async sharePost(postId: string,sharedby:string,sharedto:string[], shareMessage:string): Promise<Post> {
      return this.postRepository.sharePost(postId, sharedby,sharedto,shareMessage);
    }
  }
