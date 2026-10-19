import React from 'react';
import type { Category } from '~/types/category.type';
import type { Tag } from '~/types/tag.type';
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
  categories: Category[];
  tags: Tag[];
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (val: string | null) => void;
  selectedTags: Tag[];
  setSelectedTags: (val: Tag[]) => void;
  published: boolean;
  setPublished: (val: boolean) => void;
  isSubmitting: boolean;
  progress: number;
  handleUpPost: () => Promise<void>;
}

const InputFormCard = ({
  categories,
  tags,
  title,
  setTitle,
  content,
  setContent,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  published,
  setPublished,
  isSubmitting,
  progress,
  handleUpPost,
}: InputFormProps) => {
  const anchor = useComboboxAnchor();

  return (
    <div className="hidden md:flex p-4 border-b border-border gap-3 relative">
      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shrink-0 border border-accent select-none overflow-hidden">
        <span className="text-xl">🦆</span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <FieldSet className="w-full">
          <FieldGroup className="gap-1">
            <Field>
              <Input
                id="title"
                placeholder="Tiêu đề bài viết"
                className="text-lg md:text-xl h-10 font-bold border-none shadow-none focus-visible:ring-0 px-2 placeholder:text-muted-foreground/40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field>
              <Textarea
                id="content"
                placeholder="Chuyện gì đang xảy ra?"
                rows={3}
                className="text-base md:text-lg h-24 border-none shadow-none resize-none focus-visible:ring-0 px-2 placeholder:text-muted-foreground/60 max-h-36"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {isSubmitting && (
          <div className="absolute top-0 left-0 w-full">
            <Progress
              value={progress}
              className="w-full h-1 rounded-none animate-pulse bg-accent"
            />
          </div>
        )}

        <div className="mt-5 flex justify-between items-start">
          <div className="flex flex-col items-start gap-3">
            <div className="flex justify-start items-center gap-3">
              <div className="w-full max-w-36">
                <Combobox
                  items={categories}
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  itemToStringLabel={(id) =>
                    categories.find((c) => c.id === id)?.name ?? ''
                  }
                >
                  <ComboboxInput placeholder="Danh mục" />
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

              <div className="w-full max-w-48">
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
                    className="flex w-full max-w-xs flex-nowrap items-center gap-1 overflow-x-auto scrollbar-none"
                  >
                    <ComboboxValue>
                      {(ids: string[]) => (
                        <React.Fragment>
                          {ids.map((id) => {
                            const tag = tags.find((t) => t.id === id);
                            if (!tag) return null;
                            return (
                              <ComboboxChip key={tag.id} className="shrink-0">
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
                    className="font-normal cursor-pointer whitespace-nowrap" // whitespace-nowrap: ngăn chữ bị xuống dòng
                  >
                    Công khai?
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>

          <Button
            onClick={() => handleUpPost()}
            disabled={isSubmitting}
            className="w-24 h-9 rounded-2xl cursor-pointer"
          >
            {isSubmitting ? 'Đang đăng...' : 'Đăng'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputFormCard;
