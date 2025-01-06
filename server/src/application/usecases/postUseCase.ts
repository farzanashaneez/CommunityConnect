import { Post } from "../../domain/entities/Post";
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
  
    async getPostsByTag(tag: string): Promise<Post[]> {
      return this.postRepository.getPostsByTag(tag);
    }
  
    async addLike(id: string): Promise<Post> {
      return this.postRepository.addLike(id);
    }
  
    async addComment(id: string, comment: Partial<Comment>): Promise<Post> {
      return this.postRepository.addComment(id, comment);
    }
  
    async sharePost(postId: string,sharedby:string,sharedto:string[]): Promise<void> {
      return this.postRepository.sharePost(postId, sharedby,sharedto);
    }
  }
