import { useQuery } from '@tanstack/react-query';
import { getTags } from '@/entities/tag/api/tagApi';
import { tagKeys } from '@/entities/tag/api/queryKeys';

// 태그 목록 조회
export const useGetTags = () => {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => getTags(),
  });
};
