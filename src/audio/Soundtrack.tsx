import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type Cue = {src: string; at: number; volume?: number};

// Niveaux du mix (crête finale sous -1 dBFS).
const VOICE_VOLUME = 0.8;
const EFFECTS_VOLUME = 0.7;
const MUSIC = 0.38;
const MUSIC_UNDER_VOICE = 0.14;

// Durée des voix off en images (30 fps), pour baisser la musique pendant qu'elles parlent.
const VO_FRAMES: Record<string, number> = {
	hook1: 46,
	hook2: 37,
	web: 79,
	social: 73,
	ads: 71,
	stat: 59,
	cta: 109,
	b_intro: 93,
	b_cta: 84,
};

export const vo = (name: keyof typeof VO_FRAMES & string, at: number): Cue => ({src: `audio/vo/${name}.wav`, at, volume: VOICE_VOLUME});
export const sfx = (name: string, at: number, volume = 0.5): Cue => ({src: `audio/sfx/${name}.wav`, at, volume: volume * EFFECTS_VOLUME});

const DUCK_RAMP = 6;

const duckAmount = (frame: number, voice: Cue[]) =>
	Math.max(
		0,
		...voice.map((c) => {
			const name = c.src.replace(/^.*\/|\.wav$/g, '');
			const end = c.at + (VO_FRAMES[name] ?? 0);
			const v = Math.min((frame - (c.at - DUCK_RAMP)) / DUCK_RAMP, (end + DUCK_RAMP - frame) / DUCK_RAMP);
			return Math.min(1, Math.max(0, v));
		}),
	);

const Cues: React.FC<{cues: Cue[]}> = ({cues}) => (
	<>
		{cues.map((c, i) => (
			<Sequence key={`${c.src}-${i}`} from={c.at} layout="none">
				<Audio src={staticFile(c.src)} volume={c.volume ?? 1} />
			</Sequence>
		))}
	</>
);

export const Soundtrack: React.FC<{
	music: string;
	voice: Cue[];
	effects: Cue[];
	withMusic: boolean;
	withVoice: boolean;
	withEffects: boolean;
}> = ({music, voice, effects, withMusic, withVoice, withEffects}) => (
	<>
		{withMusic && (
			<Audio
				src={staticFile(music)}
				volume={(f) => MUSIC - (MUSIC - MUSIC_UNDER_VOICE) * (withVoice ? duckAmount(f, voice) : 0)}
			/>
		)}
		{withVoice && <Cues cues={voice} />}
		{withEffects && <Cues cues={effects} />}
	</>
);
