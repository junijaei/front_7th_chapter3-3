import { Post } from '@entities/post';
import { useGetCommentsByPostId } from '@entities/comment';
import { useLikeComment } from '@features/like-comment';
import { AddCommentButton, CreateCommentDialog } from '@features/create-comment';
import { UpdateCommentDialog, useEditCommentDialog } from '@features/update-comment';
import { useDeleteComment } from '@features/delete-comment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui';
import { highlightText } from '@shared/utils';
import { Comments } from '@entities/comment/ui/Comments';

interface PostDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  searchQuery?: string;
}

export const PostDetailDialog = ({
  isOpen,
  onClose,
  post,
  searchQuery = '',
}: PostDetailDialogProps) => {
  // 자체적으로 댓글 데이터 로드
  const { data: commentsData, isLoading } = useGetCommentsByPostId(post?.id || 0, {
    enabled: !!post?.id && isOpen,
  });

  // Feature Hooks
  const likeCommentMutation = useLikeComment();
  const deleteCommentMutation = useDeleteComment();
  const { openEditDialog } = useEditCommentDialog();

  const comments = commentsData?.comments || [];

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    if (!post) return;
    await deleteCommentMutation.mutateAsync({ id: commentId, postId: post.id });
  };

  // 댓글 좋아요 핸들러
  const handleLikeComment = async (commentId: number) => {
    if (!post) return;
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    await likeCommentMutation.mutateAsync({
      id: commentId,
      postId: post.id,
      currentLikes: comment.likes,
    });
  };

  return (
    <>
      {/* 게시물 상세 다이얼로그 */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(post?.title || '', searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(post?.body || '', searchQuery)}</p>
            {isLoading ? (
              <div className="flex justify-center p-4">댓글 로딩 중...</div>
            ) : (
              <Comments
                comments={comments}
                postId={post?.id || 0}
                searchQuery={searchQuery}
                addCommentSlot={post && <AddCommentButton postId={post.id} />}
                onEditComment={openEditDialog}
                onDeleteComment={handleDeleteComment}
                onLikeComment={handleLikeComment}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Feature 다이얼로그들 (전역 렌더링) */}
      <CreateCommentDialog />
      <UpdateCommentDialog />
    </>
  );
};
