import { Prisma, Review, Toilet, Picture, User } from "database";

// Common types for API responses
export type PaginationParams = {
  limit?: number;
  offset?: number;
};

export type ToiletFilters = {
  is_free?: boolean;
  is_public?: boolean;
  is_handicap?: boolean;
  is_commerce?: boolean;
  is_verified?: boolean;
};

export type NearbyParams = {
  latitude: number;
  longitude: number;
  radius?: number;
} & ToiletFilters &
  PaginationParams;

export type SearchParams = {
  q: string;
  type?: "toilets" | "reviews" | "users";
} & PaginationParams;

// Extended types with calculated fields
export type ToiletWithRating = Toilet & {
  avgRating: number | null;
  reviewCount: number;
  Picture?: Picture[];
  Review?: Review[];
};

export type ToiletWithDistance = ToiletWithRating & {
  distance: number;
};

export type UserWithReviewCount = Omit<User, "accounts" | "sessions"> & {
  reviewCount: number;
};

// Request body types
export type CreateToiletDto = {
  longitude: Prisma.Decimal | number | string;
  latitude: Prisma.Decimal | number | string;
  address?: string;
  is_free?: boolean;
  is_public?: boolean;
  is_handicap?: boolean;
  is_commerce?: boolean;
  is_verified?: boolean;
};

export type UpdateToiletDto = Partial<CreateToiletDto>;

export type CreatePictureDto = {
  toilet_id?: string;
  name?: string;
  url: string;
};

export type UpdatePictureDto = Partial<CreatePictureDto>;

export type CreateReviewDto = {
  rating: number;
  comment?: string;
  toilet_id: string;
  user_id: string;
};

export type UpdateReviewDto = {
  rating?: number;
  comment?: string;
};

export type UpdateUserDto = {
  name?: string;
  image?: string;
  roles?: string;
};
