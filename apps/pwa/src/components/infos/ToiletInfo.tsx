"use client";

import { MapPin, Clock, Search, User } from "lucide-react";
import { Toilet } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { useState, useRef, useEffect } from "react";

export const ToiletInfo = ({ toilet }: { toilet: Toilet }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    // Swipe up to expand (when collapsed)
    if (isUpSwipe && !isExpanded) {
      setIsExpanded(true);
    }

    // Swipe down to collapse (when expanded)
    if (isDownSwipe && isExpanded) {
      setIsExpanded(false);
    }
  };

  // Mouse events for desktop compatibility
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseEnd(null);
    setMouseStart(e.clientY);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMouseEnd(e.clientY);
  };

  const onMouseUp = () => {
    if (!mouseStart || !mouseEnd || !isDragging) {
      setIsDragging(false);
      return;
    }

    const distance = mouseStart - mouseEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && !isExpanded) {
      setIsExpanded(true);
    }

    if (isDownSwipe && isExpanded) {
      setIsExpanded(false);
    }

    setIsDragging(false);
  };

  useEffect(() => {
    const measureHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        console.log("Header height:", height);
      }
    };

    measureHeight();

    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, []);

  return (
    <div
      className="fixed w-full bottom-0 bg-white z-[1000] rounded-t-lg"
      style={{
        height: isExpanded ? "90%" : headerHeight + "px",
        transition: "height 0.5s ease-in-out",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="container flex flex-col mx-auto px-4">
        <div id="header" ref={headerRef} className="pb-2">
          {/* Pill */}
          <div
            className="flex justify-center items-center p-2 cursor-pointer"
            onClick={handleExpand}
          >
            <svg
              width="40"
              height="6"
              viewBox="0 0 40 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="30" height="3" rx="3" fill="#000" />
            </svg>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              Gratuit
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              Accès handicapé
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              Publique
            </Badge>
          </div>

          {/* Location Title */}
          <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
            Route de Launaguet (Toulouse, France)
          </h1>

          {/* Distance and Time */}
          <div className="flex items-center gap-2 text-primary">
            <span className="text-sm font-medium">1 km</span>
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">22 min</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 py-4">
          {/* Image Placeholder */}
          <Card className="bg-gray-100 p-8 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </Card>

          {/* Schedule Info */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm">Aucun horaire renseigné</span>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button className="w-full  text-white rounded-lg py-3">
              Suggérer des modifications
            </Button>

            <div className="text-center">
              <Button variant="link" className="underline">
                Ce sanitaire n'existe pas ?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
