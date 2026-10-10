import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SlamWords} from '../components/SlamWords';
import {BODY_FONT, COLORS, GOLD_GRADIENT, TITLE_FONT} from '../theme';
import {pop} from '../visuals/pop';
import {PortalIcon, type PIcon} from './icons';
import {at} from './timing';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Fenêtre de visibilité d'un élément : entrée en ressort, sortie rapide.
const useInOut = (from: number, to: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - from, fps, config: {damping: 15, stiffness: 120, mass: 0.8}});
	const leave = interpolate(frame, [to - 8, to], [1, 0], clamp);
	return {frame, fps, enter, leave, visible: frame >= from - 1 && frame < to};
};

// Carte en 3D qui arrive en pivotant depuis le côté et flotte doucement.
const Card3D: React.FC<{from: number; to: number; side: 'left' | 'right'; top?: number; width: number; children: React.ReactNode}> = ({from, to, side, top = 210, width, children}) => {
	const {frame, enter, leave, visible} = useInOut(from, to);
	if (!visible) return null;
	const dir = side === 'left' ? -1 : 1;
	const float = Math.sin((frame - from) / 22) * 8;
	const ry = dir * -16 + (1 - enter) * dir * 70 + Math.sin((frame - from) / 40) * 3;
	return (
		<div
			style={{
				position: 'absolute',
				top: top + float,
				[side]: 130,
				width,
				perspective: 1800,
				opacity: Math.min(1, enter * 1.4) * leave,
			}}
		>
			<div
				style={{
					transform: `translateX(${(1 - enter) * dir * 260}px) rotateY(${ry}deg) rotateX(${4 + (1 - enter) * 10}deg) scale(${0.85 + 0.15 * enter})`,
					transformStyle: 'preserve-3d',
					background: 'linear-gradient(160deg, rgba(28,24,17,0.94), rgba(8,8,8,0.96))',
					border: `1.5px solid rgba(206,173,111,0.55)`,
					borderRadius: 30,
					boxShadow: `0 60px 120px -30px rgba(0,0,0,0.95), 0 0 60px -10px rgba(206,173,111,0.35), inset 0 1px 0 rgba(255,240,210,0.15)`,
					padding: 34,
					fontFamily: BODY_FONT,
					color: COLORS.white,
				}}
			>
				{children}
			</div>
		</div>
	);
};

const Row: React.FC<{icon: PIcon; label: string; at: number; done?: boolean}> = ({icon, label, at: t, done = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, t);
	const tick = pop(frame, fps, t + 8);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: '16px 20px',
				borderRadius: 18,
				background: 'rgba(255,255,255,0.04)',
				border: '1px solid rgba(206,173,111,0.25)',
				opacity: Math.min(1, s * 1.5),
				transform: `translateX(${(1 - s) * 60}px) translateZ(${s * 30}px)`,
			}}
		>
			<div style={{display: 'grid', placeItems: 'center', width: 54, height: 54, borderRadius: 14, background: 'rgba(206,173,111,0.12)'}}>
				<PortalIcon name={icon} size={30} />
			</div>
			<span style={{flex: 1, fontSize: 28, fontWeight: 700}}>{label}</span>
			{done && (
				<div style={{display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', background: GOLD_GRADIENT, transform: `scale(${tick})`}}>
					<PortalIcon name="check" size={24} color={COLORS.black} stroke={3} />
				</div>
			)}
		</div>
	);
};

const CardTitle: React.FC<{icon: PIcon; title: string; badge?: {text: string; at: number}}> = ({icon, title, badge}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const b = badge ? pop(frame, fps, badge.at) : 0;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24}}>
			<div style={{display: 'grid', placeItems: 'center', width: 72, height: 72, borderRadius: 20, background: GOLD_GRADIENT}}>
				<PortalIcon name={icon} size={42} color={COLORS.black} stroke={2.2} />
			</div>
			<span style={{fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 40, letterSpacing: -0.5}}>{title}</span>
			{badge && (
				<span
					style={{
						marginLeft: 'auto',
						padding: '8px 18px',
						borderRadius: 999,
						background: GOLD_GRADIENT,
						color: COLORS.black,
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: 24,
						transform: `scale(${b}) rotate(${(1 - b) * -20}deg)`,
					}}
				>
					{badge.text}
				</span>
			)}
		</div>
	);
};

