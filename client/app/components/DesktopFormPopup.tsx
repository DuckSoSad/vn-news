import { ArrowLeftToLine } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PostService } from '~/services/client/post.service';
import { useResourceStore } from '~/store/useResourceStore';
import type { CreatePostInput, Post } from '~/types/post.type';
import { getErrorMessage } from '~/utils/getErrorMessage';
import { asyncTimeout } from '~/utils/setTimeout';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from './ui/combobox';
import { Field, FieldGroup, FieldLabel, FieldSet } from './ui/field';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';

interface InputFormProps {
  close: () => void;
  post?: Post;
  fetchPosts?: () => Promise<void>;
}

const DesktopFormPopup = ({ close, post, fetchPosts }: InputFormProps) => {
  const anchor = useComboboxAnchor();

  const categories = useResourceStore((state) => state.categories);
  const tags = useResourceStore((state) => state.tags);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      if (!post?.category?.name) return null;
      return categories.find((c) => c.name === post.category.name)?.id ?? null;
    },
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (!post?.tags) return [];

    return post.tags
      .map((postTag) => tags.find((t) => t.name === postTag.name)?.id)
      .filter((id): id is string => !!id);
  });

  const [published, setPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTitle(post?.title);
    setContent(post?.content);
    setSelectedCategory(() => {
      if (!post?.category?.name) return null;
      return categories.find((c) => c.name === post.category.name)?.id ?? null;
    });
    setSelectedTags(() => {
      if (!post?.tags) return [];

      return post.tags
        .map((postTag) => tags.find((t) => t.name === postTag.name)?.id)
        .filter((id): id is string => !!id);
    });
  }, [post, categories, tags]);

  const handleBack = () => {
    setTitle('');
    setContent('');
    setSelectedCategory(null);
    setSelectedTags([]);
    close();
  };

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

      post?.id
        ? await PostService.updatePost(post.id, data)
        : await PostService.createPost(data);

      if (progressTimer) clearInterval(progressTimer);
      setProgress(100);

      await asyncTimeout(300);

      setTitle('');
      setContent('');
      setSelectedCategory('');
      setSelectedTags([]);

      if (fetchPosts) {
        await fetchPosts();
      }

      close();
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
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleBack();
      }}
      className="fixed inset-0 z-50 flex justify-center items-center bg-blue-100/20 backdrop-blur-sm flex-col"
    >
      <div
        className="relative bg-black md:rounded-lg p-2 w-full md:w-140 md:max-h-[50vh] flex-1 overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 sticky top-0 z-10 flex justify-between items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full active:scale-95 cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeftToLine className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="mr-24">
              <FieldSet>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="published"
                      className="cursor-pointer"
                      checked={published}
                      onCheckedChange={(checked) => setPublished(!!checked)}
                    />
                    <FieldLabel
                      htmlFor="published"
                      className="font-normal cursor-pointer whitespace-nowrap"
                    >
                      Công khai?
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
            <Button
              onClick={handleUpPost}
              disabled={isSubmitting}
              className="w-24 h-9 rounded-2xl cursor-pointer"
            >
              {isSubmitting
                ? post?.id
                  ? 'Đang cập nhật...'
                  : 'Đang đăng...'
                : post?.id
                  ? 'Cập nhật'
                  : 'Đăng'}
            </Button>
          </div>
        </div>
        <div className="px-4 pt-4 flex min-w-0 justify-between items-start gap-3">
          <div className="w-10 h-10 bg-accent-foreground/10 dark:bg-accent rounded-full flex items-center justify-center shrink-0 border-2 border-accent-foreground/70 dark:border-accent select-none overflow-hidden">
            <span className="text-xl">🦆</span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <FieldSet className="w-full">
              <FieldGroup className="gap-1">
                <Field>
                  <Input
                    id="title"
                    placeholder="Tiêu đề bài viết"
                    className="text-lg md:text-xl h-10 font-bold border-2 border-accent-foreground/70 dark:border-none shadow-none focus-visible:ring-0 px-2 placeholder:text-muted-foreground/40"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <Textarea
                    id="content"
                    placeholder="Chuyện gì đang xảy ra?"
                    rows={3}
                    className="text-base md:text-lg h-24 border-2 border-accent-foreground/70 dark:border-none shadow-none resize-none focus-visible:ring-0 px-2 placeholder:text-muted-foreground/60 max-h-36"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {isSubmitting && (
              <div className="absolute top-0 left-0 w-full z-100">
                <Progress
                  value={progress}
                  className="w-full h-1 rounded-none animate-pulse bg-accent"
                />
              </div>
            )}

            <div className="mt-5 flex justify-between items-start">
              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col justify-start items-start gap-3">
                  <div className="w-full">
                    <Combobox
                      items={categories}
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      itemToStringLabel={(id) =>
                        categories.find((c) => c.id === id)?.name ?? ''
                      }
                    >
                      <ComboboxInput
                        placeholder="Danh mục"
                        className="border-2 border-accent-foreground/70 dark:border-border"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>Chưa có dữ liệu.</ComboboxEmpty>
                        <ComboboxList>
                          {(c) => (
                            <ComboboxItem key={c.id} value={c.id}>
                              {c.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>

                  <div className="w-full">
                    <Combobox
                      multiple
                      autoHighlight
                      items={tags}
                      defaultValue={[]}
                      value={selectedTags}
                      onValueChange={setSelectedTags}
                      itemToStringValue={(t) => t.name}
                    >
                      <ComboboxChips
                        ref={anchor}
                        className="flex w-full max-w-xs items-center gap-1 scrollbar-none border-2 border-accent-foreground/70 dark:border-border"
                      >
                        <ComboboxValue>
                          {(ids: string[]) => (
                            <React.Fragment>
                              {ids.map((id) => {
                                const tag = tags.find((t) => t.id === id);
                                if (!tag) return null;
                                return (
                                  <ComboboxChip
                                    key={tag.id}
                                    className="shrink-0 bg-accent-foreground text-accent"
                                  >
                                    {tag.name}
                                  </ComboboxChip>
                                );
                              })}
                              <ComboboxChipsInput
                                className="shrink-0"
                                placeholder="Hashtags"
                              />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>Chưa có dữ liệu.</ComboboxEmpty>
                        <ComboboxList>
                          {(t) => (
                            <ComboboxItem key={t.id} value={t.id}>
                              {t.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopFormPopup;
