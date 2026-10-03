import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeArea} from '../components/SafeArea';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';

const COUNT_END = 55;
const RAYS = 14;

// 20–25 s : un chiffre géant qui défile jusqu'au résultat client.
export const StatScene: React.FC<{
	prefix: string;
	value: number;
	suffix: string;
	label: string;
	detail: string;
}> = ({prefix, value, suffix, label, detail}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const chipIn = spring({frame, fps, config: {damping: 200}});
	const count = Math.round(
		interpolate(frame, [8, COUNT_END], [0, value], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.out(Easing.cubic),
		}),
	);
	const punch = spring({frame: frame - COUNT_END, fps, config: {damping: 8, stiffness: 200}});
	const burst = interpolate(frame, [COUNT_END, COUNT_END + 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const labelIn = spring({frame: frame - 30, fps, config: {damping: 200}});
	const detailIn = spring({frame: frame - 42, fps, config: {damping: 200}});

	return (
		<AbsoluteFill>
			<SafeArea style={{gap: 20}}>
				<div
					style={{
						opacity: chipIn,
						fontFamily: BODY_FONT,
						fontWeight: 700,
						fontSize: 34,
						letterSpacing: 8,
						color: COLORS.gold,
						border: `2px solid ${COLORS.gold}`,
						borderRadius: 999,
						padding: '10px 30px',
					}}
				>
					RÉSULTAT CLIENT
				</div>
				<div style={{position: 'relative'}}>
					{frame >= COUNT_END &&
						Array.from({length: RAYS}).map((_, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									width: 8,
									height: 90,
									marginLeft: -4,
									marginTop: -45,
									borderRadius: 4,
									background: COLORS.goldLight,
									opacity: 1 - burst,
									transform: `rotate(${(360 / RAYS) * i}deg) translateY(${-180 - burst * 260}px)`,
								}}
							/>
						))}
					<div
						style={{
							fontFamily: TITLE_FONT,
							fontWeight: 900,
							fontSize: 290,
							lineHeight: 1,
							background: GOLD_GRADIENT,
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							color: 'transparent',
							transform: `scale(${1 + 0.08 * punch * (1 - burst)})`,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{prefix}
						{count}
						{suffix}
					</div>
				</div>
				<div
					style={{
						opacity: labelIn,
						transform: `translateY(${(1 - labelIn) * 30}px)`,
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 72,
						color: COLORS.white,
						textAlign: 'center',
					}}
				>
					{label}
				</div>
				<div
					style={{
						opacity: detailIn,
						fontFamily: BODY_FONT,
						fontWeight: 500,
						fontSize: 44,
						color: COLORS.grey,
						textAlign: 'center',
					}}
				>
					{detail}
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
