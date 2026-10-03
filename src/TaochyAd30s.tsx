import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {type Cue, sfx, Soundtrack, vo} from './audio/Soundtrack';
import {Background} from './components/Background';
import {SafeZoneOverlay} from './components/SafeArea';
import {SceneTransition, TRANSITION_DURATION, type TransitionType} from './components/SceneTransition';
import type {AdProps} from './props';
import {CtaScene} from './scenes/CtaScene';
import {HOOK_SHAKE, HOOK_SHOT_2, HookScene} from './scenes/HookScene';
import {SERVICE_SHOT_B, ServiceScene} from './scenes/ServiceScene';
import {COUNT_END, PROOF_3_AT, STAT_SHOT_2, StatScene} from './scenes/StatScene';
import {BrowserMock} from './visuals/BrowserMock';
import {ReunionMap} from './visuals/ReunionMap';
import {SocialFeed} from './visuals/SocialFeed';

const SCENE = 150; // 5 s à 30 fps
export const AD_DURATION = SCENE * 6;

// Une transition différente à chaque changement de scène.
const TRANSITIONS: TransitionType[] = ['wipe', 'iris', 'slices', 'streaks', 'flash'];

// Les animations des visuels tournent à 1,45× : convertit une image « visuel » en image de la scène.
const V = (f: number) => SERVICE_SHOT_B + Math.round(f / 1.45);

const VOICE: Cue[] = [
	vo('hook', 2),
	vo('web', SCENE + 3),
	vo('social', SCENE * 2 + 3),
	vo('ads', SCENE * 3 + 6),
	vo('stat', SCENE * 4 + 4),
	vo('cta', SCENE * 5 + 4),
];

const serviceEffects = (o: number): Cue[] => [
	sfx('impact', o + 4, 0.3),
	sfx('whoosh', o + SERVICE_SHOT_B - 11, 0.4),
	...[14, 20, 26].map((f) => sfx('pop', o + SERVICE_SHOT_B + f, 0.3)),
];

// Bruitages, calés image par image sur les animations.
const EFFECTS: Cue[] = [
	// Accroche
	sfx('impact', 0, 0.6),
	sfx('typing', 10, 0.35),
	sfx('click', 44, 0.6),
	sfx('whoosh', HOOK_SHOT_2 - 11, 0.5),
	sfx('impact', HOOK_SHOT_2 + 6, 0.4),
	sfx('shimmer', HOOK_SHOT_2 + 10, 0.3),
	...[18, 23, 28].map((f) => sfx('pop', HOOK_SHOT_2 + f, 0.35)),
	sfx('impact', HOOK_SHAKE, 0.4),
	// Transitions entre scènes : le pic du whoosh tombe au changement.
	...[1, 2, 3, 4, 5].map((i) => sfx('whoosh', i * SCENE - 11, 0.6)),
	// 01 — site web
	...serviceEffects(SCENE),
	sfx('typing', SCENE + V(12), 0.3),
	sfx('click', SCENE + V(92), 0.6),
	sfx('shimmer', SCENE + V(98), 0.25),
	// 02 — réseaux sociaux
	...serviceEffects(SCENE * 2),
	...[30, 50, 72, 98].map((f) => sfx('pop-high', SCENE * 2 + V(f), 0.22)),
	...[18, 32, 46, 60, 74].map((f) => sfx('pop', SCENE * 2 + V(f), 0.28)),
	// 03 — publicité
	...serviceEffects(SCENE * 3),
	...[34, 44, 54, 64].map((f) => sfx('pop-high', SCENE * 3 + V(f), 0.32)),
	sfx('pop', SCENE * 3 + V(80), 0.4),
	// Chiffre client
	sfx('pop', SCENE * 4 + 2, 0.4),
	sfx('riser', SCENE * 4 + COUNT_END - 48, 0.35),
	sfx('impact', SCENE * 4 + COUNT_END, 0.55),
	sfx('whoosh', SCENE * 4 + STAT_SHOT_2 - 11, 0.45),
	sfx('pop', SCENE * 4 + STAT_SHOT_2 + 2, 0.4),
	sfx('whoosh', SCENE * 4 + STAT_SHOT_2 + PROOF_3_AT - 8, 0.35),
	sfx('pop', SCENE * 4 + STAT_SHOT_2 + PROOF_3_AT + 4, 0.4),
	// Appel à l'action
	sfx('impact', SCENE * 5, 0.5),
	sfx('pop', SCENE * 5 + 4, 0.45),
	sfx('shimmer', SCENE * 5 + 10, 0.4),
];

// Version longue : 30 s, 6 scènes de 5 s, plusieurs plans par scène et angles de caméra variés.
export const TaochyAd30s: React.FC<AdProps> = (props) => {
	const scenes = [
		<HookScene key="hook" />,
		<ServiceScene
			key="web"
			index="01"
			title="Création de site web"
			ghost="WEB"
			highlight={['site', 'web']}
			tagline="Un site qui vend pour vous 24h/24"
			features={['Réservations & devis en ligne', 'Parfait sur mobile', 'Trouvé sur Google']}
			angles={{
				titleEnter: 'zoom',
				cut: 'zoom',
				titleCamera: {from: {scale: 1.4, rz: 6}, to: {scale: 1, rz: 0}},
				visualCamera: {from: {ry: -18, scale: 1.08, x: 80}, to: {ry: -4, scale: 1, x: 0}},
			}}
			visual={<BrowserMock />}
		/>,
		<ServiceScene
			key="social"
			index="02"
			title="Gestion des réseaux sociaux"
			ghost="SOCIAL"
			highlight={['réseaux', 'sociaux']}
			tagline="Vous travaillez, on publie"
			features={['Visuels pros de vos produits', 'Publications régulières', "Une communauté qui s'engage"]}
			angles={{
				titleEnter: 'up',
				cut: 'left',
				titleCamera: {from: {rx: 30, y: 120, scale: 1.1}, to: {rx: 0, y: 0, scale: 1}},
				visualCamera: {from: {rz: -5, scale: 1.12}, to: {rz: 1.5, scale: 1}},
			}}
			visual={<SocialFeed />}
		/>,
		<ServiceScene
			key="ads"
			index="03"
			title="Publicité en ligne"
			ghost="ADS"
			highlight={['publicité']}
			tagline="Les bons clients, au bon endroit"
			features={['Facebook, Instagram & Google', 'De Saint-Denis à Saint-Pierre', 'Budget maîtrisé']}
			angles={{
				titleEnter: 'left',
				cut: 'up',
				titleCamera: {from: {ry: 35, scale: 1.15}, to: {ry: 0, scale: 1}},
				visualCamera: {from: {scale: 1.12, y: 50}, to: {scale: 1, y: 0}},
			}}
			visual={<ReunionMap />}
		/>,
		<StatScene
			key="stat"
			prefix={props.statPrefix}
			value={props.statValue}
			suffix={props.statSuffix}
			label={props.statLabel}
			detail={props.statDetail}
			proof2Value={props.proof2Value}
			proof2Label={props.proof2Label}
			proof2Detail={props.proof2Detail}
			proof3Quote={props.proof3Quote}
			proof3Detail={props.proof3Detail}
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
			{TRANSITIONS.map((type, i) => (
				<Sequence key={type} from={(i + 1) * SCENE - TRANSITION_DURATION / 2} durationInFrames={TRANSITION_DURATION}>
					<SceneTransition type={type} />
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
