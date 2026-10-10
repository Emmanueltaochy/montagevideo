"""Génère la musique et les bruitages (synthèse 100 % originale, libre de droits).

Usage : python3 scripts/generate_audio.py   (nécessite numpy et scipy)
Écrit dans public/audio/ : music-30s.wav, music-6s.wav et sfx/*.wav
"""

import os
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ROOT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(974)

BPM = 144  # 1 mesure = 1,667 s : chaque scène de 5 s dure exactement 3 mesures
BEAT = 60 / BPM
BAR = BEAT * 4


# ---------- outils ----------

def write(path, x, peak=0.89):
	x = np.asarray(x, float)
	if x.ndim == 1:
		x = np.stack([x, x], 1)
	x = x / (np.max(np.abs(x)) or 1) * peak
	os.makedirs(os.path.dirname(path), exist_ok=True)
	with wave.open(path, 'wb') as w:
		w.setnchannels(2)
		w.setsampwidth(2)
		w.setframerate(SR)
		w.writeframes((x * 32767).astype('<i2').tobytes())


def t(d):
	return np.arange(int(d * SR)) / SR


def noise(d):
	return rng.standard_normal(int(d * SR))


def filt(x, kind, f, order=2):
	return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


def fade(x, a=0.003, b=0.02):
	e = np.ones(len(x))
	ia, ib = int(a * SR), int(b * SR)
	e[:ia] = np.linspace(0, 1, ia)
	e[len(x) - ib:] = np.linspace(1, 0, ib)
	return x * e


def chirp(f0, f1, d):
	tt = t(d)
	f = f0 * (f1 / f0) ** (tt / d)
	return np.sin(2 * np.pi * np.cumsum(f) / SR)


def midi(n):
	return 440 * 2 ** ((n - 69) / 12)


def saw(f, d):
	return 2 * ((t(d) * f) % 1) - 1


# ---------- bruitages ----------

def whoosh(d=0.7):
	n = noise(d)
	tt = t(d) / d
	bands = [filt(n, 'lowpass', 500), filt(n, 'bandpass', [500, 2000]), filt(n, 'bandpass', [2000, 7000])]
	centers = [0.35, 0.55, 0.65]
	x = sum(b * np.exp(-((tt - c) / 0.18) ** 2) for b, c in zip(bands, centers))
	return fade(x * np.sin(np.pi * tt) ** 1.5)


def pop(f0=500, f1=1300, d=0.12):
	return fade(chirp(f0, f1, d) * np.exp(-t(d) * 32) + 0.2 * filt(noise(d), 'highpass', 3000) * np.exp(-t(d) * 200))


def click():
	d = 0.06
	return fade(filt(noise(d), 'bandpass', [1500, 8000]) * np.exp(-t(d) * 140) + 0.5 * np.sin(2 * np.pi * 2600 * t(d)) * np.exp(-t(d) * 220))


def typing(d=1.0, keys=11):
	x = np.zeros(int(d * SR))
	for i in range(keys):
		k = filt(noise(0.04), 'bandpass', [1200 + rng.uniform(0, 1500), 7000]) * np.exp(-t(0.04) * 110) * rng.uniform(0.5, 1)
		s = int((i / keys + rng.uniform(-0.02, 0.02)) * (d - 0.05) * SR)
		s = max(0, s)
		x[s:s + len(k)] += k
	return x


def impact(d=1.3):
	tt = t(d)
	sub = np.tanh(1.8 * chirp(110, 38, d) * np.exp(-tt * 3.5))
	body = filt(noise(d), 'lowpass', 900) * np.exp(-tt * 12) * 0.7
	crack = filt(noise(d), 'highpass', 2500) * np.exp(-tt * 60) * 0.3
	return fade(sub + body + crack, b=0.1)


def riser(d=1.6):
	tt = t(d) / d
	tone = chirp(180, 1500, d) * 0.35 + chirp(270, 2250, d) * 0.15
	air = filt(noise(d), 'bandpass', [800, 9000]) * 0.5
	return fade((tone + air) * tt ** 2.2, b=0.01)


