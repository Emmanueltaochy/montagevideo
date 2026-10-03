import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Background} from './components/Background';
import {GoldWipe, WIPE_DURATION} from './components/GoldWipe';
import {SafeZoneOverlay} from './components/SafeArea';
import type {AdProps} from './props';
import {CtaScene} from './scenes/CtaScene';
import {HookScene} from './scenes/HookScene';
import {ServiceScene} from './scenes/ServiceScene';
import {StatScene} from './scenes/StatScene';
import {BrowserMock} from './visuals/BrowserMock';
import {ReunionMap} from './visuals/ReunionMap';
import {SocialFeed} from './visuals/SocialFeed';

const SCENE = 150; // 5 s à 30 fps
export const AD_DURATION = SCENE * 6;

// Version longue : 30 s, 6 scènes de 5 s séparées par un balayage doré.
export const TaochyAd30s: React.FC<AdProps> = (props) => {
	const scenes = [
		<HookScene key="hook" />,
		<ServiceScene
			key="web"
			index="01"
			title="Création de site web"
			highlight={['site', 'web']}
			tagline="Un site pro qui attire des clients"
			visual={<BrowserMock />}
		/>,
		<ServiceScene
			key="social"
			index="02"
			title="Gestion des réseaux sociaux"
			highlight={['réseaux', 'sociaux']}
			tagline="On publie, vous vendez"
			visual={<SocialFeed />}
		/>,
		<ServiceScene
			key="ads"
			index="03"
			title="Publicité en ligne"
			highlight={['publicité']}
			tagline="Touchez les clients du 974"
			visual={<ReunionMap />}
		/>,
		<StatScene
			key="stat"
			prefix={props.statPrefix}
			value={props.statValue}
			suffix={props.statSuffix}
			label={props.statLabel}
			detail={props.statDetail}
		/>,
		<CtaScene key="cta" cta={props.cta} website={props.website} />,
	];

	return (
		<AbsoluteFill>
			<Background />
			{scenes.map((scene, i) => (
				<Sequence key={i} from={i * SCENE} durationInFrames={SCENE}>
					{scene}
				</Sequence>
			))}
			{scenes.slice(1).map((_, i) => (
				<Sequence key={`wipe-${i}`} from={(i + 1) * SCENE - WIPE_DURATION / 2} durationInFrames={WIPE_DURATION}>
					<GoldWipe />
				</Sequence>
			))}
			{/* Musique : déposer un fichier dans public/ puis ajouter <Audio src={staticFile('musique.mp3')} /> */}
			{props.showSafeZone && <SafeZoneOverlay />}
		</AbsoluteFill>
	);
};
