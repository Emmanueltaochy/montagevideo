import {useVideoConfig} from 'remotion';
import {CONTENT_HEIGHT, REEL_SAFE} from './theme';

export type Layout = {
	portrait: boolean;
	width: number;
	height: number;
	// Zone de contenu sûre (hors interface YouTube / Instagram).
	top: number;
	contentHeight: number;
	side: number;
};

// Même montage, deux mises en page : horizontale (YouTube) et verticale (Reels).
export const useLayout = (): Layout => {
	const {width, height} = useVideoConfig();
	const portrait = height > width;
	return portrait
		? {portrait, width, height, top: REEL_SAFE.top, contentHeight: height - REEL_SAFE.top - REEL_SAFE.bottom, side: REEL_SAFE.side}
		: {portrait, width, height, top: 0, contentHeight: CONTENT_HEIGHT, side: 140};
};

// Choisit une valeur selon l'orientation.
export const useResponsive = () => {
	const {portrait} = useLayout();
	return <T,>(landscape: T, vertical: T): T => (portrait ? vertical : landscape);
};
