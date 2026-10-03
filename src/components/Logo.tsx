import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const LOGO_RATIO = 404 / 1254;

// Logo avec un reflet lumineux qui le traverse à partir de `shineStart`.
export const Logo: React.FC<{width: number; shineStart?: number}> = ({width, shineStart = 0}) => {
	const frame = useCurrentFrame();
	const src = staticFile('logo.png');
	const height = width * LOGO_RATIO;
	const p = interpolate(frame - shineStart, [0, 28], [-20, 120], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div style={{position: 'relative', width, height}}>
			<Img src={src} style={{width, height, display: 'block'}} />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `linear-gradient(110deg, transparent ${p - 12}%, rgba(255,240,200,0.95) ${p}%, transparent ${p + 12}%)`,
					maskImage: `url(${src})`,
					WebkitMaskImage: `url(${src})`,
					maskSize: '100% 100%',
					WebkitMaskSize: '100% 100%',
				}}
			/>
		</div>
	);
};
