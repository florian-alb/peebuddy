import { Toilet } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState } from "react";
import { toast } from "@workspace/ui";
import { Session } from "@workspace/auth";
import Link from "next/link";

export function AddReviewModal({
  toilet,
  session,
}: {
  toilet: Toilet;
  session: Session | undefined;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setIsLoading(true);

    if (!session?.token) {
      toast.error("Vous devez être connecté pour ajouter un avis");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({
            toilet_id: toilet.id,
            rating,
            comment,
            ...(session?.userId && { user_id: session.userId }),
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout de l'avis");
      }

      setSuccess(true);

      setRating(5);
      setComment("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRating(5);
    setComment("");
  };

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline">Se connecter pour ajouter un avis</Button>
      </Link>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un avis</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un avis</DialogTitle>
          <DialogDescription>
            Ajoutez un avis pour aider les autres utilisateurs à trouver la
            bonne toilette.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="rating">Note</Label>
              <Input
                required
                id="rating"
                name="rating"
                type="number"
                min={0}
                max={5}
                step={0.5}
                className="w-full"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="comment">Commentaire</Label>
              <Textarea
                required
                id="comment"
                name="comment"
                placeholder="Bonne toilette, mais pas de papier"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
