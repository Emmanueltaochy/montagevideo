import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {type Cue, sfx, Soundtrack, vo} from './audio/Soundtrack';
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

// Voix off, calée sur l'apparition des textes.
const VOICE: Cue[] = [
	vo('hook1', 4),
	vo('hook2', 74),
	vo('web', SCENE + 14),
	vo('social', SCENE * 2 + 14),
	vo('ads', SCENE * 3 + 14),
	vo('stat', SCENE * 4 + 14),
	vo('cta', SCENE * 5 + 8),
];

// Bruitages, calés image par image sur les animations des scènes.
const EFFECTS: Cue[] = [
	sfx('impact', 0, 0.6),
	sfx('shimmer', 82, 0.35),
	sfx('impact', 100, 0.45),
	// Balayages dorés : le pic du whoosh tombe au changement de scène.
	...[1, 2, 3, 4, 5].map((i) => sfx('whoosh', i * SCENE - 12, 0.55)),
	// 01 — site web
	sfx('typing', SCENE + 12, 0.35),
	sfx('pop', SCENE + 28, 0.4),
	sfx('pop', SCENE + 40, 0.3),
	sfx('pop', SCENE + 60, 0.4),
	sfx('click', SCENE + 92, 0.7),
	sfx('shimmer', SCENE + 98, 0.3),
	// 02 — réseaux sociaux
	...[30, 42, 54].map((f) => sfx('pop', SCENE * 2 + f, 0.4)),
	...[32, 52, 74, 98].map((f) => sfx('pop-high', SCENE * 2 + f, 0.25)),
	// 03 — publicité
	...[34, 44, 54, 64].map((f) => sfx('pop-high', SCENE * 3 + f, 0.35)),
	sfx('pop', SCENE * 3 + 80, 0.45),
	// Chiffre client : montée pendant le compteur, impact à l'arrivée
	sfx('riser', SCENE * 4 + 7, 0.4),
	sfx('impact', SCENE * 4 + 55, 0.55),
	// Appel à l'action
	sfx('impact', SCENE * 5, 0.5),
	sfx('pop', SCENE * 5 + 5, 0.45),
	sfx('shimmer', SCENE * 5 + 12, 0.4),
];

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
			<Soundtrack
				music="audio/music-30s.wav"
				voice={VOICE}
				effects={EFFECTS}
				withMusic={props.music}
				withVoice={props.voiceOver}
				withEffects={props.soundEffects}
			/>
			{props.showSafeZone && <SafeZoneOverlay />}
		</AbsoluteFill>
	);
};
