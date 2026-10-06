# Landing page — « Réservez un appel gratuit »

Page d'arrivée de la publicité YouTube. Site statique (HTML, CSS, JS), aucune étape de compilation.

```
landing/
  index.html            # la page
  confidentialite.html  # confidentialité et cookies (à compléter)
  config.js             # ← vos identifiants : GTM, Pixel Meta, lien Cal.com
  styles.css
  main.js               # consentement, mesure, agenda, animation
  assets/               # logo, polices, vidéo de la pub
```

## Avant la mise en ligne

1. **`config.js`** : renseigner `gtmId`, `metaPixelId` et `calLink`.
2. **`confidentialite.html`** : compléter les passages entre crochets (raison sociale, adresse, e-mail, durée de conservation).
3. Vérifier le lien des mentions légales (`legalUrl` dans `config.js`).

## Mettre en ligne sur un sous-domaine

Envoyer tout le dossier `landing/` à la racine du sous-domaine (par exemple `appel.taochyagency.com`) :

- **Chez votre hébergeur actuel** : créer le sous-domaine dans le panneau d'administration, puis déposer les fichiers par FTP dans son dossier.
- **Ou gratuitement sur Netlify / Cloudflare Pages** : glisser-déposer le dossier, puis ajouter chez votre registraire un enregistrement DNS `CNAME appel → <adresse fournie>`.

Tester en local : `cd landing && python3 -m http.server` puis ouvrir http://localhost:8000.

## Mesure (Google Tag Manager + Pixel Meta)

- Rien n'est mesuré tant que le visiteur n'a pas cliqué sur « Accepter » (Consent Mode v2 ; le Pixel Meta n'est chargé qu'après accord).
- Événements envoyés dans le `dataLayer`, à utiliser comme déclencheurs dans GTM :

| Événement | Quand |
|---|---|
| `booking_confirmed` | Rendez-vous confirmé dans Cal.com — **la conversion à suivre** |
| `cta_click` (+ `cta_location`) | Clic sur un bouton « Réserver » (`header`, `hero`, `mobile-bar`…) |
| `proof_view` / `service_tab` | Navigation dans le carrousel des résultats / les onglets des services |
| `video_play` / `video_complete` | Lecture de la vidéo |
| `consent_choice` | Choix dans le bandeau cookies |

- Le Pixel Meta reçoit aussi `Schedule` à la réservation confirmée. Pour éviter un double comptage, ne pas recréer cet événement dans GTM.
- Dans Google Ads, importer `booking_confirmed` comme conversion (via une balise de conversion Google Ads déclenchée par cet événement dans GTM).
