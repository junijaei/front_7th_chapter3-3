import { useAtom } from 'jotai';
import { useCreatePost } from '@entities/post';
import { showAddPostDialogAtom, newPostAtom } from './atoms';
import { NewPost } from '@entities/post';
import { handleMutationSuccess, handleMutationError } from '@shared/lib/error';

export const useCreatePostFeature = () => {
  const createMutation = useCreatePost();
  const [, setShowDialog] = useAtom(showAddPostDialogAtom);
  const [, setNewPost] = useAtom(newPostAtom);

  const createPost = async (post: NewPost) => {
    try {
      await createMutation.mutateAsync(post);
      setShowDialog(false);
      setNewPost({ title: '', body: '', userId: 1 });
      handleMutationSuccess('게시물 생성');
    } catch (error) {
      handleMutationError(error as Error, '게시물 생성');
      throw error;
    }
  };

  return {
    createPost,
    isLoading: createMutation.isPending,
    error: createMutation.error,
  };
};
