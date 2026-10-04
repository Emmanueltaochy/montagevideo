import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../../theme';
import {pop} from '../pop';
import {Icon, type IconName} from './icons';

const CHANNELS: {icon: IconName; label: string}[] = [
	{icon: 'globe', label: 'Site'},
	{icon: 'chat', label: 'WhatsApp'},
	{icon: 'bolt', label: 'Messenger'},
	{icon: 'camera', label: 'Instagram'},
	{icon: 'phone', label: 'Téléphone'},
];

const MESSAGES: {from: 'client' | 'ia'; text: string; at: number}[] = [
	{from: 'client', text: 'Bonjour, vous êtes ouverts dimanche ?', at: 22},
	{from: 'ia', text: 'Oui, de 8h à 12h ! Je vous réserve une table ?', at: 52},
	{from: 'client', text: 'Oui, 4 personnes à 10h', at: 78},
	{from: 'ia', text: "C'est réservé ✓ À dimanche !", at: 104},
];

const TypingDots: React.FC<{frame: number}> = ({frame}) => (
	<div style={{display: 'flex', gap: 8, padding: '18px 22px'}}>
		{[0, 1, 2].map((i) => (
			<div key={i} style={{width: 12, height: 12, borderRadius: 6, background: COLORS.gold, opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame / 4 - i))}} />
		))}
	</div>
);

// Un assistant IA qui répond à un client en pleine nuit, sur tous les canaux.
export const ChatAssistant: React.FC = () => {
	// Animation accélérée pour un rythme plus soutenu.
	const frame = useCurrentFrame() * 1.45;
	const {fps} = useVideoConfig();
	const shown = MESSAGES.filter((m) => frame >= m.at);
	const typing = MESSAGES.find((m) => m.from === 'ia' && frame >= m.at - 18 && frame < m.at);

	return (
		<div style={{width: 760, display: 'flex', flexDirection: 'column', gap: 24}}>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				{CHANNELS.map((c, i) => {
					const s = pop(frame, fps, i * 4);
					const active = Math.floor(frame / 12) % CHANNELS.length === i;
					return (
						<div key={c.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `scale(${s})`}}>
							<div
								style={{
									width: 96,
									height: 96,
									borderRadius: 26,
									background: active ? GOLD_GRADIENT : '#151515',
									border: `2px solid ${COLORS.gold}`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: active ? '0 0 30px rgba(206,173,111,0.6)' : 'none',
								}}
							>
								<Icon name={c.icon} size={50} color={active ? COLORS.black : COLORS.gold} />
							</div>
							<div style={{fontFamily: BODY_FONT, fontWeight: 600, fontSize: 22, color: COLORS.white}}>{c.label}</div>
						</div>
					);
				})}
			</div>
			<div
				style={{
					height: 420,
					borderRadius: 26,
					background: COLORS.panel,
					border: `3px solid ${COLORS.gold}`,
					padding: 24,
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					gap: 14,
					paddingTop: 80,
					overflow: 'hidden',
					position: 'relative',
					boxShadow: '0 30px 80px rgba(206,173,111,0.25)',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						zIndex: 1,
						padding: '18px 24px',
						background: COLORS.panel,
						borderBottom: '2px solid #222',
						display: 'flex',
						justifyContent: 'space-between',
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 24,
						color: COLORS.gold,
					}}
				>
					<span>Assistant IA · en ligne</span>
					<span style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<Icon name="moon" size={26} /> 23:47
					</span>
				</div>
				{shown.map((m) => {
					const s = pop(frame, fps, m.at);
					const ia = m.from === 'ia';
					return (
						<div
							key={m.text}
							style={{
								alignSelf: ia ? 'flex-start' : 'flex-end',
								maxWidth: 520,
								padding: '16px 22px',
								borderRadius: 22,
								borderBottomLeftRadius: ia ? 4 : 22,
								borderBottomRightRadius: ia ? 22 : 4,
								background: ia ? GOLD_GRADIENT : '#262626',
								color: ia ? COLORS.black : COLORS.white,
								fontFamily: BODY_FONT,
								fontWeight: 600,
								fontSize: 28,
								opacity: Math.min(1, s),
								transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`,
								transformOrigin: ia ? 'bottom left' : 'bottom right',
							}}
						>
							{m.text}
						</div>
					);
				})}
				{typing && (
					<div style={{alignSelf: 'flex-start', borderRadius: 22, background: '#262626', opacity: interpolate(frame, [typing.at - 18, typing.at - 12], [0, 1], {extrapolateRight: 'clamp'})}}>
						<TypingDots frame={frame} />
					</div>
				)}
			</div>
		</div>
	);
};
