import { HomePage, POSTS_LIMIT } from '~/pages/client/HomePage';
import { CategoryService } from '~/services/client/category.service';
import { PostService } from '~/services/client/post.service';
import { TagService } from '~/services/client/tag.service';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Trang chủ / VN News' },
    { name: 'description', content: 'Chào mừng đến với bình nguyên vô tận!' },
  ];
}

export function clientLoader() {
  const data = Promise.all([
    PostService.getPosts({ limit: String(POSTS_LIMIT) }),
    CategoryService.getCategories(),
    TagService.getTags(),
  ]).then(([postsPage, categories, tags]) => ({ postsPage, categories, tags }));

  return { data };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomePage dataPromise={loaderData.data} />;
}
