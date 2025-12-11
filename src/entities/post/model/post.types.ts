import { User } from '@entities/user';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
  author?: User;
}

export type NewPost = Omit<Post, 'id' | 'tags' | 'reactions' | 'author'>;
