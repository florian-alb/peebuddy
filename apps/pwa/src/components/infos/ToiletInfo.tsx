"use client";

import { Clock, Image as ImageIcon, Star, User } from "lucide-react";
import { Picture, Review, Toilet } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { useState, useRef, useEffect } from "react";
import { ToiletReview } from "./toiletReview";
import { AddReviewModal } from "./addReviewModal";
import { authClient } from "@workspace/auth";
import Image from "next/image";
import { ToiletWithReviewsAndPictures } from "@/types/toilets";
import { RouteInfo } from "@/hooks/useDirection";
import { formatDistance, formatDuration } from "@/lib/utils";

export function ToiletInfo({
  toilet,
  routeInfo,
}: {
  toilet: ToiletWithReviewsAndPictures;
  routeInfo: RouteInfo | null;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(200);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data } = authClient.useSession();

  const maxHeight =
    typeof window !== "undefined" ? window.innerHeight * 0.9 : 600;

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
      if (!isDragging) {
        setCurrentHeight(isExpanded ? maxHeight : height);
      }
    }
  }, [isExpanded, isDragging, maxHeight]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
    setCurrentHeight(isExpanded ? maxHeight : headerHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;

    let newHeight;
    if (isExpanded) {
      newHeight = maxHeight + deltaY;
    } else {
      newHeight = headerHeight + deltaY;
    }

    newHeight = Math.max(headerHeight, Math.min(maxHeight, newHeight));
    setCurrentHeight(newHeight);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const threshold = headerHeight + (maxHeight - headerHeight) * 0.3;
    if (currentHeight > threshold) {
      setIsExpanded(true);
      setCurrentHeight(maxHeight);
    } else {
      setIsExpanded(false);
      setCurrentHeight(headerHeight);
    }
  };

  return (
    <div
      className="fixed w-full bottom-0 bg-white z-10 rounded-t-lg overflow-hidden"
      style={{
        height: `${currentHeight}px`,
        transition: isDragging ? "none" : "height 0.3s ease-out",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto px-4 flex flex-col justify-between h-full pb-4">
        <div>
          {/* Header Content */}
          <div ref={headerRef}>
            {/* Drag Handle */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-2">
              {toilet.is_free ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Gratuit
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Payant
                </Badge>
              )}

              {toilet.is_handicap ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Accès handicapé
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Pas d'accès handicapé
                </Badge>
              )}
              {toilet.is_public ? (
                <Badge variant="outline" className="text-gray-600">
                  Publique
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600">
                  Commerce
                </Badge>
              )}
            </div>

            {/* Location Title */}
            <h1 className="text-lg font-semibold text-gray-900 mb-2">
              {toilet.address}
            </h1>

            {/* Distance and Time */}
            <div className="flex items-center gap-2 text-primary pb-4">
              <span className="text-sm font-medium">
                {formatDistance(routeInfo?.distance)}
              </span>
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDuration(routeInfo?.duration)}
              </span>
            </div>
          </div>
          <div className="space-y-4 pb-4">
            {/* Image Placeholder */}
            <Card className="bg-gray-100 p-8 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                {toilet.pictures && toilet.pictures.length > 0 ? (
                  <Image
                    src={toilet.pictures[0].url!}
                    alt="Toilet"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-white" />
                )}
              </div>
            </Card>

            {/* Schedule Info */}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">Aucun horaire renseigné</span>
            </div>

            {/* Actions
            <div className="space-y-3">
              <Button className="w-full text-white rounded-lg py-3">
                Suggérer des modifications
              </Button>
              <div className="text-center">
                <Button variant="link" className="underline">
                  Ce sanitaire n'existe pas ?
                </Button>
              </div>
            </div> */}
          </div>

          <div className="flex justify-center flex-col gap-4 items-center">
            <div className="flex items-center gap-2 justify-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avis</h3>
              <div className="flex gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {toilet.reviews && toilet.reviews.length > 0
                    ? toilet.reviews.reduce(
                        (acc, review) => acc + review.rating,
                        0
                      ) / toilet.reviews.length
                    : 0}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {toilet.reviews && toilet.reviews.length > 0 ? (
                toilet.reviews.map((review: Review) => (
                  <ToiletReview key={review.id} review={review} />
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  Aucun avis pour le moment
                </div>
              )}
            </div>
            <AddReviewModal toilet={toilet} session={data?.session} />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Dernière mise à jour:{" "}
          {toilet.updated_at
            ? new Date(toilet.updated_at).toLocaleDateString()
            : new Date(toilet.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
