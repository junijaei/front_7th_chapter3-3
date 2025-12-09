import { Dispatch, SetStateAction, ReactElement } from 'react';
import { Post } from '@entities/post';
import { Comment, NewComment, Comments } from '@entities/comment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui';

interface PostDetailDialogProps {
  showPostDetailDialog: boolean;
  setShowPostDetailDialog: (show: boolean) => void;
  selectedPost: Post | null;
  searchQuery: string;
  highlightText: (text: string, highlight: string) => ReactElement | null;
  comments: Record<number, Comment[]>;
  setNewComment: Dispatch<SetStateAction<NewComment>>;
  setSelectedComment: (comment: Comment) => void;
  setShowAddCommentDialog: (show: boolean) => void;
  setShowEditCommentDialog: (show: boolean) => void;
  deleteComment: (commentId: number, postId: number) => void;
  likeComment: (commentId: number, postId: number) => void;
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
          <DialogTitle>{highlightText(selectedPost?.title || '', searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || '', searchQuery)}</p>
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
  );
};
