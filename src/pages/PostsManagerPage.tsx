import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAtom } from 'jotai';
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination } from '@shared/ui';
import { highlightText } from '@shared/utils';
import { useUrlParams } from '@shared/lib/hooks';
import {
  showAddPostDialogAtom,
  showEditPostDialogAtom,
  showPostDetailDialogAtom,
  selectedPostAtom,
  newPostAtom,
  showUserModalAtom,
  selectedUserIdAtom,
} from '@shared/model';
import {
  Post,
  useGetPosts,
  useSearchPosts,
  useGetPostsByTag,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  PostTable,
} from '@entities/post';
import { User, useGetUsers, UserModal } from '@entities/user';
import { useGetTags } from '@entities/tag';
import { PostAddDialog, PostEditDialog, PostDetailDialog, SearchAndFilters } from '@features/post';

const PostsManager = () => {
  // URL 파라미터 관리
  const { params, updateUrl } = useUrlParams();
  const { skip, limit, searchQuery, sortBy, order, selectedTag } = params;

  // Jotai atoms - UI 상태 관리
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [showAddDialog, setShowAddDialog] = useAtom(showAddPostDialogAtom);
  const [showEditDialog, setShowEditDialog] = useAtom(showEditPostDialogAtom);
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom);
  const [newPost, setNewPost] = useAtom(newPostAtom);

  // User UI 상태
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom);
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);

  // TanStack Query: Tags
  const { data: tags = [] } = useGetTags();

  // TanStack Query: Users
  const { data: usersData } = useGetUsers();
  const users = usersData?.users || [];

  // TanStack Query: Posts (조건부)
  const shouldFetchPosts = !searchQuery && (!selectedTag || selectedTag === 'all');
  const shouldSearchPosts = !!searchQuery;
  const shouldFetchByTag = !!selectedTag && selectedTag !== 'all' && !searchQuery;

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useGetPosts(
    { limit, skip, sortBy, order },
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
  } = useGetPostsByTag(selectedTag, { enabled: shouldFetchByTag });

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
  }, [currentData, users]);

  const total = currentData?.total || 0;

  // Mutations
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

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
            setSearchQuery={(q) => updateUrl({ searchQuery: q })}
            searchPosts={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={(tag) => updateUrl({ selectedTag: tag })}
            fetchPostsByTag={fetchPostsByTag}
            updateURL={() => {}}
            tags={tags}
            sortBy={sortBy}
            setSortBy={(sb) => updateUrl({ sortBy: sb })}
            order={order}
            setOrder={(o) => updateUrl({ order: o as 'asc' | 'desc' })}
          />

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={postsWithUsers}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={(tag) => updateUrl({ selectedTag: tag })}
              updateURL={() => {}}
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
            setLimit={(l) => updateUrl({ limit: l })}
            skip={skip}
            setSkip={(s) => updateUrl({ skip: s })}
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

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        isOpen={showPostDetailDialog}
        onClose={() => setShowPostDetailDialog(false)}
        post={selectedPost}
        searchQuery={searchQuery}
      />

      {/* 사용자 모달 */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        userId={selectedUserId}
      />
    </Card>
  );
};

export default PostsManager;
