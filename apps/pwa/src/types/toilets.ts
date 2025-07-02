import { Toilet } from "@workspace/db";
import { Review } from "@workspace/db";
import { Picture } from "@workspace/db";

export type ToiletWithReviewsAndPictures = Toilet & {
  reviews: Review[];
  pictures: Picture[];
};
