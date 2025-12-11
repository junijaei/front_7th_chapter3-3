import { GetPostsParams, SearchPostsParams } from '@/entities/post/api/postApi';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: GetPostsParams) => [...postKeys.lists(), params] as const,
  search: (params: SearchPostsParams) => [...postKeys.all, 'search', params] as const,
  byTag: (tag: string) => [...postKeys.all, 'tag', tag] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};
