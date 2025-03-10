import { useState, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${Date.now()}-${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);
  if (uploadError) throw new Error(uploadError.message);
  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });
  if (error) throw new Error(error.message);

  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
      },
      imageFile: selectedFile,
    });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form className="max-w-2xl mx-auto space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2 font-medium">Title</label>
        <input
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          type="text"
          id="title"
          name="title"
          required={true}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">Content</label>
        <textarea
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          id="Content"
          name="Content"
          required={true}
          rows={5}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">Upload Image</label>
        <input
          className="w-full text-gray-200"
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required={true}
          onChange={handleFileChange}
        />
      </div>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
        type="submit"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
      {isError && <p className="text-red-500"> Error creating post</p>}
      {isSuccess && <p className="text-green-500"> Done!</p>}
    </form>
  );
};

export default CreatePost;
