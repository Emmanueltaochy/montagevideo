import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

export type Pose = {scale?: number; rx?: number; ry?: number; rz?: number; x?: number; y?: number};

const DEFAULT: Required<Pose> = {scale: 1, rx: 0, ry: 0, rz: 0, x: 0, y: 0};

// Mouvement de caméra 3D (zoom, inclinaison, rotation, travelling) entre deux poses.
export const Camera: React.FC<{
	from: Pose;
	to?: Pose;
	duration: number;
	children: React.ReactNode;
}> = ({from, to = {}, duration, children}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const a = {...DEFAULT, ...from};
	const b = {...DEFAULT, ...to};
	const v = (k: keyof Pose) => a[k] + (b[k] - a[k]) * p;

	return (
		<AbsoluteFill style={{perspective: 1800}}>
			<AbsoluteFill
				style={{
					transform: `translate(${v('x')}px, ${v('y')}px) scale(${v('scale')}) rotateX(${v('rx')}deg) rotateY(${v('ry')}deg) rotateZ(${v('rz')}deg)`,
					transformStyle: 'preserve-3d',
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
