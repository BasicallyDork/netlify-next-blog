"use client";

import { z } from "zod";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { useState, useActionState } from "react";

import { createIdea } from "@/lib/action";
import { formSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BlogForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "IDEAL",
  });

  async function handleFormSubmit(prevState: any, formData: FormData) {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        content,
      };

      // Validate form values
      await formSchema.parseAsync(formValues);

      // Create the idea and handle the result
      const result = await createIdea(prevState, formData, content);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your idea has been created successfully",
        });

        router.push(`/blog/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your input and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    } finally {
      setContent("");
    }
  }

  return (
    <form action={formAction} className="blog-form">
      <div>
        <label htmlFor="title" className="blog-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="blog-form_input"
          required
          placeholder="Blog Title"
        />

        {errors.title && <p className="blog-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="blog-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="blog-form_textarea"
          rows={5}
          required
          placeholder="Short description of your blog"
        />

        {errors.description && (
          <p className="blog-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="blog-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          required
          className="blog-form_input"
          placeholder="Choose a category (e.g., Tech, Health, Education, etc.)"
        />

        {errors.category && (
          <p className="blog-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="blog-form_label">
          Image link
        </label>
        <Input
          id="link"
          name="link"
          type="url"
          className="blog-form_input"
          required
          placeholder="Paste a link of the image you want to use"
        />

        {errors.link && <p className="blog-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="content" className="blog-form_label">
          Content
        </label>

        <MDEditor
          id="content"
          value={content}
          preview="edit"
          height={300}
          onChange={(value) => setContent(value as string)}
          className="blog-form_editor"
          style={{
            borderRadius: 20,
            overflow: "hidden",
          }}
          textareaProps={{
            placeholder:
              "Blog content goes here. You can use markdown to format your content",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.content && <p className="blog-form_error">{errors.content}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="blog-form_btn">
        {isPending ? "Submitting..." : "Submit Your Content"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default BlogForm;
