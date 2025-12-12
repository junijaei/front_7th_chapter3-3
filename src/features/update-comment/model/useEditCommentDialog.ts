import { useSetAtom } from 'jotai';
import { showEditCommentDialogAtom } from './atoms';
import { selectedCommentAtom, Comment } from '@entities/comment';

/**
 * 댓글 수정 다이얼로그를 여는 hook
 * Feature의 내부 상태(atoms)를 캡슐화하여 외부에 노출하지 않습니다.
 */
export const useEditCommentDialog = () => {
  const setShowDialog = useSetAtom(showEditCommentDialogAtom);
  const setSelectedComment = useSetAtom(selectedCommentAtom);

  const openEditDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setShowDialog(true);
  };

  return { openEditDialog };
};
