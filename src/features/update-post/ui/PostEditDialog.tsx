import { useAtom } from 'jotai';
import { selectedPostAtom } from '@entities/post';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@shared/ui';
import { useUpdatePostFeature } from '@/features/update-post/model/useUpdatePostFeature';

interface PostEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostEditDialog = ({ isOpen, onClose }: PostEditDialogProps) => {
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const { updatePost, isLoading } = useUpdatePostFeature();

  const handleSubmit = async () => {
    if (!selectedPost) return;
    await updatePost(selectedPost);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ''}
            onChange={(e) => setSelectedPost({ ...selectedPost!, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ''}
            onChange={(e) => setSelectedPost({ ...selectedPost!, body: e.target.value })}
          />
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '수정 중...' : '게시물 업데이트'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
