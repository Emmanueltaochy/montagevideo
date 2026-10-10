import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {PortalIcon, type PIcon} from '../portail/icons';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';
import {pop} from '../visuals/pop';
import {CAPTIONS} from './captions';
import {at, COMMERCE_DURATION, JUMP_CUTS, MODES, modeAt, SAFE, TALK} from './timing';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 1080;
const vid = (name: string) => staticFile(`commerce/${name}.mp4`);

// ───────── Décor : vrai bureau (open space), flouté comme par un objectif ─────────
const Office: React.FC = () => (
	<AbsoluteFill>
		<OffthreadVideo src={vid('bureau')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 50% 40%, rgba(206,173,111,0.12), transparent 70%)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.55) 100%)'}} />
	</AbsoluteFill>
);

// ───────── La personne détourée, cadrée selon la mise en page (transitions en douceur) ─────────
const layoutOf = (m: (typeof MODES)[number]) =>
	m.mode === 'split' ? {scale: 0.84, y: 150, o: 1} : m.mode === 'full' ? {scale: 1.1, y: 0, o: 0} : {scale: m.scale ?? 1, y: 0, o: 1};

const Presenter: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {index, m, start} = modeAt(frame);
	const prev = layoutOf(MODES[Math.max(0, index - 1)]);
	const cur = layoutOf(m);
	const k = index === 0 ? 1 : spring({frame: frame - start, fps, config: {damping: 18, stiffness: 140}});
	const jumps = JUMP_CUTS.filter((t) => at(t) <= frame).length;
	const zoom = jumps % 2 ? 1.05 : 1;
	const scale = (prev.scale + (cur.scale - prev.scale) * k) * zoom;
	const y = prev.y + (cur.y - prev.y) * k;
	const o = cur.o === 0 ? 0 : prev.o === 0 ? Math.min(1, k * 2) : 1;
	const exit = interpolate(frame, [TALK - 6, TALK + 10], [1, 0], clamp);
	return (
		<AbsoluteFill style={{opacity: o * exit, transform: `translateY(${y}px) scale(${scale})`, transformOrigin: '50% 100%'}}>
			<Sequence durationInFrames={TALK} layout="none">
				<OffthreadVideo
					src={staticFile('commerce/presenter.webm')}
					transparent
					muted
					style={{
						width: W,
						height: 1920,
						filter: 'drop-shadow(0 0 2px rgba(255,240,210,0.35)) drop-shadow(0 40px 50px rgba(0,0,0,0.6))',
					}}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};

// ───────── Vidéo d'illustration plein écran ─────────
const FULL_TEXT: Record<string, {text: string; from: number}> = {
	crowd: {text: 'LE PASSAGE', from: 4.38},
	street: {text: 'LE PASSAGE', from: 12.32},
	laptop: {text: 'Un site internet ?', from: 20.36},
	phone: {text: "L'outil ultime ?", from: 22.6},
};
const FullClip: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {m, start, end} = modeAt(frame);
	if (m.mode !== 'full' || !m.clip) return null;
	const z = interpolate(frame, [start, end], [1.12, 1.0]);
	const inn = interpolate(frame, [start, start + 5], [0, 1], clamp);
	const txt = FULL_TEXT[m.clip];
	const s = txt ? spring({frame: frame - at(txt.from), fps, config: {damping: 11, stiffness: 160}}) : 0;
	return (
		<AbsoluteFill style={{opacity: inn}}>
			<Sequence from={start} durationInFrames={end - start} layout="none">
				<OffthreadVideo src={vid(m.clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
			</Sequence>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55))'}} />
			{txt && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 260}}>
					<div
						style={{
							fontFamily: TITLE_FONT,
							fontWeight: 900,
							fontSize: txt.text.length > 12 ? 104 : 150,
							letterSpacing: -2,
							color: COLORS.white,
							textAlign: 'center',
							lineHeight: 1,
							padding: '0 80px',
							textShadow: '0 10px 50px rgba(0,0,0,0.85)',
							transform: `scale(${2.2 - 1.2 * s})`,
							opacity: Math.min(1, s * 2),
							filter: `blur(${(1 - Math.min(1, s)) * 10}px)`,
						}}
					>
						{txt.text.split(' ').map((w, i, a) => (
							<span key={i} style={{color: i === a.length - 1 ? COLORS.gold : COLORS.white}}>
								{w}{' '}
							</span>
						))}
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ───────── Fenêtres 3D au-dessus de la personne ─────────
const CARD = {x: 90, y: 380, w: 900, h: 506};

