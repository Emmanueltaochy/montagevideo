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
- `stat*` et `proof*` : les trois résultats clients de la scène 20–25 s (menuiserie, gîte, VTC)
- `showSafeZone` : affiche en rouge la bande du bas réservée aux contrôles YouTube

Les autres textes sont dans `src/scenes/` et `src/TaochyAd30s.tsx`.

## Structure

```
src/
  TaochyAd30s.tsx       # montage 30 s (6 scènes de 5 s)
  TaochyBumper6s.tsx    # montage 6 s
  scenes/               # accroche, services, chiffre, appel à l'action
  visuals/              # animations : site web, réseaux sociaux, carte de La Réunion
  components/           # caméra 3D, plans, transitions, habillage motion design, zone sûre
  theme.ts              # couleurs (#000000 / #CEAD6F), polices, zone sûre
public/
  logo.png              # logo TAOCHY AGENCY
  fonts/                # Montserrat et Inter (licence SIL OFL)
```

## Son

Tout le son est dans `public/audio/` et placé image par image dans `src/TaochyAd30s.tsx` / `src/TaochyBumper6s.tsx` (listes `VOICE` et `EFFECTS`). La musique baisse automatiquement pendant la voix off. Chaque piste peut être coupée depuis les Props du Studio (`music`, `voiceOver`, `soundEffects`).

- **Musique et bruitages** (`music-*.wav`, `sfx/`) : synthétisés par `scripts/generate_audio.py` — créations originales, libres de droits. Pour les régénérer : `pip install numpy scipy && python3 scripts/generate_audio.py`.
- **Voix off** (`vo/`) : voix féminine française générée avec [Chatterbox](https://github.com/resemble-ai/chatterbox) (Resemble AI, licence MIT), à partir d'une voix de référence produite par [Piper](https://github.com/rhasspy/piper) (voix « siwis », licence CC-BY 4.0 : mention requise, voir `CREDITS.md`).

Pour remplacer la voix off par un enregistrement professionnel : déposer les fichiers dans `public/audio/vo/` sous les mêmes noms et mettre à jour leur durée (en images) dans `src/audio/Soundtrack.tsx`.
