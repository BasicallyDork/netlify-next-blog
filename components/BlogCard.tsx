import { cn, formatDate, formatNumber } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EyeIcon } from 'lucide-react';
import { Author, Blog } from '@/sanity/types';
import { Skeleton } from './ui/skeleton';

export type BlogTypeCard = Omit<Blog, 'author'> & { author?: Author};
const BlogCard = ({blogs}:{blogs: BlogTypeCard}) => {
    const {
      _createdAt,
      views,
      author,
      title,
      category,
      _id,
      image,
      description,
      } = blogs;
  return (
    <li className='blog-card group'>
        <div className='flex-between'>
            <p className='blog_card_date'>
                {formatDate(_createdAt)}
            </p>
            {/* <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div> */}
        </div>
        <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/blog/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image
            src={author?.image || '/default-image.png'}
            alt={author?.name || 'Author'}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/blog/${_id}`}>
        <p className="blog-card_desc">{description}</p>

        <img src={image} alt="placeholder" className="blog-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="blog-card_btn" asChild>
          <Link href={`/blog/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  )
}

export const BlogCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((_, index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="blog-card_skeleton" />
      </li>
    ))}
  </>
);

export default BlogCard