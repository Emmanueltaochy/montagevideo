import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, GOLD_GRADIENT} from '../theme';

export const TRANSITION_DURATION = 16;
export type TransitionType = 'wipe' | 'iris' | 'slices' | 'streaks' | 'flash';

const HALF = TRANSITION_DURATION / 2;

// 0 → 1 pendant la première moitié (l'écran se couvre), 1 → 2 pendant la seconde (il se découvre).
const useProgress = () => {
	const frame = useCurrentFrame();
	return frame < HALF
		? interpolate(frame, [0, HALF], [0, 1], {extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic)})
		: interpolate(frame, [HALF, TRANSITION_DURATION], [1, 2], {extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
};

const Wipe: React.FC<{p: number}> = ({p}) => (
	<div
		style={{
			position: 'absolute',
			top: -100,
			bottom: -100,
			left: -340,
			width: 2600,
			transform: `translateX(${(p - 1) * 3000}px) skewX(-15deg)`,
			display: 'flex',
		}}
	>
		<div style={{width: 60, background: COLORS.goldLight}} />
		<div style={{width: 30}} />
		<div style={{flex: 1, background: GOLD_GRADIENT}} />
		<div style={{width: 30}} />
		<div style={{width: 60, background: COLORS.goldLight}} />
	</div>
);

// Disque doré qui grandit, puis se troue depuis le centre.
const Iris: React.FC<{p: number}> = ({p}) => {
	const outer = Math.min(1, p) * 1250;
	const hole = Math.max(0, p - 1) * 1300;
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 45%, transparent ${hole}px, ${COLORS.goldLight} ${hole}px, ${COLORS.gold} ${hole + 40}px, ${COLORS.goldDark} ${outer}px, transparent ${outer}px)`,
			}}
		/>
	);
};

// Bandes verticales qui tombent en cascade.
const Slices: React.FC<{p: number}> = ({p}) => {
	const n = 6;
	return (
		<AbsoluteFill style={{flexDirection: 'row'}}>
			{Array.from({length: n}).map((_, i) => {
				const lag = i * 0.06;
				const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
				// Toutes les bandes couvrent l'écran à p = 1, avec un léger décalage entre elles.
				const local = p <= 1 ? clamp01((p - lag) / (1 - n * 0.06)) : 1 + clamp01((p - 1 - lag) / (1 - n * 0.06));
				return (
					<div
						key={i}
						style={{
							flex: 1,
							marginRight: -1,
							background: i % 2 ? GOLD_GRADIENT : COLORS.gold,
							transform: `translateY(${(local - 1) * 110}%)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// Traînées horizontales façon « whip pan ».
const Streaks: React.FC<{p: number}> = ({p}) => {
	const n = 9;
	return (
		<AbsoluteFill style={{flexDirection: 'column'}}>
			{Array.from({length: n}).map((_, i) => {
				const spread = 2400 + ((i * 37) % 9) * 150;
				const x = (p - 1) * spread;
				return (
					<div
						key={i}
						style={{
							flex: 1,
							marginBottom: -1,
							background: i % 3 === 0 ? COLORS.goldLight : i % 3 === 1 ? COLORS.gold : COLORS.goldDark,
							transform: `translateX(${x}px)`,
							filter: 'blur(2px)',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// Éclair doré plein écran.
const Flash: React.FC<{p: number}> = ({p}) => {
	const o = p <= 1 ? p : 2 - p;
	return (
		<AbsoluteFill
			style={{
				opacity: o,
				background: `radial-gradient(circle at 50% 45%, #fff6dc 0%, ${COLORS.goldLight} 35%, ${COLORS.gold} 100%)`,
			}}
		/>
	);
};

export const SceneTransition: React.FC<{type: TransitionType}> = ({type}) => {
	const p = useProgress();
	const Comp = {wipe: Wipe, iris: Iris, slices: Slices, streaks: Streaks, flash: Flash}[type];
	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			<Comp p={p} />
		</AbsoluteFill>
	);
};
