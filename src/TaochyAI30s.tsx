import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {type Cue, sfx, Soundtrack, vo} from './audio/Soundtrack';
import {Background} from './components/Background';
import {SafeZoneOverlay} from './components/SafeArea';
import {SceneTransition, TRANSITION_DURATION, type TransitionType} from './components/SceneTransition';
import type {AdProps} from './props';
import {AI_HOOK_SHOT_2, AIHookScene} from './scenes/ai/AIHookScene';
import {AIProofScene, PIPELINE_STEPS_AT, PROOF_COUNT_END, PROOF_SHOT_2} from './scenes/ai/AIProofScene';
import {CtaScene} from './scenes/CtaScene';
import {SERVICE_SHOT_B, ServiceScene} from './scenes/ServiceScene';
import {AutomationFlow} from './visuals/ai/AutomationFlow';
import {ChatAssistant} from './visuals/ai/ChatAssistant';
import {ContentGenerator} from './visuals/ai/ContentGenerator';
import {NeuralNet} from './visuals/ai/NeuralNet';

const SCENE = 150; // 5 s à 30 fps
export const AI_DURATION = SCENE * 6;

const TRANSITIONS: TransitionType[] = ['iris', 'streaks', 'wipe', 'slices', 'flash'];

// Les animations des visuels tournent à 1,45× : convertit une image « visuel » en image de la scène.
const V = (f: number) => SERVICE_SHOT_B + Math.round(f / 1.45);

const VOICE: Cue[] = [
	vo('ai_hook', 2),
	vo('ai_assist', SCENE + 1),
	vo('ai_auto', SCENE * 2 + 2),
	vo('ai_content', SCENE * 3 + 2),
	vo('ai_proof', SCENE * 4 + 1),
	vo('ai_cta', SCENE * 5 + 2),
];

const serviceEffects = (o: number): Cue[] => [
	sfx('impact', o + 4, 0.3),
	sfx('whoosh', o + SERVICE_SHOT_B - 11, 0.4),
	...[14, 20, 26].map((f) => sfx('pop', o + SERVICE_SHOT_B + f, 0.3)),
];

const EFFECTS: Cue[] = [
	// Accroche
	sfx('impact', 0, 0.6),
	sfx('riser', AI_HOOK_SHOT_2 - 48, 0.3),
	sfx('impact', AI_HOOK_SHOT_2 + 4, 0.45),
	sfx('shimmer', AI_HOOK_SHOT_2 + 10, 0.3),
	...[22, 29, 36].map((f) => sfx('pop', AI_HOOK_SHOT_2 + f, 0.35)),
	// Transitions entre scènes
	...[1, 2, 3, 4, 5].map((i) => sfx('whoosh', i * SCENE - 11, 0.6)),
	// 01 — assistant
	...serviceEffects(SCENE),
	...[22, 52, 78, 104].map((f) => sfx('pop-high', SCENE + V(f), 0.3)),
	// 02 — automatisation
	...serviceEffects(SCENE * 2),
	...[10, 36, 62, 88].map((f) => sfx('click', SCENE * 2 + V(f), 0.45)),
	// 03 — contenus
	...serviceEffects(SCENE * 3),
	sfx('typing', SCENE * 3 + V(4), 0.3),
	sfx('click', SCENE * 3 + V(33), 0.5),
	sfx('shimmer', SCENE * 3 + V(42), 0.3),
	...[96, 102, 108, 114].map((f) => sfx('pop-high', SCENE * 3 + V(f), 0.25)),
	// Preuve
	sfx('riser', SCENE * 4 + PROOF_COUNT_END - 48, 0.35),
	sfx('impact', SCENE * 4 + PROOF_COUNT_END, 0.55),
	sfx('whoosh', SCENE * 4 + PROOF_SHOT_2 - 11, 0.45),
	...PIPELINE_STEPS_AT.map((f) => sfx('pop', SCENE * 4 + PROOF_SHOT_2 + f, 0.45)),
	// Appel à l'action
	sfx('impact', SCENE * 5, 0.5),
	sfx('pop', SCENE * 5 + 4, 0.45),
	sfx('shimmer', SCENE * 5 + 10, 0.4),
];

// Pub « Taochy Agency × IA » : 30 s, même grammaire visuelle que la pub principale, habillage plus « tech ».
export const TaochyAI30s: React.FC<AdProps> = (props) => {
	const scenes = [
		<AIHookScene key="hook" />,
		<ServiceScene
			key="assist"
			index="01"
			title="Assistant IA"
			ghost="24H/24"
			highlight={['IA']}
			tagline="Un assistant qui répond 24h/24"
			features={['Répond aux questions', 'Prend les rendez-vous', 'Sur tous vos canaux']}
			angles={{
				titleEnter: 'zoom',
				cut: 'zoom',
				titleCamera: {from: {scale: 1.4, rz: -6}, to: {scale: 1, rz: 0}},
				visualCamera: {from: {ry: 18, scale: 1.08}, to: {ry: 4, scale: 1}},
			}}
			visual={<ChatAssistant />}
		/>,
		<ServiceScene
			key="auto"
			index="02"
			title="Automatisation"
			ghost="AUTO"
			highlight={['Automatisation']}
			tagline="Fini la paperasse"
			features={['Devis & factures automatiques', 'Relances clients', 'Agenda synchronisé']}
			angles={{
				titleEnter: 'left',
				cut: 'up',
				titleCamera: {from: {ry: -35, scale: 1.15}, to: {ry: 0, scale: 1}},
				visualCamera: {from: {rx: 22, scale: 1.1, y: 40}, to: {rx: 0, scale: 1, y: 0}},
			}}
			visual={<AutomationFlow />}
		/>,
		<ServiceScene
			key="content"
			index="03"
			title="Contenus IA"
			ghost="CONTENUS"
			highlight={['IA']}
			tagline="Vos contenus créés en un clic"
			features={['Articles & posts', 'Visuels', 'Vidéos courtes']}
			angles={{
				titleEnter: 'up',
				cut: 'left',
				titleCamera: {from: {rx: 30, y: 120, scale: 1.1}, to: {rx: 0, y: 0, scale: 1}},
				visualCamera: {from: {rz: 4, scale: 1.12}, to: {rz: -1.5, scale: 1}},
			}}
			visual={<ContentGenerator />}
		/>,
		<AIProofScene key="proof" />,
		<CtaScene key="cta" cta={props.cta} website={props.website} subline="Assistant · Automatisation · Contenus · Formation" />,
	];

	return (
		<AbsoluteFill>
			<Background />
			{scenes.map((scene, i) => (
				<Sequence key={i} from={i * SCENE} durationInFrames={SCENE}>
					{i > 0 && i < 4 && <NeuralNet seed={`s${i}`} opacity={0.3} />}
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
