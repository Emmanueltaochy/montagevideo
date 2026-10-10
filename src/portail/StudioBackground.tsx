import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// Studio virtuel noir et or qui remplace le décor d'origine : mur sombre, lumière dorée derrière
// la personne, anneaux 3D en rotation lente, bandes lumineuses et particules floues (profondeur de champ).
// `shift` décale légèrement le décor à l'opposé de la personne (parallaxe).
const Ring: React.FC<{size: number; x: number; y: number; speed: number; tilt: number; opacity: number; blur: number}> = ({size, x, y, speed, tilt, opacity, blur}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2,
				top: y - size / 2,
				width: size,
				height: size,
				perspective: 1600,
				filter: `blur(${blur}px)`,
				opacity,
			}}
		>
			<div
				style={{
					width: '100%',
					height: '100%',
					borderRadius: '50%',
					border: `${Math.max(3, size / 60)}px solid ${COLORS.gold}`,
					boxShadow: `0 0 40px rgba(206,173,111,0.5), inset 0 0 40px rgba(206,173,111,0.35)`,
					transform: `rotateX(${tilt + Math.sin(frame / 90) * 8}deg) rotateY(${frame * speed}deg)`,
				}}
			/>
		</div>
	);
};

export const StudioBackground: React.FC<{shift?: number}> = ({shift = 0}) => {
	const frame = useCurrentFrame();
	const px = -shift * 0.12 + Math.sin(frame / 140) * 14;
	const glow = 0.85 + 0.15 * Math.sin(frame / 45);

	return (
		<AbsoluteFill style={{backgroundColor: '#050505', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translateX(${px}px) scale(1.08)`}}>
				{/* mur : dégradé chaud, plus sombre sur les bords */}
				<AbsoluteFill
					style={{
						background: 'radial-gradient(ellipse 70% 80% at 50% 45%, #1d1810 0%, #0b0a08 55%, #030303 100%)',
					}}
				/>
				{/* panneaux verticaux du mur */}
				<AbsoluteFill
					style={{
						backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 240px)',
						backgroundSize: '240px 100%',
					}}
				/>
				{/* bandes lumineuses dorées */}
				{[260, 1660].map((x, i) => (
					<div
						key={x}
						style={{
							position: 'absolute',
							left: x,
							top: -40,
							width: 10,
							height: 1160,
							borderRadius: 6,
							background: `linear-gradient(180deg, transparent, ${COLORS.goldLight} 30%, ${COLORS.gold} 70%, transparent)`,
							boxShadow: `0 0 60px 14px rgba(206,173,111,${0.35 * glow})`,
							opacity: 0.55 + 0.1 * Math.sin(frame / 30 + i * 2),
							filter: 'blur(1.5px)',
						}}
					/>
				))}
				{/* grand logo en filigrane au fond */}
				<Img
					src={staticFile('logo.png')}
					style={{
						position: 'absolute',
						left: 960 - 520,
						top: 250,
						width: 1040,
						opacity: 0.07,
						filter: 'blur(3px)',
					}}
				/>
				<Ring size={760} x={960} y={470} speed={0.35} tilt={68} opacity={0.32} blur={3} />
				<Ring size={1100} x={960} y={500} speed={-0.22} tilt={74} opacity={0.18} blur={5} />
				<Ring size={260} x={300} y={250} speed={0.9} tilt={30} opacity={0.35} blur={4} />
				<Ring size={180} x={1640} y={820} speed={-1.1} tilt={50} opacity={0.3} blur={5} />
			</AbsoluteFill>
			{/* halo derrière la personne */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 34% 52% at ${50 + shift / 38}% 46%, rgba(206,173,111,${0.30 * glow}) 0%, rgba(206,173,111,0.06) 55%, transparent 75%)`,
				}}
			/>
			{/* particules floues (bokeh) */}
			{new Array(26).fill(0).map((_, i) => {
				const size = 10 + random(`s${i}`) * 46;
				const x = (random(`x${i}`) * 2100 - 90 + frame * (0.15 + random(`v${i}`) * 0.4) - shift * 0.25) % 2100;
				const y = 1080 - ((random(`y${i}`) * 1200 + frame * (0.3 + random(`w${i}`) * 0.5)) % 1240);
				const o = interpolate(Math.sin(frame / 25 + i), [-1, 1], [0.08, 0.35]);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: `radial-gradient(circle, rgba(233,214,166,${o}) 0%, rgba(206,173,111,${o * 0.4}) 50%, transparent 72%)`,
							filter: `blur(${size > 36 ? 4 : 1.5}px)`,
						}}
					/>
				);
			})}
			{/* vignette */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)'}} />
		</AbsoluteFill>
	);
};
