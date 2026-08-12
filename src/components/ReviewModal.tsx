"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/utils";
import {
  getUserReview,
  insertReview,
  updateReview,
  deleteReview,
  DbReview,
} from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [userReview, setUserReview] = React.useState<DbReview | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Load user's existing review when modal opens or user changes
  React.useEffect(() => {
    if (open && user) {
      loadUserReview();
    }
  }, [open, user]);

  const loadUserReview = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await getUserReview(user.id);
      if (error) throw new Error(error);
      if (data) {
        setUserReview(data);
        setRating(data.rating);
        setComment(data.comment || "");
      } else {
        setUserReview(null);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load review"));
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setError(null);
    setSuccess(null);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      if (userReview) {
        // Update existing review
        result = await updateReview(userReview.id, user.id, {
          rating,
          comment: comment.trim() || null,
        });
      } else {
        // Insert new review
        result = await insertReview(user.id, {
          rating,
          comment: comment.trim() || null,
        });
      }

      if (result.error) throw new Error(result.error);

      setSuccess("Thank you for your feedback!");
      setUserReview(result.data);

      // Reset form after successful submission
      setTimeout(() => {
        setRating(0);
        setComment("");
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save review"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;

    if (!user) {
      setError("User not authenticated");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteReview(userReview.id, user.id);
      if (result.error) throw new Error(result.error);

      setSuccess("Review deleted successfully");
      setUserReview(null);
      setRating(0);
      setComment("");

      // Reset form after successful deletion
      setTimeout(() => {
        setSuccess(null);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete review"));
    } finally {
      setLoading(false);
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>
            {userReview ? "Atualizar sua avaliação" : "Avalie nosso projeto"}
          </DialogTitle>
          <DialogDescription>
            Sua opinião nos ajuda a melhorar o PromptLabz para todos os usuários.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded dark:bg-green-950/40 dark:border-green-800 dark:text-green-300">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Sua avaliação:</span>
            <div className="flex items-center space-x-1">
              {stars.map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`
                    p-1 rounded hover:star-yellow-500 transition-colors
                    ${rating >= star ? "text-yellow-400" : "text-gray-300"}
                  `}
                  aria-label={`${star} estrelas`}
                >
                  <Star className="h-5 w-5" />
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {rating} / 5
            </span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium">
              Comentário (opcional):
            </label>
            <Textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="O que você achou do PromptLabz? Como podemos melhorar?"
              className="min-h-[80px]"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          {userReview && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir avaliação"}
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
            disabled={loading || rating < 1 || rating > 5}
          >
            {loading ? "Salvando..." : userReview ? "Atualizar avaliação" : "Enviar avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};