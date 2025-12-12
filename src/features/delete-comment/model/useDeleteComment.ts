import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@entities/comment/api/commentApi';
import { commentKeys } from '@entities/comment';
import { Comment } from '@entities/comment';
import { handleMutationSuccess, handleMutationError } from '@shared/lib/error';

interface DeleteCommentParams {
  id: number;
  postId: number;
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteCommentParams) => deleteComment(id),
    // 낙관적 업데이트
    onMutate: async ({ id, postId }) => {
      const queryKey = commentKeys.byPostId(postId);

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 저장
      const previousComments = queryClient.getQueryData<{ comments: Comment[] }>(queryKey);

      // 낙관적 업데이트: 삭제된 댓글 즉시 제거
      if (previousComments) {
        queryClient.setQueryData<{ comments: Comment[] }>(queryKey, {
          comments: previousComments.comments.filter((comment) => comment.id !== id),
        });
      }

      return { previousComments };
    },
    // 에러 시 롤백
    onError: (err, { postId }, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPostId(postId), context.previousComments);
      }
      handleMutationError(err, '댓글 삭제');
    },
    // 성공 시 서버 데이터로 갱신
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(postId) });
      handleMutationSuccess('댓글 삭제');
    },
  });
};
