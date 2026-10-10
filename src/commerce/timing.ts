// Reel « Qu'est-ce qui fait qu'un commerce marche ? » (1080×1920, 30 i/s).
// Les temps « t » sont en secondes dans la prise montée ; la voix démarre à l'image 0.

export const FPS = 30;
export const TALK = 1188; // 39,6 s de prise montée
export const OUTRO = 105; // appel à l'action final
export const COMMERCE_DURATION = TALK + OUTRO;
export const at = (t: number) => Math.round(t * FPS);

// Mise en page : la personne seule (talk), la personne sous une fenêtre vidéo (split),
// ou une vidéo d'illustration plein écran (full).
export type Mode = {t: number; mode: 'talk' | 'split' | 'full'; scale?: number; card?: string; clip?: string};
export const MODES: Mode[] = [
	{t: 0, mode: 'talk', scale: 1},
	{t: 2.6, mode: 'split', card: 'shop'},
	{t: 4.13, mode: 'full', clip: 'crowd'},
	{t: 5.33, mode: 'split', card: 'boutique'},
	{t: 7.9, mode: 'talk', scale: 1.15},
	{t: 10.1, mode: 'split', card: 'empty'},
	{t: 12.3, mode: 'full', clip: 'street'},
	{t: 13.13, mode: 'split', card: 'worker'},
	{t: 20.2, mode: 'split', card: 'laptop'},
	{t: 21.8, mode: 'full', clip: 'phone'},
	{t: 24.73, mode: 'talk', scale: 1},
	{t: 26.93, mode: 'split', card: 'site0'},
	{t: 29.57, mode: 'talk', scale: 1.15},
	{t: 31.5, mode: 'split', card: 'convert'},
	{t: 32.97, mode: 'split', card: 'traffic'},
	{t: 35.13, mode: 'split', card: 'leads'},
];

// Raccords de la prise (silences retirés) : petit recadrage pour masquer le saut.
export const JUMP_CUTS = [1.933, 4.5, 6.733, 8.033, 10.167, 14.267, 15.233, 17.2, 18.267, 19.267, 21.0, 23.8, 25.2, 28.033, 29.833, 37.933];

export const modeAt = (frame: number) => {
	let i = 0;
	MODES.forEach((m, k) => {
		if (frame >= at(m.t)) i = k;
	});
	const end = i + 1 < MODES.length ? at(MODES[i + 1].t) : TALK;
	return {index: i, m: MODES[i], start: at(MODES[i].t), end};
};

// Zones laissées libres pour l'interface d'Instagram.
export const SAFE = {top: 270, bottom: 640, side: 70};
