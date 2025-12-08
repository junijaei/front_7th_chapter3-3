import { NewComment } from "../types/comment.types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "."

interface CommentAddDialogProps {
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (show: boolean) => void
  newComment: NewComment
  setNewComment: (comment: NewComment) => void
  addComment: () => void
}

export const CommentAddDialog = ({
  showAddCommentDialog,
  setShowAddCommentDialog,
  newComment,
  setNewComment,
  addComment,
}: CommentAddDialogProps) => {
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
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
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
