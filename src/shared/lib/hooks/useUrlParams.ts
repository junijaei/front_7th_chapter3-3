import { useLocation, useNavigate } from 'react-router-dom';

interface UrlParams {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
  order: 'asc' | 'desc';
  selectedTag: string;
}

export const useUrlParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 직접 파라미터 읽기 (useState 제거)
  const queryParams = new URLSearchParams(location.search);
  const params: UrlParams = {
    skip: parseInt(queryParams.get('skip') || '0'),
    limit: parseInt(queryParams.get('limit') || '10'),
    searchQuery: queryParams.get('search') || '',
    sortBy: queryParams.get('sortBy') || '',
    order: (queryParams.get('order') as 'asc' | 'desc') || 'asc',
    selectedTag: queryParams.get('tag') || '',
  };

  // URL 업데이트 함수
  const updateUrl = (newParams: Partial<UrlParams>) => {
    const updatedParams = { ...params, ...newParams };
    const urlParams = new URLSearchParams();

    if (updatedParams.skip) urlParams.set('skip', updatedParams.skip.toString());
    if (updatedParams.limit) urlParams.set('limit', updatedParams.limit.toString());
    if (updatedParams.searchQuery) urlParams.set('search', updatedParams.searchQuery);
    if (updatedParams.sortBy) urlParams.set('sortBy', updatedParams.sortBy);
    if (updatedParams.order) urlParams.set('order', updatedParams.order);
    if (updatedParams.selectedTag) urlParams.set('tag', updatedParams.selectedTag);

    navigate(`?${urlParams.toString()}`);
  };

  return { params, updateUrl };
};
