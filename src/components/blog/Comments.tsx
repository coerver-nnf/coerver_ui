"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/types";

interface CommentsProps {
  postId: string;
  comments: Comment[];
}

export function Comments({ postId, comments: initialComments }: CommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Morate biti prijavljeni za komentiranje.");
        return;
      }

      const { data, error: submitError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment,
          approved: false,
        })
        .select()
        .single();

      if (submitError) throw submitError;

      setComments((prev) => [...prev, data as Comment]);
      setNewComment("");
    } catch {
      setError("Došlo je do greške. Pokušajte ponovno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-12 border-t border-coerver-gray-200">
      <h3 className="text-2xl font-bold text-coerver-dark mb-8">
        Komentari ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          placeholder="Napišite svoj komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          className="mb-4"
        />
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Objavi Komentar
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-coerver-gray-500 text-center py-8">
            Nema komentara. Budite prvi koji će komentirati!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-coerver-gray-50 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center text-white font-bold">
                  {(comment.user?.full_name || "K").charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-coerver-dark">
                    {comment.user?.full_name || "Korisnik"}
                  </div>
                  <div className="text-sm text-coerver-gray-500">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
              </div>
              <p className="text-coerver-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
