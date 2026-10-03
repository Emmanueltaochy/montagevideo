// Textes modifiables directement depuis le panneau « Props » du Studio Remotion.
export type AdProps = {
	website: string;
	cta: string;
	// Résultats clients (scène 20–25 s) : chiffre principal…
	statPrefix: string;
	statValue: number;
	statSuffix: string;
	statLabel: string;
	statDetail: string;
	// …puis deux autres preuves.
	proof2Value: string;
	proof2Label: string;
	proof2Detail: string;
	proof3Quote: string;
	proof3Detail: string;
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
	statLabel: 'de demandes de devis',
	statDetail: 'Menuiserie · Saint-Denis',
	proof2Value: 'Des millions',
	proof2Label: 'de vues',
	proof2Detail: "Gîte · Sud de l'île",
	proof3Quote: 'Mon téléphone ne fait que sonner !',
	proof3Detail: 'Chauffeur VTC',
	music: true,
	voiceOver: true,
	soundEffects: true,
	showSafeZone: false,
};
