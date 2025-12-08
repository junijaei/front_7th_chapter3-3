import { Post } from "../types/post.types"
import { Comment, NewComment } from "../types/comment.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "."
import { Comments } from "./Comments"

interface PostDetailDialogProps {
  showPostDetailDialog: boolean
  setShowPostDetailDialog: (show: boolean) => void
  selectedPost: Post | null
  searchQuery: string
  highlightText: (text: string, highlight: string) => JSX.Element | null
  comments: Record<number, Comment[]>
  setNewComment: (comment: NewComment) => void
  setSelectedComment: (comment: Comment) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
  deleteComment: (commentId: number, postId: number) => void
  likeComment: (commentId: number, postId: number) => void
}

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  highlightText,
  comments,
  setNewComment,
  setSelectedComment,
  setShowAddCommentDialog,
  setShowEditCommentDialog,
  deleteComment,
  likeComment,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          <Comments
            comments={comments}
            deleteComment={deleteComment}
            likeComment={likeComment}
            postId={selectedPost!.id}
            searchQuery={searchQuery}
            setNewComment={setNewComment}
            setSelectedComment={setSelectedComment}
            setShowAddCommentDialog={setShowAddCommentDialog}
            setShowEditCommentDialog={setShowEditCommentDialog}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
