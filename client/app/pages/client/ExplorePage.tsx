import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useSearchParams } from 'react-router';
import PostCard from '~/components/PostCard';
import { Button } from '~/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '~/components/ui/input-group';
import { Spinner } from '~/components/ui/spinner';
import { PostService } from '~/services/client/post.service';
import { usePostStore } from '~/store/usePostStore';
import type { GetPostsResponse } from '~/types/post.type';

type ExplorePageProps = {
  data: GetPostsResponse;
};

export const POSTS_LIMIT = 10;

export function ExplorePage({ data }: ExplorePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const navigation = useNavigation();
  const isSearching = navigation.state === 'loading';

  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  const executeSearch = () => {
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="bg-background flex flex-col items-center">
        <InputGroup className="w-full max-w-xs md:max-w-xl h-12 rounded-full px-2 my-4">
          <InputGroupInput
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon>
            <Search className="h-5! w-5! text-accent-foreground/70" />
          </InputGroupAddon>
          {inputValue && (
            <InputGroupAddon align="inline-end">
              <Button
                size={'icon'}
                onClick={handleClear}
                className="flex items-center justify-center h-6 w-6 rounded-full bg-accent-foreground/70 hover:bg-accent-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-white dark:text-black" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {isSearching ? (
        <div className="flex justify-center items-center py-10">
          <Spinner className="h-8! w-8! text-accent-foreground/70" />
        </div>
      ) : (
        <ExploreContent data={data} />
      )}
    </div>
  );
}

export function ExploreContent({ data }: ExplorePageProps) {
  const seededPostsPageRef = useRef<GetPostsResponse | null>(null);
  if (seededPostsPageRef.current !== data) {
    seededPostsPageRef.current = data;
    const store = usePostStore.getState();
    store.setPosts(data.data);
    store.setCursorId(data.pagination.nextCursor ?? undefined);
    store.setHasMore(data.pagination.hasNextPage);
    store.setIsLoading(false);
  }

  const posts = usePostStore((state) => state.posts);
  const hasMore = usePostStore((state) => state.hasMore);
  const isLoading = usePostStore((state) => state.isLoading);
  const setPosts = usePostStore((state) => state.setPosts);

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

  return (
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
  );
}
