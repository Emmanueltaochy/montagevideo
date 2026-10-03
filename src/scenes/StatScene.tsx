import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MotionAccents} from '../components/MotionAccents';
import {SafeArea} from '../components/SafeArea';
import {Shot} from '../components/Shot';
import {SlamWords} from '../components/SlamWords';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';

export const COUNT_END = 34;
const SPARKS = 26;
const CHART = [0.1, 0.18, 0.15, 0.3, 0.27, 0.45, 0.42, 0.62, 0.7, 0.92];

// Courbe de croissance qui se dessine derrière le chiffre.
const GrowthChart: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
	const w = 1700;
	const h = 520;
	const pts = CHART.map((v, i) => [(i / (CHART.length - 1)) * w, h - v * h] as const);
	const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');

	return (
		<svg width={w} height={h} style={{position: 'absolute', left: 110, top: 200, opacity: 0.35, overflow: 'visible'}}>
			<defs>
				<linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.6} />
					<stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
				</linearGradient>
				<clipPath id="chart-clip">
					<rect x={0} y={-50} width={w * p} height={h + 50} />
				</clipPath>
			</defs>
			<g clipPath="url(#chart-clip)">
				<path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill="url(#chart-fill)" />
				<path d={line} fill="none" stroke={COLORS.goldLight} strokeWidth={6} strokeLinejoin="round" />
				{pts.map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={10} fill={COLORS.goldLight} />
				))}
			</g>
		</svg>
	);
};

const Content: React.FC<{prefix: string; value: number; suffix: string; label: string; detail: string}> = ({
	prefix,
	value,
	suffix,
	label,
	detail,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const chipIn = spring({frame, fps, config: {damping: 12}});
	const flip = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 160}});
	const count = Math.round(
		interpolate(frame, [4, COUNT_END], [0, value], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.out(Easing.cubic),
		}),
	);
	const punch = spring({frame: frame - COUNT_END, fps, config: {damping: 7, stiffness: 220}});
	const burst = interpolate(frame, [COUNT_END, COUNT_END + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const detailIn = spring({frame: frame - 24, fps, config: {damping: 200}});

	return (
		<SafeArea style={{gap: 14}}>
			<div
				style={{
					transform: `scale(${chipIn})`,
					fontFamily: BODY_FONT,
					fontWeight: 700,
					fontSize: 34,
					letterSpacing: 8,
					color: COLORS.black,
					background: COLORS.gold,
					borderRadius: 999,
					padding: '10px 30px',
				}}
			>
				RÉSULTATS CLIENTS
			</div>
			<div style={{position: 'relative'}}>
				{frame >= COUNT_END &&
					Array.from({length: SPARKS}).map((_, i) => {
						const angle = (i / SPARKS) * Math.PI * 2 + random(`a${i}`) * 0.3;
						const dist = 160 + burst * (260 + random(`d${i}`) * 260);
						const size = 6 + random(`s${i}`) * 12;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									width: size,
									height: size,
									borderRadius: i % 3 ? '50%' : 2,
									background: i % 2 ? COLORS.goldLight : COLORS.gold,
									opacity: 1 - burst,
									transform: `translate(${Math.cos(angle) * dist * 1.6}px, ${Math.sin(angle) * dist * 0.8}px) rotate(${burst * 360}deg)`,
								}}
							/>
						);
					})}
				<div
					style={{
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: 300,
						lineHeight: 1,
						background: GOLD_GRADIENT,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
						transform: `perspective(1000px) rotateX(${(1 - flip) * -80}deg) scale(${1 + 0.12 * punch * (1 - burst)})`,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{prefix}
					{count}
					{suffix}
				</div>
			</div>
			<SlamWords text={label} fontSize={76} delay={14} stagger={2} />
			<div
				style={{
					opacity: detailIn,
					transform: `translateY(${(1 - detailIn) * 30}px)`,
					fontFamily: BODY_FONT,
					fontWeight: 500,
					fontSize: 44,
					color: COLORS.grey,
					textAlign: 'center',
				}}
			>
				{detail}
			</div>
		</SafeArea>
	);
};

export const STAT_SHOT_2 = 58;
export const PROOF_3_AT = 30;

const ProofCard: React.FC<{delay: number; detail: string; from: 'left' | 'right'; children: React.ReactNode}> = ({
	delay,
	detail,
	from,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 170, mass: 0.7}});
	const side = from === 'left' ? -1 : 1;
	return (
		<div
			style={{
				width: 760,
				height: 420,
				borderRadius: 32,
				background: 'linear-gradient(160deg, #1a1a1a, #0b0b0b)',
				border: `3px solid ${COLORS.gold}`,
				boxShadow: '0 30px 90px rgba(206,173,111,0.25)',
				padding: '44px 50px',
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				opacity: Math.min(1, s * 1.5),
				transform: `translateX(${(1 - s) * side * 500}px) rotateY(${(1 - s) * side * -40}deg)`,
			}}
		>
			{children}
			<div
				style={{
					alignSelf: 'flex-start',
					fontFamily: BODY_FONT,
					fontWeight: 700,
					fontSize: 34,
					color: COLORS.black,
					background: COLORS.gold,
					borderRadius: 999,
					padding: '8px 26px',
				}}
			>
				{detail}
			</div>
		</div>
	);
};

// Plan 2 : les deux autres preuves (gîte, VTC), synchronisées avec la voix off.
const OtherProofs: React.FC<{value: string; label: string; detail: string; quote: string; quoteDetail: string}> = ({
	value,
	label,
	detail,
	quote,
	quoteDetail,
}) => (
	<SafeArea style={{flexDirection: 'row', gap: 60, perspective: 1600}}>
		<ProofCard delay={0} detail={detail} from="left">
			<div>
				<div
					style={{
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: 96,
						lineHeight: 1,
						background: GOLD_GRADIENT,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
					}}
				>
					{value}
				</div>
				<div style={{fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 72, color: COLORS.white}}>{label}</div>
			</div>
		</ProofCard>
		<ProofCard delay={PROOF_3_AT} detail={quoteDetail} from="right">
			<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
				<div style={{fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 120, lineHeight: 0.6, color: COLORS.gold}}>“</div>
				<div style={{fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.15, color: COLORS.white}}>{quote}</div>
			</div>
		</ProofCard>
	</SafeArea>
);

type StatProps = {
	prefix: string;
	value: number;
	suffix: string;
	label: string;
	detail: string;
	proof2Value: string;
	proof2Label: string;
	proof2Detail: string;
	proof3Quote: string;
	proof3Detail: string;
};

// 20–25 s : trois vrais résultats clients — le chiffre bascule en 3D et explose, puis deux cartes de preuve.
export const StatScene: React.FC<StatProps> = (p) => (
	<AbsoluteFill>
		<MotionAccents seed="stat" ghostText="RÉSULTATS" />
		<GrowthChart />
		<Shot from={0} duration={STAT_SHOT_2} enter="up" exit="zoom" camera={{from: {scale: 1.35, rz: -5}, to: {scale: 1.02, rz: 1}}}>
			<Content prefix={p.prefix} value={p.value} suffix={p.suffix} label={p.label} detail={p.detail} />
		</Shot>
		<Shot from={STAT_SHOT_2} duration={150 - STAT_SHOT_2} enter="zoom" camera={{from: {ry: 14, scale: 1.1}, to: {ry: -4, scale: 1}}}>
			<OtherProofs
				value={p.proof2Value}
				label={p.proof2Label}
				detail={p.proof2Detail}
				quote={p.proof3Quote}
				quoteDetail={p.proof3Detail}
			/>
		</Shot>
	</AbsoluteFill>
);
