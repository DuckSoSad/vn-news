import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useResourceStore } from '~/store/useResourceStore';
import { Button } from '../ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';

const CATEGORIES_LIMIT = 10;

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hidePaths = ['/explore'];
  const shouldHide = hidePaths.includes(location.pathname);

  const categories = useResourceStore((state) => state.categories);
  const tags = useResourceStore((state) => state.tags);

  const [moreCategories, setMoreCategories] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  useEffect(() => {
    if (location.pathname !== '/explore') {
      setInputValue('');
    } else {
      setInputValue(searchParams.get('q') || '');
    }
  }, [location.pathname, searchParams]);

  const visibleCategories = useMemo(
    () =>
      moreCategories ? categories : categories?.slice(0, CATEGORIES_LIMIT),
    [categories, moreCategories],
  );

  const hasMoreCategories = (categories?.length ?? 0) > CATEGORIES_LIMIT;

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/explore?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleResearch = (type: 'category' | 'tag', value: string) => {
    if (!value.trim()) return;

    const param = type === 'category' ? 'cat' : 'tag';
    navigate(`/explore?${param}=${encodeURIComponent(value)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="hidden xl:flex w-96 h-screen sticky top-0 flex-col justify-start p-4 select-none">
      {!shouldHide ? (
        <InputGroup className="w-full max-w-md h-12 rounded-full px-2">
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
                onClick={() => setInputValue('')}
                className="flex items-center justify-center h-6 w-6 rounded-full bg-accent-foreground/70 hover:bg-accent-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-600" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
      ) : (
        <div className="border-2"></div>
      )}

      <div className="border-2 border-border p-3 rounded-2xl my-4">
        <h2 className="text-xl font-semibold mb-2">Danh mục</h2>
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {visibleCategories?.map((category) => (
            <li
              key={category.id}
              onClick={() => handleResearch('category', category.id)}
              className="text-accent-foreground/70 hover:text-accent-foreground hover:underline hover:underline-offset-2 cursor-pointer"
            >
              {category.name} ({category.postsCount})
            </li>
          ))}
          {hasMoreCategories && (
            <li
              className="text-accent-foreground/90 hover:text-accent-foreground hover:underline hover:underline-offset-2 cursor-pointer"
              onClick={() => setMoreCategories((prev) => !prev)}
            >
              {moreCategories ? 'Thu gọn...' : 'Xem thêm...'}
            </li>
          )}
        </ul>
      </div>
      <div className="border-2 border-border p-3 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Thẻ</h2>
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {tags?.map((tag) => (
            <li
              key={tag.id}
              onClick={() => handleResearch('tag', tag.id)}
              className="text-accent-foreground/70 hover:text-accent-foreground hover:underline hover:underline-offset-2 cursor-pointer"
            >
              #{tag.name} ({tag.postsCount})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
