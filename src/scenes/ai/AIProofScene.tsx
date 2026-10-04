import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MotionAccents} from '../../components/MotionAccents';
import {SafeArea} from '../../components/SafeArea';
import {Shot} from '../../components/Shot';
import {SlamWords} from '../../components/SlamWords';
import {useResponsive} from '../../layout';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../../theme';
import {NeuralNet} from '../../visuals/ai/NeuralNet';
import {Icon, type IconName} from '../../visuals/ai/icons';
import {pop} from '../../visuals/pop';

export const PROOF_SHOT_2 = 56;
export const PROOF_COUNT_END = 32;
export const PIPELINE_STEPS_AT = [6, 30, 54];
const SPARKS = 22;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Chip: React.FC<{children: React.ReactNode; scale?: number}> = ({children, scale = 1}) => (
	<div
		style={{
			transform: `scale(${scale})`,
			fontFamily: BODY_FONT,
			fontWeight: 700,
			fontSize: 32,
			letterSpacing: 6,
			color: COLORS.black,
			background: COLORS.gold,
			borderRadius: 999,
			padding: '10px 28px',
		}}
	>
		{children}
	</div>
);

// Plan 1 : « 100 % automatisé » qui compte, bascule et explose.
const Hundred: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = useResponsive();
	const chip = spring({frame, fps, config: {damping: 12}});
	const flip = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 160}});
	const count = Math.round(interpolate(frame, [3, PROOF_COUNT_END], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)}));
	const burst = interpolate(frame, [PROOF_COUNT_END, PROOF_COUNT_END + 26], [0, 1], clamp);
	const punch = spring({frame: frame - PROOF_COUNT_END, fps, config: {damping: 7, stiffness: 220}});

	return (
		<SafeArea style={{gap: 10}}>
			<Chip scale={chip}>CAS CLIENT · MÉDIA EN LIGNE</Chip>
			<div style={{position: 'relative'}}>
				{frame >= PROOF_COUNT_END &&
					Array.from({length: SPARKS}).map((_, i) => {
						const a = (i / SPARKS) * Math.PI * 2;
						const d = 150 + burst * (240 + random(`p${i}`) * 240);
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									width: 10,
									height: 10,
									borderRadius: '50%',
									background: i % 2 ? COLORS.goldLight : COLORS.gold,
									opacity: 1 - burst,
									transform: `translate(${Math.cos(a) * d * 1.5}px, ${Math.sin(a) * d * 0.8}px)`,
								}}
							/>
						);
					})}
				<div
					style={{
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: r(290, 270),
						lineHeight: 1,
						background: GOLD_GRADIENT,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
						fontVariantNumeric: 'tabular-nums',
						transform: `perspective(1000px) rotateY(${(1 - flip) * 80}deg) scale(${1 + 0.12 * punch * (1 - burst)})`,
					}}
				>
					{count}%
				</div>
			</div>
			<SlamWords text="automatisé" fontSize={r(100, 104)} delay={14} />
		</SafeArea>
	);
};

const STEPS: {icon: IconName; label: string}[] = [
	{icon: 'pen', label: 'Rédaction des articles'},
	{icon: 'layout', label: 'Mise en page'},
	{icon: 'send', label: 'Publication sur les réseaux'},
];

// Plan 2 : la chaîne du média, de la rédaction à la publication, qui se remplit étape par étape.
const Pipeline: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = useResponsive();
	const vertical = r(false, true);
	const fill = interpolate(frame, [PIPELINE_STEPS_AT[0], PIPELINE_STEPS_AT[2]], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});

	return (
		<SafeArea style={{gap: r(50, 46)}}>
			<SlamWords text="De la rédaction… à la publication" fontSize={r(72, 78)} highlight={['rédaction…', 'publication']} delay={0} stagger={2} />
			<div style={{position: 'relative', display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 50 : 70}}>
				<div
					style={{
						position: 'absolute',
						background: '#333',
						...(vertical ? {left: '50%', width: 6, marginLeft: -3, top: 60, bottom: 60} : {top: '50%', height: 6, marginTop: -3, left: 60, right: 60}),
					}}
				/>
				<div
					style={{
						position: 'absolute',
						background: GOLD_GRADIENT,
						boxShadow: '0 0 20px rgba(206,173,111,0.8)',
						...(vertical
							? {left: '50%', width: 6, marginLeft: -3, top: 60, height: `calc((100% - 120px) * ${fill})`}
							: {top: '50%', height: 6, marginTop: -3, left: 60, width: `calc((100% - 120px) * ${fill})`}),
					}}
				/>
				{STEPS.map((s, i) => {
					const on = pop(frame, fps, PIPELINE_STEPS_AT[i]);
					const lit = frame >= PIPELINE_STEPS_AT[i];
					return (
						<div
							key={s.label}
							style={{
								position: 'relative',
								width: r(440, 760),
								height: r(250, 170),
								borderRadius: 26,
								background: lit ? GOLD_GRADIENT : '#151515',
								border: `3px solid ${COLORS.gold}`,
								display: 'flex',
								flexDirection: r('column', 'row'),
								alignItems: 'center',
								justifyContent: 'center',
								gap: 18,
								padding: 20,
								boxSizing: 'border-box',
								transform: `scale(${0.85 + 0.15 * Math.min(1, on)})`,
								boxShadow: lit ? '0 0 50px rgba(206,173,111,0.5)' : 'none',
							}}
						>
							<Icon name={s.icon} size={r(72, 64)} color={lit ? COLORS.black : COLORS.gold} />
							<div style={{fontFamily: TITLE_FONT, fontWeight: 800, fontSize: r(36, 40), textAlign: 'center', color: lit ? COLORS.black : COLORS.white}}>
								{s.label}
							</div>
							{lit && (
								<div
									style={{
										position: 'absolute',
										top: -22,
										right: -22,
										width: 56,
										height: 56,
										borderRadius: 28,
										background: COLORS.black,
										border: `3px solid ${COLORS.gold}`,
										color: COLORS.gold,
										fontSize: 32,
										fontWeight: 900,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										transform: `scale(${on})`,
									}}
								>
									✓
								</div>
							)}
						</div>
					);
				})}
			</div>
		</SafeArea>
	);
};

// 20–25 s : preuve — un média 100 % automatisé, de la rédaction à la publication.
export const AIProofScene: React.FC = () => (
	<AbsoluteFill>
		<NeuralNet seed="proof" opacity={0.35} />
		<MotionAccents seed="ai-proof" ghostText="100%" />
		<Shot from={0} duration={PROOF_SHOT_2} enter="up" exit="left" camera={{from: {scale: 1.35, rz: -5}, to: {scale: 1.02, rz: 1}}}>
			<Hundred />
		</Shot>
		<Shot from={PROOF_SHOT_2} duration={150 - PROOF_SHOT_2} enter="right" camera={{from: {rx: 20, scale: 1.1}, to: {rx: 0, scale: 1}}}>
			<Pipeline />
		</Shot>
	</AbsoluteFill>
);
