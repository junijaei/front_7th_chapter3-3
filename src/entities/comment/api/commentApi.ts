import { Comment, NewComment } from '@/entities/comment';

export interface FetchCommentsResponse {
  comments: Comment[];
  total: number;
}

export interface LikeCommentParams {
  id: number;
  currentLikes: number;
}

// 게시물별 댓글 조회
export const fetchCommentsByPostId = async (postId: number): Promise<FetchCommentsResponse> => {
  const response = await fetch(`/api/comments/post/${postId}`);
  if (!response.ok) throw new Error('댓글 조회 실패');
  return response.json();
};

// 댓글 생성
export const createComment = async (newComment: NewComment): Promise<Comment> => {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  });
  if (!response.ok) throw new Error('댓글 생성 실패');
  return response.json();
};

// 댓글 수정
export const updateComment = async (comment: Comment): Promise<Comment> => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: comment.body }),
  });
  if (!response.ok) throw new Error('댓글 수정 실패');
  return response.json();
};

// 댓글 삭제
export const deleteComment = async (id: number): Promise<void> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('댓글 삭제 실패');
};

// 댓글 좋아요
export const likeComment = async (params: LikeCommentParams): Promise<Comment> => {
  const response = await fetch(`/api/comments/${params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: params.currentLikes + 1 }),
  });
  if (!response.ok) throw new Error('댓글 좋아요 실패');
  return response.json();
};
