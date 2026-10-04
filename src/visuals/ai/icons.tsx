import React from 'react';
import {COLORS} from '../../theme';

// Pictogrammes simples (traits dorés) pour les canaux et les étapes.
const Svg: React.FC<{size: number; color?: string; children: React.ReactNode}> = ({size, color = COLORS.gold, children}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
		{children}
	</svg>
);

export type IconName = 'globe' | 'chat' | 'bolt' | 'camera' | 'phone' | 'pen' | 'layout' | 'send' | 'doc' | 'invoice' | 'bell' | 'inbox' | 'sparkle' | 'moon';

export const Icon: React.FC<{name: IconName; size?: number; color?: string}> = ({name, size = 40, color}) => {
	switch (name) {
		case 'globe':
			return (
				<Svg size={size} color={color}>
					<circle cx={12} cy={12} r={9} />
					<path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
				</Svg>
			);
		case 'chat':
			return (
				<Svg size={size} color={color}>
					<path d="M4 20l1.4-4A8 8 0 1 1 8 19.6z" />
					<path d="M9 10.5c.5 1.6 2.4 3.5 4 4l1.2-1.2 2 1-.4 1.4c-3.4.4-7.6-3.8-7.2-7.2L10 8l1 2z" />
				</Svg>
			);
		case 'bolt':
			return (
				<Svg size={size} color={color}>
					<path d="M12 3C7 3 3 6.6 3 11.2c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.9.3 1.8.4 2.7.4 5 0 9-3.6 9-8.2S17 3 12 3z" />
					<path d="M7.5 13.5l3-3.2 2 2 3.5-3.3-3 3.2-2-2z" />
				</Svg>
			);
		case 'camera':
			return (
				<Svg size={size} color={color}>
					<rect x={3.5} y={3.5} width={17} height={17} rx={5} />
					<circle cx={12} cy={12} r={4} />
					<circle cx={17} cy={7} r={0.6} />
				</Svg>
			);
		case 'phone':
			return (
				<Svg size={size} color={color}>
					<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
				</Svg>
			);
		case 'pen':
			return (
				<Svg size={size} color={color}>
					<path d="M4 20l1-4L16 5l3 3L8 19z" />
					<path d="M14 7l3 3" />
				</Svg>
			);
		case 'layout':
			return (
				<Svg size={size} color={color}>
					<rect x={3} y={4} width={18} height={16} rx={2} />
					<path d="M3 9h18M9 9v11" />
				</Svg>
			);
		case 'send':
			return (
				<Svg size={size} color={color}>
					<path d="M21 3L3 10.5l7 3 3 7z" />
					<path d="M10 13.5L21 3" />
				</Svg>
			);
		case 'doc':
			return (
				<Svg size={size} color={color}>
					<path d="M6 3h8l4 4v14H6z" />
					<path d="M14 3v4h4M9 12h6M9 16h6" />
				</Svg>
			);
		case 'invoice':
			return (
				<Svg size={size} color={color}>
					<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
					<path d="M9 8h6M9 12h6M9 16h3" />
				</Svg>
			);
		case 'bell':
			return (
				<Svg size={size} color={color}>
					<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
					<path d="M10 20a2 2 0 0 0 4 0" />
				</Svg>
			);
		case 'inbox':
			return (
				<Svg size={size} color={color}>
					<path d="M3 13l3-8h12l3 8v6H3z" />
					<path d="M3 13h5l1 2h6l1-2h5" />
				</Svg>
			);
		case 'sparkle':
			return (
				<Svg size={size} color={color}>
					<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
					<path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
				</Svg>
			);
		case 'moon':
			return (
				<Svg size={size} color={color}>
					<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
				</Svg>
			);
	}
};
