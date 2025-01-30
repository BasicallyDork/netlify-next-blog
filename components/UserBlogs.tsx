import { client } from "@/sanity/lib/client";
import { BLOGS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";

import BlogCard, { BlogTypeCard } from "@/components/BlogCard";

const UserBlogs = async ({ id }: { id: string }) => {
  const posts = await client.fetch(BLOGS_BY_AUTHOR_QUERY, { id: id });

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post: BlogTypeCard) => (
          <BlogCard key={post._id} blogs={post} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};

export default UserBlogs;
