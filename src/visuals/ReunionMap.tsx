import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, TITLE_FONT} from '../theme';
import {pop} from './pop';

// Contour stylisé de La Réunion (ovale incliné nord-ouest / sud-est).
const OUTLINE: [number, number][] = [
	[250, 70], [320, 78], [380, 110], [440, 160], [490, 220], [510, 280], [495, 340],
	[450, 395], [380, 430], [300, 445], [225, 435], [160, 405], [110, 355], [80, 295],
	[75, 230], [100, 170], [145, 120], [195, 85],
];

// Courbe lissée (Catmull-Rom → Bézier) passant par tous les points.
const smoothPath = (pts: [number, number][]) => {
	const n = pts.length;
	let d = `M ${pts[0][0]} ${pts[0][1]}`;
	for (let i = 0; i < n; i++) {
		const p0 = pts[(i - 1 + n) % n];
		const p1 = pts[i];
		const p2 = pts[(i + 1) % n];
		const p3 = pts[(i + 2) % n];
		const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
	}
	return `${d} Z`;
};

const ISLAND = smoothPath(OUTLINE);

const PINS = [
	{name: 'Saint-Denis', x: 265, y: 100, delay: 34, labelDy: -34},
	{name: 'Saint-Paul', x: 120, y: 215, delay: 44, labelDy: -34},
	{name: 'Saint-Benoît', x: 455, y: 230, delay: 54, labelDy: -34},
	{name: 'Saint-Pierre', x: 270, y: 405, delay: 64, labelDy: 52},
];

// La carte de l'île se dessine, puis des points de ciblage s'allument dans les villes.
export const ReunionMap: React.FC = () => {
	// Animation accélérée pour un rythme plus soutenu.
	const frame = useCurrentFrame() * 1.45;
	const {fps} = useVideoConfig();
	const draw = interpolate(frame, [6, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fill = interpolate(frame, [30, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const chip = pop(frame, fps, 80);
	const scan = (frame % 60) / 60;

	return (
		<div style={{position: 'relative', width: 760, height: 600}}>
			<svg width={760} height={560} viewBox="0 0 590 500" style={{overflow: 'visible'}}>
				<defs>
					<radialGradient id="island-fill" cx="50%" cy="50%" r="60%">
						<stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.35} />
						<stop offset="100%" stopColor={COLORS.gold} stopOpacity={0.06} />
					</radialGradient>
				</defs>
				<path d={ISLAND} fill="url(#island-fill)" fillOpacity={fill} stroke="none" />
				<path
					d={ISLAND}
					fill="none"
					stroke={COLORS.gold}
					strokeWidth={4}
					strokeLinejoin="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - draw}
				/>
				<circle cx={295} cy={260} r={40 + scan * 220} fill="none" stroke={COLORS.gold} strokeWidth={2} opacity={(1 - scan) * 0.5 * fill} />
				{PINS.map((pin) => {
					const s = pop(frame, fps, pin.delay);
					const ring = ((frame - pin.delay) % 40) / 40;
					return (
						<g key={pin.name} opacity={Math.min(1, s)}>
							{frame > pin.delay && (
								<circle cx={pin.x} cy={pin.y} r={12 + ring * 34} fill="none" stroke={COLORS.goldLight} strokeWidth={3} opacity={1 - ring} />
							)}
							<circle cx={pin.x} cy={pin.y} r={13 * s} fill={COLORS.goldLight} stroke={COLORS.black} strokeWidth={3} />
							<text
								x={pin.x}
								y={pin.y + pin.labelDy}
								textAnchor="middle"
								fill={COLORS.white}
								fontFamily={BODY_FONT}
								fontWeight={600}
								fontSize={24}
							>
								{pin.name}
							</text>
						</g>
					);
				})}
			</svg>
			<div
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					padding: '14px 26px',
					borderRadius: 999,
					background: COLORS.gold,
					color: COLORS.black,
					fontFamily: TITLE_FONT,
					fontWeight: 800,
					fontSize: 34,
					opacity: Math.min(1, chip),
					transform: `scale(${chip})`,
				}}
			>
				Ciblage 974
			</div>
		</div>
	);
};
