import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {type Cue, sfx, Soundtrack, vo} from './audio/Soundtrack';
import {Background} from './components/Background';
import {Logo} from './components/Logo';
import {MotionAccents} from './components/MotionAccents';
import {SafeArea, SafeZoneOverlay} from './components/SafeArea';
import {SceneTransition, TRANSITION_DURATION} from './components/SceneTransition';
import {Shot} from './components/Shot';
import {SlamWords} from './components/SlamWords';
import type {AdProps} from './props';
import {CtaScene} from './scenes/CtaScene';

export const BUMPER_DURATION = 180;
const LINE_2 = 50;
const CTA_START = 100;

const VOICE: Cue[] = [vo('b_intro', 2), vo('b_cta', CTA_START + 3)];

const EFFECTS: Cue[] = [
	sfx('impact', 0, 0.55),
	sfx('shimmer', 8, 0.3),
	sfx('whoosh', LINE_2 - 11, 0.45),
	sfx('impact', LINE_2 + 2, 0.35),
	sfx('whoosh', CTA_START - 11, 0.55),
	sfx('impact', CTA_START, 0.45),
	sfx('pop', CTA_START + 4, 0.45),
	sfx('shimmer', CTA_START + 10, 0.35),
];

// Le logo reste en haut pendant toute l'intro, les phrases changent en dessous.
const PinnedLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 11, stiffness: 200, mass: 0.6}});
	return (
		<SafeArea style={{justifyContent: 'flex-start', paddingTop: 90}}>
			<div style={{opacity: Math.min(1, s * 1.5), transform: `scale(${2 - s})`}}>
				<Logo width={520} shineStart={8} />
			</div>
		</SafeArea>
	);
};

const Line: React.FC<{a: string; b: string; highlight: string[]}> = ({a, b, highlight}) => (
	<SafeArea style={{paddingTop: 250}}>
		<SlamWords text={a} fontSize={124} highlight={highlight} delay={1} stagger={2} />
		<SlamWords text={b} fontSize={124} highlight={highlight} delay={6} stagger={2} />
	</SafeArea>
);

// Version « bumper » de 6 s (non désactivable) : accroche + logo + appel à l'action.
export const TaochyBumper6s: React.FC<AdProps> = (props) => (
	<AbsoluteFill>
		<Background />
		<Sequence durationInFrames={CTA_START}>
			<MotionAccents seed="bumper" ghostText="974" />
			<PinnedLogo />
		</Sequence>
		<Shot from={0} duration={LINE_2} exit="left" camera={{from: {scale: 1.25, rx: 18}, to: {scale: 1, rx: 0}}}>
			<Line a="Commerçant à" b={'La\u00A0Réunion\u00A0?'} highlight={['La Réunion']} />
		</Shot>
		<Shot from={LINE_2} duration={CTA_START - LINE_2} enter="right" camera={{from: {scale: 1.1, rz: -4}, to: {scale: 1, rz: 0}}}>
			<Line a="Plus de clients," b="sans prise de tête." highlight={['clients,', 'tête.']} />
		</Shot>
		<Sequence from={CTA_START}>
			<CtaScene cta={props.cta} website={props.website} />
		</Sequence>
		<Sequence from={CTA_START - TRANSITION_DURATION / 2} durationInFrames={TRANSITION_DURATION}>
			<SceneTransition type="iris" />
		</Sequence>
		<Soundtrack
			music="audio/music-6s.wav"
			voice={VOICE}
			effects={EFFECTS}
			withMusic={props.music}
			withVoice={props.voiceOver}
			withEffects={props.soundEffects}
		/>
		{props.showSafeZone && <SafeZoneOverlay />}
	</AbsoluteFill>
);
