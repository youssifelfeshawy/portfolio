/* Youssef Wael Elfeshawy — 3D portfolio.
   Scrolling flies the camera from the server rack to the laptop screen (four pages), then down onto the keyboard (contact keys). */
(() => {
  'use strict';
  window.createImageBitmap = undefined;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  const $ = id => document.getElementById(id);
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  /* ---------------- Content (from the CV) ---------------- */
  const C = {
    name: 'Youssef Wael Elfeshawy', role: 'Network & Cybersecurity Engineer',
    phone: '+201141259125', phone2: '+201212442281', email: 'youssifelfeshawy@gmail.com',
    linkedin: 'https://www.linkedin.com/in/youssifelfeshawy', place: 'Alexandria, Egypt',
    map: 'https://www.google.com/maps/search/?api=1&query=Alexandria+Egypt',
    cv: 'assets/Youssif-Elfeshawy-CV.pdf', docs: 'network.html'
  };
  const ALL = [C.name, C.role, C.phone, C.phone2, C.email, C.linkedin, C.place].join('\n');
  const ABOUT = 'Cybersecurity professional with strong hands-on project experience in network engineering, security infrastructure, and cloud technologies gained throughout 4 years of dedicated academic and personal projects. Holds CompTIA A+ and CCNA certifications. Demonstrated ability to design and secure complex network environments through building a comprehensive Zero Trust Architecture simulation featuring ML-based threat detection, Suricata IDS, and Splunk SIEM integration. Proficient in Python, Java, Linux, Docker, and network protocols, with a focus on network security, cloud infrastructure, and identity management.';
  const CARDS = [
    { k: 'EDUCATION', t: 'Alexandria University', d: 'Faculty of Computing and Data Science – Cybersecurity · CGPA 3.76' },
    { k: 'CERTIFICATIONS', t: 'CompTIA A+ and CCNA', d: 'IT fundamentals and Cisco networking' },
    { k: 'FOCUS', t: 'Security and cloud', d: 'Network security, cloud infrastructure, and identity management' },
    { k: 'TOOLKIT', t: 'Python, Java, Linux', d: 'Docker, Splunk, and network analysis' }
  ];
  const PROJECTS = [
    { y: '2025', tag: 'NETWORK SECURITY · MACHINE LEARNING', t: 'Zero Trust Architecture Simulation', d: 'Designed a virtualised enterprise network with isolated subnets routed through a central Gateway, enforcing department-level VLAN segmentation and Zero Trust policies. Integrated ML-based real-time traffic classification, Keycloak OIDC/OAuth2 identity management, Suricata IDS, and Splunk SIEM for end-to-end threat detection and monitoring.' },
    { y: '2024', tag: 'CLOUD COMPUTING', t: 'Dockerized Application with Database', d: 'A web application using Docker that includes a web server container and a database container.' },
    { y: '2023', tag: 'SYSTEMS PROGRAMMING · TCP/IP', t: 'Client-Server Expression Evaluator', d: 'Built a client-server app over TCP/IP sockets where clients send arithmetic expressions across the network and the server computes and returns the result in real time.' },
    { y: '2022', tag: 'SYSTEMS PROGRAMMING', t: 'Hospital System', d: 'A scalable Java program to manage a hospital system using a database and user interface (JavaFX).' }
  ];
  const NAV = ['Journey', 'Qualifications', 'Documentation', 'Projects'];
  const loadImg = src => { const i = new Image(); i.onload = () => (dirtyScreen = true); i.src = src; return i; };
  const ccna = loadImg('assets/cisco-ccna.png'), comptia = loadImg('assets/comptia-a-plus.png');
  const TIMELINE = [
    { when: '2022', t: 'Egyptian American School', d: 'American Diploma, graduated with CGPA 4' },
    { when: '2022 – 2026', t: 'Alexandria University', d: 'Faculty of Computing and Data Science – Cybersecurity, CGPA 3.76' },
    // { when: '2022', t: 'Hospital System', d: 'Scalable Java program with a database and a JavaFX interface' },
    // { when: '2023', t: 'Client-Server Expression Evaluator', d: 'TCP/IP socket app that computes arithmetic expressions in real time' },
    // { when: '2024', t: 'Dockerized Application', d: 'Web server and database containers using Docker' },
    { when: 'CERTIFICATION', t: 'CompTIA A+', d: 'IT fundamentals', img: comptia },
    { when: 'CERTIFICATION', t: 'Cisco CCNA', d: 'Routing and switching', img: ccna },
    // { when: '2025', t: 'Zero Trust Architecture Simulation', d: 'Suricata IDS, Splunk SIEM, Keycloak and ML traffic classification' },
    // { when: '2026', t: 'Expected graduation', d: 'Alexandria University, Cybersecurity' }
  ];

  /* ---------------- Small helpers ---------------- */
  let toastTimer;
  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }
  let audio = null, soundOn = true;
  function tick(p = 1) {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
      o.type = 'triangle'; o.frequency.setValueAtTime(620 * p, t); o.frequency.exponentialRampToValueAtTime(80, t + .04);
      g.gain.setValueAtTime(.08, t); g.gain.exponentialRampToValueAtTime(.001, t + .04);
      o.connect(g); g.connect(audio.destination); o.start(); o.stop(t + .05);
    } catch (e) { /* audio blocked */ }
  }
  const copy = (text, label) => (navigator.clipboard && navigator.clipboard.writeText(text).then(() => toast('Copied ' + label), () => toast(text))) || toast(text);
  const go = url => (/^https?:/.test(url) ? window.open(url, '_blank', 'noopener') : (location.href = url));
  function download() {
    const a = document.createElement('a'); a.href = C.cv; a.download = 'Youssef-Elfeshawy-CV.pdf';
    document.body.appendChild(a); a.click(); a.remove();
  }
  let flight = null;
  function scrollToY(y, dur = 1.2) {
    if (flight) flight.kill();
    const o = { y: scrollY };
    flight = gsap.to(o, { y, duration: dur, ease: 'power2.inOut', onUpdate: () => scrollTo(0, o.y) });
  }
  const stopTop = i => document.querySelectorAll('.stop')[i].getBoundingClientRect().top + scrollY;
  const glide = where => scrollToY(where === 'hero' ? 0 : where === 'kb' ? document.documentElement.scrollHeight - innerHeight : stopTop(where));
  const bar = $('loader-bar');
  const hideLoader = () => { bar.style.width = '100%'; setTimeout(() => $('loader').classList.add('done'), 250); };

  /* ---------------- Laptop screen (2D canvas used as the 3D screen texture) ---------------- */
  const W = 2048, H = 1408, M = 150;
  const HEAD_FONT = '"Michroma",system-ui,sans-serif';
  const SANS = '"Geist","Inter",system-ui,sans-serif';
  const MONO = '"JetBrains Mono",ui-monospace,monospace';
  const sc = document.createElement('canvas'); sc.width = W; sc.height = H;
  const g = sc.getContext('2d');
  let tab = 0, tlX = 0, tlMax = 0, hits = [], hoverId = null, dirtyScreen = true, screenTex = null;

  function txt(s, x, y, size, color, o = {}) {
    g.font = `${o.w || 400} ${size}px ${o.font || SANS}`; g.fillStyle = color;
    if (o.ls && 'letterSpacing' in g) g.letterSpacing = o.ls;
    else if ('letterSpacing' in g) g.letterSpacing = '0px';
    g.textAlign = o.align || 'left'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y);
  }
  function wrap(s, x, y, maxW, size, lh, color, w = 400) {
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    g.font = `${w} ${size}px ${SANS}`; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    let line = '';
    for (const word of s.split(' ')) {
      const t = line + word + ' ';
      if (g.measureText(t).width > maxW && line) { g.fillText(line.trimEnd(), x, y); line = word + ' '; y += lh; } else line = t;
    }
    g.fillText(line.trimEnd(), x, y);
    return y + lh;
  }
  function box(x, y, w, h, r, fill, stroke) {
    g.beginPath(); g.roundRect(x, y, w, h, r);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.5; g.stroke(); }
  }
  function button(id, label, x, y, w, h, primary) {
    const hv = hoverId === id;
    box(x, y, w, h, 12, primary ? (hv ? '#e0e0e0' : '#ffffff') : (hv ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.03)'), primary ? (hv ? '#ffffff' : '#ffffff') : (hv ? '#ffffff' : '#2a2a2a'));
    txt(label, x + w / 2, y + h / 2 + 7, 18, primary ? '#000000' : (hv ? '#ffffff' : '#8a8a8a'), { w: 400, font: HEAD_FONT, align: 'center', ls: '0.08em' });
    hits.push({ id, x, y, w, h });
  }
  const head = (eyebrow, title) => {
    if (eyebrow) txt(eyebrow.toUpperCase(), M, 250, 16, '#555555', { w: 400, font: HEAD_FONT, ls: '0.16em' });
    txt(title.toUpperCase(), M, 332, 54, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });
  };

  function pageJourney() {
    head('', 'Journey');
    wrap(ABOUT, M, 440, 1560, 29, 48, '#8a8a8a');
  }
  function pageQualifications() {
    head('', 'QUALIFICATIONS');
    const y0 = 720, step = 800, cardW = 420;

    // 1. Set how many empty steps you want at the start (e.g., 1 or 2)
    const emptySteps = 0.4; 

    // 2. Add emptySteps to tlMax so the scrollbar accounts for the extra space:
    tlMax = Math.max(0, (TIMELINE.length - 1 + emptySteps) * step + cardW - (W - 2 * M));

    g.fillStyle = '#2a2a2a'; g.fillRect(0, y0, W, 2);

    TIMELINE.forEach((t, i) => {
      // 3. Shift every item to the right by emptySteps:
      const x = M + (i + emptySteps) * step - tlX;

      if (x < -step || x > W) return;
      if (t.img && t.img.naturalWidth) g.drawImage(t.img, x, y0 - 190, 140, 140);
      g.beginPath(); g.arc(x + 8, y0 + 1, 9, 0, Math.PI * 2); g.fillStyle = '#ffffff'; g.fill();
      txt(t.when.toUpperCase(), x, y0 + 72, 17, '#8a8a8a', { w: 400, font: HEAD_FONT, ls: '0.1em' });
      const yy = wrap(t.t, x, y0 + 120, cardW, 28, 38, '#f2f2f2', 600);
      wrap(t.d, x, yy + 14, cardW, 22, 34, '#8a8a8a');
    });

    for (const [x0, x1, a, b] of [[0, 140, '#000000', 'rgba(0,0,0,0)'], [W - 140, W, 'rgba(0,0,0,0)', '#000000']]) {
      const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, a); gr.addColorStop(1, b);
      g.fillStyle = gr; g.fillRect(x0, 142, x1 - x0, H - 142);
    }
    const tw = W - 2 * M, thumb = tw * .22;
    box(M, 1310, tw, 4, 2, '#1a1a1a');
    box(M + (tlMax ? tlX / tlMax : 0) * (tw - thumb), 1310, thumb, 4, 2, '#ffffff');
    txt(tlX < tlMax - 4 ? 'KEEP SCROLLING TO MOVE ALONG THE TIMELINE  →' : 'END OF THE TIMELINE — SCROLL ON  ↓', M, 1270, 15, '#555555', { font: HEAD_FONT, ls: '0.12em' });
  }

  function pageDocumentation() {
    head('', 'DOCUMENTATION');
    const y = 400, h = 250, w = W - 2 * M;
    const hv = hoverId === 'docs';

    box(
      M, y, w, h, 20,
      hv ? 'rgba(20,20,20,.95)' : 'rgba(12,12,12,.85)',
      hv ? '#ffffff' : '#2a2a2a'
    );
    hits.push({ id: 'docs', x: M, y, w, h });

    txt('NETWORK', M + 54, y + 115, 50, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });
    wrap('A structured, comprehensive networking engineering reference guide.', M + 54, y + 175, w - 240, 26, 40, '#8a8a8a');

    const cx = M + w - 90, cy = y + h / 2, radius = 40;
    g.beginPath();
    g.arc(cx, cy, radius, 0, Math.PI * 2);
    g.fillStyle = hv ? '#ffffff' : 'rgba(255,255,255,.05)';
    g.fill();
    g.strokeStyle = hv ? '#ffffff' : '#2a2a2a';
    g.lineWidth = 1.5;
    g.stroke();

    txt('→', cx, cy + 9, 32, hv ? '#000000' : '#8a8a8a', { font: MONO, align: 'center', w: 600 });
  }

  function pageProjects() {
    head('', 'PROJECTS');
    const gap = 28, cw = (W - 2 * M - gap) / 2, ch = 372;
    PROJECTS.forEach((p, i) => {
      const x = M + (i % 2) * (cw + gap), y = 410 + Math.floor(i / 2) * (ch + gap);
      box(x, y, cw, ch, 18, 'rgba(12,12,12,.85)', '#2a2a2a');
      txt(p.tag.toUpperCase(), x + 34, y + 54, 13, '#555555', { w: 400, font: HEAD_FONT, ls: '0.14em' });
      txt(p.y, x + cw - 34, y + 54, 15, '#8a8a8a', { w: 400, font: HEAD_FONT, align: 'right' });
      txt(p.t, x + 34, y + 108, 26, '#f2f2f2', { w: 600, font: SANS });
      wrap(p.d, x + 34, y + 160, cw - 68, 21, 32, '#8a8a8a');
    });
  }
  function getMobileMetrics() {
    const asp = innerWidth / innerHeight;
    const isMobile = asp < 0.85;
    if (!isMobile) return null;
    const s = screenMesh ? new THREE.Box3().setFromObject(screenMesh) : null;
    const meshW = s ? (s.max.x - s.min.x) : 0.3207;
    const meshH = s ? (s.max.y - s.min.y) : 0.2203;
    const visFracY = 0.94;
    const visFracX = (meshH * 0.94 * asp) / meshW;
    const mobW = Math.round(W * visFracX);
    const mobH = Math.round(H * visFracY);
    const x0 = Math.round((W - mobW) / 2);
    const y0 = Math.round((H - mobH) / 2);
    return { isMobile, mobW, mobH, x0, y0, x1: x0 + mobW, y1: y0 + mobH };
  }

  function drawMobileScreen(m) {
    const { mobW, mobH, x0, y0 } = m;
    const mx = x0 + 18, mw = mobW - 36;

    // Mobile top tab bar
    const tabY = y0 + 34, tabH = 46;
    const tabLabels = ['JOURNEY', 'QUALS', 'DOCS', 'PROJECTS'];
    const tabW = Math.floor((mw - 3 * 8) / 4);
    tabLabels.forEach((label, i) => {
      const tx = mx + i * (tabW + 8);
      const id = 'tab' + i;
      const isAct = tab === i;
      const isHov = hoverId === id;
      box(tx, tabY, tabW, tabH, 10, isAct ? '#ffffff' : isHov ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.03)', isAct ? '#ffffff' : isHov ? '#ffffff' : '#2a2a2a');
      txt(label, tx + tabW / 2, tabY + 28, 12, isAct ? '#000000' : isHov ? '#ffffff' : '#8a8a8a', { w: 400, font: HEAD_FONT, align: 'center', ls: '0.06em' });
      hits.push({ id, x: tx, y: tabY, w: tabW, h: tabH });
    });

    const contentY0 = tabY + tabH + 24;

    if (tab === 0) {
      txt('JOURNEY', mx, contentY0 + 64, 34, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });
      wrap(ABOUT, mx, contentY0 + 118, mw, 21, 34, '#8a8a8a', 400);
    } else if (tab === 1) {
      txt('QUALIFICATIONS', mx, contentY0 + 64, 30, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

      const cardW = mw, step = mw + 30;
      tlMax = Math.max(0, (TIMELINE.length - 1) * step);
      const yMid = contentY0 + 440;
      g.fillStyle = '#2a2a2a'; g.fillRect(mx, yMid, mw, 2);

      TIMELINE.forEach((t, i) => {
        const x = mx + i * step - tlX;
        if (x < mx - step || x > mx + mw + step) return;

        const cY = yMid - 310;
        box(x, cY, cardW, 260, 16, 'rgba(12,12,12,.9)', '#2a2a2a');

        if (t.img && t.img.naturalWidth) {
          g.drawImage(t.img, x + 24, cY + 24, 76, 76);
          txt(t.when.toUpperCase(), x + 116, cY + 54, 14, '#8a8a8a', { w: 400, font: HEAD_FONT, ls: '0.08em' });
          wrap(t.t, x + 116, cY + 86, cardW - 136, 24, 30, '#f2f2f2', 600);
          wrap(t.d, x + 24, cY + 140, cardW - 48, 19, 27, '#8a8a8a');
        } else {
          txt(t.when.toUpperCase(), x + 24, cY + 54, 15, '#8a8a8a', { w: 400, font: HEAD_FONT, ls: '0.08em' });
          const yy = wrap(t.t, x + 24, cY + 98, cardW - 48, 27, 36, '#f2f2f2', 600);
          wrap(t.d, x + 24, yy + 14, cardW - 48, 20, 29, '#8a8a8a');
        }

        g.beginPath(); g.arc(x + cardW / 2, yMid + 1, 8, 0, Math.PI * 2);
        g.fillStyle = '#ffffff'; g.fill();
      });

      const tw = mw, thumb = Math.max(50, tw * 0.25);
      const barY = y0 + mobH - 70;
      box(mx, barY, tw, 4, 2, '#1a1a1a');
      box(mx + (tlMax ? tlX / tlMax : 0) * (tw - thumb), barY, thumb, 4, 2, '#ffffff');
      txt(tlX < tlMax - 4 ? 'SCROLL TO EXPLORE  →' : 'END OF TIMELINE  ↓', mx, barY - 14, 13, '#555555', { font: HEAD_FONT, ls: '0.12em' });
    } else if (tab === 2) {
      txt('DOCUMENTATION', mx, contentY0 + 64, 30, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

      const dY = contentY0 + 120, dH = 190;
      const hv = hoverId === 'docs';
      box(mx, dY, mw, dH, 18, hv ? 'rgba(20,20,20,.95)' : 'rgba(12,12,12,.85)', hv ? '#ffffff' : '#2a2a2a');
      hits.push({ id: 'docs', x: mx, y: dY, w: mw, h: dH });

      const cx = mx + mw - 54, cy = dY + 65;
      g.beginPath(); g.arc(cx, cy, 24, 0, Math.PI * 2);
      g.fillStyle = hv ? '#ffffff' : 'rgba(255,255,255,.05)';
      g.fill();
      g.strokeStyle = hv ? '#ffffff' : '#2a2a2a'; g.lineWidth = 1.5; g.stroke();
      txt('→', cx, cy + 7, 24, hv ? '#000000' : '#8a8a8a', { font: MONO, align: 'center', w: 600 });

      txt('NETWORK', mx + 28, dY + 76, 38, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });
      wrap('A structured, comprehensive networking engineering reference guide.', mx + 28, dY + 118, mw - 56, 19, 28, '#8a8a8a');
    } else if (tab === 3) {
      txt('PROJECTS', mx, contentY0 + 64, 30, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

      const cardH = 250, cardGap = 16;
      PROJECTS.forEach((p, i) => {
        const py = contentY0 + 100 + i * (cardH + cardGap);
        if (py + cardH > y0 + mobH) return;
        box(mx, py, mw, cardH, 14, 'rgba(12,12,12,.85)', '#2a2a2a');
        txt(p.tag.toUpperCase(), mx + 20, py + 34, 12, '#555555', { w: 400, font: HEAD_FONT, ls: '0.12em' });
        txt(p.y, mx + mw - 20, py + 34, 13, '#8a8a8a', { w: 400, font: HEAD_FONT, align: 'right' });
        txt(p.t, mx + 20, py + 72, 22, '#f2f2f2', { w: 600, font: SANS });
        wrap(p.d, mx + 20, py + 106, mw - 40, 17, 25, '#8a8a8a');
      });
    }
  }

  function drawScreen() {
    hits = [];
    g.fillStyle = '#000000'; g.fillRect(0, 0, W, H);
    const m = getMobileMetrics();
    if (m && m.isMobile) {
      drawMobileScreen(m);
      if (screenTex) screenTex.needsUpdate = true;
      return;
    }
    let x = M;
    NAV.forEach((n, i) => {
      g.font = `400 18px ${HEAD_FONT}`;
      if ('letterSpacing' in g) g.letterSpacing = '0.08em';
      const label = n.toUpperCase();
      const w = g.measureText(label).width + 56, id = 'tab' + i;
      const isAct = tab === i, isHov = hoverId === id;
      box(x, 40, w, 56, 12, isAct ? '#ffffff' : isHov ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.03)', isAct ? '#ffffff' : isHov ? '#ffffff' : '#2a2a2a');
      txt(label, x + w / 2, 75, 17, isAct ? '#000000' : isHov ? '#ffffff' : '#8a8a8a', { w: 400, font: HEAD_FONT, align: 'center', ls: '0.08em' });
      hits.push({ id, x, y: 40, w, h: 56 }); x += w + 16;
    });
    button('cv', 'DOWNLOAD CV  ↓', W - M - 260, 40, 260, 56, true);
    g.save(); g.beginPath(); g.rect(0, 142, W, H - 142); g.clip();
    [pageJourney, pageQualifications, pageDocumentation, pageProjects][tab]();
    g.restore();
    if (screenTex) screenTex.needsUpdate = true;
  }
  function screenAction(id) {
    tick(1.1);
    if (id.startsWith('tab')) glide(+id.slice(3));
    else if (id === 'cv') { download(); toast('Downloading CV…'); }
    else if (id === 'docs') go(C.docs);
  }

  /* ---------------- Keyboard (texture with key highlight; keys located in texture UV space) ---------------- */
  const KW = 1503, KH = 1046;
  const kbc = document.createElement('canvas'); kbc.width = KW; kbc.height = KH;
  const kctx = kbc.getContext('2d'), kbImg = new Image();
  let kHover = null, kDown = null, kbTex = null;
  const key = (u0, v0, u1, v1, run) => ({ u0, v0, u1, v1, run });
  const call = () => { go('tel:' + C.phone); return 'Calling ' + C.phone; };
  const wa = () => { go('https://wa.me/' + C.phone2.replace('+', '')); return 'Opening WhatsApp'; };
  const mail = () => { go('mailto:' + C.email); return 'Opening your mail app'; };
  const li = () => { go(C.linkedin); return 'Opening LinkedIn'; };
  const map = () => { go(C.map); return C.place; };
  const toTab = (n, label) => () => { glide(n); return label; };
  const hero = () => { glide('hero'); return 'Back to the server'; };
  const cv = () => { download(); return 'Downloading CV…'; };
  const cpAll = () => { copy(ALL, 'all contact details'); return null; };
  const cpMail = () => { copy(C.email, 'email'); return null; };
  const KEYS = [
    // function row
    key(.058, .065, .143, .158, hero),
    //  key(.148, .065, .207, .158, call), key(.210, .065, .270, .158, wa),
    // key(.273, .065, .333, .158, mail), key(.336, .065, .396, .158, li), key(.397, .065, .456, .158, map),
    // key(.459, .065, .519, .158, toTab(2, 'Documentation')), key(.521, .065, .579, .158, toTab(0, 'Journey')),
    // key(.582, .065, .642, .158, cv), key(.644, .065, .702, .158, toTab(3, 'Projects')),
    // key(.705, .065, .763, .158, () => { copy(location.href, 'page link'); return null; }), key(.766, .065, .826, .158, cpMail),
    key(.886, .065, .946, .158, () => { soundOn = !soundOn; return soundOn ? 'Key sound on' : 'Key sound off'; }), 
    // key(.886, .065, .946, .158, cpAll),
    // contact keys
    key(.058, .162, .307, .270, call), key(.311, .162, .577, .270, wa), key(.581, .162, .946, .270, mail),
    key(.058, .275, .475, .390, li), key(.479, .275, .856, .390, map), key(.860, .275, .946, .390, hero),
    // bottom row
    key(.058, .397, .130, .499, hero), key(.135, .397, .216, .499, () => { go(C.docs); return 'Opening the network guide'; }),
    key(.220, .397, .304, .499, toTab(0, 'Journey')), key(.309, .397, .597, .499, cpAll), key(.601, .397, .677, .499, mail), key(.680, .397, .753, .499, cpMail)
  ];
  const keyAt = uv => KEYS.find(k => uv.x >= k.u0 && uv.x <= k.u1 && uv.y >= k.v0 && uv.y <= k.v1) || null;
  function paintKeys() {
    if (!kbImg.naturalWidth) return;
    kctx.filter = 'grayscale(100%) brightness(1.15) contrast(1.1)';
    kctx.drawImage(kbImg, 0, 0, KW, KH);
    kctx.filter = 'none';
    const mark = (k, fill, stroke, glow) => {
      kctx.save(); kctx.shadowColor = glow || 'transparent'; kctx.shadowBlur = glow ? 25 : 0;
      kctx.fillStyle = fill; kctx.strokeStyle = stroke; kctx.lineWidth = 5; kctx.beginPath();
      kctx.roundRect(k.u0 * KW, k.v0 * KH, (k.u1 - k.u0) * KW, (k.v1 - k.v0) * KH, 16); kctx.fill(); kctx.stroke(); kctx.restore();
    };
    if (kHover && kHover !== kDown) mark(kHover, 'rgba(255,255,255,.15)', '#ffffff', 'rgba(255,255,255,.3)');
    if (kDown) mark(kDown, 'rgba(255,255,255,.35)', '#ffffff');
    if (kbTex) kbTex.needsUpdate = true;
    needRender = true;
  }
  function pressKey(k) {
    tick(1);
    kDown = k; paintKeys();
    setTimeout(() => { kDown = null; paintKeys(); }, 170);
    const msg = k.run(); if (msg) toast(msg);
  }

  /* ---------------- 3D scene ---------------- */
  let renderer, camera, scene, model = null, screenMesh = null, deckMesh = null, needRender = true;
  const kbMeshes = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const FOV = 30, TAN = Math.tan(FOV * Math.PI / 360);
  const BASE = V(6.4, 3.9, 12.6), T0 = V(0, 1.9, .4);
  const P0 = V(), P1 = V(), T1 = V(), P2 = V(), T2 = V(), pos = V(), tgt = V();
  const state = { a: 0, q: 0 };   // a: rack -> screen, q: screen -> keyboard

  function layoutCamera() {
    const asp = innerWidth / innerHeight;
    const isMobile = asp < 0.85;
    P0.copy(T0).add(BASE.clone().sub(T0).multiplyScalar(asp < 1 ? 1.5 : 1));
    if (!screenMesh) return;
    const s = new THREE.Box3().setFromObject(screenMesh), sc3 = s.getCenter(V());
    const meshH = s.max.y - s.min.y;
    // On mobile view: go in the laptop more so all the screen is black after entering the laptop
    const dS = isMobile
      ? (meshH * 0.94) / (2 * TAN)
      : Math.max(meshH / (2 * TAN), (s.max.x - s.min.x) / (2 * TAN * asp)) * 1.06;
    T1.copy(sc3); P1.set(sc3.x, sc3.y, s.max.z + dS);

    const k = new THREE.Box3().setFromObject(deckMesh || kbMeshes[0]), kc = k.getCenter(V());
    const meshKW = k.max.x - k.min.x;
    // On mobile view: zoom in more on the keys than the normal web view (keys fill mobile width edge-to-edge)
    const dK = isMobile
      ? (meshKW * 0.98) / (2 * TAN * asp)
      : Math.max(meshKW * 1.15 / (2 * TAN * asp), (k.max.z - k.min.z) * 1.7 / (2 * TAN), 1.8 * (asp < 1 ? 1.35 : 1));
    T2.copy(kc);
    P2.set(kc.x, kc.y + dK * 0.85, kc.z + dK * 0.53);
  }
  function renderFrame() {
    const e = state.a, q = state.q, vw = innerWidth, vh = innerHeight, port = vw < vh;
    pos.copy(P0).lerp(P1, e).lerp(P2, q); tgt.copy(T0).lerp(T1, e).lerp(T2, q);
    if (q > 0) pos.z += Math.sin(q * Math.PI) * 0.25;
    camera.up.set(0, 1, 0); camera.position.copy(pos); camera.lookAt(tgt);
    // keep the server on the right (and vertically centred) in the hero, then centre it as we fly in; on mobile raise server up
    camera.setViewOffset(vw, vh, port ? 0 : -vw * .2 * (1 - e), port ? -vh * .06 * (1 - e) : 0, vw, vh);
    renderer.render(scene, camera);
  }
  function fail() { document.body.classList.add('no-webgl'); hideLoader(); }

  function initScene() {
    const canvas = $('webgl-canvas');
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { return fail(); }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x000000, .03);
    camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, .05, 120);
    const grid = new THREE.GridHelper(60, 60, 0x222222, 0x0f0f0f); grid.position.y = -1.02; scene.add(grid);

    // soft studio reflections for the metal, plus key / rim lights
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.BackSide })));
    [[8, 8, 10, 0xffffff], [-10, 4, 6, 0xffffff], [0, 12, -8, 0xffffff]].forEach(([x, y, z, c]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
      m.material.color.set(c).multiplyScalar(5); m.position.set(x, y, z); m.lookAt(0, 2, 0); env.add(m);
    });
    try {
      scene.environment = new THREE.PMREMGenerator(renderer).fromScene(env, .04).texture;
    } catch (e) {
      console.warn('PMREM skipped', e);
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0x151515, .8));
    const key1 = new THREE.DirectionalLight(0xffffff, 1.6); key1.position.set(5, 8, 9); scene.add(key1);
    const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(-6, 3, -4); scene.add(rim);

    const aniso = renderer.capabilities.getMaxAnisotropy();
    screenTex = new THREE.CanvasTexture(sc); kbTex = new THREE.CanvasTexture(kbc);
    [screenTex, kbTex].forEach(t => { t.flipY = false; t.encoding = THREE.sRGBEncoding; t.anisotropy = aniso; });
    drawScreen(); paintKeys();

    const loader = new THREE.GLTFLoader();
    loader.load("assets/models/Server.glb", gltf => {
      model = gltf.scene;
      model.traverse(o => {
        if (!o.isMesh || !o.material) return;
        const m = o.material;
        if (m.name === 'ScreenMaterial') {
          screenMesh = o; o.material = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, fog: false });
        } else if (m.name === 'KeyboardMaterial') {
          kbMeshes.push(o); if (o.geometry.attributes.position.count === 4) deckMesh = o;
          o.material = new THREE.MeshBasicMaterial({ map: kbTex, toneMapped: false, fog: false });
        }
      });
      scene.add(model); model.updateMatrixWorld(true);
      layoutCamera(); setupScroll();
      const urlParams = new URLSearchParams(location.search);
      if (urlParams.get('cam') === 'keyboard') {
        state.a = 1; state.q = 1;
        const hc = document.querySelector('.hero-content'); if (hc) hc.style.opacity = '0';
      } else if (urlParams.get('cam') === 'screen') {
        state.a = 1; state.q = 0;
        const hc = document.querySelector('.hero-content'); if (hc) hc.style.opacity = '0';
      }
      if (urlParams.has('tab')) { tab = parseInt(urlParams.get('tab')) || 0; }
      needRender = true; hideLoader();
    }, xhr => { if (xhr.lengthComputable) bar.style.width = (xhr.loaded / xhr.total * 100) + '%'; }, err => { console.warn(err); fail(); });
    layoutCamera();
  }

  /* ---------------- Scroll choreography ---------------- */
  function syncPages() {
    const urlParams = new URLSearchParams(location.search);
    const sy = scrollY, vh = innerHeight, stops = document.querySelectorAll('.stop');
    if (urlParams.has('tab') && sy === 0) {
      tab = parseInt(urlParams.get('tab')) || 0;
      dirtyScreen = true;
      return;
    }
    let t = 0; stops.forEach((s, i) => { if (sy >= stopTop(i) - 2) t = i; });
    const long = stops[1], p = clamp((sy - stopTop(1)) / (long.offsetHeight - vh), 0, 1), x = p * tlMax;
    if (t !== tab || (t === 1 && Math.abs(x - tlX) > .5)) { tab = t; tlX = x; dirtyScreen = true; }
  }

  function setupScroll() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-content', { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 45%', scrub: true } });
    // 1 unit = 100vh: fly to the screen (1), stay on the screen for 4 pages (1+3+1+1), tilt down to the keyboard (1)
    gsap.timeline({ scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true }, onUpdate: () => (needRender = true) })
      .to(state, { a: 1, duration: 1, ease: 'power2.inOut' })
      .to(state, { duration: 6 })
      .to(state, { q: 1, duration: 1, ease: 'power2.inOut' });
    addEventListener('scroll', syncPages, { passive: true }); syncPages();
  }

  /* ---------------- Pointer: hero click, screen buttons, keyboard keys ---------------- */
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  function pick(e) {
    if (!renderer || !model) return null;
    mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(mouse, camera);
    if (state.a < .5) return ray.intersectObject(model, true).length ? { hero: true } : null;
    if (state.a > .97 && state.q < .03) { const h = ray.intersectObject(screenMesh)[0]; if (h) { const x = h.uv.x * W, y = h.uv.y * H; const b = hits.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); return { id: b ? b.id : null }; } }
    if (state.q > .97) { const h = ray.intersectObjects(kbMeshes)[0]; if (h && h.uv) return { key: keyAt(h.uv) }; }
    return null;
  }
  addEventListener('pointermove', e => {
    const p = pick(e); let id = null, k = null, hot = false;
    if (p) { if (p.hero) hot = true; if (p.id) { id = p.id; hot = true; } if (p.key) { k = p.key; hot = true; } }
    if (id !== hoverId) { hoverId = id; dirtyScreen = true; }
    if (k !== kHover) { kHover = k; paintKeys(); }
    document.body.style.cursor = hot ? 'pointer' : '';
  });
  addEventListener('click', e => {
    const p = pick(e); if (!p) return;
    if (p.hero) { tick(1.2); glide(0); } else if (p.id) screenAction(p.id); else if (p.key) pressKey(p.key);
  });
  addEventListener('resize', () => {
    if (!renderer) return;
    renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; layoutCamera();
    if (window.ScrollTrigger) ScrollTrigger.refresh(); dirtyScreen = true; needRender = true;
  });

  /* ---------------- Start ---------------- */
  kbImg.onload = paintKeys; kbImg.src = 'assets/console-keyboard.jpg';
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => (dirtyScreen = true));
  (function loop() {
    requestAnimationFrame(loop);
    if (dirtyScreen) { drawScreen(); dirtyScreen = false; needRender = true; }
    if (needRender && renderer && camera) { needRender = false; renderFrame(); }
  })();
  if (typeof THREE === 'undefined' || !THREE.GLTFLoader || typeof gsap === 'undefined') fail(); else initScene();
})();