const Chip: React.FC<{text: string; icon?: PIcon; at: number; gold?: boolean}> = ({text, icon, at: f, gold}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, f);
	if (frame < f) return null;
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 14,
				padding: '14px 26px',
				borderRadius: 999,
				background: gold ? GOLD_GRADIENT : 'rgba(8,8,8,0.9)',
				border: gold ? 'none' : '1.5px solid rgba(206,173,111,0.6)',
				color: gold ? COLORS.black : COLORS.white,
				fontFamily: TITLE_FONT,
				fontWeight: 900,
				fontSize: 38,
				transform: `scale(${s}) rotate(${(1 - s) * -12}deg)`,
				boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)',
				whiteSpace: 'nowrap',
			}}
		>
			{icon && <PortalIcon name={icon} size={40} color={gold ? COLORS.black : COLORS.gold} stroke={2.2} />}
			{text}
		</div>
	);
};

const Frame3D: React.FC<{start: number; children: React.ReactNode; label?: React.ReactNode}> = ({start, children, label}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - start, fps, config: {damping: 15, stiffness: 120}});
	const f = frame - start;
	return (
		<div style={{position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, perspective: 1800}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					transform: `translateY(${(1 - s) * -120 + Math.sin(f / 24) * 6}px) rotateX(${7 + (1 - s) * 40}deg) rotateY(${Math.sin(f / 50) * 5}deg) scale(${0.8 + 0.2 * s})`,
					opacity: Math.min(1, s * 1.5),
					borderRadius: 34,
					overflow: 'hidden',
					border: '3px solid rgba(206,173,111,0.85)',
					boxShadow: '0 60px 100px -30px rgba(0,0,0,0.9), 0 0 60px -10px rgba(206,173,111,0.45)',
					background: '#0b0b0b',
					position: 'relative',
				}}
			>
				{children}
			</div>
			{label && <div style={{position: 'absolute', left: 30, bottom: -36, display: 'flex', gap: 12}}>{label}</div>}
		</div>
	);
};

const ClipFill: React.FC<{name: string; from: number; dur: number; grey?: number}> = ({name, from, dur, grey = 0}) => (
	<Sequence from={from} durationInFrames={dur} layout="none">
		<OffthreadVideo src={vid(name)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: `grayscale(${grey}) brightness(${1 - grey * 0.35})`}} />
	</Sequence>
);

// Faux site « magasin » : vitrine avec store, produits, et compteur de visiteurs.
const SiteMock: React.FC<{visitors: number; button?: {at: number}}> = ({visitors, button}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const click = button ? spring({frame: frame - button.at, fps, config: {damping: 12}}) : 0;
	const cx = button ? interpolate(frame, [button.at - 24, button.at - 2], [820, 455], clamp) : 0;
	const cy = button ? interpolate(frame, [button.at - 24, button.at - 2], [480, 395], clamp) : 0;
	return (
		<AbsoluteFill style={{background: '#f6f2ea', fontFamily: BODY_FONT}}>
			<div style={{height: 50, background: '#e8e1d3', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px'}}>
				{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
					<div key={c} style={{width: 14, height: 14, borderRadius: '50%', background: c}} />
				))}
				<div style={{marginLeft: 16, padding: '6px 18px', borderRadius: 10, background: '#fff', fontSize: 20, color: '#555'}}>www.votre-commerce.re</div>
			</div>
			<div style={{height: 46, backgroundImage: 'repeating-linear-gradient(90deg, #0b0b0b 0 60px, #cead6f 60px 120px)', borderBottomLeftRadius: 30, borderBottomRightRadius: 30}} />
			<div style={{display: 'flex', gap: 20, padding: '26px 34px'}}>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{flex: 1, height: 170, borderRadius: 18, background: `linear-gradient(160deg, #e0d4bd, #c9b58e)`, display: 'grid', placeItems: 'center'}}>
						<PortalIcon name="cart" size={56} color="#6b5a39" />
					</div>
				))}
			</div>
			{button && (
				<div
					style={{
						position: 'absolute',
						left: 300,
						top: 360,
						padding: '18px 40px',
						borderRadius: 16,
						background: GOLD_GRADIENT,
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: 30,
						color: COLORS.black,
						transform: `scale(${1 - 0.08 * Math.sin(Math.min(1, click) * Math.PI)})`,
						boxShadow: `0 0 0 ${click * 30}px rgba(206,173,111,${0.5 * (1 - Math.min(1, click))})`,
					}}
				>
					Demander un devis
				</div>
			)}
			{button && (
				<div style={{position: 'absolute', left: cx, top: cy}}>
					<PortalIcon name="cursor" size={54} color={COLORS.black} stroke={2} />
				</div>
			)}
			<div
				style={{
					position: 'absolute',
					right: 24,
					top: 64,
					padding: '10px 18px',
					borderRadius: 12,
					background: 'rgba(11,11,11,0.88)',
					color: COLORS.white,
					fontFamily: TITLE_FONT,
					fontWeight: 800,
					fontSize: 24,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<PortalIcon name="users" size={28} /> {visitors.toLocaleString('fr-FR')} visiteur{visitors > 1 ? 's' : ''}
			</div>
		</AbsoluteFill>
	);
};

