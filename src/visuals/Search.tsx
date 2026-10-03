import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';
import {pop} from './pop';

const QUERY = 'artisan près de chez moi';

// Barre de recherche qui tape une requête (accroche, plan 1).
export const SearchBar: React.FC<{delay?: number}> = ({delay = 0}) => {
	const frame = useCurrentFrame() - delay;
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, 0);
	const typed = Math.floor(interpolate(frame, [4, 34], [0, QUERY.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const press = frame > 38 && frame < 44 ? 0.9 : 1;
	const pulse = interpolate(frame, [38, 54], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<div
			style={{
				width: 1100,
				height: 120,
				borderRadius: 60,
				background: '#121212',
				border: `3px solid ${COLORS.gold}`,
				boxShadow: '0 20px 80px rgba(206,173,111,0.3)',
				display: 'flex',
				alignItems: 'center',
				padding: '0 20px 0 46px',
				gap: 26,
				transform: `scale(${Math.min(1.05, s)})`,
				opacity: Math.min(1, s * 2),
			}}
		>
			<svg width={52} height={52} viewBox="0 0 24 24">
				<circle cx={10} cy={10} r={7} fill="none" stroke={COLORS.gold} strokeWidth={2.6} />
				<path d="M15.5 15.5L22 22" stroke={COLORS.gold} strokeWidth={2.6} strokeLinecap="round" />
			</svg>
			<div style={{flex: 1, fontFamily: BODY_FONT, fontWeight: 500, fontSize: 48, color: COLORS.white}}>
				{QUERY.slice(0, typed)}
				<span style={{color: COLORS.gold, opacity: frame % 16 < 8 ? 1 : 0}}>|</span>
			</div>
			<div style={{position: 'relative'}}>
				<div
					style={{
						background: GOLD_GRADIENT,
						color: COLORS.black,
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 34,
						padding: '22px 40px',
						borderRadius: 50,
						transform: `scale(${press})`,
					}}
				>
					Rechercher
				</div>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: 50,
						border: `3px solid ${COLORS.goldLight}`,
						opacity: pulse > 0 && pulse < 1 ? 1 - pulse : 0,
						transform: `scale(${1 + pulse * 0.5})`,
					}}
				/>
			</div>
		</div>
	);
};

const RESULTS = [
	{name: 'Concurrent n°1', stars: 5},
	{name: 'Concurrent n°2', stars: 4},
	{name: 'Concurrent n°3', stars: 4},
];

// Résultats de recherche : vos concurrents apparaissent, pas vous (accroche, plan 2).
export const CompetitorResults: React.FC<{delay?: number; vertical?: boolean}> = ({delay = 0, vertical = false}) => {
	const frame = useCurrentFrame() - delay;
	const {fps} = useVideoConfig();

	return (
		<div style={{display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 22 : 28}}>
			{RESULTS.map((r, i) => {
				const s = pop(frame, fps, i * 5);
				return (
					<div
						key={r.name}
						style={{
							width: vertical ? 760 : 420,
							height: vertical ? 130 : 150,
							borderRadius: 22,
							background: '#141414',
							border: '2px solid #2e2e2e',
							padding: '22px 26px',
							boxSizing: 'border-box',
							display: 'flex',
							gap: 20,
							alignItems: 'center',
							opacity: Math.min(1, s * 1.5),
							transform: `translateY(${(1 - s) * 120}px) rotate(${(1 - s) * (i - 1) * 10}deg)`,
						}}
					>
						<div
							style={{
								width: 70,
								height: 70,
								borderRadius: 16,
								background: '#2a2a2a',
								color: COLORS.grey,
								fontFamily: TITLE_FONT,
								fontWeight: 900,
								fontSize: 40,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{i + 1}
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
							<div style={{fontFamily: BODY_FONT, fontWeight: 700, fontSize: 34, color: COLORS.white}}>{r.name}</div>
							<div style={{fontSize: 30, color: COLORS.gold, letterSpacing: 4}}>
								{'★'.repeat(r.stars)}
								<span style={{color: '#444'}}>{'★'.repeat(5 - r.stars)}</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
