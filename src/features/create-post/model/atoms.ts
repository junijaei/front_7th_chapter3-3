import { atom } from 'jotai';
import { NewPost } from '@entities/post/model/post.types';

// 게시글 작성 다이얼로그 표시 여부
export const showAddPostDialogAtom = atom(false);

// 새 게시글 데이터
export const newPostAtom = atom<NewPost>({ title: '', body: '', userId: 1 });