const Notif: React.FC<{icon: PIcon; text: string; at: number; i: number}> = ({icon, text, at: f, i}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, f);
	if (frame < f) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 40,
				right: 40,
				top: 40 + i * 120,
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: '18px 24px',
				borderRadius: 22,
				background: 'rgba(250,247,240,0.96)',
				boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
				transform: `translateY(${(1 - s) * -60}px) scale(${0.9 + 0.1 * s})`,
				opacity: Math.min(1, s * 1.5),
				fontFamily: BODY_FONT,
			}}
		>
			<div style={{display: 'grid', placeItems: 'center', width: 64, height: 64, borderRadius: 16, background: GOLD_GRADIENT}}>
				<PortalIcon name={icon} size={36} color={COLORS.black} stroke={2.2} />
			</div>
			<div>
				<div style={{fontSize: 22, color: '#777', fontWeight: 700}}>maintenant</div>
				<div style={{fontSize: 32, color: '#111', fontWeight: 800}}>{text}</div>
			</div>
		</div>
	);
};

const Card: React.FC = () => {
	const frame = useCurrentFrame();
	const {m, start, end} = modeAt(frame);
	if (m.mode !== 'split') return null;
	const dur = end - start;
	const leave = interpolate(frame, [end - 5, end], [1, 0], clamp);
	const body = (() => {
		switch (m.card) {
			case 'shop':
				return (
					<Frame3D start={start} label={<Chip text="Commerce physique" icon="cart" at={start + 6} gold />}>
						<ClipFill name="shop" from={start} dur={dur} />
					</Frame3D>
				);
			case 'boutique': {
				const office = frame >= at(7.42);
				return (
					<Frame3D start={start} label={office ? <Chip key="b" text="Un bureau" icon="folder" at={at(7.42)} gold /> : <Chip key="m" text="Un magasin" icon="cart" at={at(6.8)} gold />}>
						{office ? <ClipFill name="office" from={at(7.42)} dur={end - at(7.42)} /> : <ClipFill name="boutique" from={start} dur={at(7.42) - start} />}
					</Frame3D>
				);
			}
			case 'empty': {
				const g = interpolate(frame, [start, start + 12], [0, 1], clamp);
				return (
					<Frame3D start={start} label={<Chip text="Votre offre = 0" icon="eyeOff" at={at(11.6)} />}>
						<ClipFill name="empty" from={start} dur={dur} grey={g} />
						<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
							<div style={{fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 200, color: COLORS.white, opacity: g, textShadow: '0 10px 40px rgba(0,0,0,0.8)'}}>0</div>
							<div style={{fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 40, color: COLORS.goldLight, opacity: g, marginTop: -20}}>client</div>
						</AbsoluteFill>
					</Frame3D>
				);
			}
			case 'worker': {
				const brand = frame >= at(17.2);
				const g = interpolate(frame, [at(18.4), at(18.9)], [0, 1], clamp);
				return (
					<Frame3D
						start={start}
						label={
							g > 0.5 ? (
								<Chip key="n" text="Personne ne vous voit" icon="eyeOff" at={at(18.5)} />
							) : brand ? (
								<Chip key="b" text="La meilleure image de marque" icon="star" at={at(17.48)} gold />
							) : (
								<Chip key="p" text="Le meilleur produit" icon="star" at={at(14.62)} gold />
							)
						}
					>
						{brand ? <ClipFill name="brand" from={at(17.2)} dur={end - at(17.2)} grey={g} /> : <ClipFill name="worker" from={start} dur={at(17.2) - start} />}
					</Frame3D>
				);
			}
			case 'site0':
				return (
					<Frame3D start={start} label={<Chip text="Invisible = inutile" icon="eyeOff" at={at(28.7)} />}>
						<SiteMock visitors={0} />
					</Frame3D>
				);
			case 'convert':
				return (
					<Frame3D start={start} label={<Chip text="1 · Un site qui convertit" at={start + 4} gold />}>
						<SiteMock visitors={0} button={{at: at(32.5)}} />
					</Frame3D>
				);
			case 'traffic': {
				const n = Math.round(interpolate(frame, [at(34.4), at(35.1)], [0, 1240], clamp));
				return (
					<Frame3D start={start} label={<Chip text="2 · Du trafic" icon="users" at={start + 4} gold />}>
						<ClipFill name="mall" from={start} dur={dur} />
						<div style={{position: 'absolute', right: 24, top: 24, padding: '12px 20px', borderRadius: 14, background: 'rgba(11,11,11,0.88)', color: COLORS.white, fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 34, display: 'flex', gap: 12, alignItems: 'center'}}>
							<PortalIcon name="users" size={34} /> {n.toLocaleString('fr-FR')}
						</div>
					</Frame3D>
				);
			}
			case 'leads':
				return (
					<Frame3D start={start} label={<Chip text="Devis & ventes" icon="chart" at={at(37.3)} gold />}>
						<ClipFill name="cashier" from={start} dur={dur} />
						<AbsoluteFill style={{background: 'rgba(0,0,0,0.25)'}} />
						<Notif icon="users" text="Nouveau visiteur" at={at(36.2)} i={0} />
						<Notif icon="doc" text="Nouvelle demande de devis" at={at(38.3)} i={1} />
						<Notif icon="cart" text="Nouvelle vente" at={at(39.5)} i={2} />
					</Frame3D>
				);
			default:
				return null;
		}
	})();
	return <AbsoluteFill style={{opacity: leave}}>{body}</AbsoluteFill>;
};

