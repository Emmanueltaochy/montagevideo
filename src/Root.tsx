import React from 'react';
import {Composition} from 'remotion';
import {DEFAULT_PROPS} from './props';
import {AD_DURATION, TaochyAd30s} from './TaochyAd30s';
import {BUMPER_DURATION, TaochyBumper6s} from './TaochyBumper6s';
import {VIDEO} from './theme';

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
			id="TaochyBumper6s"
			component={TaochyBumper6s}
			durationInFrames={BUMPER_DURATION}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={DEFAULT_PROPS}
		/>
	</>
);
