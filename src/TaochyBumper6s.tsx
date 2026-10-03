import React from 'react';
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {type Cue, sfx, Soundtrack, vo} from './audio/Soundtrack';
import {AnimatedWords} from './components/AnimatedWords';
import {Background} from './components/Background';
import {GoldWipe, WIPE_DURATION} from './components/GoldWipe';
import {Logo} from './components/Logo';
import {SafeArea, SafeZoneOverlay} from './components/SafeArea';
import type {AdProps} from './props';
import {CtaScene} from './scenes/CtaScene';

export const BUMPER_DURATION = 180;
const LINE_2 = 58;
const CTA_START = 105;

const VOICE: Cue[] = [vo('b_intro', 1), vo('b_cta', 95)];

const EFFECTS: Cue[] = [
	sfx('impact', 0, 0.55),
	sfx('shimmer', 60, 0.3),
	sfx('whoosh', CTA_START - 12, 0.55),
	sfx('impact', CTA_START, 0.45),
	sfx('pop', CTA_START + 5, 0.45),
	sfx('shimmer', CTA_START + 12, 0.35),
];

const fadeOut = (frame: number, end: number) =>
	interpolate(frame, [end - 8, end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const BumperIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logoIn = spring({frame: frame - 4, fps, config: {damping: 200}});

	return (
		<AbsoluteFill>
			<SafeArea style={{gap: 50}}>
				<div style={{opacity: logoIn, transform: `scale(${0.9 + 0.1 * logoIn})`}}>
					<Logo width={560} shineStart={60} />
				</div>
				<div style={{position: 'relative', width: '100%', height: 260}}>
					<AbsoluteFill style={{justifyContent: 'center', opacity: fadeOut(frame, LINE_2)}}>
						<AnimatedWords text="Commerçants, artisans" fontSize={100} delay={2} stagger={3} />
						<AnimatedWords text={'de La Réunion :'} fontSize={100} highlight={['La Réunion']} delay={8} stagger={3} />
					</AbsoluteFill>
					{frame >= LINE_2 - 2 && (
						<AbsoluteFill style={{justifyContent: 'center'}}>
							<AnimatedWords text="Plus de clients" fontSize={104} highlight={['clients']} delay={LINE_2} stagger={3} />
							<AnimatedWords text="grâce au digital." fontSize={104} highlight={['digital.']} delay={LINE_2 + 6} stagger={3} />
						</AbsoluteFill>
					)}
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};

// Version « bumper » de 6 s (non désactivable) : accroche + logo + appel à l'action.
export const TaochyBumper6s: React.FC<AdProps> = (props) => (
	<AbsoluteFill>
		<Background />
		<Sequence durationInFrames={CTA_START}>
			<BumperIntro />
		</Sequence>
		<Sequence from={CTA_START}>
			<CtaScene cta={props.cta} website={props.website} />
		</Sequence>
		<Sequence from={CTA_START - WIPE_DURATION / 2} durationInFrames={WIPE_DURATION}>
			<GoldWipe />
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