def shimmer(d=1.6):
	tt = t(d)
	x = np.zeros(len(tt))
	for f, a, k in [(1318.5, 1, 3), (1975.5, 0.7, 3.5), (2637, 0.5, 4.5), (3951, 0.3, 6)]:
		for det in (-1.5, 1.5):
			x += a * np.sin(2 * np.pi * (f + det) * tt) * np.exp(-tt * k)
	x *= 1 + 0.25 * np.sin(2 * np.pi * 7 * tt)
	return fade(x, a=0.01, b=0.1)


# ---------- musique ----------

CHORDS = [  # (basse, notes du pad) : Am – F – G, une grille par scène de 5 s
	(45, [57, 60, 64]),
	(41, [53, 57, 60]),
	(43, [55, 59, 62]),
]


class Mix:
	def __init__(self, d):
		self.L = np.zeros(int(d * SR) + SR)
		self.R = np.zeros(int(d * SR) + SR)
		self.d = d

	def add(self, start, x, gain=1.0, pan=0.0):
		s = int(start * SR)
		if s >= len(self.L):
			return
		x = x[: len(self.L) - s] * gain
		self.L[s:s + len(x)] += x * np.sqrt((1 - pan) / 2) * 1.414
		self.R[s:s + len(x)] += x * np.sqrt((1 + pan) / 2) * 1.414

	def render(self):
		n = int(self.d * SR)
		out = np.stack([self.L[:n], self.R[:n]], 1)
		out = np.tanh(out / (np.max(np.abs(out)) or 1) * 1.6)
		fo = int(0.6 * SR)
		out[-fo:] *= np.linspace(1, 0, fo)[:, None]
		return out


def kick():
	d = 0.4
	tt = t(d)
	f = 45 + 110 * np.exp(-tt * 28)
	return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8) + 0.15 * filt(noise(d), 'highpass', 4000) * np.exp(-tt * 300))


def clap():
	d = 0.25
	x = np.zeros(int(d * SR))
	for off in (0, 0.011, 0.022):
		b = filt(noise(d), 'bandpass', [900, 3500]) * np.exp(-t(d) * 28)
		s = int(off * SR)
		x[s:] += b[: len(x) - s]
	return fade(x)


def hat(open_=False):
	d = 0.2 if open_ else 0.06
	return fade(filt(noise(d), 'highpass', 7500) * np.exp(-t(d) * (18 if open_ else 70)))


def bass(note, d):
	f = midi(note)
	tt = t(d)
	x = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt)
	return fade(np.tanh(1.6 * x) * (0.6 + 0.4 * np.exp(-tt * 10)), b=0.03)


def pluck(note, d=0.3, bright=2600):
	f = midi(note)
	return fade(filt(saw(f, d) + 0.5 * saw(f * 1.004, d), 'lowpass', bright) * np.exp(-t(d) * 14))


def pad(notes, d, cutoff):
	x = np.zeros(int(d * SR))
	for n in notes:
		for det in (0.997, 1.003):
			x += saw(midi(n) * det, d)
	x = filt(x, 'lowpass', cutoff)
	e = np.minimum(1, t(d) / 0.35) * np.minimum(1, (d - t(d)) / 0.4)
	return x * e


ARP = [0, 1, 2, 3, 2, 1, 0, 2]


def bar_parts(mix, b, start, sections):
	"""Ajoute une mesure ; `sections` dit quels instruments jouent."""
	root, notes = CHORDS[b % 3]
	tones = notes + [notes[0] + 12]
	if 'pad' in sections:
		mix.add(start, pad(notes, BAR + 0.4, 1400 if 'bright' in sections else 800), 0.10, -0.2)
		mix.add(start, pad([n + 12 for n in notes], BAR + 0.4, 1200), 0.04, 0.3)
	for s16 in range(16):
		ts = start + s16 * BEAT / 4
		if 'arp' in sections:
			mix.add(ts, pluck(tones[ARP[s16 % 8]] + 12, bright=3200 if 'bright' in sections else 1800), 0.10, -0.35 if s16 % 2 else 0.35)
	for beat in range(4):
		tb = start + beat * BEAT
		if 'kick' in sections:
			mix.add(tb, kick(), 0.9)
		if 'clap' in sections and beat in (1, 3):
			mix.add(tb, clap(), 0.35, 0.1)
		if 'hat' in sections:
			mix.add(tb + BEAT / 2, hat(), 0.22, 0.4)
			mix.add(tb + BEAT / 4 * 3, hat(), 0.08, -0.3)
		if 'bass' in sections:
			for e in range(2):
				mix.add(tb + e * BEAT / 2, bass(root, BEAT / 2 - 0.02), 0.32)
	if 'roll' in sections:
		for i in range(8):
			mix.add(start + BAR / 2 + i * BEAT / 4, clap(), 0.08 + i * 0.04, 0.1)


