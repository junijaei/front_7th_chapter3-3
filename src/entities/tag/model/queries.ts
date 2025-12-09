import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '@/entities/tag/api/tagApi';
import { tagKeys } from '@/entities/tag/api/queryKeys';

// 태그 목록 조회
export const useFetchTags = () => {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => fetchTags(),
  });
};
