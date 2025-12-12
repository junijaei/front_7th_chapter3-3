import { useAtom } from 'jotai';
import { showAddCommentDialogAtom, newCommentAtom } from '@/features/create-comment/model/atoms';
import { useCreateComment } from '@/features/create-comment/model/useCreateComment';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Textarea } from '@shared/ui';

export const CreateCommentDialog = () => {
  const [showDialog, setShowDialog] = useAtom(showAddCommentDialogAtom);
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const createMutation = useCreateComment();

  const handleSubmit = async () => {
    await createMutation.mutateAsync(newComment);
    setShowDialog(false);
    setNewComment({ body: '', postId: 0, userId: 1 });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
