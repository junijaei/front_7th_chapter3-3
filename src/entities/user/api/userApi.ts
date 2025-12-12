import { User } from '@/entities/user/model/user.types';
import { API_BASE_URL } from '@/shared/api';

export interface GetUsersResponse {
  users: User[];
  total: number;
}

// 사용자 목록 조회 (username, image만)
export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`);
  if (!response.ok) throw new Error('사용자 목록 조회 실패');
  return response.json();
};

// 사용자 상세 조회
export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) throw new Error('사용자 상세 조회 실패');
  return response.json();
};
