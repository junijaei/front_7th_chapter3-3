import { atom } from 'jotai';
import { Comment } from './comment.types';

// 선택된 댓글 (수정, 삭제 등 여러 feature에서 공유)
export const selectedCommentAtom = atom<Comment | null>(null);
