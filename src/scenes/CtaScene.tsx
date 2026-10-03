import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {SafeArea} from '../components/SafeArea';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';

// Écran final : logo + appel à l'action + site web, tout est en place en moins de 0,5 s.
export const CtaScene: React.FC<{cta: string; website: string}> = ({cta, website}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logoIn = spring({frame, fps, config: {damping: 16, mass: 0.7}});
	const buttonIn = spring({frame: frame - 5, fps, config: {damping: 12, mass: 0.7}});
	const siteIn = spring({frame: frame - 10, fps, config: {damping: 200}});
	const pulse = frame > 20 ? 1 + 0.035 * Math.sin((frame - 20) / 5) : 1;
	const glow = 40 + 25 * Math.sin(frame / 5);
	const arrowX = 10 * Math.sin(frame / 4);

	return (
		<AbsoluteFill>
			<SafeArea style={{gap: 50}}>
				<div style={{opacity: Math.min(1, logoIn), transform: `scale(${0.8 + 0.2 * logoIn})`}}>
					<Logo width={760} shineStart={12} />
				</div>
				<div
					style={{
						transform: `scale(${buttonIn * pulse})`,
						background: GOLD_GRADIENT,
						color: COLORS.black,
						fontFamily: TITLE_FONT,
						fontWeight: 800,
						fontSize: 70,
						padding: '32px 70px',
						borderRadius: 999,
						display: 'flex',
						alignItems: 'center',
						gap: 30,
						boxShadow: `0 0 ${glow}px rgba(206,173,111,0.55)`,
					}}
				>
					{cta}
					<span style={{display: 'inline-block', transform: `translateX(${arrowX}px)`}}>→</span>
				</div>
				<div
					style={{
						opacity: siteIn,
						transform: `translateY(${(1 - siteIn) * 30}px)`,
						fontFamily: BODY_FONT,
						fontWeight: 600,
						fontSize: 56,
						color: COLORS.white,
						letterSpacing: 2,
						borderBottom: `4px solid ${COLORS.gold}`,
						paddingBottom: 6,
					}}
				>
					{website}
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
