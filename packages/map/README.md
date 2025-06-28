# @workspace/map

Package de carte Leaflet.js pour Peebuddy, utilisable dans la PWA et l'application web.

## Installation

Le package est déjà configuré dans le workspace. Pour l'utiliser dans vos applications :

```bash
# Dans votre app PWA ou web
pnpm add @workspace/map
```

## Utilisation

### Import automatique des styles

Les styles Leaflet sont automatiquement importés quand vous utilisez les composants du package. Vous n'avez plus besoin d'importer manuellement les styles CSS.

### Utilisation simple

```tsx
import { PeebuddyMap, ToiletMarkerType } from "@workspace/map";

const toilets: ToiletMarkerType[] = [
  {
    id: "1",
    position: [43.6043, 1.4437], // Toulouse
    name: "Toilette publique",
    address: "123 Rue de la Paix, Toulouse",
    rating: 4.5,
    isVerified: true,
  },
];

export default function App() {
  return (
    <div className="h-screen w-full">
      <PeebuddyMap
        toilets={toilets}
        onToiletClick={(toilet) => console.log("Toilette cliquée:", toilet)}
        showControls={true}
        autoLocate={true}
      />
    </div>
  );
}
```

### Import manuel des styles (optionnel)

Si vous préférez importer les styles manuellement :

```tsx
// Dans votre layout.tsx ou _app.tsx
import "@workspace/map/styles";
```

### Composant principal PeebuddyMap

```tsx
import { PeebuddyMap, ToiletMarkerType } from "@workspace/map";

const toilets: ToiletMarkerType[] = [
  {
    id: "1",
    position: [43.6043, 1.4437], // Toulouse
    name: "Toilette publique",
    address: "123 Rue de la Paix, Toulouse",
    rating: 4.5,
    isVerified: true,
  },
];

export default function MapPage() {
  const handleToiletClick = (toilet: ToiletMarkerType) => {
    console.log("Toilette cliquée:", toilet);
  };

  return (
    <div className="h-screen w-full">
      <PeebuddyMap
        toilets={toilets}
        onToiletClick={handleToiletClick}
        showControls={true}
        autoLocate={true}
      />
    </div>
  );
}
```

### Composants individuels

```tsx
import {
  MapContainer,
  ToiletMarker,
  LocationButton,
  ZoomControls,
} from "@workspace/map";

export default function CustomMap() {
  return (
    <MapContainer center={[43.6043, 1.4437]} zoom={13}>
      <ToiletMarker
        toilet={{
          id: "1",
          position: [43.6043, 1.4437],
          name: "Toilette",
          isVerified: true,
        }}
      />
      <LocationButton />
      <ZoomControls />
    </MapContainer>
  );
}
```

### Hook useMap

```tsx
import { useMap } from "@workspace/map";

export default function MapComponent() {
  const { map, userLocation, getLocation, flyToLocation } = useMap();

  return (
    <div>
      <button onClick={getLocation}>Ma position</button>
      {userLocation && (
        <button onClick={() => flyToLocation(userLocation[0], userLocation[1])}>
          Aller à ma position
        </button>
      )}
    </div>
  );
}
```

## API

### PeebuddyMap Props

| Prop            | Type                                 | Default             | Description                               |
| --------------- | ------------------------------------ | ------------------- | ----------------------------------------- |
| `center`        | `LatLngExpression`                   | `[43.6043, 1.4437]` | Centre de la carte (Toulouse)             |
| `zoom`          | `number`                             | `13`                | Niveau de zoom                            |
| `toilets`       | `ToiletMarkerType[]`                 | `[]`                | Liste des toilettes à afficher            |
| `onToiletClick` | `(toilet: ToiletMarkerType) => void` | -                   | Callback lors du clic sur une toilette    |
| `showControls`  | `boolean`                            | `true`              | Afficher les contrôles de la carte        |
| `autoLocate`    | `boolean`                            | `true`              | Localisation automatique de l'utilisateur |
| `className`     | `string`                             | -                   | Classe CSS personnalisée                  |
| `style`         | `React.CSSProperties`                | -                   | Styles inline personnalisés               |
| `mapOptions`    | `Partial<MapOptions>`                | -                   | Options Leaflet personnalisées            |

### ToiletMarkerType

```typescript
interface ToiletMarkerType {
  id: string;
  position: LatLngExpression;
  name?: string;
  address?: string;
  rating?: number;
  isVerified?: boolean;
}
```

## Utilitaires

### Fonctions de calcul

```tsx
import { calculateDistance, formatDistance } from "@workspace/map";

const distance = calculateDistance(43.6043, 1.4437, 43.6083, 1.4437);
const formattedDistance = formatDistance(distance); // "0.4km"
```

### Géolocalisation

```tsx
import { getCurrentPosition } from "@workspace/map";

try {
  const position = await getCurrentPosition();
  console.log("Position:", position.coords.latitude, position.coords.longitude);
} catch (error) {
  console.error("Erreur de géolocalisation:", error);
}
```

## Styles personnalisés

Le package inclut des styles personnalisés pour Leaflet avec :

- **Design moderne** : Popups arrondis avec ombres
- **Contrôles améliorés** : Boutons de zoom stylisés
- **Responsive** : Adaptation mobile
- **Mode sombre** : Support automatique du thème sombre
- **Animations** : Effets de hover sur les marqueurs

### Personnalisation des styles

Vous pouvez surcharger les styles en important vos propres CSS après le package :

```css
/* Votre fichier CSS personnalisé */
.leaflet-popup-content-wrapper {
  border-radius: 20px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
```

## Configuration

### Icônes personnalisées

Les icônes des toilettes sont configurées dans `utils.ts`. Vous pouvez personnaliser les chemins :

```tsx
// Dans utils.ts
export const createToiletIcon = (isVerified: boolean = false): Icon => {
  return new Icon({
    iconUrl: isVerified
      ? "/icons/toilet-verified.png" // Votre icône vérifiée
      : "/icons/toilet.png", // Votre icône normale
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
```

### Tuiles de carte

Vous pouvez changer le fournisseur de tuiles en modifiant `DEFAULT_TILE_LAYER` dans `utils.ts` :

```tsx
// OpenStreetMap (par défaut)
export const DEFAULT_TILE_LAYER =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

// Ou utiliser un autre fournisseur
export const DEFAULT_TILE_LAYER =
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
```

## Support

Ce package est conçu pour fonctionner avec :

- React 19+
- Leaflet 1.9+
- React Leaflet 5.x
- TypeScript
- Tailwind CSS (pour les styles des contrôles)

## Migration depuis react-leaflet v4

Ce package utilise maintenant react-leaflet v5. Les principales différences :

- API simplifiée et plus performante
- Meilleure compatibilité avec React 19
- Support amélioré des hooks personnalisés
- Configuration par défaut optimisée (`scrollWheelZoom={false}`)
