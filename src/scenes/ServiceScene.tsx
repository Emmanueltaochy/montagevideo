import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedWords} from '../components/AnimatedWords';
import {SafeArea} from '../components/SafeArea';
import {BODY_FONT, COLORS, TITLE_FONT} from '../theme';

// Gabarit commun aux 3 services : texte à gauche, animation à droite.
export const ServiceScene: React.FC<{
	index: string;
	title: string;
	tagline: string;
	highlight?: string[];
	visual: React.ReactNode;
}> = ({index, title, tagline, highlight, visual}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numberIn = spring({frame: frame - 4, fps, config: {damping: 14}});
	const barIn = interpolate(frame, [16, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const taglineIn = spring({frame: frame - 24, fps, config: {damping: 200}});
	const visualIn = spring({frame: frame - 6, fps, config: {damping: 15, mass: 0.8}});
	// Léger zoom continu pour garder du mouvement pendant toute la scène.
	const drift = interpolate(frame, [0, 150], [1, 1.04]);

	return (
		<AbsoluteFill>
			<SafeArea style={{flexDirection: 'row', justifyContent: 'space-between', gap: 60}}>
				<div style={{width: 820, display: 'flex', flexDirection: 'column', gap: 18}}>
					<div
						style={{
							fontFamily: TITLE_FONT,
							fontWeight: 900,
							fontSize: 150,
							lineHeight: 1,
							color: 'transparent',
							WebkitTextStroke: `3px ${COLORS.gold}`,
							opacity: Math.min(1, numberIn),
							transform: `translateX(${(1 - numberIn) * -120}px)`,
						}}
					>
						{index}
					</div>
					<AnimatedWords text={title} fontSize={92} align="flex-start" delay={8} stagger={4} highlight={highlight} />
					<div style={{height: 8, width: 220 * barIn, background: COLORS.gold, borderRadius: 4}} />
					<div
						style={{
							fontFamily: BODY_FONT,
							fontWeight: 600,
							fontSize: 52,
							lineHeight: 1.2,
							color: COLORS.goldLight,
							opacity: taglineIn,
							transform: `translateY(${(1 - taglineIn) * 30}px)`,
						}}
					>
						{tagline}
					</div>
				</div>
				<div
					style={{
						width: 760,
						height: 620,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: Math.min(1, visualIn),
						transform: `translateX(${(1 - visualIn) * 200}px) scale(${(0.85 + 0.15 * visualIn) * drift})`,
					}}
				>
					{visual}
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
