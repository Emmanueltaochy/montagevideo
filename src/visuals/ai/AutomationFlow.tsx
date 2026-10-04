import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, GOLD_GRADIENT} from '../../theme';
import {pop} from '../pop';
import {Icon, type IconName} from './icons';

const W = 330;
const H = 104;

const STEPS: {icon: IconName; label: string; x: number; y: number}[] = [
	{icon: 'inbox', label: 'Demande client', x: 20, y: 20},
	{icon: 'doc', label: 'Devis généré', x: 410, y: 160},
	{icon: 'invoice', label: 'Facture envoyée', x: 20, y: 300},
	{icon: 'bell', label: 'Relance auto', x: 410, y: 440},
];

const STEP_EVERY = 26;

// Une chaîne d'automatisation : chaque étape s'allume quand l'impulsion dorée l'atteint.
export const AutomationFlow: React.FC = () => {
	const frame = useCurrentFrame() * 1.45;
	const {fps} = useVideoConfig();

	const centers = STEPS.map((s) => ({x: s.x + W / 2, y: s.y + H / 2}));
	const path = centers.map((c, i) => `${i ? 'L' : 'M'} ${c.x} ${c.y}`).join(' ');
	const progress = interpolate(frame, [10, 10 + STEP_EVERY * (STEPS.length - 1)], [0, STEPS.length - 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.quad),
	});
	const seg = Math.min(STEPS.length - 2, Math.floor(progress));
	const t = progress - seg;
	const dot = {
		x: centers[seg].x + (centers[seg + 1].x - centers[seg].x) * t,
		y: centers[seg].y + (centers[seg + 1].y - centers[seg].y) * t,
	};

	return (
		<div style={{position: 'relative', width: 760, height: 580}}>
			<svg width={760} height={580} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path d={path} fill="none" stroke="#333" strokeWidth={4} strokeDasharray="10 10" />
				<path
					d={path}
					fill="none"
					stroke={COLORS.gold}
					strokeWidth={5}
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - progress / (STEPS.length - 1)}
				/>
				{progress < STEPS.length - 1 && <circle cx={dot.x} cy={dot.y} r={12} fill={COLORS.goldLight} style={{filter: 'drop-shadow(0 0 12px #CEAD6F)'}} />}
			</svg>
			{STEPS.map((s, i) => {
				const appear = pop(frame, fps, i * 4);
				const done = progress >= i - 0.02;
				const check = pop(frame, fps, 10 + i * STEP_EVERY);
				return (
					<div
						key={s.label}
						style={{
							position: 'absolute',
							left: s.x,
							top: s.y,
							width: W,
							height: H,
							borderRadius: 20,
							background: done ? GOLD_GRADIENT : '#151515',
							border: `2px solid ${COLORS.gold}`,
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: '0 22px',
							boxSizing: 'border-box',
							fontFamily: BODY_FONT,
							fontWeight: 700,
							fontSize: 28,
							color: done ? COLORS.black : COLORS.white,
							transform: `scale(${Math.min(1, appear)})`,
							boxShadow: done ? '0 0 34px rgba(206,173,111,0.5)' : 'none',
						}}
					>
						<Icon name={s.icon} size={42} color={done ? COLORS.black : COLORS.gold} />
						<span style={{flex: 1}}>{s.label}</span>
						{done && <span style={{fontSize: 30, fontWeight: 900, transform: `scale(${check})`}}>✓</span>}
					</div>
				);
			})}
		</div>
	);
};
