import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, TITLE_FONT} from '../theme';

// Les espaces insécables (\u00A0) gardent plusieurs mots ensemble sur la même ligne.
const normalize = (word: string) =>
	word.replace(/[.,:;…!?]/g, '').replace(/\u00A0/g, ' ').trim().toLowerCase();

// Texte qui apparaît mot par mot, avec certains mots mis en valeur en doré.
export const AnimatedWords: React.FC<{
	text: string;
	fontSize: number;
	delay?: number;
	stagger?: number;
	color?: string;
	highlight?: string[];
	highlightColor?: string;
	fontWeight?: number;
	align?: 'center' | 'flex-start';
	style?: React.CSSProperties;
}> = ({
	text,
	fontSize,
	delay = 0,
	stagger = 4,
	color = COLORS.white,
	highlight = [],
	highlightColor = COLORS.gold,
	fontWeight = 800,
	align = 'center',
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const highlighted = highlight.map(normalize);

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: align,
				columnGap: fontSize * 0.28,
				fontFamily: TITLE_FONT,
				fontSize,
				fontWeight,
				lineHeight: 1.12,
				letterSpacing: -1,
				...style,
			}}
		>
			{text.split(' ').map((word, i) => {
				const s = spring({
					frame: frame - delay - i * stagger,
					fps,
					config: {damping: 14, stiffness: 170, mass: 0.6},
				});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: Math.min(1, s),
							transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})`,
							color: highlighted.includes(normalize(word)) ? highlightColor : color,
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};
