import { ArrowLeftToLine, MessageCircle } from 'lucide-react';
import { Suspense, use, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import CommentCard from '~/components/CommentCard';
import CommentFormPopup from '~/components/CommentFormPopup';
import ExpandableText from '~/components/ExpandableText';
import InteractCard from '~/components/InteractCard';
import OptionPopover from '~/components/OptionPopover';
import { Button } from '~/components/ui/button';
import { Field, FieldGroup, FieldSet } from '~/components/ui/field';
import { Progress } from '~/components/ui/progress';
import { Spinner } from '~/components/ui/spinner';
import { Textarea } from '~/components/ui/textarea';
import { CommentService } from '~/services/client/comment.service';
import { PostService } from '~/services/client/post.service';
import { useCommentStore } from '~/store/useCommentStore';
import type { GetCommentsResponse } from '~/types/comment.type';
import type { Post } from '~/types/post.type';
import { formatDateTime } from '~/utils/formatDateTime';
import { getErrorMessage } from '~/utils/getErrorMessage';
import { asyncTimeout } from '~/utils/setTimeout';

export const COMMENTS_LIMIT = 30;

type DetailData = {
  detail: Post;
  comments: GetCommentsResponse;
};

type DetailPageProps = {
  dataPromise: Promise<DetailData>;
};

export function DetailPage({ dataPromise }: DetailPageProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-background relative">
      <div className="p-2 sticky top-0 z-10 flex justify-start items-center gap-5 border-b-2 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full active:scale-95 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftToLine className="size-5" />
        </Button>
        <p className="font-bold text-xl md:text-2xl">Bài đăng</p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            <Spinner className="h-8! w-8!" />
          </div>
        }
      >
        <DetailContent dataPromise={dataPromise} />
      </Suspense>
    </div>
  );
}

