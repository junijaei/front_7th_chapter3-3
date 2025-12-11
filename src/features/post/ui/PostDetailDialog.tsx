import { useAtom } from 'jotai';
import { Post } from '@entities/post';
import {
  Comment,
  useGetCommentsByPostId,
  useDeleteComment,
  useCreateComment,
  useUpdateComment,
} from '@entities/comment';
import { useLikeComment } from '@features/comment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from '@shared/ui';
import { highlightText } from '@shared/utils';
import { Comments } from '@entities/comment/ui/Comments';
import {
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  selectedCommentAtom,
  newCommentAtom,
} from '@shared/model';

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
  // Jotai atoms - 댓글 다이얼로그 상태
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom);
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom);
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);
  const [newComment, setNewComment] = useAtom(newCommentAtom);

  // 자체적으로 댓글 데이터 로드
  const { data: commentsData, isLoading } = useGetCommentsByPostId(post?.id || 0, {
    enabled: !!post?.id && isOpen,
  });

  // Mutations
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();

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

  // 댓글 추가 다이얼로그 열기
  const handleOpenAddComment = () => {
    if (!post) return;
    setNewComment({ body: '', postId: post.id, userId: 1 });
    setShowAddCommentDialog(true);
  };

  // 댓글 추가
  const handleAddComment = async () => {
    await createCommentMutation.mutateAsync(newComment);
    setShowAddCommentDialog(false);
    setNewComment({ body: '', postId: 0, userId: 1 });
  };

  // 댓글 수정 다이얼로그 열기
  const handleOpenEditComment = (comment: Comment) => {
    setSelectedComment(comment);
    setShowEditCommentDialog(true);
  };

  // 댓글 수정
  const handleUpdateComment = async () => {
    if (!selectedComment) return;
    await updateCommentMutation.mutateAsync(selectedComment);
    setShowEditCommentDialog(false);
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
                onAddComment={handleOpenAddComment}
                onEditComment={handleOpenEditComment}
                onDeleteComment={handleDeleteComment}
                onLikeComment={handleLikeComment}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 다이얼로그 */}
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
            <Button onClick={handleAddComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 다이얼로그 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ''}
              onChange={(e) =>
                setSelectedComment({ ...selectedComment!, body: e.target.value })
              }
            />
            <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
