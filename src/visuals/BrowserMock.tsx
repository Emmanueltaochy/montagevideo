import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';
import {pop} from './pop';

const URL = 'www.votre-commerce.re';
const CLICK = 92;

// Un site web qui se construit bloc par bloc, puis un clic sur « Réserver ».
export const BrowserMock: React.FC = () => {
	// Animation accélérée pour un rythme plus soutenu.
	const frame = useCurrentFrame() * 1.45;
	const {fps} = useVideoConfig();
	const typed = Math.floor(interpolate(frame, [12, 40], [0, URL.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const nav = pop(frame, fps, 20);
	const hero = pop(frame, fps, 28);
	const cards = [40, 46, 52].map((d) => pop(frame, fps, d));
	const button = pop(frame, fps, 60);
	const cursorX = interpolate(frame, [64, 88], [700, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const cursorY = interpolate(frame, [64, 88], [520, 425], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const press = frame >= CLICK && frame < CLICK + 6 ? 0.92 : 1;
	const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const booked = pop(frame, fps, CLICK + 6);

	return (
		<div
			style={{
				position: 'relative',
				width: 720,
				height: 540,
				borderRadius: 26,
				border: `3px solid ${COLORS.gold}`,
				background: COLORS.panel,
				overflow: 'hidden',
				boxShadow: '0 30px 80px rgba(206,173,111,0.25)',
			}}
		>
			<div style={{height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', borderBottom: '2px solid #222'}}>
				{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
					<div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
				))}
				<div
					style={{
						marginLeft: 16,
						flex: 1,
						height: 36,
						borderRadius: 18,
						background: '#1c1c1c',
						color: COLORS.grey,
						fontFamily: BODY_FONT,
						fontSize: 22,
						display: 'flex',
						alignItems: 'center',
						padding: '0 18px',
					}}
				>
					{URL.slice(0, typed)}
					<span style={{opacity: frame % 20 < 10 ? 1 : 0, color: COLORS.gold}}>|</span>
				</div>
			</div>
			<div style={{padding: 26, display: 'flex', flexDirection: 'column', gap: 20}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: Math.min(1, nav), transform: `translateY(${(1 - nav) * -20}px)`}}>
					<div style={{width: 110, height: 26, borderRadius: 6, background: COLORS.gold}} />
					<div style={{display: 'flex', gap: 14}}>
						{[70, 70, 70].map((w, i) => (
							<div key={i} style={{width: w, height: 12, borderRadius: 6, background: '#3a3a3a'}} />
						))}
					</div>
				</div>
				<div
					style={{
						height: 150,
						borderRadius: 16,
						background: GOLD_GRADIENT,
						transform: `scaleY(${Math.min(1, hero)})`,
						transformOrigin: 'top',
						padding: 24,
						boxSizing: 'border-box',
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
					}}
				>
					<div style={{width: 340, height: 24, borderRadius: 6, background: 'rgba(0,0,0,0.75)'}} />
					<div style={{width: 240, height: 14, borderRadius: 6, background: 'rgba(0,0,0,0.45)'}} />
					<div style={{width: 280, height: 14, borderRadius: 6, background: 'rgba(0,0,0,0.45)'}} />
				</div>
				<div style={{display: 'flex', gap: 18}}>
					{cards.map((c, i) => (
						<div
							key={i}
							style={{
								flex: 1,
								height: 100,
								borderRadius: 14,
								background: '#1a1a1a',
								border: '2px solid #2c2c2c',
								opacity: Math.min(1, c),
								transform: `translateY(${(1 - c) * 40}px)`,
								padding: 14,
								boxSizing: 'border-box',
							}}
						>
							<div style={{width: 34, height: 34, borderRadius: 17, background: COLORS.gold, opacity: 0.8}} />
							<div style={{marginTop: 12, width: '80%', height: 10, borderRadius: 5, background: '#3a3a3a'}} />
						</div>
					))}
				</div>
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							position: 'relative',
							transform: `scale(${Math.min(1.05, button) * press})`,
							background: GOLD_GRADIENT,
							color: COLORS.black,
							fontFamily: TITLE_FONT,
							fontWeight: 800,
							fontSize: 28,
							padding: '16px 46px',
							borderRadius: 999,
						}}
					>
						{booked > 0.5 ? 'Réservé ✓' : 'Réserver'}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: 999,
								border: `3px solid ${COLORS.goldLight}`,
								opacity: ripple > 0 ? 1 - ripple : 0,
								transform: `scale(${1 + ripple * 0.6})`,
							}}
						/>
					</div>
				</div>
			</div>
			<svg
				width={44}
				height={44}
				viewBox="0 0 24 24"
				style={{position: 'absolute', left: cursorX, top: cursorY, opacity: frame > 62 ? 1 : 0, transform: `scale(${press})`}}
			>
				<path d="M4 2l16 9-7 2-3 7z" fill={COLORS.white} stroke={COLORS.black} strokeWidth={1.2} />
			</svg>
		</div>
	);
};
