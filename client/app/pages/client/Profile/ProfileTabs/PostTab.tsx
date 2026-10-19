import { useCallback, useEffect, useRef } from 'react';
import PostCard from '~/components/PostCard';
import { Spinner } from '~/components/ui/spinner';
import { PostService } from '~/services/client/post.service';
import { usePostStore } from '~/store/usePostStore';
import type { GetPostsResponse } from '~/types/post.type';
import type { User } from '~/types/user.type';
import { POSTS_LIMIT } from '../ProfilePage';

type ProfileTabProps = {
  author: User;
  posts: GetPostsResponse;
};

export default function PostTab({
  author,
  posts: initialPosts,
}: ProfileTabProps) {
  const seededPostsPageRef = useRef<GetPostsResponse | null>(null);
  if (seededPostsPageRef.current !== initialPosts) {
    seededPostsPageRef.current = initialPosts;
    const store = usePostStore.getState();
    store.setPosts(initialPosts.data);
    store.setCursorId(initialPosts.pagination.nextCursor ?? undefined);
    store.setHasMore(initialPosts.pagination.hasNextPage);
    store.setIsLoading(false);
  }

  const posts = usePostStore((state) => state.posts);
  const hasMore = usePostStore((state) => state.hasMore);
  const isLoading = usePostStore((state) => state.isLoading);
  const setPosts = usePostStore((state) => state.setPosts);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(
    async (cursor?: string) => {
      const store = usePostStore.getState();
      if (store.isLoading) return;

      store.setIsLoading(true);
      try {
        const res = await PostService.getPosts({
          cursor,
          limit: String(POSTS_LIMIT),
          username: author.username,
        });
        if (cursor) {
          store.addPosts(res.data);
        } else {
          store.setPosts(res.data);
        }
        store.setCursorId(res.pagination.nextCursor ?? undefined);
        store.setHasMore(res.pagination.hasNextPage);
      } catch (err) {
        console.error(err);
      } finally {
        store.setIsLoading(false);
      }
    },
    [author.username],
  ); // trống -> không phụ thuộc vào bất kỳ state nào

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const { hasMore, isLoading, cursorId } = usePostStore.getState();
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPosts(cursorId);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchPosts]);

  return (
    <div className="mt-3 flex flex-col gap-4">
      {posts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          onDelete={(id) => {
            setPosts(posts.filter((p) => p.id !== id));
          }}
        />
      ))}

      <div ref={sentinelRef} />

      {isLoading && (
        <div className="flex justify-center items-center pb-20 sm:pb-4">
          <Spinner className="h-8! w-8! text-accent-foreground/70" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="pb-6 text-center text-sm text-muted-foreground">
          Đã hết bài viết
        </p>
      )}
    </div>
  );
}
