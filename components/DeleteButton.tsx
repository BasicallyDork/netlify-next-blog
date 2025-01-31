'use client';

import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { deleteComment } from '@/lib/action';
import { toast } from '@/hooks/use-toast';

export const DeleteButton = ({ commentId }: { commentId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteComment(commentId);
      
      if (result?.success) {
        toast({
            title: "Success",
            description: result.message,
          });
      } else {
        toast({
            title: "Error",
            description: "Failed to delete your comment.",
          });
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete comment"
      className="disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash className="size-6 text-red-500 hover:text-red-600 transition-colors" />
    </button>
  );
};