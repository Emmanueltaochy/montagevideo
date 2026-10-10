// Reel « Magasin et site » v2, prise pré-coupée par Emmanuel (1080×1920, 30 i/s).
// Les temps « t » sont en secondes dans la prise montée ; la voix démarre à l'image 0.

export const FPS = 30;
export const TALK = 819; // 27,3 s de prise montée
export const OUTRO = 105; // appel à l'action final
export const COMMERCE2_DURATION = TALK + OUTRO;
export const at = (t: number) => Math.round(t * FPS);

// Mise en page : la personne seule (talk), la personne sous une fenêtre vidéo (split),
// ou une vidéo d'illustration plein écran (full).
export type Mode = {t: number; mode: 'talk' | 'split' | 'full'; scale?: number; card?: string; clip?: string};
export const MODES: Mode[] = [
	{t: 0, mode: 'talk', scale: 1}, // « Qu'est-ce qui fait qu'un commerce physique fonctionne ? »
	{t: 2.1, mode: 'full', clip: 'crowd'}, // « Le passage. »
	{t: 2.95, mode: 'split', card: 'worker'}, // « le meilleur produit, la meilleure image de marque »
	{t: 7.95, mode: 'split', card: 'laptop'}, // « Un site internet, c'est la même chose »
	{t: 9.5, mode: 'full', clip: 'phone'}, // « l'outil ultime pour faire plus de ventes »
	{t: 12.55, mode: 'talk', scale: 1}, // « mais un site internet, c'est comme un magasin »
	{t: 14.8, mode: 'split', card: 'site0'}, // « s'il n'est pas visible, il ne sert à rien »
	{t: 17.5, mode: 'talk', scale: 1.15}, // « Chez Taochy Agency »
	{t: 19.0, mode: 'split', card: 'convert'}, // « 1, faire un site qui convertit »
	{t: 20.5, mode: 'split', card: 'traffic'}, // « 2, qu'il y ait du trafic »
	{t: 22.75, mode: 'split', card: 'leads'}, // « des demandes de devis ou des ventes »
];

// Raccords de la prise (silences retirés) : petit recadrage pour masquer le saut.
export const JUMP_CUTS = [5.067, 6.1, 7.1, 8.867, 13.1, 15.933, 25.6, 26.7];

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
