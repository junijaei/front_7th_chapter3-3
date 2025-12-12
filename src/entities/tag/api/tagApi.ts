import { Tag } from '@/entities/tag';
import { API_BASE_URL } from '@/shared/api';

// 태그 목록 조회
export const getTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/tags`);
  if (!response.ok) throw new Error('태그 목록 조회 실패');
  return response.json();
};
