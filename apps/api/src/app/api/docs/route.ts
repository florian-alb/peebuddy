import { NextResponse } from "next/server";

// GET API documentation
export async function GET() {
  const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "PeeBuddy API",
      description: "API pour trouver et évaluer des toilettes publiques",
      version: "1.0.0",
      contact: {
        name: "PeeBuddy Team",
        email: "contact@peebuddy.com",
      },
    },
    servers: [
      {
        url: "https://api.peebuddy.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    paths: {
      "/api": {
        get: {
          summary: "Informations générales de l'API",
          description:
            "Retourne les informations de base de l'API et la liste des endpoints disponibles",
          responses: {
            "200": {
              description: "Informations de l'API",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      version: { type: "string" },
                      description: { type: "string" },
                      endpoints: {
                        type: "array",
                        items: { type: "string" },
                      },
                      documentation: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/toilets": {
        get: {
          summary: "Récupérer toutes les toilettes",
          description:
            "Récupère la liste des toilettes avec filtres optionnels et pagination",
          parameters: [
            {
              name: "is_free",
              in: "query",
              description: "Filtrer par toilettes gratuites",
              schema: { type: "boolean" },
            },
            {
              name: "is_public",
              in: "query",
              description: "Filtrer par toilettes publiques",
              schema: { type: "boolean" },
            },
            {
              name: "is_handicap",
              in: "query",
              description: "Filtrer par toilettes accessibles aux handicapés",
              schema: { type: "boolean" },
            },
            {
              name: "is_commerce",
              in: "query",
              description: "Filtrer par toilettes de commerce",
              schema: { type: "boolean" },
            },
            {
              name: "is_verified",
              in: "query",
              description: "Filtrer par toilettes vérifiées",
              schema: { type: "boolean" },
            },
            {
              name: "limit",
              in: "query",
              description: "Nombre d'éléments par page",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "offset",
              in: "query",
              description: "Nombre d'éléments à ignorer",
              schema: { type: "integer", default: 0 },
            },
          ],
          responses: {
            "200": {
              description: "Liste des toilettes",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/ToiletWithRating",
                        },
                      },
                      meta: {
                        $ref: "#/components/schemas/PaginationMeta",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Créer une nouvelle toilette",
          description:
            "Crée une nouvelle toilette avec les coordonnées géographiques",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateToiletDto",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Toilette créée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Toilet",
                  },
                },
              },
            },
            "400": {
              description: "Données invalides",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/toilets/{id}": {
        get: {
          summary: "Récupérer une toilette par ID",
          description:
            "Récupère les détails d'une toilette spécifique avec ses photos et avis",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de la toilette",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Détails de la toilette",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ToiletWithRating",
                  },
                },
              },
            },
            "404": {
              description: "Toilette non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        put: {
          summary: "Mettre à jour une toilette",
          description: "Met à jour les informations d'une toilette existante",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de la toilette",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateToiletDto",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Toilette mise à jour",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Toilet",
                  },
                },
              },
            },
            "404": {
              description: "Toilette non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Supprimer une toilette",
          description: "Supprime une toilette (suppression logique)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de la toilette",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Toilette supprimée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Toilette non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/toilets/nearby": {
        get: {
          summary: "Trouver des toilettes à proximité",
          description:
            "Trouve les toilettes les plus proches d'un point géographique donné",
          parameters: [
            {
              name: "latitude",
              in: "query",
              required: true,
              description: "Latitude du point de référence",
              schema: { type: "number", format: "float" },
            },
            {
              name: "longitude",
              in: "query",
              required: true,
              description: "Longitude du point de référence",
              schema: { type: "number", format: "float" },
            },
            {
              name: "radius",
              in: "query",
              description: "Rayon de recherche en kilomètres",
              schema: { type: "number", format: "float", default: 5 },
            },
            {
              name: "limit",
              in: "query",
              description: "Nombre maximum de résultats",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "is_free",
              in: "query",
              description: "Filtrer par toilettes gratuites",
              schema: { type: "boolean" },
            },
            {
              name: "is_public",
              in: "query",
              description: "Filtrer par toilettes publiques",
              schema: { type: "boolean" },
            },
            {
              name: "is_handicap",
              in: "query",
              description: "Filtrer par toilettes accessibles aux handicapés",
              schema: { type: "boolean" },
            },
            {
              name: "is_commerce",
              in: "query",
              description: "Filtrer par toilettes de commerce",
              schema: { type: "boolean" },
            },
          ],
          responses: {
            "200": {
              description: "Toilettes à proximité",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/ToiletWithDistance",
                        },
                      },
                      meta: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          latitude: { type: "number" },
                          longitude: { type: "number" },
                          radiusKm: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Paramètres invalides",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/reviews": {
        get: {
          summary: "Récupérer tous les avis",
          description:
            "Récupère la liste des avis avec filtres optionnels et pagination",
          parameters: [
            {
              name: "toilet_id",
              in: "query",
              description: "Filtrer par ID de toilette",
              schema: { type: "string" },
            },
            {
              name: "user_id",
              in: "query",
              description: "Filtrer par ID d'utilisateur",
              schema: { type: "string" },
            },
            {
              name: "min_rating",
              in: "query",
              description: "Note minimum",
              schema: { type: "integer", minimum: 1, maximum: 5 },
            },
            {
              name: "limit",
              in: "query",
              description: "Nombre d'éléments par page",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "offset",
              in: "query",
              description: "Nombre d'éléments à ignorer",
              schema: { type: "integer", default: 0 },
            },
          ],
          responses: {
            "200": {
              description: "Liste des avis",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Review",
                        },
                      },
                      meta: {
                        $ref: "#/components/schemas/PaginationMeta",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Créer un nouvel avis",
          description: "Crée un nouvel avis pour une toilette",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateReviewDto",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Avis créé",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        $ref: "#/components/schemas/Review",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Données invalides",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "404": {
              description: "Toilette ou utilisateur non trouvé",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/reviews/{id}": {
        get: {
          summary: "Récupérer un avis par ID",
          description: "Récupère les détails d'un avis spécifique",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'avis",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Détails de l'avis",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Review",
                  },
                },
              },
            },
            "404": {
              description: "Avis non trouvé",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        put: {
          summary: "Mettre à jour un avis",
          description: "Met à jour un avis existant",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'avis",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateReviewDto",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Avis mis à jour",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Review",
                  },
                },
              },
            },
            "404": {
              description: "Avis non trouvé",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Supprimer un avis",
          description: "Supprime un avis (suppression logique)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'avis",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Avis supprimé",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Avis non trouvé",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/pictures": {
        get: {
          summary: "Récupérer toutes les photos",
          description:
            "Récupère la liste des photos avec filtres optionnels et pagination",
          parameters: [
            {
              name: "toilet_id",
              in: "query",
              description: "Filtrer par ID de toilette",
              schema: { type: "string" },
            },
            {
              name: "limit",
              in: "query",
              description: "Nombre d'éléments par page",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "offset",
              in: "query",
              description: "Nombre d'éléments à ignorer",
              schema: { type: "integer", default: 0 },
            },
          ],
          responses: {
            "200": {
              description: "Liste des photos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Picture",
                        },
                      },
                      meta: {
                        $ref: "#/components/schemas/PaginationMeta",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Créer une nouvelle photo",
          description: "Crée une nouvelle photo pour une toilette",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreatePictureDto",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Photo créée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Picture",
                  },
                },
              },
            },
            "400": {
              description: "Données invalides",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "404": {
              description: "Toilette non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/pictures/{id}": {
        get: {
          summary: "Récupérer une photo par ID",
          description: "Récupère les détails d'une photo spécifique",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de la photo",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Détails de la photo",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Picture",
                  },
                },
              },
            },
            "404": {
              description: "Photo non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        put: {
          summary: "Mettre à jour une photo",
          description: "Met à jour une photo existante",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de la photo",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdatePictureDto",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Photo mise à jour",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Picture",
                  },
                },
              },
            },
            "404": {
              description: "Photo non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Supprimer une photo",
          description: "Supprime une photo (suppression logique)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de la photo",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Photo supprimée",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Photo non trouvée",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/users": {
        get: {
          summary: "Récupérer tous les utilisateurs",
          description:
            "Récupère la liste des utilisateurs avec filtres optionnels et pagination",
          parameters: [
            {
              name: "role",
              in: "query",
              description: "Filtrer par rôle",
              schema: { type: "string" },
            },
            {
              name: "email",
              in: "query",
              description: "Filtrer par email",
              schema: { type: "string" },
            },
            {
              name: "limit",
              in: "query",
              description: "Nombre d'éléments par page",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "offset",
              in: "query",
              description: "Nombre d'éléments à ignorer",
              schema: { type: "integer", default: 0 },
            },
          ],
          responses: {
            "200": {
              description: "Liste des utilisateurs",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/User",
                        },
                      },
                      meta: {
                        $ref: "#/components/schemas/PaginationMeta",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          summary: "Récupérer un utilisateur par ID",
          description: "Récupère les détails d'un utilisateur spécifique",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'utilisateur",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Détails de l'utilisateur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "404": {
              description: "Utilisateur non trouvé",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        put: {
          summary: "Mettre à jour un utilisateur",
          description: "Met à jour un utilisateur existant",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'utilisateur",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateUserDto",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Utilisateur mis à jour",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "404": {
              description: "Utilisateur non trouvé",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/search": {
        get: {
          summary: "Recherche globale",
          description:
            "Effectue une recherche dans les toilettes, avis et utilisateurs",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              description: "Terme de recherche",
              schema: { type: "string" },
            },
            {
              name: "type",
              in: "query",
              description: "Type de recherche (toilets, reviews, users)",
              schema: {
                type: "string",
                enum: ["toilets", "reviews", "users"],
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Nombre maximum de résultats",
              schema: { type: "integer", default: 10 },
            },
            {
              name: "offset",
              in: "query",
              description: "Nombre d'éléments à ignorer",
              schema: { type: "integer", default: 0 },
            },
          ],
          responses: {
            "200": {
              description: "Résultats de recherche",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      toilets: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/ToiletWithRating",
                        },
                      },
                      reviews: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Review",
                        },
                      },
                      users: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/User",
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Requête invalide",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/api/stats": {
        get: {
          summary: "Statistiques de l'application",
          description: "Récupère les statistiques générales de l'application",
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Numéro de page",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "pageSize",
              in: "query",
              description: "Taille de page",
              schema: { type: "integer", default: 10, maximum: 100 },
            },
          ],
          responses: {
            "200": {
              description: "Statistiques de l'application",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      toilets: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          verified: { type: "integer" },
                          free: { type: "integer" },
                          public: { type: "integer" },
                          handicap: { type: "integer" },
                          commerce: { type: "integer" },
                          topRated: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/ToiletWithRating",
                            },
                          },
                        },
                      },
                      reviews: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          averageRating: { type: "number" },
                        },
                      },
                      users: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                        },
                      },
                      pictures: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Erreur serveur",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Toilet: {
          type: "object",
          properties: {
            id: { type: "string" },
            longitude: { type: "string" },
            latitude: { type: "string" },
            is_free: { type: "boolean" },
            is_public: { type: "boolean" },
            is_handicap: { type: "boolean" },
            is_commerce: { type: "boolean" },
            is_verified: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            deleted_at: { type: "string", format: "date-time", nullable: true },
          },
        },
        ToiletWithRating: {
          allOf: [
            { $ref: "#/components/schemas/Toilet" },
            {
              type: "object",
              properties: {
                avgRating: { type: "number", nullable: true },
                reviewCount: { type: "integer" },
                pictures: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Picture" },
                },
                reviews: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Review" },
                },
              },
            },
          ],
        },
        ToiletWithDistance: {
          allOf: [
            { $ref: "#/components/schemas/ToiletWithRating" },
            {
              type: "object",
              properties: {
                distance: {
                  type: "number",
                  description: "Distance en kilomètres",
                },
              },
            },
          ],
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", nullable: true },
            toilet_id: { type: "string" },
            user_id: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            deleted_at: { type: "string", format: "date-time", nullable: true },
            Toilet: { $ref: "#/components/schemas/Toilet" },
            User: { $ref: "#/components/schemas/User" },
          },
        },
        Picture: {
          type: "object",
          properties: {
            id: { type: "string" },
            toilet_id: { type: "string", nullable: true },
            name: { type: "string", nullable: true },
            url: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            deleted_at: { type: "string", format: "date-time", nullable: true },
            Toilet: { $ref: "#/components/schemas/Toilet" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string", nullable: true },
            email: { type: "string" },
            emailVerified: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            image: { type: "string", nullable: true },
            role: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateToiletDto: {
          type: "object",
          required: ["longitude", "latitude"],
          properties: {
            longitude: { type: "number" },
            latitude: { type: "number" },
            is_free: { type: "boolean", default: false },
            is_public: { type: "boolean", default: false },
            is_handicap: { type: "boolean", default: false },
            is_commerce: { type: "boolean", default: false },
            is_verified: { type: "boolean", default: false },
          },
        },
        UpdateToiletDto: {
          type: "object",
          properties: {
            longitude: { type: "number" },
            latitude: { type: "number" },
            is_free: { type: "boolean" },
            is_public: { type: "boolean" },
            is_handicap: { type: "boolean" },
            is_commerce: { type: "boolean" },
            is_verified: { type: "boolean" },
          },
        },
        CreateReviewDto: {
          type: "object",
          required: ["rating", "toilet_id", "user_id"],
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
            toilet_id: { type: "string" },
            user_id: { type: "string" },
          },
        },
        UpdateReviewDto: {
          type: "object",
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
        },
        CreatePictureDto: {
          type: "object",
          required: ["url"],
          properties: {
            toilet_id: { type: "string" },
            name: { type: "string" },
            url: { type: "string" },
          },
        },
        UpdatePictureDto: {
          type: "object",
          properties: {
            toilet_id: { type: "string" },
            name: { type: "string" },
            url: { type: "string" },
          },
        },
        UpdateUserDto: {
          type: "object",
          properties: {
            name: { type: "string" },
            image: { type: "string" },
            roles: { type: "string" },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            total: { type: "integer" },
            offset: { type: "integer" },
            limit: { type: "integer" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    tags: [
      {
        name: "Toilets",
        description: "Opérations sur les toilettes",
      },
      {
        name: "Reviews",
        description: "Opérations sur les avis",
      },
      {
        name: "Pictures",
        description: "Opérations sur les photos",
      },
      {
        name: "Users",
        description: "Opérations sur les utilisateurs",
      },
      {
        name: "Search",
        description: "Recherche globale",
      },
      {
        name: "Stats",
        description: "Statistiques de l'application",
      },
    ],
  };

  return NextResponse.json(swaggerDocument);
}
