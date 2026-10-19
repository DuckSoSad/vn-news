import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PostService } from '~/services/client/post.service';
import type { Post } from '~/types/post.type';
import { formatRelativeTime } from '~/utils/formatRelativeTime';
import DesktopFormPopup from './DesktopFormPopup';
import ExpandableText from './ExpandableText';
import InteractCard from './InteractCard';
import OptionPopover from './OptionPopover';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const navigate = useNavigate();

  const [currentFixPost, setCurrentFixPost] = useState<string>();

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

  const handleSelectPost = () => {
    if (!post.id) return;
    setCurrentFixPost(post.id);
  };

  const handleDeletePost = async () => {
    try {
      await PostService.deletePost(post.id);
      toast.success('Xóa bài viết thành công!');
      onDelete(post.id);
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
      toast.error('Xóa bài viết thất bại!');
      throw err;
    }
  };

  return (
    <div
      onClick={() => navigate(`/detail/${post.id}`)}
      className="relative w-full max-w-xl p-1.5 border-b border-border flex gap-3 cursor-pointer"
    >
      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0 border border-accent select-none overflow-hidden">
        <span className="text-md">🦆</span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col max-w-xl text-[14px]">
        <div className="flex items-center gap-2 mb-0.5">
          <Link
            to={`/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-24 md:max-w-full truncate font-semibold hover:underline cursor-pointer"
          >
            {post.author.name}
          </Link>
          <span className="max-w-26 md:max-w-full text-muted-foreground cursor-pointer truncate">
            @{post.author.username}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground hover:underline cursor-pointer">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        <div className="max-w-[90%] flex-1 min-w-0 flex flex-col">
          <p className="font-bold text-base md:text-xl text-accent-foreground/70 leading-normal whitespace-pre-line wrap-anywhere">
            {post.title}
          </p>
          <ExpandableText
            text={post.content}
            className="mt-1 text-sm md:text-base text-foreground leading-normal whitespace-pre-line wrap-anywhere"
          />

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            {post.category && (
              <div className="w-fit inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold backdrop-blur-sm border border-accent/30 shadow-sm hover:bg-accent transition">
                <p>{post.category.name}</p>
              </div>
            )}
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-accent-foreground/60 hover:underline cursor-pointer"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        <InteractCard
          size={'half'}
          comments={post._count.comments}
          likes={190904}
          views={Number('05032004')}
        />
      </div>

      <OptionPopover
        open={open}
        setOpen={setOpen}
        for={'post'}
        selectFunc={handleSelectPost}
        deleteFunc={handleDeletePost}
        author={post.author.username}
      />

      {currentFixPost === post.id && (
        <DesktopFormPopup close={() => setCurrentFixPost('')} post={post} />
      )}
    </div>
  );
};

export default PostCard;
