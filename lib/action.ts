"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "@/lib/utils";

export const createIdea = async (state: any, form: FormData, content: string) => {
  const session = await auth();
  if (!session)
    parseServerActionResponse({ error: "Not signed in", status: "ERROR" });

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "content"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const idea = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      content,
    };

    const result = await writeClient.create({ _type: "blog", ...idea });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("Error", error);

    return parseServerActionResponse({
      error: JSON.stringify(error) || "Unknown error",
      status: "ERROR",
    });
  }
};

export const createComment = async (state: any, form: FormData, content: string, blogId: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({ error: "Not signed in", status: "ERROR" });

  const { comment } = Object.fromEntries(Array.from(form));

  try {
    const newComment = {
      _type: "comment",
      comment, // The text content of the comment
      blog: {
        _type: "reference",
        _ref: blogId, // Reference the specific blog ID
      },
      userID: {
        _type: "reference",
        _ref: session?.id, // Reference the user who created the comment
      },
    };

    const result = await writeClient.create(newComment);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("Error", error);

    return parseServerActionResponse({
      error: JSON.stringify(error) || "Unknown error",
      status: "ERROR",
    });
  }
};

export const deleteComment = async (commentId: string) => {
  try {

    const session = await auth();
    if (!session) throw new Error('Unauthorized - Please log in');
    console.log("session", session);

    const comment = await writeClient.getDocument(commentId);
    

    if (!comment) throw new Error('Comment not found');
    if (comment.userID._id !== session.user.id) {
      throw new Error('Unauthorized - You do not own this comment');
    }


    await writeClient.delete(commentId);
    

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {

    console.error('Delete failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete comment'
    };
  }
};
