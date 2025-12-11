import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@entities/comment/api/queryKeys';
import { likeComment, LikeCommentParams } from '../api/likeComment';

interface UseLikeCommentParams extends LikeCommentParams {
  postId: number;
}

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UseLikeCommentParams) =>
      likeComment({ id: params.id, currentLikes: params.currentLikes }),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({ queryKey: commentKeys.byPostId(variables.postId) });
    },
  });
};
