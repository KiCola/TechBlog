import { getAllPosts } from '../lib/posts';
import HomeClient from '../components/HomeClient';

export default function Home() {
  const posts = getAllPosts();
  return <HomeClient posts={posts} />;
}
