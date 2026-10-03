import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedWords} from '../components/AnimatedWords';
import {Logo} from '../components/Logo';
import {SafeArea} from '../components/SafeArea';
import {COLORS} from '../theme';

const LINE_2_START = 72;
const SHAKE_START = 100;

// 0–5 s : accroche choc, puis le logo s'affiche avant la fin des 5 s non désactivables.
export const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logoIn = spring({frame: frame - 66, fps, config: {damping: 200}});
	const underline = interpolate(frame, [28, 52], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const t = frame - SHAKE_START;
	const shake = t > 0 && t < 16 ? Math.sin(t * 2.4) * 16 * (1 - t / 16) : 0;
	const line1Dim = interpolate(frame, [LINE_2_START, LINE_2_START + 12], [1, 0.55], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<SafeArea style={{gap: 36}}>
				<div
					style={{
						opacity: logoIn,
						transform: `translateY(${(1 - logoIn) * -30}px) scale(${0.9 + 0.1 * logoIn})`,
					}}
				>
					<Logo width={500} shineStart={82} />
				</div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: line1Dim}}>
					<AnimatedWords text="Vos clients vous cherchent en ligne…" fontSize={82} highlight={['en', 'ligne…']} delay={2} stagger={4} />
					<div
						style={{
							height: 8,
							width: `${underline * 55}%`,
							background: COLORS.gold,
							borderRadius: 4,
							marginTop: 16,
						}}
					/>
				</div>
				<div style={{transform: `translateX(${shake}px)`}}>
					<AnimatedWords
						text="…et ils trouvent vos concurrents."
						fontSize={82}
						highlight={['concurrents.']}
						delay={LINE_2_START}
						stagger={4}
					/>
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
