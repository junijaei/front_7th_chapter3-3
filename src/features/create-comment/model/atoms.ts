import { atom } from 'jotai';
import { NewComment } from '@entities/comment';

// 댓글 작성 다이얼로그 표시 여부
export const showAddCommentDialogAtom = atom(false);

// 새 댓글 데이터
export const newCommentAtom = atom<NewComment>({ body: '', postId: 0, userId: 1 });
