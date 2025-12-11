import { Post } from '@entities/post';
import { User } from '@entities/user';
import { PostTableView } from '@entities/post/ui/PostTableView';
import { highlightText } from '@shared/utils';
import { useUrlParams } from '@shared/lib/hooks';

interface PostsTableProps {
  posts: Post[];
  searchQuery?: string;
  selectedTag?: string;
  onPostDetail: (post: Post) => void;
  onPostEdit: (post: Post) => void;
  onPostDelete: (postId: number) => void;
  onUserClick: (user: User) => void;
}

export const PostsTable = ({
  posts,
  searchQuery = '',
  selectedTag = '',
  onPostDetail,
  onPostEdit,
  onPostDelete,
  onUserClick,
}: PostsTableProps) => {
  const { updateUrl } = useUrlParams();

  const handleTagClick = (tag: string) => {
    updateUrl({ selectedTag: tag, skip: 0 });
  };

  return (
    <PostTableView
      posts={posts}
      searchQuery={searchQuery}
      selectedTag={selectedTag}
      onRowClick={onPostDetail}
      onEdit={onPostEdit}
      onDelete={onPostDelete}
      onTagClick={handleTagClick}
      onUserClick={onUserClick}
      renderHighlight={highlightText}
    />
  );
};
