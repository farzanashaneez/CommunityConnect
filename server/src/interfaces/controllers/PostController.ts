// interface/controllers/PostController.ts

import { NextFunction, Request, Response } from 'express';
import {  CustomRequestWithImageArray } from "../../infrastructure/middlewares/uploadImageToCloudinary";
import { PostUseCase } from '../../application/usecases/postUseCase';

export class PostController {
  constructor(private postUseCase: PostUseCase) {}

  async createPost(req: CustomRequestWithImageArray, res: Response,next: NextFunction) {
    try {
      const formData = req.body;
      console.log("in post controller",formData)

      if (req.imageUrls && req.imageUrls.length > 0) {
        formData.images = req.imageUrls;
      }
      console.log("in post controller",formData)

      const post = await this.postUseCase.createPost(formData);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  async getPostById(req: Request, res: Response,next: NextFunction) {
    try {
      const post = await this.postUseCase.getPostById(req.params.id);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to get post' });
    }
  }

  async updatePost(req: Request, res: Response,next: NextFunction) {
    try {
      const post = await this.postUseCase.updatePost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }

  async deletePost(req: Request, res: Response,next: NextFunction) {
    try {
      await this.postUseCase.deletePost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  async getAllPosts(req: Request, res: Response,next: NextFunction) {
    try {
      const posts = await this.postUseCase.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get posts' });
    }
  }

  async getPostsByTag(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.postUseCase.getPostsByTag(req.params.tag);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get posts by tag' });
    }
  }

  async addLike(req: Request, res: Response,next: NextFunction) {
    try {
      const post = await this.postUseCase.addLike(req.params.id,req.body.userid);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add like' });
    }
  }

  async addComment(req: Request, res: Response,next: NextFunction) {
    try {
      const post = await this.postUseCase.addComment(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add comment' });
    }
  }

  async sharePost(req: Request, res: Response,next: NextFunction) {
    try {
      await this.postUseCase.sharePost(req.params.postid, req.body.userid,req.body.toUsers,req.body.url);
      res.status(200).json({ message: 'Post shared successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to share Post' });
    }
  }
}



