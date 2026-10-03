import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, GOLD_GRADIENT} from '../theme';
import {pop} from './pop';

const HEART = 'M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z';
const POSTS = 5;
const POST_HEIGHT = 290;
const HEARTS = [
	{x: 40, delay: 30, size: 44},
	{x: 120, delay: 40, size: 34},
	{x: 210, delay: 50, size: 52},
	{x: 70, delay: 62, size: 38},
	{x: 250, delay: 72, size: 42},
	{x: 160, delay: 84, size: 48},
	{x: 20, delay: 96, size: 36},
	{x: 230, delay: 108, size: 40},
];
const NOTIFS = [
	{text: '+1 abonné', x: 300, y: 40, delay: 18},
	{text: '♥ 128 j\'aime', x: -250, y: 170, delay: 32},
	{text: 'Nouveau message', x: 300, y: 300, delay: 46},
	{text: '+1 abonné', x: -230, y: 430, delay: 60},
	{text: '↗ Partagé 24 fois', x: 290, y: 520, delay: 74},
];

const Post: React.FC<{i: number}> = ({i}) => (
	<div style={{height: POST_HEIGHT - 16, borderRadius: 18, background: '#161616', padding: 14, boxSizing: 'border-box'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
			<div style={{width: 34, height: 34, borderRadius: 17, background: COLORS.gold}} />
			<div style={{width: 120, height: 12, borderRadius: 6, background: '#3a3a3a'}} />
		</div>
		<div
			style={{
				marginTop: 12,
				height: 170,
				borderRadius: 12,
				background: i % 2 === 0 ? GOLD_GRADIENT : 'linear-gradient(135deg, #2a2a2a, #111)',
				border: `2px solid ${COLORS.goldDark}`,
			}}
		/>
		<div style={{marginTop: 12, display: 'flex', gap: 12}}>
			<svg width={28} height={28} viewBox="0 0 24 24">
				<path d={HEART} fill={COLORS.gold} />
			</svg>
			<div style={{width: 90, height: 12, marginTop: 8, borderRadius: 6, background: '#3a3a3a'}} />
		</div>
	</div>
);

// Un téléphone qui fait défiler des publications, avec des « j'aime » et des notifications qui surgissent.
export const SocialFeed: React.FC = () => {
	// Animation accélérée pour un rythme plus soutenu.
	const frame = useCurrentFrame() * 1.45;
	const {fps} = useVideoConfig();
	const scroll = interpolate(frame, [20, 145], [0, -(POSTS - 2) * POST_HEIGHT], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div style={{position: 'relative'}}>
			<div
				style={{
					width: 330,
					height: 600,
					borderRadius: 46,
					border: `4px solid ${COLORS.gold}`,
					background: COLORS.panel,
					overflow: 'hidden',
					padding: '26px 14px',
					boxSizing: 'border-box',
					boxShadow: '0 30px 80px rgba(206,173,111,0.25)',
				}}
			>
				<div style={{transform: `translateY(${scroll}px)`, display: 'flex', flexDirection: 'column', gap: 16}}>
					{Array.from({length: POSTS}).map((_, i) => (
						<Post key={i} i={i} />
					))}
				</div>
			</div>
			{HEARTS.map((h, i) => {
				const t = frame - h.delay;
				const p = interpolate(t, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				if (t < 0 || p >= 1) return null;
				return (
					<svg
						key={i}
						width={h.size}
						height={h.size}
						viewBox="0 0 24 24"
						style={{
							position: 'absolute',
							left: h.x,
							bottom: 80 + p * 320,
							opacity: 1 - p,
							transform: `scale(${0.6 + p * 0.6}) rotate(${Math.sin(t / 4) * 15}deg)`,
						}}
					>
						<path d={HEART} fill={i % 2 ? COLORS.goldLight : '#ff4d6d'} />
					</svg>
				);
			})}
			{NOTIFS.map((n, i) => {
				const s = pop(frame, fps, n.delay);
				const float = Math.sin((frame + i * 20) / 12) * 8;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: n.x,
							top: n.y + float,
							whiteSpace: 'nowrap',
							padding: '14px 24px',
							borderRadius: 18,
							background: i % 2 ? '#151515' : COLORS.gold,
							border: `2px solid ${COLORS.gold}`,
							color: i % 2 ? COLORS.white : COLORS.black,
							fontFamily: BODY_FONT,
							fontWeight: 700,
							fontSize: 28,
							boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
							opacity: Math.min(1, s),
							transform: `scale(${s})`,
						}}
					>
						{n.text}
					</div>
				);
			})}
		</div>
	);
};
