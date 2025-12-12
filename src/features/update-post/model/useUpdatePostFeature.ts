import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { updatePost } from '@entities/post/api/postApi';
import { postKeys } from '@entities/post';
import { showEditPostDialogAtom } from '@shared/model';
import { Post } from '@entities/post';
import { handleMutationSuccess, handleMutationError } from '@shared/lib/error';

export const useUpdatePostFeature = () => {
  const queryClient = useQueryClient();
  const [, setShowDialog] = useAtom(showEditPostDialogAtom);

  const mutation = useMutation({
    mutationFn: (post: Post) => updatePost(post),
    // 낙관적 업데이트
    onMutate: async (updatedPost) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // 이전 데이터 저장
      const previousData = queryClient.getQueriesData({ queryKey: postKeys.lists() });

      // 낙관적 업데이트 적용
      queryClient.setQueriesData(
        { queryKey: postKeys.lists() },
        (old: { posts: Post[]; total: number } | undefined) => {
          if (!old?.posts) return old;
          return {
            ...old,
            posts: old.posts.map((post: Post) =>
              post.id === updatedPost.id ? { ...post, ...updatedPost } : post,
            ),
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
      handleMutationError(err, '게시물 수정');
    },
    // 성공 시 다이얼로그 닫기 및 서버 데이터로 갱신
    onSuccess: (data) => {
      setShowDialog(false);
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      handleMutationSuccess('게시물 수정');
    },
  });

  return {
    updatePost: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
