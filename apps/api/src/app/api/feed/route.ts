import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

const data = {
  elements: [
    {
      lat: 48.8566,
      lon: 2.3522,
    },
  ],
};

export async function GET(request: NextRequest) {
  const toilets = data.elements
    .map((toilet) => {
      if (!toilet.lat || !toilet.lon) return null;
      return {
        latitude: toilet.lat.toString(),
        longitude: toilet.lon.toString(),
        is_handicap: isWheelchair(toilet),
        is_free: isFree(toilet),
        is_public: isPublic(toilet),
        is_commerce: false, // Valeur par défaut
        is_verified: false, // Valeur par défaut
      };
    })
    .filter((toilet) => toilet !== null);

  try {
    const results = {
      success: 0,
      errors: 0,
      details: [] as any[],
    };

    for (const toiletData of toilets) {
      try {
        // Vérifier si la toilette existe déjà (par coordonnées)
        const existingToilet = await prisma.toilet.findFirst({
          where: {
            latitude: toiletData.latitude,
            longitude: toiletData.longitude,
            deleted_at: null,
          },
        });

        if (existingToilet) {
          results.details.push({
            coordinates: `${toiletData.latitude}, ${toiletData.longitude}`,
            status: "skipped",
            reason: "Toilette déjà existante",
          });
          continue;
        }

        // Créer la toilette
        const newToilet = await prisma.toilet.create({
          data: toiletData,
        });

        results.success++;
        results.details.push({
          id: newToilet.id,
          coordinates: `${toiletData.latitude}, ${toiletData.longitude}`,
          status: "created",
        });
      } catch (toiletError) {
        results.errors++;
        results.details.push({
          coordinates: `${toiletData.latitude}, ${toiletData.longitude}`,
          status: "error",
          error:
            toiletError instanceof Error
              ? toiletError.message
              : "Erreur inconnue",
        });
        console.error(
          `Erreur lors de la création de la toilette:`,
          toiletError
        );
      }
    }

    return NextResponse.json({
      message: `Import terminé: ${results.success} toilettes ajoutées, ${results.errors} erreurs`,
      summary: {
        total: toilets.length,
        success: results.success,
        errors: results.errors,
        skipped: results.details.filter((d) => d.status === "skipped").length,
      },
      details: results.details,
    });
  } catch (error) {
    console.error("Erreur générale:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout des toilettes", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function isWheelchair(toilet: any) {
  const wheelchair = toilet.tags?.wheelchair;
  if (!wheelchair) return false;
  return wheelchair === "yes";
}

function isFree(toilet: any) {
  const fee = toilet.tags?.fee;
  if (!fee) return true; // Par défaut gratuit si non spécifié
  return fee === "no";
}

function isPublic(toilet: any) {
  const access = toilet.tags?.access;
  if (!access) return true; // Par défaut public si non spécifié
  return access !== "private";
}
