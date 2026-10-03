# TAOCHY AGENCY — Publicités YouTube (Remotion)

Deux vidéos 1920×1080, 30 fps :

| Composition | Durée | Usage |
|---|---|---|
| `TaochyAd30s` | 30 s | Annonce désactivable après 5 s (in-stream) |
| `TaochyBumper6s` | 6 s | Annonce « bumper » non désactivable |

## Démarrer

```bash
npm install
npm run dev        # ouvre le Studio Remotion sur http://localhost:3000
npm run render     # génère out/taochy-ad-30s.mp4 et out/taochy-bumper-6s.mp4
```

## Modifier les textes

Dans le Studio, onglet **Props** à droite (ou dans `src/props.ts`) :

- `website`, `cta` : site web et appel à l'action
- `statPrefix`, `statValue`, `statSuffix`, `statLabel`, `statDetail` : le résultat client de la scène 20–25 s.
  **La valeur actuelle (+40 % de réservations) est un exemple à remplacer par un vrai résultat avant diffusion.**
- `showSafeZone` : affiche en rouge la bande du bas réservée aux contrôles YouTube

Les autres textes sont dans `src/scenes/` et `src/TaochyAd30s.tsx`.

## Structure

```
src/
  TaochyAd30s.tsx       # montage 30 s (6 scènes de 5 s)
  TaochyBumper6s.tsx    # montage 6 s
  scenes/               # accroche, services, chiffre, appel à l'action
  visuals/              # animations : site web, réseaux sociaux, carte de La Réunion
  components/           # fond, logo, texte animé, transition dorée, zone sûre
  theme.ts              # couleurs (#000000 / #CEAD6F), polices, zone sûre
public/
  logo.png              # logo TAOCHY AGENCY
  fonts/                # Montserrat et Inter (licence SIL OFL)
```

## Musique

Déposer un fichier libre de droits dans `public/` (par ex. `musique.mp3`), puis ajouter dans `TaochyAd30s.tsx` et `TaochyBumper6s.tsx` :

```tsx
import {Audio, staticFile} from 'remotion';
// ...
<Audio src={staticFile('musique.mp3')} />
```
