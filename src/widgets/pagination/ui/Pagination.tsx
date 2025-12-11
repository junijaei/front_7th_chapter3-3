import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui';
import { useUrlParams } from '@shared/lib/hooks';

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const { params, updateUrl } = useUrlParams();
  const { limit, skip } = params;

  const handleLimitChange = (value: string) => {
    updateUrl({ limit: Number(value), skip: 0 });
  };

  const handlePrev = () => {
    updateUrl({ skip: Math.max(0, skip - limit) });
  };

  const handleNext = () => {
    updateUrl({ skip: skip + limit });
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={handlePrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
};
