import React from 'react';
import {COLORS} from '../theme';

export type PIcon = 'upload' | 'check' | 'doc' | 'invoice' | 'gift' | 'cap' | 'whatsapp' | 'mail' | 'chart' | 'home' | 'star' | 'folder';

const PATHS: Record<PIcon, React.ReactNode> = {
	upload: <path d="M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />,
	check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
	doc: <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 0v5h5M9 13h6M9 17h6" />,
	invoice: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3" />,
	gift: <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-4-6-3-5 0m5 0c2-4 6-3 5 0" />,
	cap: <path d="m2 9 10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" />,
	whatsapp: <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19zM9 9c0 3 3 6 6 6l1.2-1.5-2-1-1 1c-1-.5-2.2-1.7-2.7-2.7l1-1-1-2z" />,
	mail: <path d="M3 6h18v12H3zm0 0 9 7 9-7" />,
	chart: <path d="M4 20V10m6 10V6m6 14v-7m4-9-6 6-4-3-6 6" />,
	home: <path d="m3 11 9-7 9 7v9h-6v-6H9v6H3z" />,
	star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
	folder: <path d="M3 6h6l2 2h10v11H3z" />,
};

export const PortalIcon: React.FC<{name: PIcon; size?: number; color?: string; stroke?: number}> = ({name, size = 40, color = COLORS.gold, stroke = 1.8}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
		{PATHS[name]}
	</svg>
);
