import { useCallback, useEffect, useRef } from 'react';
import CommentCard from '~/components/CommentCard';
import { Spinner } from '~/components/ui/spinner';
import { CommentService } from '~/services/client/comment.service';
import { useCommentStore } from '~/store/useCommentStore';
import type { GetCommentsResponse } from '~/types/comment.type';
import type { User } from '~/types/user.type';
import { COMMENTS_LIMIT } from '../ProfilePage';

type CommentTabProps = {
  author: User;
  comments: GetCommentsResponse;
};

export default function CommentTab({
  author,
  comments: initialComments,
}: CommentTabProps) {
  const seededCommentsPageRef = useRef<GetCommentsResponse | null>(null);
  if (seededCommentsPageRef.current !== initialComments) {
    seededCommentsPageRef.current = initialComments;
    const store = useCommentStore.getState();
    store.setComments(initialComments.data);
    store.setCursorId(initialComments.pagination.nextCursor ?? undefined);
    store.setHasMore(initialComments.pagination.hasNextPage);
    store.setIsLoading(false);
  }

  const comments = useCommentStore((state) => state.comments);
  const hasMore = useCommentStore((state) => state.hasMore);
  const isLoading = useCommentStore((state) => state.isLoading);
  const setComments = useCommentStore((state) => state.setComments);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = useCallback(
    async (cursor?: string) => {
      const store = useCommentStore.getState();
      if (store.isLoading) return;

      store.setIsLoading(true);
      try {
        const res = await CommentService.getComments({
          cursor,
          limit: String(COMMENTS_LIMIT),
          username: author.username,
        });
        if (cursor) {
          store.addComments(res.data);
        } else {
          store.setComments(res.data);
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
        const { hasMore, isLoading, cursorId } = useCommentStore.getState();
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchComments(cursorId);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchComments]);

  return (
    <div className="mt-3 flex flex-col gap-4">
      {comments.map((p) => (
        <CommentCard
          key={p.id}
          comment={p}
          onDelete={(id) => {
            setComments(comments.filter((c) => c.id !== id));
          }}
        />
      ))}

      <div ref={sentinelRef} />

      {isLoading && (
        <div className="flex justify-center items-center pb-20 sm:pb-4">
          <Spinner className="h-8! w-8! text-accent-foreground/70" />
        </div>
      )}

      {!hasMore && comments.length > 0 && (
        <p className="pb-6 text-center text-sm text-muted-foreground">
          Đã hết bình luận
        </p>
      )}
    </div>
  );
}
