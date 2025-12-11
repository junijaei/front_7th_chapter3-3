import { User } from '@entities/user';

export interface Comment {
  id: number;
  user: User;
  body: string;
  postId: number;
  userId: number;
  likes: number;
}

export type NewComment = Omit<Comment, 'id' | 'user' | 'likes'>;
