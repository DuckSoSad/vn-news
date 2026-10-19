import { SquarePen } from 'lucide-react';
import { Suspense, use, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import InputFormCard from '~/components/InputFormCard';
import PostFormPopup from '~/components/MobileFormPopup';
import PostCard from '~/components/PostCard';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PostService } from '~/services/client/post.service';
import { usePostStore } from '~/store/usePostStore';
import { useResourceStore } from '~/store/useResourceStore';
import type { Category } from '~/types/category.type';
import type { CreatePostInput, GetPostsResponse } from '~/types/post.type';
import type { Tag } from '~/types/tag.type';
import { getErrorMessage } from '~/utils/getErrorMessage';
import { asyncTimeout } from '~/utils/setTimeout';

type HomeData = {
  postsPage: GetPostsResponse;
  categories: Category[];
  tags: Tag[];
};

type HomePageProps = {
  dataPromise: Promise<HomeData>;
};

export const POSTS_LIMIT = 10;

export function HomePage({ dataPromise }: HomePageProps) {
  return (
    <div className="w-full min-h-screen bg-background">
      <Tabs
        defaultValue="fyp"
        className="sticky top-0 z-10 border-b border-border backdrop-blur-sm"
      >
        <TabsList
          variant="line"
          className="w-full mt-3 mb-2 flex gap-16 md:gap-36"
        >
          <div className="flex items-center justify-center">
            <TabsTrigger
              value="fyp"
              className="cursor-pointer after:h-0.75! after:rounded-full after:bg-blue-500 dark:after:bg-blue-400"
            >
              <p className="text-base">Dành cho bạn</p>
            </TabsTrigger>
          </div>
          <div className="flex items-center justify-center">
            <TabsTrigger
              value="follow"
              className="cursor-pointer after:h-0.75! after:rounded-full after:bg-blue-500 dark:after:bg-blue-400"
            >
              <p className="text-base">Đang theo dõi</p>
            </TabsTrigger>
          </div>
        </TabsList>
      </Tabs>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            <Spinner className="h-8! w-8! text-accent-foreground/70" />
          </div>
        }
      >
        <HomeContent dataPromise={dataPromise} />
      </Suspense>
    </div>
  );
}

function HomeContent({ dataPromise }: HomePageProps) {
  const {
    postsPage,
    categories: initialCategories,
    tags: initialTags,
  } = use(dataPromise);

  const categories = useResourceStore((state) => state.categories);
  const seededCategoriesRef = useRef<Category[] | null>(null);
  if (seededCategoriesRef.current !== initialCategories) {
    seededCategoriesRef.current = initialCategories;
    useResourceStore.getState().setCategories(initialCategories);
  }

  const tags = useResourceStore((state) => state.tags);
  const seededTagsRef = useRef<Tag[] | null>(null);
  if (seededTagsRef.current !== initialTags) {
    seededTagsRef.current = initialTags;
    useResourceStore.getState().setTags(initialTags);
  }

  const seededPostsPageRef = useRef<GetPostsResponse | null>(null);
  if (seededPostsPageRef.current !== postsPage) {
    seededPostsPageRef.current = postsPage;
    const store = usePostStore.getState();
    store.setPosts(postsPage.data);
    store.setCursorId(postsPage.pagination.nextCursor ?? undefined);
    store.setHasMore(postsPage.pagination.hasNextPage);
    store.setIsLoading(false);
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [published, setPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const posts = usePostStore((state) => state.posts);
  const hasMore = usePostStore((state) => state.hasMore);
  const isLoading = usePostStore((state) => state.isLoading);
  const setPosts = usePostStore((state) => state.setPosts);

  const [open, setOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (cursor?: string) => {
    const store = usePostStore.getState();
    if (store.isLoading) return;

    store.setIsLoading(true);
    try {
      const res = await PostService.getPosts({
        cursor,
        limit: String(POSTS_LIMIT),
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
  }, []); // trống -> không phụ thuộc vào bất kỳ state nào

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

  const handleUpPost = async () => {
    if (!title || !content) {
      toast.error('Vui lòng nhập đủ tiêu đề và nội dung!');
      throw new Error('Điền thiếu trường quan trọng.');
    }

    const data: CreatePostInput = {
      title,
      content,
      published,
    };

    let progressTimer: NodeJS.Timeout | null = null;

    try {
      setIsSubmitting(true);
      setProgress(15);

      progressTimer = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 25));
      }, 100);

      await asyncTimeout(500);

      if (selectedCategory) {
        data.categoryId = selectedCategory;
      }
      if (selectedTags && selectedTags.length > 0) {
        data.tagIds = selectedTags;
      }

      await PostService.createPost(data);

      if (progressTimer) clearInterval(progressTimer);
      setProgress(100);

      await asyncTimeout(300);

      setTitle('');
      setContent('');
      setSelectedCategory('');
      setSelectedTags([]);

      await fetchPosts();
    } catch (err) {
      console.error('Lỗi khi đăng bài:', err);
      toast.error(getErrorMessage(err, 'Đăng bài thất bại. Vui lòng thử lại.'));
      throw err;
    } finally {
      if (progressTimer) clearInterval(progressTimer);

      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <>
      <InputFormCard
        categories={categories}
        tags={tags}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        published={published}
        setPublished={setPublished}
        isSubmitting={isSubmitting}
        progress={progress}
        handleUpPost={handleUpPost}
      />

      <div className="p-2 flex flex-col gap-4">
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
          <div className="flex justify-center items-center py-10">
            <Spinner className="h-8! w-8! text-accent-foreground/70" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="pb-4 text-center text-sm text-muted-foreground">
            Đã hết bài viết
          </p>
        )}
      </div>

      <Button
        variant={'default'}
        className="fixed p-0 bottom-22 right-6 md:hidden w-15 h-15 rounded-full md:rounded-xl text-base font-semibold cursor-pointer shadow-md transition-all active:scale-95"
        onClick={() => setOpen(true)}
      >
        <SquarePen className="size-5.5 md:hidden shrink-0" />
      </Button>

      {open && (
        <PostFormPopup
          close={() => setOpen(false)}
          categories={categories}
          tags={tags}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          published={published}
          setPublished={setPublished}
          isSubmitting={isSubmitting}
          progress={progress}
          handleUpPost={handleUpPost}
        />
      )}
    </>
  );
}
