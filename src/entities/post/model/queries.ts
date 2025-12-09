import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import {
  fetchPosts,
  searchPosts,
  fetchPostsByTag,
  createPost,
  updatePost,
  deletePost,
  FetchPostsParams,
  FetchPostsResponse,
  SearchPostsParams,
  FetchPostsByTagResponse,
} from '@/entities/post/api/postApi';
import { postKeys } from '@/entities/post/api/queryKeys';
import { NewPost, Post } from '@/entities/post/model/post.types';

// 게시물 목록 조회
export const useFetchPosts = (
  params: FetchPostsParams,
  options?: Omit<UseQueryOptions<FetchPostsResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => fetchPosts(params),
    ...options,
  });
};

// 게시물 검색
export const useSearchPosts = (
  params: SearchPostsParams,
  options?: Omit<UseQueryOptions<FetchPostsResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: postKeys.search(params),
    queryFn: () => searchPosts(params),
    ...options,
  });
};

// 태그별 게시물 조회
export const useFetchPostsByTag = (
  tag: string,
  options?: Omit<UseQueryOptions<FetchPostsByTagResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: postKeys.byTag(tag),
    queryFn: () => fetchPostsByTag(tag),
    ...options,
  });
};

// 게시물 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: NewPost) => createPost(newPost),
    onSuccess: () => {
      // 모든 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

// 게시물 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Post) => updatePost(post),
    onSuccess: (data) => {
      // 특정 게시물 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.id) });
      // 모든 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      // 모든 게시물 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
