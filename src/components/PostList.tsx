import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");
  console.log(data, "kir");
  if (error) throw new Error(error.message);

  return data as Post[];
};

const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
  if (isLoading) return <div> Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data);
  return (
    <div className="flex flex-wrap gap-6 justify-center mx-auto">
      {data?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
      {/** maybe i use index instead of post id? */}
    </div>
  );
};

export default PostList;
