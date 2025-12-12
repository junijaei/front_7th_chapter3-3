import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@entities/comment/api/commentApi';
import { commentKeys } from '@entities/comment';
import { NewComment, Comment } from '@entities/comment';
import { handleMutationSuccess, handleMutationError } from '@shared/lib/error';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: NewComment) => createComment(newComment),
    // 낙관적 업데이트
    onMutate: async (newComment) => {
      const queryKey = commentKeys.byPostId(newComment.postId);

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 저장
      const previousComments = queryClient.getQueryData<{ comments: Comment[] }>(queryKey);

      // 낙관적 업데이트: 임시 ID로 새 댓글 추가
      if (previousComments) {
        const optimisticComment: Comment = {
          id: Date.now(), // 임시 ID
          body: newComment.body,
          postId: newComment.postId,
          userId: newComment.userId,
          likes: 0,
          user: {
            id: newComment.userId,
            username: 'You',
            image: '',
          },
        };

        queryClient.setQueryData<{ comments: Comment[] }>(queryKey, {
          comments: [...previousComments.comments, optimisticComment],
        });
      }

      return { previousComments };
    },
    // 에러 시 롤백
    onError: (err, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPostId(newComment.postId), context.previousComments);
      }
      handleMutationError(err, '댓글 추가');
    },
    // 성공 시 서버 데이터로 갱신
    onSuccess: (data) => {
      if (data.postId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(data.postId) });
      }
      handleMutationSuccess('댓글 추가');
    },
  });
};
