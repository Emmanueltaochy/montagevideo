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

	// ───────── Agenda Cal.com (chargé à l'approche de la section) ─────────
	const calEl = document.getElementById('cal-inline');
	const loadCal = () => {
		if (!config.calLink || window.__calLoaded) return;
		window.__calLoaded = true;
		/* eslint-disable */
		(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
		/* eslint-enable */
		const Cal = window.Cal;
		Cal('init', 'appel', {origin: 'https://cal.com'});
		calEl.innerHTML = '';
		Cal.ns.appel('inline', {elementOrSelector: '#cal-inline', calLink: config.calLink, config: {layout: 'month_view', theme: 'dark'}});
		Cal.ns.appel('ui', {theme: 'dark', cssVarsPerTheme: {dark: {'cal-brand': '#CEAD6F'}}, hideEventTypeDetails: false, layout: 'month_view'});

		// Réservation confirmée : la vraie conversion, envoyée à GTM et à Meta.
		let sent = false;
		const onBooked = () => {
			if (sent) return;
			sent = true;
			track('booking_confirmed', {booking_tool: 'cal.com'});
			if (window.fbq) window.fbq('track', 'Schedule');
		};
		Cal.ns.appel('on', {action: 'bookingSuccessfulV2', callback: onBooked});
		Cal.ns.appel('on', {action: 'bookingSuccessful', callback: onBooked});
	};
	if (calEl && config.calLink) {
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(([e]) => {
				if (e.isIntersecting) {
					loadCal();
					io.disconnect();
				}
			}, {rootMargin: '600px'});
			io.observe(calEl);
		} else loadCal();
	}
})();
