import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAtom } from 'jotai';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@shared/ui';
import { useUrlParams } from '@shared/lib/hooks';
import { Pagination } from '@widgets/pagination';
import { Post, useGetPosts, useSearchPosts, useGetPostsByTag, selectedPostAtom } from '@entities/post';
import { showAddPostDialogAtom } from '@features/create-post';
import { showEditPostDialogAtom } from '@features/update-post';
import { showPostDetailDialogAtom } from '@features/post-detail';
import { PostsTable } from '@widgets/posts-table';
import { SearchFilters } from '@widgets/search-filters';
import { User, useGetUsers, UserModal, showUserModalAtom, selectedUserIdAtom } from '@entities/user';
import { useGetTags } from '@entities/tag';
import { PostAddDialog } from '@features/create-post';
import { PostEditDialog } from '@features/update-post';
import { PostDetailDialog } from '@features/post-detail';
import { useDeletePostFeature } from '@features/delete-post';

const PostsManager = () => {
  // URL 파라미터 관리
  const { params } = useUrlParams();
  const { skip, limit, searchQuery, sortBy, order, selectedTag } = params;

  // Jotai atoms - UI 상태 관리
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [showAddDialog, setShowAddDialog] = useAtom(showAddPostDialogAtom);
  const [showEditDialog, setShowEditDialog] = useAtom(showEditPostDialogAtom);
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom);

  // User UI 상태
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom);
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);

  // TanStack Query: Tags
  const { data: tags = [] } = useGetTags();

  // TanStack Query: Users
  const { data: usersData } = useGetUsers();

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
    const users = usersData?.users || [];
    if (!currentData?.posts || !users.length) return [];

    return currentData.posts.map((post) => ({
      ...post,
      author: users.find((user: User) => user.id === post.userId),
    }));
  }, [currentData, usersData]);

  const total = currentData?.total || 0;

  // Feature Hooks
  const { deletePost } = useDeletePostFeature();

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

  // 게시물 삭제
  const handleDeletePost = async (id: number) => {
    await deletePost(id);
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
          <SearchFilters tags={tags} onSearch={searchPosts} onTagChange={fetchPostsByTag} />

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={postsWithUsers}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onPostDetail={openPostDetail}
              onPostEdit={(post) => {
                setSelectedPost(post);
                setShowEditDialog(true);
              }}
              onPostDelete={handleDeletePost}
              onUserClick={openUserModal}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog isOpen={showAddDialog} onClose={() => setShowAddDialog(false)} />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog isOpen={showEditDialog} onClose={() => setShowEditDialog(false)} />

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
