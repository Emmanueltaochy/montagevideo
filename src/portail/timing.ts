// Minutage de la vidéo d'accueil du portail client (30 i/s).
// Les temps « t » sont en secondes dans la prise montée (voix), mesurés sur la transcription.

export const FPS = 30;
export const INTRO = 60; // 2 s de logo avant la première phrase
export const TALK = 1258; // 41,93 s de prise montée
export const OUTRO = 105;
export const PORTAIL_DURATION = INTRO + TALK + OUTRO;

// Image de la composition correspondant à un instant de la prise.
export const at = (t: number) => INTRO + Math.round(t * FPS);

// Plans : position et taille de la personne détourée. Chaque changement est une coupe franche.
export type Shot = {t: number; x: number; scale: number};
export const SHOTS: Shot[] = [
	{t: 0, x: 0, scale: 1.04}, // « Si vous êtes en train de regarder cette vidéo… »
	{t: 5.033, x: 0, scale: 1.3}, // « Bienvenue chez Taochy Agency & Consulting »
	{t: 9.433, x: -440, scale: 1.04}, // « Dans ce portail… différents onglets »
	{t: 14.467, x: -440, scale: 1.14}, // « l'envoi de fichiers, la validation… »
	{t: 20.1, x: 440, scale: 1.06}, // « toutes nos factures »
	{t: 23.433, x: 440, scale: 1.16}, // « la page d'accueil… des offres »
	{t: 26.433, x: -440, scale: 1.06}, // « une partie Académie »
	{t: 31.333, x: 0, scale: 1.3}, // « afin de vous aider… objectifs commerciaux »
	{t: 35.967, x: 0, scale: 1.06}, // « WhatsApp et par mail »
	{t: 38.933, x: 0, scale: 1.34}, // « le maximum de succès »
];

// Coupes à l'intérieur d'un plan (silences retirés) : léger changement de cadre pour masquer le saut.
export const JUMP_CUTS = [11.9, 12.533, 17.6, 19.033, 25.633, 29.5];
