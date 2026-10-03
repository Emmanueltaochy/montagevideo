import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../layout';
import {BODY_FONT, SAFE_BOTTOM} from '../theme';

// Zone de contenu : tout l'écran, sauf les bandes réservées à l'interface de YouTube ou d'Instagram.
export const SafeArea: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({children, style}) => {
	const l = useLayout();
	return (
		<div
			style={{
				position: 'absolute',
				top: l.top,
				left: 0,
				right: 0,
				height: l.contentHeight,
				padding: l.portrait ? `0 ${l.side}px` : `50px ${l.side}px 0`,
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
};

const Band: React.FC<{style: React.CSSProperties; label: string}> = ({style, label}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			background: 'repeating-linear-gradient(45deg, rgba(255,0,0,0.25) 0 20px, rgba(255,0,0,0.1) 20px 40px)',
			color: 'white',
			fontFamily: BODY_FONT,
			fontSize: 28,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...style,
		}}
	>
		{label}
	</div>
);

export const SafeZoneOverlay: React.FC = () => {
	const l = useLayout();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{l.portrait ? (
				<>
					<Band style={{top: 0, height: l.top, borderBottom: '3px dashed red'}} label="Zone réservée à Instagram (compte)" />
					<Band style={{bottom: 0, height: l.height - l.top - l.contentHeight, borderTop: '3px dashed red'}} label="Zone réservée à Instagram (légende, bouton)" />
				</>
			) : (
				<Band style={{bottom: 0, height: SAFE_BOTTOM, borderTop: '3px dashed red'}} label="Zone réservée aux contrôles YouTube" />
			)}
		</AbsoluteFill>
	);
};
