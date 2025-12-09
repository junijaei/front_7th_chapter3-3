import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination } from '@shared/ui';
import { highlightText } from '@shared/utils';
import {
  Post,
  NewPost,
  useFetchPosts,
  useSearchPosts,
  useFetchPostsByTag,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  PostTable,
} from '@entities/post';
import {
  Comment,
  NewComment,
  useFetchCommentsByPostId,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useLikeComment,
} from '@entities/comment';
import { User, useFetchUsers, useFetchUserById, UserModal } from '@entities/user';
import { useFetchTags } from '@entities/tag';
import { PostAddDialog, PostEditDialog, PostDetailDialog, SearchAndFilters } from '@features/post';
import { CommentAddDialog, CommentEditDialog } from '@features/comment';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // URL 파라미터 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '');

  // UI 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({ title: '', body: '', userId: 1 });

  // Comment UI 상태
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState<NewComment>({ body: '', postId: null, userId: 1 });
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);

  // User UI 상태
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // TanStack Query: Tags
  const { data: tags = [] } = useFetchTags();

  // TanStack Query: Users
  const { data: usersData } = useFetchUsers();
  const users = usersData?.users || [];

  // TanStack Query: Posts (조건부)
  const shouldFetchPosts = !searchQuery && (!selectedTag || selectedTag === 'all');
  const shouldSearchPosts = !!searchQuery;
  const shouldFetchByTag = !!selectedTag && selectedTag !== 'all' && !searchQuery;

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useFetchPosts(
    { limit, skip },
    {
      enabled: shouldFetchPosts,
    },
  );

  const {
    data: searchData,
    isLoading: isSearching,
    refetch: refetchSearch,
  } = useSearchPosts({ q: searchQuery }, { enabled: shouldSearchPosts });

  const {
    data: tagData,
    isLoading: isLoadingByTag,
    refetch: refetchByTag,
  } = useFetchPostsByTag(selectedTag, { enabled: shouldFetchByTag });

  // 현재 활성화된 데이터 소스 결정
  const currentData = shouldSearchPosts ? searchData : shouldFetchByTag ? tagData : postsData;
  const isLoading = isLoadingPosts || isSearching || isLoadingByTag;

  // Posts와 Users 조합
  const postsWithUsers = useMemo(() => {
    if (!currentData?.posts || !users.length) return [];

    return currentData.posts.map((post) => ({
      ...post,
      author: users.find((user: User) => user.id === post.userId),
    }));
  }, [currentData?.posts, users]);

  const total = currentData?.total || 0;

  // TanStack Query: Comments (selectedPost가 있을 때만)
  const { data: commentsData, refetch: refetchComments } = useFetchCommentsByPostId(
    selectedPost?.id || 0,
    {
      enabled: !!selectedPost?.id && showPostDetailDialog,
    },
  );

  const comments = useMemo(() => {
    if (!selectedPost?.id || !commentsData?.comments) return {};
    return { [selectedPost.id]: commentsData.comments };
  }, [selectedPost?.id, commentsData?.comments]);

  // TanStack Query: User Detail
  const { data: selectedUser } = useFetchUserById(selectedUserId || 0, {
    enabled: !!selectedUserId && showUserModal,
  });

  // Mutations
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 게시물 검색
  const searchPosts = () => {
    if (!searchQuery) {
      refetchPosts();
      return;
    }
    refetchSearch();
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = (tag: string) => {
    if (!tag || tag === 'all') {
      refetchPosts();
      return;
    }
    refetchByTag();
  };

  // 게시물 추가
  const addPost = async () => {
    await createPostMutation.mutateAsync(newPost);
    setShowAddDialog(false);
    setNewPost({ title: '', body: '', userId: 1 });
  };

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return;
    await updatePostMutation.mutateAsync(selectedPost);
    setShowEditDialog(false);
  };

  // 게시물 삭제
  const deletePost = async (id: number) => {
    await deletePostMutation.mutateAsync(id);
  };

  // 댓글 추가
  const addComment = async () => {
    await createCommentMutation.mutateAsync(newComment);
    setShowAddCommentDialog(false);
    setNewComment({ body: '', postId: null, userId: 1 });
    refetchComments();
  };

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return;
    await updateCommentMutation.mutateAsync(selectedComment);
    setShowEditCommentDialog(false);
    refetchComments();
  };

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    await deleteCommentMutation.mutateAsync({ id, postId });
    refetchComments();
  };

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    const comment = comments[postId]?.find((c) => c.id === id);
    if (!comment) return;

    await likeCommentMutation.mutateAsync({
      id,
      postId,
      currentLikes: comment.likes,
    });
    refetchComments();
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = (user: User) => {
    setSelectedUserId(user.id);
    setShowUserModal(true);
  };

  // URL 파라미터 변경 감지
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  // 파라미터 변경 시 URL 업데이트
  useEffect(() => {
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPosts={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            fetchPostsByTag={fetchPostsByTag}
            updateURL={updateURL}
            tags={tags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={postsWithUsers}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              openPostDetail={openPostDetail}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              deletePost={deletePost}
              openUserModal={openUserModal}
              highlightText={highlightText}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={limit}
            setLimit={setLimit}
            skip={skip}
            setSkip={setSkip}
            total={total}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        updatePost={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        updateComment={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
        highlightText={highlightText}
        comments={comments}
        setNewComment={setNewComment}
        setSelectedComment={setSelectedComment}
        setShowAddCommentDialog={setShowAddCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        deleteComment={deleteComment}
        likeComment={likeComment}
      />

      {/* 사용자 모달 */}
      <UserModal
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        selectedUser={selectedUser || null}
      />
    </Card>
  );
};

export default PostsManager;
