import { User } from '@entities/user';

export interface Comment {
  id: number;
  user: User;
  body: string;
  postId: number;
  userId: number;
  likes: number;
}

export interface NewComment {
  body: string;
  postId: number | null;
  userId: number;
}
