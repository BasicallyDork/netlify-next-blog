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
      
      // _id:drafts.cc97cb78-ab98-43b8-9a00-d4cc0ba4fd40
      //   _type:comment
      //   _createdAt:2025-01-27T13:50:57.998Z
      //   blog:{…} 2 properties
      //   _type:reference
      //   _ref:zBY7Bgc8YY7JKuhWi0imW0
      //   userID:{…} 2 properties
      //   _type:reference
      //   _ref:l44alCYb09vxjF9SxRHs98
      //   comment:hello
      //   _rev:158dea76-621e-42c1-bda5-e49e3a694ab0
      //   _updatedAt:2025-01-27T13:51:04.121Z

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

