// Reel « Qu'est-ce qui fait qu'un commerce marche ? » (1080×1920, 30 i/s).
// Les temps « t » sont en secondes dans la prise montée ; la voix démarre à l'image 0.

export const FPS = 30;
export const TALK = 1029; // 34,3 s de prise montée
export const OUTRO = 105; // appel à l'action final
export const COMMERCE_DURATION = TALK + OUTRO;
export const at = (t: number) => Math.round(t * FPS);

// Mise en page : la personne seule (talk), la personne sous une fenêtre vidéo (split),
// ou une vidéo d'illustration plein écran (full).
export type Mode = {t: number; mode: 'talk' | 'split' | 'full'; scale?: number; card?: string; clip?: string};
export const MODES: Mode[] = [
	{t: 0, mode: 'talk', scale: 1}, // « Qu'est-ce qui fait qu'un commerce physique fonctionne ? »
	{t: 2.167, mode: 'full', clip: 'crowd'}, // « Ouais, le passage. »
	{t: 3.333, mode: 'split', card: 'boutique'}, // « un magasin, un bureau »
	{t: 5.867, mode: 'talk', scale: 1.15}, // « s'il n'est pas visible par personne »
	{t: 8.0, mode: 'split', card: 'empty'}, // « votre offre ne vaut rien »
	{t: 9.467, mode: 'full', clip: 'street'}, // « Le passage. »
	{t: 10.233, mode: 'split', card: 'worker'}, // « le meilleur produit, la meilleure image de marque »
	{t: 15.167, mode: 'split', card: 'laptop'}, // « Un site internet, c'est la même chose »
	{t: 16.8, mode: 'full', clip: 'phone'}, // « l'outil ultime pour faire plus de ventes »
	{t: 19.7, mode: 'talk', scale: 1}, // « c'est comme un magasin »
	{t: 21.9, mode: 'split', card: 'site0'}, // « s'il n'est pas visible, il ne sert à rien »
	{t: 24.533, mode: 'talk', scale: 1.15}, // « Chez Taochy Agency »
	{t: 26.2, mode: 'split', card: 'convert'}, // « 1, faire un site qui convertit »
	{t: 27.667, mode: 'split', card: 'traffic'}, // « 2, qu'il y ait du trafic »
	{t: 29.833, mode: 'split', card: 'leads'}, // « des demandes de devis ou des ventes »
];

// Raccords de la prise (silences retirés) : petit recadrage pour masquer le saut.
export const JUMP_CUTS = [4.567, 12.167, 13.233, 14.233, 20.167, 23.0, 32.633];

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