// Fenêtre du portail avec ses onglets en haut, puis la liste de ce qu'on y fait.
const TABS = ['Accueil', 'Fichiers', 'Validations', 'Cahier des charges', 'Factures', 'Académie'];
const PortalWindow: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = at(9.6);
	const to = at(20.05);
	const cycle = Math.floor(interpolate(frame, [at(11.1), at(12.0)], [0, TABS.length - 0.01], clamp));
	const active = frame < at(11.1) ? 0 : frame < at(14.6) ? cycle : 2;
	const arrow = pop(frame, fps, at(11.9));
	const stamp = pop(frame, fps, at(19.1));
	return (
		<Card3D from={from} to={to} side="right" top={150} width={860}>
			<div style={{display: 'flex', gap: 10, marginBottom: 18}}>
				{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
					<div key={c} style={{width: 16, height: 16, borderRadius: '50%', background: c, opacity: 0.8}} />
				))}
				<div style={{marginLeft: 20, flex: 1, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.06)'}} />
			</div>
			<div style={{position: 'relative', display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 18, borderBottom: '1px solid rgba(206,173,111,0.25)'}}>
				{TABS.map((t, i) => (
					<span
						key={t}
						style={{
							padding: '10px 16px',
							borderRadius: 12,
							fontSize: 21,
							fontWeight: 700,
							background: i === active ? GOLD_GRADIENT : 'rgba(255,255,255,0.05)',
							color: i === active ? COLORS.black : COLORS.grey,
						}}
					>
						{t}
					</span>
				))}
				<div
					style={{
						position: 'absolute',
						left: 330,
						top: -86,
						opacity: frame < at(14.4) ? arrow : 0,
						transform: `translateY(${Math.sin(frame / 4) * 8 + (1 - arrow) * 30}px)`,
						fontFamily: TITLE_FONT,
						fontWeight: 900,
						fontSize: 26,
						color: COLORS.goldLight,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
					}}
				>
					<span style={{fontSize: 44}}>↑</span> Les onglets, juste au-dessus
				</div>
			</div>
			<div style={{display: 'grid', gap: 14, marginTop: 22, minHeight: 330}}>
				{frame < at(14.6) ? (
					[0, 1, 2].map((i) => (
						<div key={i} style={{height: 96, borderRadius: 18, background: 'rgba(255,255,255,0.035)', border: '1px dashed rgba(206,173,111,0.2)'}} />
					))
				) : (
					<>
						<Row icon="upload" label="Envoi de fichiers" at={at(15.0)} />
						<Row icon="check" label="Validation des posts" at={at(15.85)} />
						<Row icon="doc" label="Validation du cahier des charges" at={at(17.8)} />
					</>
				)}
			</div>
			<div
				style={{
					position: 'absolute',
					right: -30,
					bottom: -36,
					padding: '16px 28px',
					borderRadius: 18,
					background: GOLD_GRADIENT,
					color: COLORS.black,
					fontFamily: TITLE_FONT,
					fontWeight: 900,
					fontSize: 34,
					boxShadow: '0 20px 50px -10px rgba(206,173,111,0.6)',
					transform: `translateZ(80px) scale(${stamp}) rotate(${-4 + (1 - stamp) * 25}deg)`,
				}}
			>
				Tout se passe ici
			</div>
		</Card3D>
	);
};

const Invoices: React.FC = () => (
	<Card3D from={at(20.25)} to={at(23.4)} side="left" top={230} width={720}>
		<CardTitle icon="invoice" title="Vos factures" />
		<div style={{display: 'grid', gap: 14}}>
			<Row icon="doc" label="Site web" at={at(21.0)} />
			<Row icon="doc" label="Réseaux sociaux" at={at(21.5)} />
			<Row icon="doc" label="Publicité" at={at(22.0)} />
		</div>
	</Card3D>
);

