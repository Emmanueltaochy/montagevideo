import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../../components/Logo';
import {MotionAccents} from '../../components/MotionAccents';
import {SafeArea} from '../../components/SafeArea';
import {Shot} from '../../components/Shot';
import {SlamWords} from '../../components/SlamWords';
import {useResponsive} from '../../layout';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../../theme';
import {pop} from '../../visuals/pop';
import {Icon, type IconName} from '../../visuals/ai/icons';
import {NeuralNet} from '../../visuals/ai/NeuralNet';

export const AI_HOOK_SHOT_2 = 72;

// Cœur lumineux de l'IA : un disque doré qui pulse, entouré d'anneaux.
const AICore: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 12}});
	const pulse = 1 + 0.06 * Math.sin(frame / 5);
	return (
		<div style={{position: 'relative', width: 220, height: 220, transform: `scale(${s})`}}>
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						inset: -i * 30,
						borderRadius: '50%',
						border: `2px ${i === 1 ? 'dashed' : 'solid'} rgba(206,173,111,${0.6 - i * 0.18})`,
						transform: `rotate(${frame * (i % 2 ? -2 : 1.5)}deg)`,
					}}
				/>
			))}
			<div
				style={{
					position: 'absolute',
					inset: 30,
					borderRadius: '50%',
					background: `radial-gradient(circle at 40% 35%, #fff4d6, ${COLORS.gold} 45%, ${COLORS.goldDark})`,
					boxShadow: `0 0 ${60 * pulse}px rgba(206,173,111,0.8)`,
					transform: `scale(${pulse})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: TITLE_FONT,
					fontWeight: 900,
					fontSize: 64,
					color: COLORS.black,
				}}
			>
				IA
			</div>
		</div>
	);
};

const NOTIFS: {icon: IconName; text: string}[] = [
	{icon: 'chat', text: 'Client répondu'},
	{icon: 'doc', text: 'Devis envoyé'},
	{icon: 'bell', text: 'RDV confirmé'},
];

const Shot2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = useResponsive();
	const logoIn = spring({frame: frame - 4, fps, config: {damping: 12, stiffness: 180}});
	const badge = pop(frame, fps, 12);

	return (
		<SafeArea style={{gap: r(30, 40)}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: Math.min(1, logoIn * 1.5), transform: `scale(${2 - logoIn})`}}>
				<Logo width={r(400, 440)} shineStart={10} />
				<div
					style={{
						transform: `scale(${badge}) rotate(${(1 - badge) * -20}deg)`,
						background: GOLD_GRADIENT,
						color: COLORS.black,
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: r(52, 56),
						padding: '6px 24px',
						borderRadius: 16,
					}}
				>
					× IA
				</div>
			</div>
			<SlamWords text="…même quand vous dormez ?" fontSize={r(92, 96)} highlight={['dormez', '?']} delay={8} stagger={3} />
			<div style={{display: 'flex', flexDirection: r('row', 'column'), alignItems: 'center', gap: 22}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 40,
						color: COLORS.gold,
						opacity: Math.min(1, pop(frame, fps, 16)),
					}}
				>
					<Icon name="moon" size={46} /> 03:12
				</div>
				{NOTIFS.map((n, i) => {
					const s = pop(frame, fps, 22 + i * 7);
					return (
						<div
							key={n.text}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								padding: '16px 26px',
								borderRadius: 20,
								background: '#151515',
								border: `2px solid ${COLORS.gold}`,
								fontFamily: BODY_FONT,
								fontWeight: 700,
								fontSize: 32,
								color: COLORS.white,
								opacity: Math.min(1, s),
								transform: `translateY(${(1 - s) * 80}px) scale(${0.8 + 0.2 * s})`,
							}}
						>
							<Icon name={n.icon} size={36} />
							{n.text}
							<span style={{color: COLORS.gold, fontWeight: 900}}>✓</span>
						</div>
					);
				})}
			</div>
		</SafeArea>
	);
};

const Shot1: React.FC = () => {
	const r = useResponsive();
	return (
		<SafeArea style={{gap: r(50, 70)}}>
			<AICore />
			<SlamWords text="Et si votre entreprise travaillait…" fontSize={r(96, 100)} highlight={['travaillait…']} delay={4} stagger={3} keepLastPair={r(true, false)} />
		</SafeArea>
	);
};

// 0–5 s : l'accroche « même quand vous dormez », puis le logo et les tâches faites pendant la nuit.
export const AIHookScene: React.FC = () => (
	<AbsoluteFill>
		<NeuralNet seed="hook" />
		<MotionAccents seed="ai-hook" />
		<Shot from={0} duration={AI_HOOK_SHOT_2} exit="zoom" camera={{from: {scale: 1.35, rz: 5}, to: {scale: 1, rz: 0}}}>
			<Shot1 />
		</Shot>
		<Shot from={AI_HOOK_SHOT_2} duration={150 - AI_HOOK_SHOT_2} enter="zoom" camera={{from: {scale: 1.1, rx: -18}, to: {scale: 1, rx: 0}}}>
			<Shot2 />
		</Shot>
	</AbsoluteFill>
);
