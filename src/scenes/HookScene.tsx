import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {MotionAccents} from '../components/MotionAccents';
import {SafeArea} from '../components/SafeArea';
import {Shot} from '../components/Shot';
import {useResponsive} from '../layout';
import {SlamWords} from '../components/SlamWords';
import {CompetitorResults, SearchBar} from '../visuals/Search';

export const HOOK_SHOT_2 = 72;
export const HOOK_SHAKE = 100;

const Shot2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logoIn = spring({frame: frame - 4, fps, config: {damping: 12, stiffness: 180}});
	const t = frame + HOOK_SHOT_2 - HOOK_SHAKE;
	const shake = t > 0 && t < 14 ? Math.sin(t * 2.6) * 18 * (1 - t / 14) : 0;
	const r = useResponsive();

	return (
		<SafeArea style={{gap: 34}}>
			<div style={{opacity: Math.min(1, logoIn * 1.5), transform: `scale(${2 - logoIn})`}}>
				<Logo width={420} shineStart={10} />
			</div>
			<div style={{transform: `translateX(${shake}px)`}}>
				<SlamWords text="…mais tombent sur vos concurrents." fontSize={r(80, 84)} highlight={['concurrents.']} delay={6} stagger={3} />
			</div>
			<CompetitorResults delay={18} vertical={r(false, true)} />
		</SafeArea>
	);
};

const Shot1: React.FC = () => {
	const r = useResponsive();
	return (
		<SafeArea style={{gap: r(60, 80)}}>
			<SlamWords text="Vos clients vous cherchent sur Google…" fontSize={r(78, 96)} highlight={['Google…']} delay={0} stagger={3} />
			<div style={{transform: `scale(${r(1, 0.78)})`}}>
				<SearchBar delay={6} />
			</div>
		</SafeArea>
	);
};

// 0–5 s : deux plans rapides — la recherche, puis les concurrents (logo visible dès 2,5 s).
export const HookScene: React.FC = () => (
	<AbsoluteFill>
		<MotionAccents seed="hook" ghostText="EN LIGNE" />
		<Shot from={0} duration={HOOK_SHOT_2} exit="left" camera={{from: {scale: 1.3, rx: 22, y: 60}, to: {scale: 1, rx: 0, y: 0}}}>
			<Shot1 />
		</Shot>
		<Shot
			from={HOOK_SHOT_2}
			duration={150 - HOOK_SHOT_2}
			enter="right"
			camera={{from: {scale: 1.12, rz: -4}, to: {scale: 1, rz: 0}}}
		>
			<Shot2 />
		</Shot>
	</AbsoluteFill>
);