function DetailContent({ dataPromise }: DetailPageProps) {
  const navigate = useNavigate();
  const { detail, comments: initialComments } = use(dataPromise);

  const seededPostsPageRef = useRef<GetCommentsResponse | null>(null);
  if (seededPostsPageRef.current !== initialComments) {
    seededPostsPageRef.current = initialComments;
    const store = useCommentStore.getState();
    store.setComments(initialComments.data);
    store.setCursorId(initialComments.pagination.nextCursor ?? undefined);
    store.setHasMore(initialComments.pagination.hasNextPage);
    store.setIsLoading(false);
  }

  const [content, setContent] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const comments = useCommentStore((state) => state.comments);
  const hasMore = useCommentStore((state) => state.hasMore);
  const isLoading = useCommentStore((state) => state.isLoading);
  const setComments = useCommentStore((state) => state.setComments);

  // config for open popup state
  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = useCallback(async (postId: string, cursor?: string) => {
    const store = useCommentStore.getState();
    if (store.isLoading) return;

    store.setIsLoading(true);
    try {
      const res = await CommentService.getComments({
        cursor,
        postId: postId,
        limit: String(COMMENTS_LIMIT),
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
  }, []); // trống -> không phụ thuộc vào bất kỳ state nào

  useEffect(() => {
    const id = detail.id;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const { hasMore, isLoading, cursorId } = useCommentStore.getState();
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchComments(id, cursorId);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [detail.id, fetchComments]);

  const handleUpComment = useCallback(async () => {
    const id = detail.id;
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung!');
      throw new Error('Điền thiếu trường quan trọng.');
    }

    let progressTimer: NodeJS.Timeout | null = null;

    try {
      setIsSubmitting(true);
      setProgress(15);

      progressTimer = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 25));
      }, 100);

      await asyncTimeout(500);
      await CommentService.createComment({
        content: content,
        postId: id,
      });

      if (progressTimer) clearInterval(progressTimer);
      setProgress(100);

      await asyncTimeout(300);

      setContent('');

      await fetchComments(id);
    } catch (err) {
      console.error('Lỗi khi bình luân:', err);
      toast.error(
        getErrorMessage(err, 'Gửi bình luận thất bại. Vui lòng thử lại.'),
      );
      throw err;
    } finally {
      if (progressTimer) clearInterval(progressTimer);

      setIsSubmitting(false);
      setProgress(0);
    }
  }, [detail.id, content, fetchComments]);

  const handleDeletePost = async () => {
    try {
      await PostService.deletePost(detail.id);
      toast.success('Xóa bài viết thành công!');
      navigate('/');
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
      toast.error('Xóa bài viết thất bại!');
      throw err;
    }
  };

  return (
    <>
      <div className="p-2 relative">
        <div className="mt-4 pb-4 border-b relative">
          <div className="flex px-1.5 gap-3">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shrink-0 border border-accent select-none overflow-hidden">
              <span className="text-xl">🦆</span>
            </div>
            <div>
              <p className="font-bold">{detail.author.name}</p>
              <p className="text-sm text-accent-foreground/60">
                {detail.author.username}
              </p>
            </div>
          </div>
          <div className="max-w-[95%] pt-3 px-1.5">
            <p className="text-base md:text-xl font-bold text-accent-foreground/70 leading-normal whitespace-pre-line wrap-anywhere">
              {detail.title}
            </p>
            <ExpandableText
              text={detail.content}
              maxLength={500}
              className="mt-1.5 text-sm md:text-base text-foreground leading-normal whitespace-pre-line wrap-anywhere"
            />
          </div>
          <div className="pt-3 px-1.5">
            <p className="text-sm text-accent-foreground/60">
              {formatDateTime(detail.createdAt)}
            </p>
          </div>

          <OptionPopover
            open={openPopover}
            setOpen={setOpenPopover}
            for={'post'}
            deleteFunc={handleDeletePost}
            author={detail.author.username}
            className="-top-1.5"
          />
        </div>

        <InteractCard
          comments={detail._count.comments}
          likes={190904}
          views={Number('05032004')}
        />

        <div className="hidden md:block my-3 border-b border-accent"></div>

        <div className="hidden md:flex mt-3 flex-1 min-w-0 justify-between items-start gap-3">
          <div className="mt-0.5 w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0 border border-accent select-none overflow-hidden">
            <span className="text-xl">🦆</span>
          </div>

          <FieldSet className="w-full">
            <FieldGroup className="gap-1">
              <Field>
                <Textarea
                  id="content"
                  placeholder={`Trả lời ${detail.author.username}`}
                  rows={1}
                  className="text-base md:text-lg border-none shadow-none resize-none focus-visible:ring-0 px-2 placeholder:text-muted-foreground/60 min-h-0 max-h-36"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            onClick={() => handleUpComment()}
            disabled={isSubmitting}
            className="mt-1 w-24 h-9 rounded-2xl cursor-pointer"
          >
            {isSubmitting ? 'Đang trả lời...' : 'Trả lời'}
          </Button>

          {isSubmitting && (
            <div className="absolute top-0 left-0 w-full">
              <Progress
                value={progress}
                className="w-full h-1 rounded-none animate-pulse bg-accent"
              />
            </div>
          )}

          <div className="mt-5 flex justify-between items-center"></div>
        </div>

        <div className="my-3 border-b border-accent"></div>

        <div className="p-2 flex flex-col gap-4">
          {comments?.map((c) => (
            <CommentCard
              key={c.id}
              author={detail.author.id}
              comment={c}
              onDelete={(id) => {
                setComments(comments.filter((p) => p.id !== id));
              }}
            />
          ))}

          <div ref={sentinelRef} />

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Spinner className="h-8! w-8! text-accent-foreground/70" />
            </div>
          )}

          {!hasMore && comments.length > 0 && (
            <p className="pb-2 text-center text-sm text-muted-foreground">
              Đã hết bình luận
            </p>
          )}
        </div>
      </div>

      <Button
        variant={'default'}
        className="fixed p-0 bottom-22 right-6 md:hidden w-15 h-15 bg-blue-500 dark:bg-blue-500 rounded-full md:rounded-xl text-base font-semibold cursor-pointer shadow-md transition-all active:scale-95"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="size-5.5 md:hidden shrink-0 text-accent dark:text-accent-foreground" />
      </Button>

      {open && (
        <CommentFormPopup
          close={() => setOpen(false)}
          pushFunc={handleUpComment}
          detail={detail}
          content={content}
          setContent={setContent}
          isSubmitting={isSubmitting}
          progress={progress}
        />
      )}
    </>
  );
}
