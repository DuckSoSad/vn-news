import { ArrowLeftToLine } from 'lucide-react';
import type { Post } from '~/types/post.type';
import { formatRelativeTime } from '~/utils/formatRelativeTime';
import ExpandableText from './ExpandableText';
import { Button } from './ui/button';
import { Field, FieldGroup, FieldSet } from './ui/field';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';

interface InputFormProps {
  close: () => void;
  pushFunc: () => Promise<void>;
  detail: Post;
  content: string;
  setContent: (val: string) => void;
  isSubmitting: boolean;
  progress: number;
}

const CommentFormPopup = ({
  close,
  pushFunc,
  detail,
  content,
  setContent,
  isSubmitting,
  progress,
}: InputFormProps) => {
  const handleBack = () => {
    setContent('');
    close();
  };

  const handleSubmit = async () => {
    try {
      await pushFunc();
      close();
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      throw err;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-accent dark:bg-black flex flex-col">
      <div
        className="relative flex-1 overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 sticky top-0 z-10 flex justify-between items-center gap-5 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full active:scale-95 cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeftToLine className="size-5" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-24 h-9 rounded-2xl cursor-pointer"
          >
            {isSubmitting ? 'Đang trả lời...' : 'Trả lời'}
          </Button>
        </div>
        <div className="px-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-accent-foreground/10 dark:bg-accent rounded-full flex items-center justify-center shrink-0 border-2 border-accent-foreground/70 dark:border-accent select-none overflow-hidden">
              <span className="text-xl">🦆</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold">{detail.author.name}</p>
              <p className="text-sm text-accent-foreground/60">
                {detail.author.username}
              </p>
              <p className="text-sm text-accent-foreground/60">
                {formatRelativeTime(detail.createdAt)}
              </p>
            </div>
          </div>
          <div className="max-w-[95%] mt-1 ms-4.5 ps-8 border-l-2 border-accent-foreground dark:border-accent-foreground/20 flex flex-col gap-y-1.5 text-sm">
            <p className="text-base font-bold text-accent-foreground/70 leading-normal whitespace-pre-line wrap-break-word">
              {detail.title}
            </p>
            <ExpandableText
              text={detail.content}
              className="text-foreground leading-normal whitespace-pre-line wrap-break-word"
            />
            <p className="text-accent-foreground/60">
              Đang trả lời @{detail.author.username}
            </p>
          </div>
        </div>
        <div className="px-4 pt-4 flex min-w-0 justify-between items-start gap-3">
          <div className="w-10 h-10 bg-accent-foreground/10 dark:bg-accent rounded-full flex items-center justify-center shrink-0 border-2 border-accent-foreground/70 dark:border-accent select-none overflow-hidden">
            <span className="text-xl">🦆</span>
          </div>

          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <Textarea
                  id="content"
                  placeholder={`Đăng câu trả lời của bạn...`}
                  rows={1}
                  className="p-1 text-xl border-none shadow-none resize-none focus-visible:ring-0 px-2 placeholder:text-muted-foreground/60 min-h-36 max-h-72"
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

          <div className="mt-5 flex justify-between items-center"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentFormPopup;
