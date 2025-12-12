import { useSetAtom } from 'jotai';
import { showAddCommentDialogAtom, newCommentAtom } from '../model/atoms';
import { Button } from '@shared/ui';

interface AddCommentButtonProps {
  postId: number;
}

export const AddCommentButton = ({ postId }: AddCommentButtonProps) => {
  const setShowDialog = useSetAtom(showAddCommentDialogAtom);
  const setNewComment = useSetAtom(newCommentAtom);

  const handleClick = () => {
    setNewComment({ body: '', postId, userId: 1 });
    setShowDialog(true);
  };

  return <Button onClick={handleClick}>댓글 추가</Button>;
};
