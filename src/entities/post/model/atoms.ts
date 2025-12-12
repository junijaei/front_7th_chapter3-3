import { atom } from 'jotai';
import { Post } from './post.types';

// 선택된 게시글 (상세보기, 수정, 삭제 등 여러 feature에서 공유)
export const selectedPostAtom = atom<Post | null>(null);