def music_30s():
	mix = Mix(30)
	full = {'pad', 'arp', 'kick', 'clap', 'hat', 'bass'}
	plan = {
		0: {'pad', 'arp', 'kick', 'hat', 'bass'},  # accroche : énergique dès la 1re image
		1: {'pad', 'arp', 'kick', 'hat', 'bass'},
		2: {'pad', 'arp', 'kick', 'hat', 'bass', 'roll'},
		14: full | {'roll'},  # montée vers l'appel à l'action
		15: full | {'bright'},
		16: full | {'bright'},
		17: full | {'bright'},
	}
	for b in range(18):
		bar_parts(mix, b, b * BAR, plan.get(b, full))
	mix.add(5 - 1.6, riser(1.6), 0.3)
	mix.add(25 - 1.6, riser(1.6), 0.3)
	return mix.render()


def music_6s():
	mix = Mix(6)
	full = {'pad', 'arp', 'kick', 'clap', 'hat', 'bass', 'bright'}
	for b in range(4):
		bar_parts(mix, b, b * BAR, full | ({'roll'} if b == 1 else set()))
	return mix.render()


def music_portail(d=48.0, bpm=96, drive=False):
	"""Vidéo d'accueil du portail client : fond musical posé (96 BPM), qui laisse la place à la voix.
	`drive` : version plus rythmée (Reels), grosse caisse sur tous les temps et charleston en doubles croches."""
	beat = 60 / bpm
	bar = beat * 4
	mix = Mix(d)
	chords = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G
	nbars = int(np.ceil(d / bar))
	for b in range(nbars):
		start = b * bar
		root, notes = chords[b % 4]
		mix.add(start, pad(notes, bar + 0.5, 900), 0.12, -0.2)
		mix.add(start, pad([n + 12 for n in notes], bar + 0.5, 1500), 0.035, 0.3)
		tones = notes + [notes[0] + 12]
		for s8 in range(8):
			if s8 in (0, 3, 5, 6):
				mix.add(start + s8 * beat / 2, pluck(tones[(s8 + b) % 4] + 12, d=0.5, bright=1700), 0.07, -0.4 if s8 % 2 else 0.4)
		if b >= 1:
			for beat_i in range(4):
				tb = start + beat_i * beat
				mix.add(tb, kick(), 0.42 if (drive or beat_i in (0, 2)) else 0.0)
				mix.add(tb + beat / 2, hat(), 0.09, 0.35)
				if drive:
					mix.add(tb + beat / 4, hat(), 0.04, -0.3)
					mix.add(tb + beat * 3 / 4, hat(), 0.04, -0.3)
				if beat_i == 3:
					mix.add(tb, clap(), 0.12, 0.1)
			mix.add(start, bass(root, bar * 0.48), 0.18)
			mix.add(start + bar / 2, bass(root, bar * 0.45), 0.14)
	mix.add(0, shimmer(1.6), 0.18)
	out = mix.render()
	fi = int(1.0 * SR)
	out[:fi] *= np.linspace(0, 1, fi)[:, None]
	fo = int(2.5 * SR)
	out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
	return out


if __name__ == '__main__':
	sfx = os.path.join(ROOT, 'sfx')
	for name, x in {
		'whoosh': whoosh(),
		'pop': pop(),
		'pop-high': pop(900, 2000, 0.09),
		'click': click(),
		'typing': typing(),
		'impact': impact(),
		'riser': riser(),
		'shimmer': shimmer(),
	}.items():
		write(os.path.join(sfx, f'{name}.wav'), x)
	write(os.path.join(ROOT, 'music-30s.wav'), music_30s())
	write(os.path.join(ROOT, 'music-6s.wav'), music_6s())
	write(os.path.join(ROOT, 'music-portail.wav'), music_portail())
	write(os.path.join(ROOT, 'music-commerce.wav'), music_portail(46.0, 112, drive=True))
	print('ok')
