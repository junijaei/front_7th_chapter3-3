import { atom } from 'jotai';

// 사용자 모달 표시 여부
export const showUserModalAtom = atom(false);

// 선택된 사용자 ID
export const selectedUserIdAtom = atom<number | null>(null);
