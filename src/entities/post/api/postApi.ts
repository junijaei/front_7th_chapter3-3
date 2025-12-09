import { Post, NewPost } from '@/entities/post/model/post.types';

export interface FetchPostsParams {
  limit: number;
  skip: number;
}

export interface FetchPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchPostsParams {
  q: string;
}

export interface FetchPostsByTagResponse {
  posts: Post[];
  total: number;
}

// 게시물 목록 조회
export const fetchPosts = async (params: FetchPostsParams): Promise<FetchPostsResponse> => {
  const response = await fetch(`/api/posts?limit=${params.limit}&skip=${params.skip}`);
  if (!response.ok) throw new Error('게시물 조회 실패');
  return response.json();
};

// 게시물 검색
export const searchPosts = async (params: SearchPostsParams): Promise<FetchPostsResponse> => {
  const response = await fetch(`/api/posts/search?q=${params.q}`);
  if (!response.ok) throw new Error('게시물 검색 실패');
  return response.json();
};

// 태그별 게시물 조회
export const fetchPostsByTag = async (tag: string): Promise<FetchPostsByTagResponse> => {
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
