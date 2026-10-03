import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const COLORS = {
	black: '#000000',
	gold: '#CEAD6F',
	goldLight: '#E9D6A6',
	goldDark: '#9C7F45',
	white: '#FFFFFF',
	grey: '#A3A3A3',
	panel: '#0E0E0E',
};

export const GOLD_GRADIENT = `linear-gradient(135deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 45%, ${COLORS.goldDark} 100%)`;

export const VIDEO = {
	width: 1920,
	height: 1080,
	fps: 30,
};

// Bande du bas laissée vide : barre de progression, boutons et « Ignorer » de YouTube.
export const SAFE_BOTTOM = 220;
export const CONTENT_HEIGHT = VIDEO.height - SAFE_BOTTOM;

// Polices intégrées au projet (public/fonts) : le rendu fonctionne même hors ligne.
export const TITLE_FONT = 'Montserrat';
export const BODY_FONT = 'Inter';

loadFont({family: TITLE_FONT, url: staticFile('fonts/Montserrat.woff2'), weight: '700 900'});
loadFont({family: BODY_FONT, url: staticFile('fonts/Inter.woff2'), weight: '400 700'});

// Format vertical (Reels Instagram) : zones à laisser libres pour l'interface d'Instagram.
export const REEL = {width: 1080, height: 1920};
export const REEL_SAFE = {
	top: 270, // nom du compte, « Sponsorisé »
	bottom: 640, // légende, bouton d'appel à l'action
	side: 70, // icônes j'aime / commentaire / partage à droite
};
