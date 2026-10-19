import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CommentService } from '~/services/client/comment.service';
import type { Comment } from '~/types/comment.type';
import { formatRelativeTime } from '~/utils/formatRelativeTime';
import ExpandableText from './ExpandableText';
import InteractCard from './InteractCard';
import OptionPopover from './OptionPopover';

interface CommentCardProps {
  author?: string;
  comment: Comment;
  onDelete: (id: string) => void;
}

const CommentCard = ({ author, comment, onDelete }: CommentCardProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = async () => {
    try {
      await CommentService.deleteComment(comment.id);
      toast.success('Xóa bình luận thành công');
      onDelete(comment.id);
    } catch (err) {
      console.error('Lỗi khi xóa bình luận:', err);
      toast.error('Xóa bình luận thất bại');
      throw err;
    }
  };

  return (
    <div className="relative w-full max-w-xl p-1.5 border-b border-border flex gap-3">
      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0 border border-accent select-none overflow-hidden">
        <span className="text-md">🦆</span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col max-w-xl text-[14px]">
        <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-2 gap-y-0.5 mb-0.5">
          <span className="max-w-24 sm:max-w-full truncate font-semibold hover:underline cursor-pointer">
            {comment.author.name}
          </span>
          <span className="max-w-20 sm:max-w-full text-muted-foreground cursor-pointer truncate">
            @{comment.author.username}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground hover:underline cursor-pointer">
            {formatRelativeTime(comment.createdAt)}
          </span>

          {author === comment.author.id && (
            <span className="w-full sm:w-auto">
              <span className="text-muted-foreground pr-2 hidden sm:inline">
                ·
              </span>
              <span className="text-muted-foreground cursor-pointer">
                Tác giả
              </span>
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 w-full max-w-[90%] flex flex-col">
          <ExpandableText
            text={comment.content}
            className="text-foreground leading-normal whitespace-pre-line wrap-anywhere"
          />
        </div>
        <InteractCard
          size={'half'}
          comments={1994}
          likes={190904}
          views={Number('05032004')}
        />
      </div>

      <OptionPopover
        open={open}
        setOpen={setOpen}
        for={'comment'}
        deleteFunc={handleDelete}
        author={comment.author.username}
      />
    </div>
  );
};

export default CommentCard;
