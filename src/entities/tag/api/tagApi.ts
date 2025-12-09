import { Tag } from '@/entities/tag';

// 태그 목록 조회
export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch('/api/posts/tags');
  if (!response.ok) throw new Error('태그 목록 조회 실패');
  return response.json();
};
