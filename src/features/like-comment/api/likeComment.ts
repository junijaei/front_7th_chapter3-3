import { Comment } from '@entities/comment';

export interface LikeCommentParams {
  id: number;
  currentLikes: number;
}

// 댓글 좋아요 (비즈니스 액션)
export const likeComment = async (params: LikeCommentParams): Promise<Comment> => {
  const response = await fetch(`/api/comments/${params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: params.currentLikes + 1 }),
  });
  if (!response.ok) throw new Error('댓글 좋아요 실패');
  return response.json();
};
