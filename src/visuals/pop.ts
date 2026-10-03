import {spring} from 'remotion';

export const pop = (frame: number, fps: number, delay: number) =>
	spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 160, mass: 0.6}});
