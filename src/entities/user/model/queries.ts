import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUsers, getUserById, GetUsersResponse } from '@/entities/user/api/userApi';
import { userKeys } from '@/entities/user/api/queryKeys';
import { User } from '@/entities/user/model/user.types';

// 사용자 목록 조회
export const useGetUsers = (
  options?: Omit<UseQueryOptions<GetUsersResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => getUsers(),
    ...options,
  });
};

// 사용자 상세 조회
export const useGetUserById = (
  id: number,
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    ...options,
  });
};
