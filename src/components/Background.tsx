import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const x = 50 + Math.sin(frame / 80) * 18;
	const y = 32 + Math.cos(frame / 100) * 10;
	const gridMask = 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)';

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.black}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 55% 55% at ${x}% ${y}%, rgba(206,173,111,0.20) 0%, rgba(206,173,111,0) 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(206,173,111,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(206,173,111,0.07) 1px, transparent 1px)',
					backgroundSize: '80px 80px',
					backgroundPosition: `${frame * 0.4}px ${frame * 0.4}px`,
					maskImage: gridMask,
					WebkitMaskImage: gridMask,
				}}
			/>
		</AbsoluteFill>
	);
};
