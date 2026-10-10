import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {at, INTRO, JUMP_CUTS, SHOTS, TALK} from './timing';

// Plan en cours à l'image `frame` de la composition.
export const shotAt = (frame: number) => {
	let i = 0;
	SHOTS.forEach((s, k) => {
		if (frame >= at(s.t)) i = k;
	});
	return {index: i, shot: SHOTS[i], start: at(SHOTS[i].t), end: i + 1 < SHOTS.length ? at(SHOTS[i + 1].t) : INTRO + TALK};
};

// La personne détourée (vidéo avec transparence), cadrée selon le plan en cours.
// Léger travelling avant pendant chaque plan, et petit recadrage sur les coupes internes.
export const Presenter: React.FC = () => {
	const frame = useCurrentFrame();
	const {index, shot, start, end} = shotAt(frame);
	const jumps = JUMP_CUTS.filter((t) => at(t) <= frame && at(t) > start).length;
	const push = interpolate(frame, [start, end], [0, 0.035]);
	const scale = shot.scale * (jumps % 2 ? 1.07 : 1) + push;
	// Entrée : la personne arrive après le logo, avec un fondu et un léger zoom.
	const enter = interpolate(frame, [INTRO - 8, INTRO + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const exit = interpolate(frame, [INTRO + TALK - 4, INTRO + TALK + 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill
			style={{
				opacity: enter * exit,
				transform: `translateX(${shot.x}px) scale(${scale * (0.94 + 0.06 * enter)})`,
				transformOrigin: '50% 30%',
			}}
			data-shot={index}
		>
			<Sequence from={INTRO} durationInFrames={TALK} layout="none">
				<OffthreadVideo
					src={staticFile('portail/presenter.webm')}
					transparent
					muted
					style={{
						position: 'absolute',
						left: -110, // la personne est un peu à droite dans la prise : on la recentre
						top: 0,
						width: 1920,
						height: 1080,
						filter: 'drop-shadow(0 0 2px rgba(233,214,166,0.55)) drop-shadow(0 0 28px rgba(206,173,111,0.35)) drop-shadow(0 30px 40px rgba(0,0,0,0.7))',
					}}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
