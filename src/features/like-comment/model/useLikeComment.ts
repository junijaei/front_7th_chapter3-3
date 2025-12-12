import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@entities/comment/api/queryKeys';
import { likeComment, LikeCommentParams } from '@/features/like-comment/api/likeComment';
import { Comment } from '@entities/comment';
import { handleMutationError } from '@shared/lib/error';

interface UseLikeCommentParams extends LikeCommentParams {
  postId: number;
}

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UseLikeCommentParams) =>
      likeComment({ id: params.id, currentLikes: params.currentLikes }),
    // 낙관적 업데이트 적용
    onMutate: async (params) => {
      const queryKey = commentKeys.byPostId(params.postId);

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 저장
      const previousComments = queryClient.getQueryData<{ comments: Comment[] }>(queryKey);

      // 낙관적 업데이트
      if (previousComments) {
        queryClient.setQueryData<{ comments: Comment[] }>(queryKey, {
          comments: previousComments.comments.map((comment) =>
            comment.id === params.id ? { ...comment, likes: params.currentLikes + 1 } : comment,
          ),
        });
      }

      return { previousComments };
    },
    // 에러 시 롤백
    onError: (err, params, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPostId(params.postId), context.previousComments);
      }
      handleMutationError(err, '댓글 좋아요');
    },
    // 성공 시 서버 데이터로 갱신
    onSettled: (_, __, params) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(params.postId) });
    },
  });
};
