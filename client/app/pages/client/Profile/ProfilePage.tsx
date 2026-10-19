import { ArrowLeftToLine, LogOut } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import LogoutPopup from '~/components/LogoutPopup';
import PostCard from '~/components/PostCard';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PostService } from '~/services/client/post.service';
import { useAuthStore } from '~/store/useAuthStore';
import { usePopupStore } from '~/store/usePopupStore';
import { usePostStore } from '~/store/usePostStore';
import type { GetPostsResponse } from '~/types/post.type';
import type { ExtendedUser, User } from '~/types/user.type';
import CommentTab from './ProfileTabs/CommentTab';
import PostTab from './ProfileTabs/PostTab';

export const POSTS_LIMIT = 10;
export const COMMENTS_LIMIT = 30;

export function ProfilePage({ loaderData }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const author = loaderData.user;
  const currentTab = loaderData.tab;

  const user = useAuthStore((state) => state.user) as User | null;

  const logoutOpen = usePopupStore((state) => state.logoutOpen);
  const setLogoutOpen = usePopupStore((state) => state.setLogoutOpen);

  const handleChangeTab = (val: string) => {
    const currentTab = searchParams.get('tab') || 'posts';
    if (currentTab === val) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', val);

    setSearchParams(newParams);
  };

  return (
    <div className="w-full min-h-screen bg-background ">
      <div className="p-2 sticky top-0 z-10 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full active:scale-95 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftToLine className="size-5" />
          </Button>
          <p className="font-bold text-xl md:text-2xl">{author.name}</p>
        </div>

        {user?.username === author.username && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-10 h-10 bg-accent rounded-full active:scale-95 cursor-pointer"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="size-5" />
          </Button>
        )}
      </div>

      <div className="relative h-48 bg-accent-foreground/15">
        <div className="absolute -bottom-10 md:-bottom-18 left-5 w-20 h-20 md:w-36 md:h-36 bg-accent rounded-full flex items-center justify-center shrink-0 border border-accent select-none overflow-hidden">
          <span className="text-3xl md:text-6xl">🦆</span>
        </div>
      </div>

      <div className="w-full">
        <div className="px-5 pt-5 flex justify-end items-center">
          <Button
            variant={'outline'}
            className="text-base p-5 md:px-7 rounded-full cursor-pointer"
          >
            Chỉnh sửa hồ sơ
          </Button>
        </div>

        <div className="p-5 mt-7 flex flex-col justify-start items-start">
          <p className="text-2xl font-extrabold">{author.name}</p>
          <p className="text-base text-accent-foreground/60">
            @{author.username}
          </p>
        </div>

        <Tabs defaultValue="fyp" className="border-b border-border">
          <TabsList
            variant="line"
            className="w-full mt-3 mb-2 flex gap-16 md:gap-36"
          >
            <div className="flex items-center justify-center">
              <TabsTrigger
                value="fyp"
                onClick={() => handleChangeTab('posts')}
                className="cursor-pointer after:h-0.75! after:rounded-full after:bg-blue-500 dark:after:bg-blue-400"
              >
                <p className="text-base">Bài đăng</p>
              </TabsTrigger>
            </div>
            <div className="flex items-center justify-center">
              <TabsTrigger
                value="follow"
                onClick={() => handleChangeTab('comments')}
                className="cursor-pointer after:h-0.75! after:rounded-full after:bg-blue-500 dark:after:bg-blue-400"
              >
                <p className="text-base">Các phản hồi</p>
              </TabsTrigger>
            </div>
          </TabsList>
        </Tabs>

        {currentTab === 'posts' ? (
          <PostTab author={author} posts={loaderData.postsPage} />
        ) : (
          <CommentTab author={author} comments={loaderData.commentsPage} />
        )}
      </div>

      {logoutOpen && <LogoutPopup onClose={() => setLogoutOpen(false)} />}
    </div>
  );
}
