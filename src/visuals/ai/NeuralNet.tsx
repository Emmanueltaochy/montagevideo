import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../theme';

const NODES = 34;
const LINK_DISTANCE = 330;

// Réseau de neurones en fond : des nœuds qui dérivent, reliés par des lignes où circulent des impulsions dorées.
export const NeuralNet: React.FC<{seed?: string; opacity?: number}> = ({seed = 'net', opacity = 0.55}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const nodes = Array.from({length: NODES}).map((_, i) => {
		const bx = random(`${seed}-x${i}`) * width;
		const by = random(`${seed}-y${i}`) * height;
		const ph = random(`${seed}-p${i}`) * Math.PI * 2;
		return {x: bx + Math.sin(frame / 40 + ph) * 30, y: by + Math.cos(frame / 50 + ph) * 24};
	});

	const links: {a: number; b: number; d: number}[] = [];
	for (let a = 0; a < NODES; a++) {
		for (let b = a + 1; b < NODES; b++) {
			const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
			if (d < LINK_DISTANCE) links.push({a, b, d});
		}
	}

	return (
		<AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
			<svg width={width} height={height}>
				{links.map(({a, b, d}, i) => {
					const t = ((frame * 0.025 + random(`${seed}-l${i}`)) % 1 + 1) % 1;
					const px = nodes[a].x + (nodes[b].x - nodes[a].x) * t;
					const py = nodes[a].y + (nodes[b].y - nodes[a].y) * t;
					return (
						<g key={i}>
							<line
								x1={nodes[a].x}
								y1={nodes[a].y}
								x2={nodes[b].x}
								y2={nodes[b].y}
								stroke={COLORS.gold}
								strokeOpacity={0.35 * (1 - d / LINK_DISTANCE)}
								strokeWidth={1.5}
							/>
							{i % 3 === 0 && <circle cx={px} cy={py} r={3} fill={COLORS.goldLight} opacity={0.9} />}
						</g>
					);
				})}
				{nodes.map((n, i) => (
					<circle key={i} cx={n.x} cy={n.y} r={4 + (i % 3) * 2} fill={COLORS.gold} opacity={0.5 + 0.5 * Math.sin(frame / 10 + i)} />
				))}
			</svg>
		</AbsoluteFill>
	);
};