// ───────── Textes sur la personne (plans « talk ») ─────────
const TalkText: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const items = [
		{from: 0.3, to: 2.6, top: 1010, node: <Chip text="Commerce physique ?" icon="cart" at={at(0.3)} gold />},
		{from: 8.8, to: 10.1, top: 1010, node: <Chip text="Visible par personne" icon="eyeOff" at={at(8.8)} />},
		{from: 25.5, to: 26.93, top: 1010, node: <Chip text="Site internet = magasin" icon="home" at={at(25.5)} gold />},
	];
	const logo = spring({frame: frame - at(29.9), fps, config: {damping: 13}});
	return (
		<>
			{items.map((it, i) =>
				frame >= at(it.from) && frame < at(it.to) ? (
					<div key={i} style={{position: 'absolute', top: it.top, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: interpolate(frame, [at(it.to) - 5, at(it.to)], [1, 0], clamp)}}>
						{it.node}
					</div>
				) : null,
			)}
			{frame >= at(29.9) && frame < at(31.5) && (
				<div style={{position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center', perspective: 1400}}>
					<div
						style={{
							padding: '26px 44px',
							borderRadius: 26,
							background: 'rgba(8,8,8,0.9)',
							border: '2px solid rgba(206,173,111,0.7)',
							transform: `rotateY(${(1 - logo) * 80}deg) scale(${0.7 + 0.3 * logo})`,
							opacity: Math.min(1, logo * 1.5) * interpolate(frame, [at(31.5) - 5, at(31.5)], [1, 0], clamp),
							boxShadow: '0 0 60px -10px rgba(206,173,111,0.6)',
						}}
					>
						<Logo width={520} shineStart={at(30.1)} />
					</div>
				</div>
			)}
		</>
	);
};

// ───────── Sous-titres animés (mot en cours en doré) ─────────
const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const g = CAPTIONS.find((grp, i) => t >= grp[0].s - 0.05 && (i + 1 >= CAPTIONS.length || t < CAPTIONS[i + 1][0].s - 0.05) && t < grp[grp.length - 1].e + 0.6);
	if (!g || frame >= TALK) return null;
	const enter = spring({frame: frame - Math.round((g[0].s - 0.05) * fps), fps, config: {damping: 14, stiffness: 200}});
	return (
		<div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: 1110, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: '0 18px',
					fontFamily: TITLE_FONT,
					fontWeight: 900,
					fontSize: 74,
					lineHeight: 1.1,
					textTransform: 'uppercase',
					letterSpacing: -1,
					transform: `scale(${0.85 + 0.15 * enter}) translateY(${(1 - enter) * 20}px)`,
					WebkitTextStroke: '2px rgba(0,0,0,0.6)',
					textShadow: '0 6px 0 rgba(0,0,0,0.55), 0 10px 40px rgba(0,0,0,0.75)',
				}}
			>
				{g.map((w, i) => {
					const active = t >= w.s - 0.03 && t < (g[i + 1]?.s ?? w.e + 0.6);
					return (
						<span key={i} style={{color: active ? COLORS.gold : COLORS.white, transform: `scale(${active ? 1.06 : 1})`, display: 'inline-block'}}>
							{w.w}
						</span>
					);
				})}
			</div>
		</div>
	);
};

