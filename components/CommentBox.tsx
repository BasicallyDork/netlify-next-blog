"use client";
import { z } from "zod";
import { Send } from "lucide-react";
import { useState, useActionState } from "react";

import { createComment } from "@/lib/action";
import { commentSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CommentForm = ({ blogId }: { blogId: string }) => {
  const { toast } = useToast();

  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "IDEAL",
  });

  async function handleFormSubmit(prevState: any, formData: FormData) {
    try {
      const formValues = {
        comment: formData.get("comment") as string,
      };

      // Validate form values
      await commentSchema.parseAsync(formValues);

      // Create the comment and handle the result
      const result = await createComment(prevState, formData, content, blogId);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your comment has been successfully added.",
        });
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
        <label htmlFor="comment" className="blog-form_label">
          Comment
        </label>
        <Textarea
          id="comment"
          name="comment"
          className="blog-form_textarea"
          rows={5}
          required
          placeholder="Write your comment here"
        />

        {errors.comment && (
          <p className="blog-form_error">{errors.comment}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="blog-form_btn">
        {isPending ? "Submitting..." : "Add Comment"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default CommentForm;
