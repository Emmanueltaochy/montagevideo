import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera} from '../components/Camera';
import {Logo} from '../components/Logo';
import {MotionAccents} from '../components/MotionAccents';
import {SafeArea} from '../components/SafeArea';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';

// Anneaux concentriques qui tournent derrière le logo.
const Rings: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{alignItems: 'center', top: -120}}>
			{[620, 820, 1020].map((size, i) => {
				const s = interpolate(frame, [i * 3, i * 3 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<div
						key={size}
						style={{
							position: 'absolute',
							top: '50%',
							width: size,
							height: size,
							marginTop: -size / 2,
							borderRadius: '50%',
							border: `${i === 1 ? 3 : 2}px ${i === 1 ? 'solid' : 'dashed'} rgba(206,173,111,${0.35 - i * 0.08})`,
							transform: `scale(${s}) rotate(${frame * (i % 2 ? -0.7 : 0.9)}deg)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// Écran final : logo + appel à l'action + site web, tout est en place en moins de 0,4 s.
export const CtaScene: React.FC<{cta: string; website: string}> = ({cta, website}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logoIn = spring({frame, fps, config: {damping: 11, stiffness: 200, mass: 0.6}});
	const buttonIn = spring({frame: frame - 4, fps, config: {damping: 10, stiffness: 200, mass: 0.6}});
	const siteIn = spring({frame: frame - 8, fps, config: {damping: 14, stiffness: 200}});
	const pulse = frame > 16 ? 1 + 0.04 * Math.sin((frame - 16) / 4) : 1;
	const glow = 40 + 30 * Math.sin(frame / 4);
	const arrowX = 14 * Math.sin(frame / 3);
	// Reflet lumineux qui balaie le bouton toutes les 30 images.
	const sweep = ((frame % 30) / 30) * 160 - 30;

	return (
		<AbsoluteFill>
			<MotionAccents seed="cta" />
			<Rings />
			<Camera from={{scale: 1.15, rz: -2}} to={{scale: 1, rz: 0}} duration={150}>
				<SafeArea style={{gap: 46}}>
					<div style={{opacity: Math.min(1, logoIn * 1.5), transform: `scale(${2.2 - 1.2 * logoIn})`}}>
						<Logo width={760} shineStart={10} />
					</div>
					<div
						style={{
							position: 'relative',
							overflow: 'hidden',
							transform: `scale(${buttonIn * pulse})`,
							background: GOLD_GRADIENT,
							color: COLORS.black,
							fontFamily: TITLE_FONT,
							fontWeight: 800,
							fontSize: 72,
							padding: '32px 72px',
							borderRadius: 999,
							display: 'flex',
							alignItems: 'center',
							gap: 30,
							boxShadow: `0 0 ${glow}px rgba(206,173,111,0.6)`,
						}}
					>
						{cta}
						<span style={{display: 'inline-block', transform: `translateX(${arrowX}px)`}}>→</span>
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: `linear-gradient(110deg, transparent ${sweep - 10}%, rgba(255,255,255,0.65) ${sweep}%, transparent ${sweep + 10}%)`,
							}}
						/>
					</div>
					<div
						style={{
							opacity: siteIn,
							transform: `translateY(${(1 - siteIn) * 40}px)`,
							fontFamily: BODY_FONT,
							fontWeight: 600,
							fontSize: 58,
							color: COLORS.white,
							letterSpacing: 2,
							borderBottom: `4px solid ${COLORS.gold}`,
							paddingBottom: 6,
						}}
					>
						{website}
					</div>
				</SafeArea>
			</Camera>
		</AbsoluteFill>
	);
};
