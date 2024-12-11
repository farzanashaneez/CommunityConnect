export interface Post {
    _id: string; // Unique identifier
    title: string; // Title of the post
    content: string; // Body content of the post
    tags: string[]; // Array of tags for categorization
    author: string; // Author's name or ID
    createdAt: Date; // Timestamp of creation
    updatedAt: Date; // Timestamp of the last update
  }
  