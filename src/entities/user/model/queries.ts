import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchUsers, fetchUserById, FetchUsersResponse } from '@/entities/user/api/userApi';
import { userKeys } from '@/entities/user/api/queryKeys';
import { User } from '@/entities/user/model/user.types';

// 사용자 목록 조회
export const useFetchUsers = (
  options?: Omit<UseQueryOptions<FetchUsersResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => fetchUsers(),
    ...options,
  });
};

// 사용자 상세 조회
export const useFetchUserById = (
  id: number,
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    ...options,
  });
};
