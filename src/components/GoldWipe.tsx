import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, GOLD_GRADIENT} from '../theme';

export const WIPE_DURATION = 16;

// Bande dorée qui balaie l'écran ; elle le couvre entièrement à mi-parcours, au moment du changement de scène.
export const GoldWipe: React.FC = () => {
	const frame = useCurrentFrame();
	const half = WIPE_DURATION / 2;
	const x =
		frame < half
			? interpolate(frame, [0, half], [-3000, 0], {
					easing: Easing.out(Easing.cubic),
					extrapolateLeft: 'clamp',
				})
			: interpolate(frame, [half, WIPE_DURATION], [0, 3000], {
					easing: Easing.in(Easing.cubic),
					extrapolateRight: 'clamp',
				});

	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					top: -100,
					bottom: -100,
					left: -340,
					width: 2600,
					transform: `translateX(${x}px) skewX(-15deg)`,
					display: 'flex',
				}}
			>
				<div style={{width: 60, background: COLORS.goldLight}} />
				<div style={{width: 30}} />
				<div style={{flex: 1, background: GOLD_GRADIENT}} />
				<div style={{width: 30}} />
				<div style={{width: 60, background: COLORS.goldLight}} />
			</div>
		</AbsoluteFill>
	);
};
