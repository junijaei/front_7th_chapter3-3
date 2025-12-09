import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import {
  fetchCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  LikeCommentParams,
  FetchCommentsResponse,
} from '@entities/comment/api/commentApi';
import { commentKeys } from '@entities/comment/api/queryKeys';
import { Comment, NewComment } from '@entities/comment/model/comment.types';

// 게시물별 댓글 조회
export const useFetchCommentsByPostId = (
  postId: number,
  options?: Omit<UseQueryOptions<FetchCommentsResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: commentKeys.byPostId(postId),
    queryFn: () => fetchCommentsByPostId(postId),
    ...options,
  });
};

// 댓글 생성
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: NewComment) => createComment(newComment),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 목록 무효화
      if (data.postId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(data.postId) });
      }
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Comment) => updateComment(comment),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 목록 무효화
      if (data.postId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(data.postId) });
      }
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(variables.postId) });
    },
  });
};

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LikeCommentParams & { postId: number }) =>
      likeComment({ id: params.id, currentLikes: params.currentLikes }),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(variables.postId) });
    },
  });
};
