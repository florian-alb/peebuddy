import { Review } from "@workspace/db";
import { Star, User } from "lucide-react";

export function ToiletReview({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4" />
        <span className="text-sm font-medium">{review.rating}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{review.comment}</span>
      </div>
    </div>
  );
}