const Offers: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, at(25.3));
	return (
		<Card3D from={at(23.5)} to={at(26.4)} side="left" top={230} width={720}>
			<CardTitle icon="home" title="Page d'accueil" />
			<div
				style={{
					position: 'relative',
					padding: 30,
					borderRadius: 24,
					background: GOLD_GRADIENT,
					color: COLORS.black,
					transform: `scale(${0.8 + 0.2 * s}) translateZ(${40 * s}px)`,
					opacity: Math.min(1, s * 1.5),
					boxShadow: '0 30px 70px -20px rgba(206,173,111,0.7)',
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<PortalIcon name="gift" size={54} color={COLORS.black} stroke={2.2} />
					<div>
						<div style={{fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 42}}>Offres du moment</div>
						<div style={{fontSize: 26, fontWeight: 700, opacity: 0.8}}>tout au long de l'année</div>
					</div>
				</div>
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${15 + i * 24}%`,
							top: -18 - (i % 2) * 14,
							transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(frame / 9 + i))})`,
						}}
					>
						<PortalIcon name="star" size={30} color={COLORS.goldLight} stroke={2} />
					</div>
				))}
			</div>
		</Card3D>
	);
};

const Academy: React.FC = () => (
	<Card3D from={at(26.55)} to={at(31.33)} side="right" top={230} width={760}>
		<CardTitle icon="cap" title="Académie" badge={{text: 'Bientôt', at: at(26.96)}} />
		<div style={{display: 'grid', gap: 14}}>
			<Row icon="star" label="Des tips concrets" at={at(30.9)} done={false} />
			<Row icon="chart" label="Pour vos objectifs" at={at(31.1)} done={false} />
		</div>
	</Card3D>
);

// Gros plan : petit graphique qui monte sur « objectifs commerciaux ».
const Goals: React.FC = () => {
	const {frame, fps, enter, leave, visible} = useInOut(at(32.4), at(35.96));
	if (!visible) return null;
	const bars = [0.35, 0.5, 0.62, 0.8, 1];
	return (
		<div style={{position: 'absolute', right: 110, top: 300, width: 380, perspective: 1400, opacity: enter * leave}}>
			<div
				style={{
					transform: `rotateY(-22deg) rotateX(6deg) translateX(${(1 - enter) * 200}px)`,
					padding: 28,
					borderRadius: 26,
					background: 'linear-gradient(160deg, rgba(28,24,17,0.94), rgba(8,8,8,0.96))',
					border: '1.5px solid rgba(206,173,111,0.55)',
					boxShadow: '0 50px 100px -30px rgba(0,0,0,0.95), 0 0 50px -10px rgba(206,173,111,0.35)',
				}}
			>
				<div style={{fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 30, color: COLORS.white, marginBottom: 20}}>Vos objectifs</div>
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 16, height: 200}}>
					{bars.map((h, i) => {
						const g = spring({frame: frame - at(34.6) - i * 3, fps, config: {damping: 14}});
						return <div key={i} style={{flex: 1, height: `${(0.15 + h * 0.85 * g) * 100}%`, borderRadius: 10, background: GOLD_GRADIENT, opacity: 0.5 + 0.5 * h}} />;
					})}
				</div>
			</div>
		</div>
	);
};

