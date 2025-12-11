import { Search } from 'lucide-react';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui';
import { Tag } from '@entities/tag';
import { useUrlParams } from '@shared/lib/hooks';

interface SearchFiltersProps {
  tags: Tag[];
  onSearch?: () => void;
  onTagChange?: (tag: string) => void;
}

export const SearchFilters = ({ tags, onSearch, onTagChange }: SearchFiltersProps) => {
  const { params, updateUrl } = useUrlParams();
  const { searchQuery, selectedTag, sortBy, order } = params;

  const handleSearchQueryChange = (value: string) => {
    updateUrl({ searchQuery: value });
  };

  const handleSearch = () => {
    onSearch?.();
  };

  const handleTagChange = (value: string) => {
    updateUrl({ selectedTag: value, skip: 0 });
    onTagChange?.(value);
  };

  const handleSortByChange = (value: string) => {
    updateUrl({ sortBy: value });
  };

  const handleOrderChange = (value: string) => {
    updateUrl({ order: value as 'asc' | 'desc' });
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>
      <Select value={selectedTag} onValueChange={handleTagChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={order} onValueChange={handleOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
