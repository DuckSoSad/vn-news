import { ExplorePage, POSTS_LIMIT } from '~/pages/client/ExplorePage';
import { PostService } from '~/services/client/post.service';
import type { GetPostsQuery } from '~/types/post.type';
import type { Route } from './+types/explore';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Khám phá / VN News' },
    { name: 'description', content: 'Chào mừng đến với bình nguyên vô tận!' },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';

  const category = url.searchParams.get('cat') || '';
  const tag = url.searchParams.get('tag') || '';

  const searchParams: GetPostsQuery = {
    search: q,
    limit: String(POSTS_LIMIT),
  };

  if (category) {
    searchParams.categoryId = category;
  }

  if (tag) {
    searchParams.tagId = tag;
  }

  const data = await PostService.getPosts(searchParams);

  return { data };
}

export default function Explore({ loaderData }: Route.ComponentProps) {
  return <ExplorePage data={loaderData.data} />;
}
