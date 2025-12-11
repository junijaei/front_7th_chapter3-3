import { Post, NewPost } from '@/entities/post/model/post.types';

export interface GetPostsParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface GetPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchPostsParams {
  q: string;
}

export interface GetPostsByTagResponse {
  posts: Post[];
  total: number;
}

// 게시물 목록 조회
export const getPosts = async (params: GetPostsParams): Promise<GetPostsResponse> => {
  const url = new URLSearchParams({
    limit: params.limit.toString(),
    skip: params.skip.toString(),
  });

  if (params.sortBy) url.append('sortBy', params.sortBy);
  if (params.order) url.append('order', params.order);

  const response = await fetch(`/api/posts?${url.toString()}`);
  if (!response.ok) throw new Error('게시물 조회 실패');
  return response.json();
};

// 게시물 검색
export const searchPosts = async (params: SearchPostsParams): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts/search?q=${params.q}`);
  if (!response.ok) throw new Error('게시물 검색 실패');
  return response.json();
};

// 태그별 게시물 조회
export const getPostsByTag = async (tag: string): Promise<GetPostsByTagResponse> => {
  const response = await fetch(`/api/posts/tag/${tag}`);
  if (!response.ok) throw new Error('태그별 게시물 조회 실패');
  return response.json();
};

// 게시물 생성
export const createPost = async (newPost: NewPost): Promise<Post> => {
  const response = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  if (!response.ok) throw new Error('게시물 생성 실패');
  return response.json();
};

// 게시물 수정
export const updatePost = async (post: Post): Promise<Post> => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  if (!response.ok) throw new Error('게시물 수정 실패');
  return response.json();
};

// 게시물 삭제
export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('게시물 삭제 실패');
};
