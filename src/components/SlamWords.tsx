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
	// Garde les deux derniers mots ensemble (désactiver si ce groupe est trop large pour l'écran).
	keepLastPair?: boolean;
	style?: React.CSSProperties;
}> = ({text, fontSize, delay = 0, stagger = 3, highlight = [], align = 'center', keepLastPair = true, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const hl = highlight.map(normalize);
	// Les deux derniers mots restent ensemble : jamais de mot seul sur la dernière ligne.
	const words = text.split(' ');
	const groups = keepLastPair && words.length >= 3 ? [...words.slice(0, -2).map((w) => [w]), words.slice(-2)] : words.map((w) => [w]);

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
			{groups.map((group, g) => {
				const s = spring({frame: frame - delay - g * stagger, fps, config: {damping: 11, stiffness: 220, mass: 0.5}});
				return (
					<span
						key={g}
						style={{
							display: 'inline-block',
							whiteSpace: 'nowrap',
							opacity: Math.min(1, s * 1.6),
							transform: `scale(${2.4 - 1.4 * s}) rotate(${(1 - s) * (g % 2 ? 8 : -8)}deg)`,
							filter: `blur(${Math.max(0, 1 - s) * 12}px)`,
						}}
					>
						{group.map((word, w) => (
							<span key={w} style={{color: hl.includes(normalize(word)) ? COLORS.gold : COLORS.white}}>
								{w > 0 ? '\u00A0' : ''}
								{word}
							</span>
						))}
					</span>
				);
			})}
		</div>
	);
};
