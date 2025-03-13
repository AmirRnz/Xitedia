import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

interface Props {
  postId: number;
}
const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  console.log(data, "here");
  if (error) throw new Error(error.message);
  return data as Post;
};

const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });
  if (isLoading) {
    return <div> Loading post...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-x-3">
        <img src={data?.avatar_url} className="w-18 h-18 rounded-full" />
        <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data?.title}
        </h2>
      </div>

      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="mt-4 rounded-xl object-cover w-full h-80"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>
      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
      {postId === 18 ? (
        <audio
          autoPlay
          loop
          ref={(audio) => {
            if (audio) {
              audio.volume = 0.4; // Set volume to 50%
            }
          }}
        >
          <source src="/inmydreams1.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      ) : null}
    </div>
  );
};

export default PostDetail;
