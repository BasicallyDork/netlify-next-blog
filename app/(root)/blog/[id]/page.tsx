import { client } from "@/sanity/lib/client";
import {
  BLOG_BY_ID_QUERY,
  COMMENT_BY_BLOG_QUERY
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
// import { Skeleton } from "@/components/ui/skeleton";
// import View from "@/components/View";

import { auth } from "@/auth";
import CommentForm from "@/components/CommentBox";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { Trash } from "lucide-react";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();

  const post = await client.fetch(BLOG_BY_ID_QUERY, { id });
  const { data: comment } = await sanityFetch({ query: COMMENT_BY_BLOG_QUERY, params: { id } });

  if (!post) return notFound();

  const parsedContent = md.render(post?.content || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Content</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />
      </section>
      <section className="section_container !max-w-5xl">
      {session ? <CommentForm blogId={id} /> : ''}
   
      {session ?   
      <div className="blog-form">
      <h3 className="blog-form_label">Comments</h3>
      <ul>
        {comment.map((comment: { userID: { name: string, _id: string }, comment: string, createdAt: string }, index: number) => (
          <li className="mt-2 bg-[#762bee24] p-4 rounded-xl" key={index}>
            <div><strong>{comment.userID.name}</strong>: 
            <div className="flex-between gap-2">
            <span className="max-sm:hidden">{comment.comment}</span>
             {session.id == comment.userID._id ? <Trash className="size-6 text-red-500 hover:cursor-pointer" /> : ''}</div></div>
            <small>{formatDate(comment.createdAt)}</small>
          </li>
        ))}
      </ul>
    </div> : 
    <div className="blog-form text-center">
      <p>Log in to view comments</p>  
    </div>}
      </section>
    <SanityLive />
    </>
  );
};

export default Page;