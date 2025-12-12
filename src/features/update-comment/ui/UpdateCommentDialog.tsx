import { useAtom } from 'jotai';
import { showEditCommentDialogAtom } from '@/features/update-comment/model/atoms';
import { selectedCommentAtom } from '@entities/comment';
import { useUpdateComment } from '@/features/update-comment/model/useUpdateComment';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Textarea } from '@shared/ui';

export const UpdateCommentDialog = () => {
  const [showDialog, setShowDialog] = useAtom(showEditCommentDialogAtom);
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);
  const updateMutation = useUpdateComment();

  const handleSubmit = async () => {
    if (!selectedComment) return;
    await updateMutation.mutateAsync(selectedComment);
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ''}
            onChange={(e) => setSelectedComment({ ...selectedComment!, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
