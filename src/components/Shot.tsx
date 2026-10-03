import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Camera, type Pose} from './Camera';

export type Move = 'zoom' | 'left' | 'right' | 'up' | 'none';

const EDGE = 7;

const moveStyle = (move: Move, p: number): React.CSSProperties => {
	// p : 0 = plan visible, 1 = plan hors champ
	if (move === 'none' || p <= 0) return {};
	const blur = p * 14;
	switch (move) {
		case 'zoom':
			return {transform: `scale(${1 + p * 0.5})`, filter: `blur(${blur}px)`, opacity: 1 - p};
		case 'left':
			return {transform: `translateX(${-p * 700}px)`, filter: `blur(${blur}px)`, opacity: 1 - p};
		case 'right':
			return {transform: `translateX(${p * 700}px)`, filter: `blur(${blur}px)`, opacity: 1 - p};
		case 'up':
			return {transform: `translateY(${-p * 400}px)`, filter: `blur(${blur}px)`, opacity: 1 - p};
	}
};

const ShotInner: React.FC<{
	duration: number;
	enter: Move;
	exit: Move;
	camera: {from: Pose; to?: Pose};
	children: React.ReactNode;
}> = ({duration, enter, exit, camera, children}) => {
	const frame = useCurrentFrame();
	const opts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)} as const;
	const pin = interpolate(frame, [0, EDGE], [1, 0], opts);
	const pout = interpolate(frame, [duration - EDGE, duration], [0, 1], opts);
	// `enter` = côté d'où arrive le plan, `exit` = côté vers lequel il part.
	const style = pin > 0 ? moveStyle(enter, pin) : moveStyle(exit, pout);

	return (
		<AbsoluteFill style={style}>
			<Camera from={camera.from} to={camera.to} duration={duration}>
				{children}
			</Camera>
		</AbsoluteFill>
	);
};

// Un plan : une séquence avec son propre mouvement de caméra, une entrée et une sortie animées.
export const Shot: React.FC<{
	from: number;
	duration: number;
	enter?: Move;
	exit?: Move;
	camera?: {from: Pose; to?: Pose};
	children: React.ReactNode;
}> = ({from, duration, enter = 'none', exit = 'none', camera = {from: {}}, children}) => (
	<Sequence from={from} durationInFrames={duration}>
		<ShotInner duration={duration} enter={enter} exit={exit} camera={camera}>
			{children}
		</ShotInner>
	</Sequence>
);
