import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  buttonClassName?: string;
}

const ExpandableText = ({
  text,
  maxLength = 200,
  className,
  buttonClassName = 'text-xs text-accent-foreground/60 hover:underline cursor-pointer self-start',
}: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > maxLength;

  return (
    <>
      <p className={className}>
        {isExpanded || !isLong ? text : `${text.slice(0, maxLength)}...`}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className={buttonClassName}
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </>
  );
};

export default ExpandableText;
