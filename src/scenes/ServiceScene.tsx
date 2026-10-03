import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Pose} from '../components/Camera';
import {MotionAccents} from '../components/MotionAccents';
import {SafeArea} from '../components/SafeArea';
import {type Move, Shot} from '../components/Shot';
import {SlamWords} from '../components/SlamWords';
import {BODY_FONT, COLORS, TITLE_FONT} from '../theme';
import {pop} from '../visuals/pop';

export const SERVICE_SHOT_B = 46;
const SCENE = 150;

type Angles = {
	titleCamera: {from: Pose; to?: Pose};
	visualCamera: {from: Pose; to?: Pose};
	titleEnter: Move;
	cut: Move;
};

// Plan A : le titre du service en très grand, numéro qui pivote en 3D.
const TitleCard: React.FC<{index: string; title: string; highlight?: string[]}> = ({index, title, highlight}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const flip = spring({frame, fps, config: {damping: 14, stiffness: 150}});
	const bar = interpolate(frame, [10, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<SafeArea style={{gap: 10}}>
			<div
				style={{
					fontFamily: TITLE_FONT,
					fontWeight: 900,
					fontSize: 210,
					lineHeight: 1,
					color: 'transparent',
					WebkitTextStroke: `4px ${COLORS.gold}`,
					transform: `perspective(900px) rotateY(${(1 - flip) * 100}deg) scale(${0.6 + 0.4 * flip})`,
				}}
			>
				{index}
			</div>
			<SlamWords text={title} fontSize={118} highlight={highlight} delay={4} stagger={3} />
			<div style={{display: 'flex', gap: 14, marginTop: 18}}>
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						style={{
							height: 10,
							width: (i === 1 ? 260 : 60) * Math.max(0, Math.min(1, bar * 1.4 - i * 0.2)),
							background: COLORS.gold,
							borderRadius: 5,
						}}
					/>
				))}
			</div>
		</SafeArea>
	);
};

// Plan B : accroche + points forts à gauche, animation à droite.
const Detail: React.FC<{index: string; title: string; tagline: string; features: string[]; visual: React.ReactNode}> = ({
	index,
	title,
	tagline,
	features,
	visual,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const head = pop(frame, fps, 0);

	return (
		<SafeArea style={{flexDirection: 'row', justifyContent: 'space-between', gap: 50}}>
			<div style={{width: 800, display: 'flex', flexDirection: 'column', gap: 22}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 18,
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 40,
						color: COLORS.gold,
						opacity: Math.min(1, head),
						transform: `translateX(${(1 - head) * -80}px)`,
					}}
				>
					<span style={{background: COLORS.gold, color: COLORS.black, borderRadius: 10, padding: '4px 14px'}}>{index}</span>
					{title}
				</div>
				<SlamWords text={tagline} fontSize={80} align="flex-start" delay={3} stagger={2} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10}}>
					{features.map((f, i) => {
						const s = pop(frame, fps, 14 + i * 6);
						return (
							<div
								key={f}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 16,
									fontFamily: BODY_FONT,
									fontWeight: 600,
									fontSize: 40,
									color: COLORS.white,
									opacity: Math.min(1, s),
									transform: `translateX(${(1 - s) * -120}px)`,
								}}
							>
								<span
									style={{
										width: 40,
										height: 40,
										borderRadius: 20,
										background: COLORS.gold,
										color: COLORS.black,
										fontSize: 26,
										fontWeight: 900,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										transform: `scale(${s})`,
									}}
								>
									✓
								</span>
								{f}
							</div>
						);
					})}
				</div>
			</div>
			<div style={{width: 780, height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{visual}</div>
		</SafeArea>
	);
};

export const ServiceScene: React.FC<{
	index: string;
	title: string;
	ghost: string;
	tagline: string;
	features: string[];
	highlight?: string[];
	angles: Angles;
	visual: React.ReactNode;
}> = ({index, title, ghost, tagline, features, highlight, angles, visual}) => (
	<AbsoluteFill>
		<MotionAccents seed={ghost} ghostText={ghost} />
		<Shot from={0} duration={SERVICE_SHOT_B} enter={angles.titleEnter} exit={angles.cut} camera={angles.titleCamera}>
			<TitleCard index={index} title={title} highlight={highlight} />
		</Shot>
		<Shot from={SERVICE_SHOT_B} duration={SCENE - SERVICE_SHOT_B} enter="zoom" camera={angles.visualCamera}>
			<Detail index={index} title={title} tagline={tagline} features={features} visual={visual} />
		</Shot>
	</AbsoluteFill>
);
