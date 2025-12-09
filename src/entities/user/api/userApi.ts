import { User } from '@/entities/user/model/user.types';

export interface FetchUsersResponse {
  users: User[];
  total: number;
}

// 사용자 목록 조회 (username, image만)
export const fetchUsers = async (): Promise<FetchUsersResponse> => {
  const response = await fetch('/api/users?limit=0&select=username,image');
  if (!response.ok) throw new Error('사용자 목록 조회 실패');
  return response.json();
};

// 사용자 상세 조회
export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('사용자 상세 조회 실패');
  return response.json();
};
