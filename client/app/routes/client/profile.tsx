import { LogIn } from 'lucide-react';
import { Suspense } from 'react';
import { Await, useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { POSTS_LIMIT, ProfilePage } from '~/pages/client/Profile/ProfilePage';
import { AuthService } from '~/services/auth/auth.service';
import { CommentService } from '~/services/client/comment.service';
import { PostService } from '~/services/client/post.service';
import { useAuthStore } from '~/store/useAuthStore';
import type { User } from '~/types/user.type';
import type { Route } from './+types/profile';

function UnauthenticatedProfile() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent">
        <LogIn className="size-7 text-accent-foreground/70" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold">Bạn chưa đăng nhập</p>
        <p className="text-sm text-muted-foreground">
          Đăng nhập để xem thông tin tài khoản của bạn
        </p>
      </div>
      <Button
        className="text-sm rounded-full px-6 h-12 cursor-pointer"
        onClick={() => navigate('/login')}
      >
        Đăng nhập ngay
      </Button>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Thông tin / VN News' },
    { name: 'description', content: 'Chào mừng đến với bình nguyên vô tận!' },
  ];
}

export function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  const author = useAuthStore.getState().user as User | null;

  if (params.username === 'profile' && !isAuthenticated) {
    return { data: null };
  }

  const username =
    params.username === 'profile' && author ? author.username : params.username;

  const url = new URL(request.url);
  const currentTab = url.searchParams.get('tab') || 'posts';

  const data =
    currentTab === 'comments'
      ? Promise.all([
          AuthService.checkAccount({ username }),
          CommentService.getComments({ username, limit: String(POSTS_LIMIT) }),
        ]).then(([user, commentsPage]) => ({
          user,
          commentsPage,
          tab: 'comments',
        }))
      : Promise.all([
          AuthService.checkAccount({ username }),
          PostService.getPosts({ username, limit: String(POSTS_LIMIT) }),
        ]).then(([user, postsPage]) => ({ user, postsPage, tab: 'posts' }));

  return { data };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  if (!loaderData.data) {
    return <UnauthenticatedProfile />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-10">
          <Spinner className="h-8! w-8! text-accent-foreground/70" />
        </div>
      }
    >
      <Await resolve={loaderData.data}>
        {(data) => <ProfilePage loaderData={data} />}
      </Await>
    </Suspense>
  );
}
