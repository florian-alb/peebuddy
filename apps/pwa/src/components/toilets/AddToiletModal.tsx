"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Link, PlusIcon } from "lucide-react";
import { useIsMobile } from "@workspace/ui/hooks/useMobile";
import { authClient } from "@workspace/auth";
import { toast } from "@workspace/ui";

interface AddToiletFormData {
  longitude: string;
  latitude: string;
  address: string;
  is_free: boolean;
  is_public: boolean;
  is_handicap: boolean;
  is_commerce: boolean;
}

interface AddToiletModalProps {
  trigger?: React.ReactNode;
}

export function AddToiletModal({ trigger }: AddToiletModalProps) {
  const [open, setOpen] = useState(false);
  const { data } = authClient.useSession();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddToiletFormData>({
    longitude: "",
    latitude: "",
    address: "",
    is_free: false,
    is_public: false,
    is_handicap: false,
    is_commerce: false,
  });

  const handleInputChange = (
    field: keyof AddToiletFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);

    // Validation basique
    if (!formData.longitude || !formData.latitude) {
      alert("La longitude et la latitude sont requises");
      return;
    }

    // Validation des coordonnées
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Les coordonnées doivent être des nombres valides");
      return;
    }

    if (!formData.address) {
      alert("L'adresse est requise");
      return;
    }

    if (lat < -90 || lat > 90) {
      alert("La latitude doit être entre -90 et 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      alert("La longitude doit être entre -180 et 180");
      return;
    }

    onAddToilet(formData);
  };

  const onAddToilet = async (formData: AddToiletFormData) => {
    if (!data?.session?.token) {
      toast.error("Vous devez être connecté pour ajouter une toilette");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/toilets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la toilette");
      }

      setOpen(false);
      setFormData({
        longitude: "",
        latitude: "",
        address: "",
        is_free: false,
        is_public: false,
        is_handicap: false,
        is_commerce: false,
      });

      toast.success("Toilette ajoutée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la toilette", {
        description: error instanceof Error ? error.message : "Erreur inconnue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBoolean = (field: keyof AddToiletFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!data?.session?.token) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusIcon className="w-4 h-4" />
            {!isMobile && "Ajouter une toilette"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Vous devez être connecté pour ajouter une toilette
            </DialogTitle>
            <DialogDescription>
              <Link href="/login">
                <Button variant="default">Se connecter</Button>
              </Link>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="fixed top-4 right-[50%] translate-x-1/2"
            variant="default"
          >
            <PlusIcon className="w-4 h-4" />
            {!isMobile && "Ajouter une toilette"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle toilette</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter une nouvelle toilette à la
            base de données.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coordonnées */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Coordonnées</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="48.8566"
                  value={formData.latitude}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("latitude", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="2.3522"
                  value={formData.longitude}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("longitude", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              placeholder="123 Rue de la Paix, 75001 Paris, France"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("address", e.target.value)
              }
              rows={3}
            />
          </div>

          <Separator />

          {/* Caractéristiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Caractéristiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-colors ${
                  formData.is_free ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleBoolean("is_free")}
              >
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl">💰</div>
                    <div className="font-medium">Gratuit</div>
                    <Badge variant={formData.is_free ? "default" : "secondary"}>
                      {formData.is_free ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  formData.is_public ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleBoolean("is_public")}
              >
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl">🏛️</div>
                    <div className="font-medium">Public</div>
                    <Badge
                      variant={formData.is_public ? "default" : "secondary"}
                    >
                      {formData.is_public ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  formData.is_handicap ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleBoolean("is_handicap")}
              >
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl">♿</div>
                    <div className="font-medium">Accessible</div>
                    <Badge
                      variant={formData.is_handicap ? "default" : "secondary"}
                    >
                      {formData.is_handicap ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  formData.is_commerce ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleBoolean("is_commerce")}
              >
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl">🏪</div>
                    <div className="font-medium">Commerce</div>
                    <Badge
                      variant={formData.is_commerce ? "default" : "secondary"}
                    >
                      {formData.is_commerce ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={isLoading}
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout en cours..." : "Ajouter la toilette"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
