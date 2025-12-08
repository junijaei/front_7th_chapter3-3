import { Comment } from "../types/comment.types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "."

interface CommentEditDialogProps {
  showEditCommentDialog: boolean
  setShowEditCommentDialog: (show: boolean) => void
  selectedComment: Comment | null
  setSelectedComment: (comment: Comment) => void
  updateComment: () => void
}

export const CommentEditDialog = ({
  showEditCommentDialog,
  setShowEditCommentDialog,
  selectedComment,
  setSelectedComment,
  updateComment,
}: CommentEditDialogProps) => {
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment!, body: e.target.value })}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
