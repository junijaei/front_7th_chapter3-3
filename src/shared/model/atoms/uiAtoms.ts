import { atom } from 'jotai';
import { Post } from '@entities/post';
import { Comment, NewComment } from '@entities/comment';
import { NewPost } from '@entities/post/model/post.types';

// Post Dialog 상태
export const showAddPostDialogAtom = atom(false);
export const showEditPostDialogAtom = atom(false);
export const showPostDetailDialogAtom = atom(false);
export const selectedPostAtom = atom<Post | null>(null);
export const newPostAtom = atom<NewPost>({ title: '', body: '', userId: 1 });

// Comment Dialog 상태
export const showAddCommentDialogAtom = atom(false);
export const showEditCommentDialogAtom = atom(false);
export const selectedCommentAtom = atom<Comment | null>(null);
export const newCommentAtom = atom<NewComment>({ body: '', postId: 0, userId: 1 });

// User Modal 상태
export const showUserModalAtom = atom(false);
export const selectedUserIdAtom = atom<number | null>(null);
