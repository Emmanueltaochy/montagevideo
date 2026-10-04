import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../../theme';
import {pop} from '../pop';
import {Icon} from './icons';

const PROMPT = 'Un post pour ma boulangerie';
const CAPTION = 'Nouveau ! Nos croissants pur beurre, tout chauds dès 6h.';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Une IA qui génère un post complet (visuel + texte) à partir d'une simple demande.
export const ContentGenerator: React.FC = () => {
	const frame = useCurrentFrame() * 1.45;
	const {fps} = useVideoConfig();
	const typed = Math.floor(interpolate(frame, [4, 30], [0, PROMPT.length], clamp));
	const press = frame > 32 && frame < 38 ? 0.9 : 1;
	const card = pop(frame, fps, 38);
	const reveal = interpolate(frame, [42, 70], [0, 100], clamp);
	const written = Math.floor(interpolate(frame, [62, 100], [0, CAPTION.length], clamp));
	const badges = ['Article', 'Post', 'Visuel', 'Vidéo'];

	return (
		<div style={{width: 760, display: 'flex', flexDirection: 'column', gap: 22}}>
			<div
				style={{
					height: 92,
					borderRadius: 46,
					background: '#121212',
					border: `3px solid ${COLORS.gold}`,
					display: 'flex',
					alignItems: 'center',
					padding: '0 14px 0 28px',
					gap: 16,
				}}
			>
				<Icon name="sparkle" size={40} />
				<div style={{flex: 1, fontFamily: BODY_FONT, fontWeight: 500, fontSize: 32, color: COLORS.white}}>
					{PROMPT.slice(0, typed)}
					<span style={{color: COLORS.gold, opacity: frame % 16 < 8 ? 1 : 0}}>|</span>
				</div>
				<div
					style={{
						background: GOLD_GRADIENT,
						color: COLORS.black,
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 26,
						padding: '16px 28px',
						borderRadius: 40,
						transform: `scale(${press})`,
					}}
				>
					Générer
				</div>
			</div>
			<div
				style={{
					borderRadius: 26,
					background: COLORS.panel,
					border: `3px solid ${COLORS.gold}`,
					padding: 22,
					display: 'flex',
					gap: 22,
					opacity: Math.min(1, card),
					transform: `translateY(${(1 - card) * 60}px) scale(${0.9 + 0.1 * card})`,
					boxShadow: '0 30px 80px rgba(206,173,111,0.25)',
				}}
			>
				<div style={{position: 'relative', width: 250, height: 250, borderRadius: 18, overflow: 'hidden', background: '#1c1c1c', flexShrink: 0}}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: `radial-gradient(circle at 35% 40%, ${COLORS.goldLight}, ${COLORS.gold} 35%, ${COLORS.goldDark} 70%, #3a2a10)`,
							clipPath: `inset(0 ${100 - reveal}% 0 0)`,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							width: 60,
							left: `${reveal - 10}%`,
							background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
							opacity: reveal > 0 && reveal < 100 ? 1 : 0,
						}}
					/>
				</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<div style={{width: 40, height: 40, borderRadius: 20, background: COLORS.gold}} />
						<div style={{fontFamily: BODY_FONT, fontWeight: 700, fontSize: 24, color: COLORS.white}}>Boulangerie du Port</div>
					</div>
					<div style={{fontFamily: BODY_FONT, fontWeight: 500, fontSize: 28, lineHeight: 1.3, color: COLORS.white, minHeight: 110}}>
						{CAPTION.slice(0, written)}
					</div>
					<div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
						{badges.map((b, i) => {
							const s = pop(frame, fps, 96 + i * 6);
							return (
								<div
									key={b}
									style={{
										padding: '8px 16px',
										borderRadius: 999,
										background: COLORS.gold,
										color: COLORS.black,
										fontFamily: BODY_FONT,
										fontWeight: 700,
										fontSize: 22,
										transform: `scale(${s})`,
									}}
								>
									{b} ✓
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
