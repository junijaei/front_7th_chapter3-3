import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@entities/post/api/postApi';
import { postKeys } from '@entities/post';
import { Post } from '@entities/post';
import { handleMutationSuccess, handleMutationError } from '@shared/lib/error';

export const useDeletePostFeature = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    // 낙관적 업데이트
    onMutate: async (deletedId) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // 이전 데이터 저장
      const previousData = queryClient.getQueriesData({ queryKey: postKeys.lists() });

      // 낙관적 업데이트: 삭제된 게시물 즉시 제거
      queryClient.setQueriesData(
        { queryKey: postKeys.lists() },
        (old: { posts: Post[]; total: number } | undefined) => {
          if (!old?.posts) return old;
          return {
            ...old,
            posts: old.posts.filter((post: Post) => post.id !== deletedId),
            total: old.total - 1,
          };
        },
      );

      return { previousData };
    },
    // 에러 시 롤백
    onError: (err, _, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      handleMutationError(err, '게시물 삭제');
    },
    // 성공 시 서버 데이터로 갱신
    onSuccess: () => {
      handleMutationSuccess('게시물 삭제');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });

  return {
    deletePost: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
