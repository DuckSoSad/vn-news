import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from './ui/button';

const formatCompactNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

const cardVariants = cva(
  'flex justify-between items-center gap-7 mt-3 text-muted-foreground',
  {
    variants: {
      size: {
        default: 'w-full px-0.5',
        half: 'max-w-[50%]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

interface InteractCardProps extends VariantProps<typeof cardVariants> {
  comments: number;
  likes: number;
  views: number;
}

const InteractCard = ({ comments, likes, views, size }: InteractCardProps) => {
  return (
    <div className={cn(cardVariants({ size }))}>
      <Button
        variant={'ghost'}
        size={'lg'}
        className="px-0 gap-1.5 hover:bg-transparent! hover:text-blue-500 text-muted-foreground transition-all duration-200 group rounded-full cursor-pointer"
      >
        <span className="transition-transform group-hover:scale-110">
          <MessageCircle className="w-6 h-6 group-hover:stroke-blue-500 transition-all" />
        </span>
        <span className="text-xs font-medium">
          {formatCompactNumber(comments)}
        </span>
      </Button>
      <Button
        variant={'ghost'}
        size={'lg'}
        className="px-0 gap-1.5 hover:bg-transparent! hover:text-red-500 text-muted-foreground transition-all duration-200 group rounded-full cursor-pointer"
      >
        <span className="transition-transform group-hover:scale-110">
          <Heart className="w-6 h-6 group-hover:stroke-red-500 transition-all" />
        </span>
        <span className="text-xs font-medium">
          {formatCompactNumber(likes)}
        </span>
      </Button>
      <Button
        variant={'ghost'}
        size={'lg'}
        className="px-0 gap-1.5 hover:bg-transparent! hover:text-green-500 text-muted-foreground transition-all duration-200 group rounded-full cursor-pointer"
      >
        <span className="transition-transform group-hover:scale-110">
          <Eye className="w-6 h-6 group-hover:stroke-green-500 transition-all" />
        </span>
        <span className="text-xs font-medium">
          {formatCompactNumber(views)}
        </span>
      </Button>
    </div>
  );
};

export default InteractCard;
