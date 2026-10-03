import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, TITLE_FONT} from '../theme';

const PARTICLES = 28;

// Habillage motion design permanent : particules, anneaux en rotation, croix, texte géant en fond.
export const MotionAccents: React.FC<{seed: string; ghostText?: string}> = ({seed, ghostText}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			{ghostText && (
				<div
					style={{
						position: 'absolute',
						top: height > width ? height * 0.42 : 120,
						left: 0,
						whiteSpace: 'nowrap',
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: 420,
						lineHeight: 1,
						color: 'transparent',
						WebkitTextStroke: '2px rgba(206,173,111,0.13)',
						transform: `translateX(${200 - frame * 6}px)`,
					}}
				>
					{`${ghostText} · ${ghostText} · ${ghostText}`}
				</div>
			)}
			{[0, 1].map((i) => {
				const size = 380 + random(`${seed}-ring-${i}`) * 300;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${(i ? 78 : 8) + random(`${seed}-rx-${i}`) * 10}%`,
							top: `${10 + random(`${seed}-ry-${i}`) * 40}%`,
							width: size,
							height: size,
							marginLeft: -size / 2,
							marginTop: -size / 2,
							borderRadius: '50%',
							border: `2px dashed rgba(206,173,111,${0.18 + i * 0.07})`,
							transform: `rotate(${frame * (i ? -0.8 : 1.1)}deg) scale(${1 + 0.05 * Math.sin(frame / 15 + i)})`,
						}}
					/>
				);
			})}
			{Array.from({length: PARTICLES}).map((_, i) => {
				const x = random(`${seed}-x-${i}`) * width;
				const speed = 0.6 + random(`${seed}-s-${i}`) * 2.2;
				const y = height - 180 - ((random(`${seed}-y-${i}`) * height + frame * speed * 3) % height);
				const size = 3 + random(`${seed}-z-${i}`) * 7;
				const isCross = i % 7 === 0;
				return isCross ? (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							color: COLORS.gold,
							opacity: 0.45,
							fontSize: 28,
							fontWeight: 700,
							transform: `rotate(${frame * 3}deg)`,
						}}
					>
						+
					</div>
				) : (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: COLORS.gold,
							opacity: 0.15 + random(`${seed}-o-${i}`) * 0.45,
							boxShadow: `0 0 ${size * 2}px ${COLORS.gold}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
