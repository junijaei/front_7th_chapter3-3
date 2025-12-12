import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '@entities/comment/api/commentApi';
import { commentKeys } from '@entities/comment';
import { Comment } from '@entities/comment';
import { handleMutationSuccess, handleMutationError } from '@shared/lib/error';

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Comment) => updateComment(comment),
    // 낙관적 업데이트
    onMutate: async (updatedComment) => {
      const queryKey = commentKeys.byPostId(updatedComment.postId);

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 저장
      const previousComments = queryClient.getQueryData<{ comments: Comment[] }>(queryKey);

      // 낙관적 업데이트
      if (previousComments) {
        queryClient.setQueryData<{ comments: Comment[] }>(queryKey, {
          comments: previousComments.comments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment,
          ),
        });
      }

      return { previousComments };
    },
    // 에러 시 롤백
    onError: (err, updatedComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.byPostId(updatedComment.postId),
          context.previousComments,
        );
      }
      handleMutationError(err, '댓글 수정');
    },
    // 성공 시 서버 데이터로 갱신
    onSuccess: (data) => {
      if (data.postId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(data.postId) });
      }
      handleMutationSuccess('댓글 수정');
    },
  });
};
