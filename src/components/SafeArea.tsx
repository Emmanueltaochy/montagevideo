import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BODY_FONT, CONTENT_HEIGHT, SAFE_BOTTOM} from '../theme';

// Zone de contenu : tout le haut de l'écran, sauf la bande réservée à YouTube.
export const SafeArea: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({children, style}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: CONTENT_HEIGHT,
			padding: '50px 140px 0',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			...style,
		}}
	>
		{children}
	</div>
);

export const SafeZoneOverlay: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: SAFE_BOTTOM,
				background:
					'repeating-linear-gradient(45deg, rgba(255,0,0,0.25) 0 20px, rgba(255,0,0,0.1) 20px 40px)',
				borderTop: '3px dashed red',
				color: 'white',
				fontFamily: BODY_FONT,
				fontSize: 28,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			Zone réservée aux contrôles YouTube
		</div>
	</AbsoluteFill>
);
