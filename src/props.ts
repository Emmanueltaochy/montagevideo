// Textes modifiables directement depuis le panneau « Props » du Studio Remotion.
export type AdProps = {
	website: string;
	cta: string;
	// EXEMPLE À REMPLACER par un vrai résultat client avant diffusion.
	statPrefix: string;
	statValue: number;
	statSuffix: string;
	statLabel: string;
	statDetail: string;
	// Pistes audio activables séparément.
	music: boolean;
	voiceOver: boolean;
	soundEffects: boolean;
	// Affiche la zone réservée aux contrôles YouTube (pour vérifier la mise en page).
	showSafeZone: boolean;
};

export const DEFAULT_PROPS: AdProps = {
	website: 'taochyagency.com',
	cta: 'Réservez un appel gratuit',
	statPrefix: '+',
	statValue: 40,
	statSuffix: '%',
	statLabel: 'de réservations en 3 mois',
	statDetail: 'pour un commerce accompagné à La Réunion',
	music: true,
	voiceOver: true,
	soundEffects: true,
	showSafeZone: false,
};