// Plan large : WhatsApp à gauche, e-mail à droite.
const Contact: React.FC<{icon: PIcon; label: string; side: 'left' | 'right'; from: number}> = ({icon, label, side, from}) => {
	const {frame, enter, leave, visible} = useInOut(from, at(38.92));
	if (!visible) return null;
	const dir = side === 'left' ? -1 : 1;
	return (
		<div style={{position: 'absolute', top: 380 + Math.sin(frame / 20) * 8, [side]: 170, perspective: 1200, opacity: enter * leave}}>
			<div
				style={{
					transform: `rotateY(${dir * -20 + (1 - enter) * dir * 60}deg) scale(${0.7 + 0.3 * enter})`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 16,
					padding: '34px 42px',
					borderRadius: 30,
					background: 'linear-gradient(160deg, rgba(28,24,17,0.94), rgba(8,8,8,0.96))',
					border: '1.5px solid rgba(206,173,111,0.55)',
					boxShadow: '0 50px 100px -30px rgba(0,0,0,0.95), 0 0 60px -10px rgba(206,173,111,0.4)',
				}}
			>
				<div style={{display: 'grid', placeItems: 'center', width: 120, height: 120, borderRadius: 34, background: GOLD_GRADIENT}}>
					<PortalIcon name={icon} size={70} color={COLORS.black} stroke={2} />
				</div>
				<span style={{fontFamily: TITLE_FONT, fontWeight: 900, fontSize: 36, color: COLORS.white}}>{label}</span>
			</div>
		</div>
	);
};

// Titre en bas de l'écran, sur un léger dégradé sombre pour rester lisible.
const BottomTitle: React.FC<{from: number; to: number; text: string; highlight: string[]; size?: number}> = ({from, to, text, highlight, size = 92}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame >= to) return null;
	const leave = interpolate(frame, [to - 7, to], [1, 0], clamp);
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90, opacity: leave}}>
			<AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 38%)'}} />
			<SlamWords text={text} fontSize={size} highlight={highlight} delay={from} stagger={3} style={{color: COLORS.white, textShadow: '0 8px 40px rgba(0,0,0,0.8)', maxWidth: 1500}} />
		</AbsoluteFill>
	);
};

// Bandeau nom / fonction.
const LowerThird: React.FC = () => {
	const {frame, fps, leave, visible} = useInOut(at(5.35), at(9.4));
	if (!visible) return null;
	const a = spring({frame: frame - at(5.35), fps, config: {damping: 16}});
	const b = spring({frame: frame - at(7.7), fps, config: {damping: 16}});
	return (
		<div style={{position: 'absolute', left: 120, bottom: 120, opacity: leave, fontFamily: TITLE_FONT, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
			<div
				style={{
					display: 'inline-block',
					padding: '14px 26px',
					borderRadius: 14,
					background: GOLD_GRADIENT,
					color: COLORS.black,
					fontWeight: 900,
					fontSize: 38,
					clipPath: `inset(0 ${(1 - a) * 100}% 0 0)`,
				}}
			>
				Taochy Agency &amp; Consulting
			</div>
			<div
				style={{
					marginTop: 12,
					padding: '14px 26px',
					borderRadius: 14,
					background: 'rgba(8,8,8,0.88)',
					border: '1.5px solid rgba(206,173,111,0.6)',
					color: COLORS.white,
					fontWeight: 800,
					fontSize: 34,
					clipPath: `inset(0 ${(1 - b) * 100}% 0 0)`,
					display: 'inline-flex',
					gap: 14,
				}}
			>
				Emmanuel Taochy <span style={{color: COLORS.gold}}>· Fondateur</span>
			</div>
		</div>
	);
};

export const Overlays: React.FC = () => (
	<AbsoluteFill>
		<BottomTitle from={at(1.9)} to={at(4.4)} text="Bienvenue sur votre portail client" highlight={['portail', 'client']} size={84} />
		<BottomTitle from={at(4.42)} to={at(5.03)} text="Merci !" highlight={['Merci']} size={150} />
		<LowerThird />
		<PortalWindow />
		<Invoices />
		<Offers />
		<Academy />
		<Goals />
		<Contact icon="whatsapp" label="WhatsApp" side="left" from={at(37.75)} />
		<Contact icon="mail" label="E-mail" side="right" from={at(38.5)} />
		<BottomTitle from={at(39.75)} to={at(41.93)} text="Le maximum de succès" highlight={['succès']} size={110} />
	</AbsoluteFill>
);
