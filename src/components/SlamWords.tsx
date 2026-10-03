import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, TITLE_FONT} from '../theme';

const normalize = (word: string) =>
	word.replace(/[.,:;…!?]/g, '').replace(/ /g, ' ').trim().toLowerCase();

// Mots qui « claquent » à l'écran : arrivent de très grand, flous, et se posent avec un rebond.
export const SlamWords: React.FC<{
	text: string;
	fontSize: number;
	delay?: number;
	stagger?: number;
	highlight?: string[];
	align?: 'center' | 'flex-start';
	style?: React.CSSProperties;
}> = ({text, fontSize, delay = 0, stagger = 3, highlight = [], align = 'center', style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const hl = highlight.map(normalize);

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: align,
				columnGap: fontSize * 0.28,
				fontFamily: TITLE_FONT,
				fontWeight: 900,
				fontSize,
				lineHeight: 1.08,
				letterSpacing: -1,
				...style,
			}}
		>
			{text.split(' ').map((word, i) => {
				const s = spring({frame: frame - delay - i * stagger, fps, config: {damping: 11, stiffness: 220, mass: 0.5}});
				const on = hl.includes(normalize(word));
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: Math.min(1, s * 1.6),
							transform: `scale(${2.4 - 1.4 * s}) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`,
							filter: `blur(${Math.max(0, 1 - s) * 12}px)`,
							color: on ? COLORS.gold : COLORS.white,
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};
