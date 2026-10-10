import React from 'react';
import {Composition} from 'remotion';
import {DEFAULT_PROPS} from './props';
import {AD_DURATION, TaochyAd30s} from './TaochyAd30s';
import {AI_DURATION, TaochyAI30s} from './TaochyAI30s';
import {BUMPER_DURATION, TaochyBumper6s} from './TaochyBumper6s';
import {CommerceReel} from './commerce/CommerceReel';
import {COMMERCE_DURATION} from './commerce/timing';
import {PORTAIL_DURATION} from './portail/timing';
import {TaochyPortail} from './portail/TaochyPortail';
import {REEL, VIDEO} from './theme';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="TaochyAd30s"
			component={TaochyAd30s}
			durationInFrames={AD_DURATION}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={DEFAULT_PROPS}
		/>
		<Composition
			id="TaochyReel30s"
			component={TaochyAd30s}
			durationInFrames={AD_DURATION}
			fps={VIDEO.fps}
			width={REEL.width}
			height={REEL.height}
			defaultProps={DEFAULT_PROPS}
		/>
		<Composition
			id="TaochyBumper6s"
			component={TaochyBumper6s}
			durationInFrames={BUMPER_DURATION}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={DEFAULT_PROPS}
		/>
		<Composition
			id="TaochyAI30s"
			component={TaochyAI30s}
			durationInFrames={AI_DURATION}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={DEFAULT_PROPS}
		/>
		<Composition
			id="TaochyAIReel30s"
			component={TaochyAI30s}
			durationInFrames={AI_DURATION}
			fps={VIDEO.fps}
			width={REEL.width}
			height={REEL.height}
			defaultProps={DEFAULT_PROPS}
		/>
		<Composition
			id="TaochyPortail"
			component={TaochyPortail}
			durationInFrames={PORTAIL_DURATION}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
		/>
		<Composition
			id="TaochyCommerceReel"
			component={CommerceReel}
			durationInFrames={COMMERCE_DURATION}
			fps={VIDEO.fps}
			width={REEL.width}
			height={REEL.height}
		/>
	</>
);
