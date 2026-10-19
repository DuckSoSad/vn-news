import { COMMENTS_LIMIT, DetailPage } from '~/pages/client/DetailPage';
import { CommentService } from '~/services/client/comment.service';
import { PostService } from '~/services/client/post.service';
import type { Route } from './+types/detail';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Chi tiết / VN News' },
    { name: 'description', content: 'Chào mừng đến với bình nguyên vô tận!' },
  ];
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { id } = params;

  const data = Promise.all([
    PostService.getPostById(id),
    CommentService.getComments({ postId: id, limit: String(COMMENTS_LIMIT) }),
  ]).then(([detail, comments]) => ({ detail, comments }));

  return { data };
}

export default function Detail({ loaderData }: Route.ComponentProps) {
  return <DetailPage dataPromise={loaderData.data} />;
}
