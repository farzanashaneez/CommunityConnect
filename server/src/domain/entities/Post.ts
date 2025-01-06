
export interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
  images: string[];
}

export interface Comment {
  _id: string;
  content: string;
  author: string;
  createdAt: Date;
}
