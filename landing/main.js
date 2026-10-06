(() => {
	const config = window.TAOCHY_CONFIG || {};
	const CONSENT_KEY = 'taochy-consent';
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	window.dataLayer = window.dataLayer || [];
	const track = (event, params = {}) => window.dataLayer.push({event, ...params});

	// ───────── Mesure : Google Tag Manager (Consent Mode v2) + Pixel Meta ─────────
	const loadGtm = () => {
		if (!config.gtmId || window.__gtmLoaded) return;
		window.__gtmLoaded = true;
		window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
		const s = document.createElement('script');
		s.async = true;
		s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`;
		document.head.appendChild(s);
	};

	const loadMetaPixel = () => {
		if (!config.metaPixelId || window.fbq) return;
		/* eslint-disable */
		!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
		/* eslint-enable */
		window.fbq('init', config.metaPixelId);
		window.fbq('track', 'PageView');
	};

	const applyConsent = (choice) => {
		const value = choice === 'granted' ? 'granted' : 'denied';
		window.gtag('consent', 'update', {
			ad_storage: value,
			ad_user_data: value,
			ad_personalization: value,
			analytics_storage: value,
		});
		if (value === 'granted') loadMetaPixel();
		else if (window.fbq) window.fbq('consent', 'revoke');
	};

	const readConsent = () => {
		try {
			return localStorage.getItem(CONSENT_KEY);
		} catch {
			return null;
		}
	};
	const saveConsent = (choice) => {
		try {
			localStorage.setItem(CONSENT_KEY, choice);
		} catch {
			/* navigation privée : le choix vaut pour cette visite */
		}
	};

	// GTM se charge toujours, mais n'enregistre rien tant que le visiteur n'a pas accepté.
	loadGtm();

	const banner = document.querySelector('[data-consent]');
	const mobileCta = document.querySelector('[data-mobile-cta]');
	const showBanner = () => {
		banner.hidden = false;
		if (mobileCta) mobileCta.classList.add('is-hidden');
		banner.querySelector('[data-consent-choice="denied"]').focus({preventScroll: true});
	};

	const stored = readConsent();
	if (stored) applyConsent(stored);
	else if (config.gtmId || config.metaPixelId) showBanner();

	banner.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-consent-choice]');
		if (!btn) return;
		const choice = btn.dataset.consentChoice;
		saveConsent(choice);
		applyConsent(choice);
		banner.hidden = true;
		track('consent_choice', {consent: choice});
	});
	document.querySelector('[data-open-consent]')?.addEventListener('click', showBanner);

	// ───────── Liens légaux ─────────
	if (config.legalUrl) {
		document.querySelectorAll('[data-legal]').forEach((a) => (a.href = config.legalUrl));
	}

	// ───────── Suivi des clics et de la vidéo ─────────
	document.querySelectorAll('[data-cta]').forEach((el) =>
		el.addEventListener('click', () => track('cta_click', {cta_location: el.dataset.cta})),
	);
	const video = document.querySelector('[data-video]');
	video?.addEventListener('play', () => track('video_play', {video: video.dataset.video}), {once: true});
	video?.addEventListener('ended', () => track('video_complete', {video: video.dataset.video}), {once: true});

	// ───────── Animation de la recherche (une seule fois) ─────────
	const demo = document.querySelector('.search-demo');
	const query = demo?.querySelector('.search-demo__query');
	if (demo && query && !reduceMotion) {
		const text = query.dataset.query;
		demo.classList.add('is-armed');
		query.textContent = '';
		let i = 0;
		const type = () => {
			query.textContent = text.slice(0, ++i);
			if (i < text.length) setTimeout(type, 55 + Math.random() * 45);
			else setTimeout(() => demo.classList.add('is-revealed'), 280);
		};
		setTimeout(type, 450);
	}

	// ───────── Barre fixe mobile : visible après le haut de page, cachée sur la réservation ─────────
	const heroActions = document.querySelector('.hero__actions');
	const booking = document.getElementById('reserver');
	if (mobileCta && heroActions && booking && 'IntersectionObserver' in window) {
		let heroVisible = true;
		let bookingVisible = false;
		const update = () => {
			mobileCta.hidden = false;
			mobileCta.classList.toggle('is-hidden', heroVisible || bookingVisible || !banner.hidden);
		};
		new IntersectionObserver(([e]) => {
			heroVisible = e.isIntersecting;
			update();
		}).observe(heroActions);
		new IntersectionObserver(([e]) => {
			bookingVisible = e.isIntersecting;
			update();
		}).observe(booking);
	}

	// ───────── Agenda Calendly (chargé à l'approche de la section) ─────────
	const calEl = document.getElementById('cal-inline');
	const loadCalendly = () => {
		if (!config.calendlyUrl || window.__calendlyLoaded) return;
		window.__calendlyLoaded = true;
		const url = new URL(config.calendlyUrl);
		// Couleurs de la marque (prises en compte selon l'offre Calendly).
		url.searchParams.set('background_color', '000000');
		url.searchParams.set('text_color', 'f3eee4');
		url.searchParams.set('primary_color', 'cead6f');
		calEl.innerHTML = '';
		const widget = document.createElement('div');
		widget.className = 'calendly-inline-widget';
		widget.dataset.url = url.toString();
		calEl.appendChild(widget);
		const s = document.createElement('script');
		s.src = 'https://assets.calendly.com/assets/external/widget.js';
		s.async = true;
		document.body.appendChild(s);
	};

	// Réservation confirmée : la vraie conversion, envoyée à GTM et à Meta.
	let booked = false;
	window.addEventListener('message', (e) => {
		if (e.origin !== 'https://calendly.com' || !e.data || typeof e.data.event !== 'string') return;
		if (e.data.event === 'calendly.date_and_time_selected') track('booking_slot_selected', {booking_tool: 'calendly'});
		if (e.data.event === 'calendly.event_scheduled' && !booked) {
			booked = true;
			track('booking_confirmed', {booking_tool: 'calendly'});
			if (window.fbq) window.fbq('track', 'Schedule');
		}
	});

	if (calEl && config.calendlyUrl) {
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(([e]) => {
				if (e.isIntersecting) {
					loadCalendly();
					io.disconnect();
				}
			}, {rootMargin: '600px'});
			io.observe(calEl);
		} else loadCalendly();
	}

	// ───────── Effets 3D ─────────
	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

	// Inclinaison qui suit la souris (cartes et maquettes marquées data-tilt).
	if (finePointer && !reduceMotion) {
		document.querySelectorAll('[data-tilt]').forEach((el) => {
			const base = getComputedStyle(el);
			const rx0 = parseFloat(base.getPropertyValue('--rx')) || 0;
			const ry0 = parseFloat(base.getPropertyValue('--ry')) || 0;
			const zone = el.closest('section') || el;
			zone.addEventListener('pointermove', (e) => {
				const r = el.getBoundingClientRect();
				const x = (e.clientX - (r.left + r.width / 2)) / r.width;
				const y = (e.clientY - (r.top + r.height / 2)) / r.height;
				el.style.setProperty('--rx', `${rx0 - y * 10}deg`);
				el.style.setProperty('--ry', `${ry0 + x * 16}deg`);
			});
			zone.addEventListener('pointerleave', () => {
				el.style.setProperty('--rx', `${rx0}deg`);
				el.style.setProperty('--ry', `${ry0}deg`);
			});
		});
	}

	// Apparition en 3D des blocs quand ils entrent à l'écran.
	const reveals = document.querySelectorAll('[data-reveal]');
	if ('IntersectionObserver' in window && !reduceMotion) {
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add('is-in');
						io.unobserve(e.target);
					}
				}),
			{threshold: 0.15, rootMargin: '0px 0px -8% 0px'},
		);
		reveals.forEach((el) => io.observe(el));
	} else reveals.forEach((el) => el.classList.add('is-in'));

	// Carrousel 3D des résultats clients.
	const flow = document.querySelector('[data-coverflow]');
	if (flow) {
		const slides = [...flow.querySelectorAll('[data-slide]')];
		const dots = flow.querySelector('[data-dots]');
		const n = slides.length;
		let active = Number(flow.dataset.start ?? Math.floor(n / 2));
		const dotButtons = slides.map((slide, i) => {
			const b = document.createElement('button');
			b.type = 'button';
			b.setAttribute('aria-label', slide.getAttribute('aria-label'));
			b.addEventListener('click', () => go(i));
			dots.appendChild(b);
			return b;
		});
		const narrow = () => window.innerWidth < 600;
		const layout = () => {
			slides.forEach((slide, i) => {
				let d = i - active;
				if (d > n / 2) d -= n;
				if (d < -n / 2) d += n;
				const abs = Math.abs(d);
				const spread = narrow() ? 58 : 78;
				slide.style.transform = `translateX(${d * spread}%) translateZ(${-abs * 260}px) rotateY(${-d * 38}deg)`;
				slide.style.zIndex = String(10 - abs);
				slide.style.opacity = abs > 1 ? '0' : '1';
				slide.classList.toggle('is-active', d === 0);
				slide.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
				dotButtons[i].setAttribute('aria-current', d === 0 ? 'true' : 'false');
			});
		};
		const go = (i) => {
			active = (i + n) % n;
			layout();
			track('proof_view', {proof_index: active});
		};
		slides.forEach((slide, i) => slide.addEventListener('click', () => i !== active && go(i)));
		flow.querySelector('[data-prev]').addEventListener('click', () => go(active - 1));
		flow.querySelector('[data-next]').addEventListener('click', () => go(active + 1));
		flow.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') go(active - 1);
			if (e.key === 'ArrowRight') go(active + 1);
		});
		// Balayage au doigt.
		let startX = null;
		const stage = flow.querySelector('.coverflow__stage');
		stage.addEventListener('pointerdown', (e) => (startX = e.clientX));
		stage.addEventListener('pointerup', (e) => {
			if (startX === null) return;
			const dx = e.clientX - startX;
			if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
			startX = null;
		});
		window.addEventListener('resize', layout);
		layout();
	}

	// Onglets des services, avec rotation 3D entre les panneaux.
	const tabsEl = document.querySelector('[data-tabs]');
	if (tabsEl) {
		const tabs = [...tabsEl.querySelectorAll('[role="tab"]')];
		const stage = tabsEl.querySelector('.tabs__stage');
		const indicator = tabsEl.querySelector('.tabs__indicator');
		let current = 0;
		const moveIndicator = () => {
			const t = tabs[current];
			indicator.style.width = `${t.offsetWidth}px`;
			indicator.style.transform = `translateX(${t.offsetLeft}px)`;
		};
		const select = (i, focus = false) => {
			if (i === current) return;
			const prevPanel = document.getElementById(tabs[current].getAttribute('aria-controls'));
			const nextPanel = document.getElementById(tabs[i].getAttribute('aria-controls'));
			stage.dataset.dir = i > current ? 'next' : 'prev';
			tabs[current].setAttribute('aria-selected', 'false');
			tabs[current].tabIndex = -1;
			tabs[i].setAttribute('aria-selected', 'true');
			tabs[i].tabIndex = 0;
			if (focus) tabs[i].focus();
			current = i;
			moveIndicator();
			track('service_tab', {service: tabs[i].id.replace('tab-', '')});
			const show = () => {
				prevPanel.hidden = true;
				prevPanel.classList.remove('is-leaving', 'is-active');
				nextPanel.hidden = false;
				nextPanel.classList.add('is-active', 'is-entering');
				nextPanel.addEventListener('animationend', () => nextPanel.classList.remove('is-entering'), {once: true});
			};
			if (reduceMotion) show();
			else {
				prevPanel.classList.add('is-leaving');
				prevPanel.addEventListener('animationend', show, {once: true});
			}
		};
		tabs.forEach((t, i) => {
			t.addEventListener('click', () => select(i));
			t.addEventListener('keydown', (e) => {
				if (e.key === 'ArrowRight') select((current + 1) % tabs.length, true);
				if (e.key === 'ArrowLeft') select((current - 1 + tabs.length) % tabs.length, true);
				if (e.key === 'Home') select(0, true);
				if (e.key === 'End') select(tabs.length - 1, true);
			});
		});
		window.addEventListener('resize', moveIndicator);
		document.fonts?.ready.then(moveIndicator);
		moveIndicator();
	}
})();