// ───────── Fin : appel à l'action ─────────
const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < TALK - 4) return null;
	const f = frame - TALK;
	const a = spring({frame: f, fps, config: {damping: 14}});
	const b = spring({frame: f - 10, fps, config: {damping: 12}});
	const c = spring({frame: f - 22, fps, config: {damping: 14}});
	return (
		<AbsoluteFill style={{background: `rgba(0,0,0,${0.55 * Math.min(1, a)})`, justifyContent: 'center', alignItems: 'center', paddingBottom: 300, gap: 56}}>
			<div style={{perspective: 1400}}>
				<div style={{transform: `rotateY(${(1 - a) * -70}deg) scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 1.5), filter: 'drop-shadow(0 0 40px rgba(206,173,111,0.5))'}}>
					<Logo width={760} shineStart={TALK + 12} />
				</div>
			</div>
			<div
				style={{
					padding: '30px 54px',
					borderRadius: 999,
					background: GOLD_GRADIENT,
					fontFamily: TITLE_FONT,
					fontWeight: 900,
					fontSize: 50,
					color: COLORS.black,
					transform: `scale(${b * (1 + 0.03 * Math.sin(f / 5))})`,
					boxShadow: '0 30px 60px -15px rgba(206,173,111,0.7)',
				}}
			>
				Réservez votre appel gratuit
			</div>
			<div style={{fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 46, color: COLORS.goldLight, letterSpacing: 2, opacity: c, transform: `translateY(${(1 - c) * 30}px)`}}>taochyagency.com</div>
		</AbsoluteFill>
	);
};

// Logo toujours visible en haut à gauche (sous la zone de l'interface Instagram).
const CornerLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [TALK - 4, TALK + 8], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: SAFE.side, top: SAFE.top + 16, opacity: 0.95 * o, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.9))'}}>
			<Logo width={230} shineStart={20} />
		</div>
	);
};

// Éclair blanc très bref aux changements de mise en page.
const Flash: React.FC = () => {
	const frame = useCurrentFrame();
	const {start, index} = modeAt(frame);
	if (index === 0 || frame >= TALK) return null;
	const o = interpolate(frame - start, [0, 5], [0.28, 0], clamp);
	return <AbsoluteFill style={{background: '#fff', opacity: o, mixBlendMode: 'overlay'}} />;
};

const musicVolume = (f: number) => interpolate(f, [0, 8, TALK - 6, TALK + 10, COMMERCE_DURATION], [0.12, 0.06, 0.06, 0.42, 0.42], clamp);

const SFX: {name: string; f: number; v: number}[] = [
	...MODES.slice(1).map((m) => ({name: 'whoosh', f: at(m.t) - 3, v: 0.14})),
	{name: 'pop', f: at(0.3), v: 0.16},
	{name: 'pop', f: at(6.8), v: 0.14},
	{name: 'pop', f: at(7.42), v: 0.14},
	{name: 'impact', f: at(11.9), v: 0.18},
	{name: 'pop', f: at(14.62), v: 0.14},
	{name: 'pop', f: at(17.48), v: 0.14},
	{name: 'impact', f: at(19.9), v: 0.16},
	{name: 'typing', f: at(20.3), v: 0.12},
	{name: 'impact', f: at(28.7), v: 0.16},
	{name: 'shimmer', f: at(29.9), v: 0.2},
	{name: 'click', f: at(32.5), v: 0.3},
	{name: 'riser', f: at(33.6), v: 0.12},
	{name: 'pop-high', f: at(36.2), v: 0.18},
	{name: 'pop-high', f: at(38.3), v: 0.18},
	{name: 'pop-high', f: at(39.5), v: 0.18},
	{name: 'shimmer', f: TALK + 4, v: 0.25},
];

export const CommerceReel: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: COLORS.black}}>
		<Office />
		<Presenter />
		<Card />
		<FullClip />
		<TalkText />
		<Captions />
		<Flash />
		<Outro />
		<CornerLogo />

		<Audio src={staticFile('audio/music-commerce.wav')} volume={musicVolume} />
		<Audio src={staticFile('commerce/voix.wav')} />
		{SFX.map((s, i) => (
			<Sequence key={i} from={s.f} layout="none">
				<Audio src={staticFile(`audio/sfx/${s.name}.wav`)} volume={s.v} />
			</Sequence>
		))}
	</AbsoluteFill>
);
