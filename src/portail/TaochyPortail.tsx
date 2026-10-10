import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {COLORS, TITLE_FONT} from '../theme';
import {Overlays} from './Overlays';
import {Presenter, shotAt} from './Presenter';
import {StudioBackground} from './StudioBackground';
import {at, INTRO, PORTAIL_DURATION, SHOTS, TALK} from './timing';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUTRO_START = INTRO + TALK;

// Grand logo en 3D : il pivote vers la caméra avec un reflet (intro et fin).
const HeroLogo: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 90}});
	return (
		<div style={{perspective: 1600}}>
			<div
				style={{
					transform: `rotateY(${(1 - s) * -75}deg) rotateX(${(1 - s) * 20}deg) scale(${0.6 + 0.4 * s}) translateZ(${s * 40}px)`,
					opacity: Math.min(1, s * 1.6),
					filter: `drop-shadow(0 0 40px rgba(206,173,111,${0.5 * s}))`,
				}}
			>
				<Logo width={900} shineStart={start + 14} />
			</div>
		</div>
	);
};

const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const out = interpolate(frame, [INTRO - 14, INTRO], [1, 0], clamp);
	const zoom = interpolate(frame, [INTRO - 14, INTRO], [1, 1.6], clamp);
	if (frame >= INTRO) return null;
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out, transform: `scale(${zoom})`}}>
			<HeroLogo start={2} />
		</AbsoluteFill>
	);
};

const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < OUTRO_START) return null;
	const t = spring({frame: frame - OUTRO_START - 20, fps, config: {damping: 16}});
	const fade = interpolate(frame, [PORTAIL_DURATION - 14, PORTAIL_DURATION], [1, 0], clamp);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40, opacity: fade}}>
			<HeroLogo start={OUTRO_START + 6} />
			<div
				style={{
					fontFamily: TITLE_FONT,
					fontWeight: 800,
					fontSize: 44,
					color: COLORS.goldLight,
					letterSpacing: 2,
					opacity: t,
					transform: `translateY(${(1 - t) * 30}px)`,
				}}
			>
				taochyagency.com
			</div>
		</AbsoluteFill>
	);
};

// Logo toujours visible en haut à gauche (il se retire seulement quand le grand logo est à l'écran).
const CornerLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const o = Math.min(
		interpolate(frame, [INTRO - 6, INTRO + 10], [0, 1], clamp),
		interpolate(frame, [OUTRO_START, OUTRO_START + 10], [1, 0], clamp),
	);
	return (
		<div style={{position: 'absolute', left: 70, top: 56, opacity: 0.92 * o, filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.8))'}}>
			<Logo width={250} shineStart={INTRO + 20} />
		</div>
	);
};

// Éclair doré sur chaque changement de plan (masque la coupe).
const CutFlash: React.FC = () => {
	const frame = useCurrentFrame();
	const {start, index} = shotAt(frame);
	if (index === 0) return null;
	const o = interpolate(frame - start, [0, 6], [0.35, 0], clamp);
	return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(233,214,166,1), transparent 70%)', opacity: o, mixBlendMode: 'screen'}} />;
};

// Musique : plus forte sur le logo, très discrète sous la voix.
const musicVolume = (f: number) =>
	interpolate(f, [0, INTRO - 10, INTRO + 6, OUTRO_START - 6, OUTRO_START + 10, PORTAIL_DURATION], [0.55, 0.55, 0.1, 0.1, 0.5, 0.5], clamp);

const SFX: {name: string; f: number; v: number}[] = [
	{name: 'shimmer', f: 2, v: 0.35},
	{name: 'whoosh', f: INTRO - 12, v: 0.3},
	...SHOTS.slice(1).map((s) => ({name: 'whoosh', f: at(s.t) - 4, v: 0.16})),
	{name: 'pop', f: at(15.0), v: 0.18},
	{name: 'pop', f: at(15.85), v: 0.18},
	{name: 'pop', f: at(17.8), v: 0.18},
	{name: 'pop-high', f: at(19.1), v: 0.2},
	{name: 'pop', f: at(25.3), v: 0.18},
	{name: 'pop-high', f: at(26.96), v: 0.2},
	{name: 'pop', f: at(37.75), v: 0.18},
	{name: 'pop', f: at(38.5), v: 0.18},
	{name: 'shimmer', f: at(39.75), v: 0.25},
	{name: 'shimmer', f: OUTRO_START + 6, v: 0.3},
];

export const TaochyPortail: React.FC = () => {
	const frame = useCurrentFrame();
	const {shot} = shotAt(frame);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			<StudioBackground shift={frame >= INTRO ? shot.x : 0} />
			<Presenter />
			<CutFlash />
			<Overlays />
			<Intro />
			<Outro />
			<CornerLogo />

			<Audio src={staticFile('audio/music-portail.wav')} volume={musicVolume} />
			<Sequence from={INTRO} layout="none">
				<Audio src={staticFile('portail/voix.wav')} volume={1} />
			</Sequence>
			{SFX.map((s, i) => (
				<Sequence key={i} from={s.f} layout="none">
					<Audio src={staticFile(`audio/sfx/${s.name}.wav`)} volume={s.v} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
