/* Youssef Wael Elfeshawy — 3D portfolio.
   Scrolling flies the camera from the server rack to the laptop screen (four pages), then down onto the keyboard (contact keys). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(() => {
  'use strict';
  window.createImageBitmap = undefined;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  const $ = id => document.getElementById(id);
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  /* ---------------- Responsive settings ---------------- */
  const COMPACT_BELOW = 1.25;              // window shape (width ÷ height) below this = phone / portrait-tablet layout
  const ROTATE_KEYBOARD_ON_PHONE = true;   // portrait phones: turn the final keyboard view 90° so the keys use the full screen height
  const CROP_FY = .94;                     // phone: camera shows 94% of the laptop display height
  const PHONE_TEXT = 560;                  // phone: design width that maps to 1 CSS-pixel-per-design-pixel scale (smaller = bigger text)
  const FONTS = ['400 20px "Michroma"', '400 16px "Geist"', '600 16px "Geist"', '400 16px "JetBrains Mono"'];

  /* ---------------- Content (from the CV) ---------------- */
  const C = {
    name: 'Youssef Wael Elfeshawy', role: 'Cybersecurity & Network Engineer',
    phone: '+201141259125', phone2: '+201212442281', email: 'youssifelfeshawy@gmail.com',
    linkedin: 'https://www.linkedin.com/in/youssifelfeshawy', place: 'Alexandria, Egypt',
    map: 'https://www.google.com/maps/search/?api=1&query=Alexandria+Egypt',
    cv: 'assets/Youssef_Elfeshawy_CV.pdf', docs: 'network.html', github: 'https://github.com/youssifelfeshawy'
  };
  const ALL = [C.name, C.role, C.phone, C.phone2, C.email, C.linkedin, C.place].join('\n');
  const ABOUT = 'Cybersecurity and Network Engineering graduate from Alexandria University with a solid understanding of network security, system administration, cloud computing, and secure infrastructure design. Through academic and personal projects, I have gained practical experience in network traffic analysis, Zero Trust Architecture, machine learning-based threat detection, and SIEM monitoring. My technical skills include Python, Linux, Docker, and network troubleshooting. I enjoy working on technical challenges, learning new technologies, and finding practical ways to improve network security and system reliability.';
  const PROJECTS = [
    { y: '2025', tag: 'NETWORK SECURITY · MACHINE LEARNING', t: 'Zero Trust Architecture Simulation', d: 'Designed a virtualised enterprise network with isolated subnets routed through a central Gateway, enforcing department-level VLAN segmentation and Zero Trust policies. Integrated ML-based real-time traffic classification, Keycloak OIDC/OAuth2 identity management, Suricata IDS, and Splunk SIEM for end-to-end threat detection and monitoring.' },
    { y: '2024', tag: 'CLOUD COMPUTING', t: 'Dockerized Application with Database', d: 'A web application using Docker that includes a web server container and a database container.' },
    { y: '2023', tag: 'SYSTEMS PROGRAMMING · TCP/IP', t: 'Client-Server Expression Evaluator', d: 'Built a client-server app over TCP/IP sockets where clients send arithmetic expressions across the network and the server computes and returns the result in real time.' },
    { y: '2022', tag: 'SYSTEMS PROGRAMMING', t: 'Hospital System', d: 'A scalable Java program to manage a hospital system using a database and user interface (JavaFX).' }
  ];
  const network_doc = [
    {
      id: 'network',
      t: 'NETWORK',
      d: 'A structured, comprehensive networking engineering reference guide.',
      url: C.docs
    }
  ];
  const NAV = ['AboutMe', 'Qualifications', 'Documentations', 'Projects'];
  const loadImg = src => { const i = new Image(); i.onload = () => (dirtyScreen = true); i.src = src; return i; };
  const school_cert = loadImg('assets/images/school_cert.jpg'),
        college_cert = loadImg('assets/images/college_cert.jpg'),
        cyber5w_cert = loadImg('assets/images/digital_cyber5w_cert.jpg'),
        elab_cert = loadImg('assets/images/elab_cert.jpg'),
        iti_cert = loadImg('assets/images/iti_cert.jpg'),
        huawei_cert = loadImg('assets/images/huawei_ict_cert.png'),
        ethydco_cert = loadImg('assets/images/ethydco_cert.jpg'),
        comptia = loadImg('assets/images/A+_cert.png'),
        ccna = loadImg('assets/images/ccna_cert.png');
  const TIMELINE = [
    {
      when: '2022',
      t: 'Egyptian American School',
      d: 'American Diploma, graduated with CGPA 4',
      img: school_cert,
      imgW: 300,
      imgH: 215,
      mobW: 90,
      mobH: 125,
      bg: 'transparent',
      radius: 0,
    },
    {
      when: '2022 – 2026',
      t: 'Alexandria University',
      d: 'Faculty of Computing and Data Science – Cybersecurity, CGPA 3.76',
      img: college_cert,
      imgW: 245,
      imgH: 330,
      mobW: 92,
      mobH: 125,
      bg: 'transparent',
      radius: 0,
    },
    {
      when: 'March, 2025',
      t: 'Cyber 5W',
      d: 'Introduction to Digital Forensics',
      img: cyber5w_cert,
      imgW: 300,
      imgH: 212,
      mobW: 110,
      mobH: 78,
      bg: 'transparent',
      radius: 4,
    },
    {
      when: 'July, 2025',
      t: 'ELAB',
      d: 'Summer Training — Egyptian Linear Alkyl Benzene',
      img: elab_cert,
      imgW: 300,
      imgH: 206,
      mobW: 110,
      mobH: 76,
      bg: 'transparent',
      radius: 4,
    },
    {
      when: 'August, 2025',
      t: 'Information Technology Institute (ITI)',
      d: 'Cyber Security Training (90 hrs)',
      img: iti_cert,
      imgW: 238,
      imgH: 330,
      mobW: 90,
      mobH: 125,
      bg: 'transparent',
      radius: 0,
    },
    {
      when: 'August, 2025',
      t: 'Huawei ICT Academy',
      d: 'HCCDA – Tech Essentials Course',
      img: huawei_cert,
      imgW: 233,
      imgH: 330,
      mobW: 90,
      mobH: 125,
      bg: 'transparent',
      radius: 0,
    },
    {
      when: 'Summer, 2025',
      t: 'ETHYDCO',
      d: 'Summer Training (80 Hours) — Egyptian Ethylene & Derivatives',
      img: ethydco_cert,
      imgW: 300,
      imgH: 217,
      mobW: 110,
      mobH: 80,
      bg: 'transparent',
      radius: 4,
    },
    {
      when: 'May, 2026',
      t: 'CompTIA A+',
      d: 'IT fundamentals',
      img: comptia,
      imgW: 210,
      imgH: 210,
      mobW: 90,
      mobH: 90,
      bg: 'transparent',
      radius: 12
    },
    {
      when: '2026',
      t: 'Cisco CCNA',
      d: 'Routing and switching',
      img: ccna,
      imgW: 210,
      imgH: 210,
      mobW: 90,
      mobH: 90,
      bg: '#ffffff',
      radius: 10
    }
  ];

  /* ---------------- Small helpers ---------------- */
  let toastTimer;
  function toast(msg) {
    const t = $('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
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
  const stopTop = i => {
    const stops = document.querySelectorAll('.stop');
    return stops[i] ? stops[i].getBoundingClientRect().top + scrollY : 0;
  };
  const glide = where => scrollToY(where === 'hero' ? 0 : where === 'kb' ? document.documentElement.scrollHeight - innerHeight : stopTop(where));
  const bar = $('loader-bar');
  const hideLoader = () => { if (bar) bar.style.width = '100%'; const l = $('loader'); if (l) setTimeout(() => l.classList.add('done'), 250); };

  /* ---------------- Laptop screen (2D canvas used as the 3D screen texture) ---------------- */
  const W = 2048, H = 1408, M = 150;
  const HEAD_FONT = '"Michroma",system-ui,sans-serif';
  const SANS = '"Geist","Inter",system-ui,sans-serif';
  const MONO = '"JetBrains Mono",ui-monospace,monospace';
  const sc = document.createElement('canvas'); sc.width = W; sc.height = H;
  const g = sc.getContext('2d');
  // Two layouts share one canvas: the laptop layout (2048×1408 design space) and the phone layout, whose design space is
  // exactly the part of the laptop display the camera shows (so nothing is cropped or stretched on any phone / tablet).
  let compact = false, DW = 560, DH = 1200, K = 1, screenSetup = false;
  const crop = { fx: 1, fy: 1 };
  const screenDim = { w: 1.139, h: .625 };   // the 16:9 display, measured from the model
  let tab = 0, tlX = 0, tlMax = 0, docsY = 0, docsMax = 0, projY = 0, projMax = 0, hits = [], hoverId = null, dirtyScreen = true, screenTex = null, screenMat = null;

  function txt(s, x, y, size, color, o = {}) {
    g.font = `${o.w || 400} ${size}px ${o.font || SANS}`; g.fillStyle = color;
    if (o.ls && 'letterSpacing' in g) g.letterSpacing = o.ls;
    else if ('letterSpacing' in g) g.letterSpacing = '0px';
    g.textAlign = o.align || 'left'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
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

  function renderCardImage(img, x, y, w, h, opts = {}) {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const radius = opts.radius !== undefined ? opts.radius : 10;
    const bg = opts.bg || 'transparent';
    const border = opts.border || null;
    const pad = opts.pad || 0;
    const fit = opts.fit || 'contain';

    if (bg && bg !== 'transparent') {
      g.save();
      g.beginPath();
      g.roundRect(x, y, w, h, radius);
      g.fillStyle = bg;
      g.fill();
      g.restore();
    }

    const availW = Math.max(0, w - pad * 2);
    const availH = Math.max(0, h - pad * 2);
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const boxAspect = availW / availH;

    let drawW, drawH, drawX, drawY;
    if (fit === 'contain') {
      if (imgAspect > boxAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
      }
      drawX = x + pad + (availW - drawW) / 2;
      drawY = y + pad + (availH - drawH) / 2;
    } else {
      drawW = availW;
      drawH = availH;
      drawX = x + pad;
      drawY = y + pad;
    }

    g.save();
    g.beginPath();
    g.roundRect(x, y, w, h, radius);
    g.clip();
    g.drawImage(img, drawX, drawY, drawW, drawH);
    g.restore();

    if (border) {
      g.save();
      g.beginPath();
      g.roundRect(x, y, w, h, radius);
      g.strokeStyle = border;
      g.lineWidth = 1.5;
      g.stroke();
      g.restore();
    }
  }

  const head = (eyebrow, title) => {
    if (eyebrow) txt(eyebrow.toUpperCase(), M, 230, 18, '#666666', { w: 400, font: HEAD_FONT, ls: '0.16em' });
    txt(title.toUpperCase(), M, 290, 64, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });
  };

  function pageAboutMe() {
    head('', 'AboutMe');
    wrap(ABOUT, M, 430, W - 2 * M, 40, 74, '#b0b0b0');
  }

  function pageQualifications() {
    head('', 'QUALIFICATIONS');

    const y0 = 850, step = 840, cardW = 540;
    const emptySteps = 0.35;
    tlMax = Math.max(0, (TIMELINE.length - 1 + emptySteps) * step + cardW - (W - 2 * M));

    g.fillStyle = '#2a2a2a'; g.fillRect(0, y0, W, 2);

    TIMELINE.forEach((t, i) => {
      const x = M + (i + emptySteps) * step - tlX;
      if (x < -step || x > W) return;
      if (t.img && t.img.naturalWidth) {
        const iw = t.imgW || 240, ih = t.imgH || 300;
        const iy = y0 - 32 - ih;
        renderCardImage(t.img, x, iy, iw, ih, {
          bg: t.bg || 'transparent',
          radius: t.radius !== undefined ? t.radius : 10,
          border: t.border || null,
          pad: t.pad || 0,
          fit: 'contain'
        });
      }
      g.beginPath(); g.arc(x + 8, y0 + 1, 10, 0, Math.PI * 2); g.fillStyle = '#ffffff'; g.fill();
      txt(t.when.toUpperCase(), x, y0 + 72, 18, '#8a8a8a', { w: 400, font: HEAD_FONT, ls: '0.1em' });
      const yy = wrap(t.t, x, y0 + 124, cardW, 34, 44, '#f2f2f2', 600);
      wrap(t.d, x, yy + 18, cardW, 26, 38, '#8a8a8a');
    });

    for (const [x0, x1, a, b] of [[0, 140, '#000000', 'rgba(0,0,0,0)'], [W - 140, W, 'rgba(0,0,0,0)', '#000000']]) {
      const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, a); gr.addColorStop(1, b);
      g.fillStyle = gr; g.fillRect(x0, 142, x1 - x0, H - 142);
    }
  }

  function pageDocumentation() {
    head('', 'DOCUMENTATIONS');
    const y = 400, h = 250, w = W - 2 * M;
    const hv = hoverId === 'docs' || hoverId === 'doc-network';

    box(
      M, y, w, h, 20,
      hv ? 'rgba(20,20,20,.95)' : 'rgba(12,12,12,.85)',
      hv ? '#ffffff' : '#2a2a2a'
    );
    hits.push({ id: 'docs', x: M, y, w, h, url: C.docs });

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
      txt(p.tag.toUpperCase(), x + 34, y + 54, 15, '#555555', { w: 400, font: HEAD_FONT, ls: '0.14em' });
      txt(p.y, x + cw - 34, y + 54, 17, '#8a8a8a', { w: 400, font: HEAD_FONT, align: 'right' });
      txt(p.t, x + 34, y + 108, 34, '#f2f2f2', { w: 600, font: SANS });
      wrap(p.d, x + 34, y + 160, cw - 68, 24, 32, '#8a8a8a');
    });
  }

  function getMobileMetrics() {
    return compact ? { isMobile: true, mobW: DW, mobH: DH, x0: 0, y0: 0, x1: DW, y1: DH } : null;
  }

  function drawMobileScreen(m) {
    const { mobW, mobH, x0, y0 } = m;
    const padX = 28;
    const mx = x0 + padX, mw = mobW - 2 * padX;
    const contentY0 = y0 + 105;

    // Canvas drawer toggle button at top-left of the screen
    const bx = mx, by = y0 + 36, bw = 46, bh = 46;
    if (!drawerToggle) {   // (when the page has the HTML menu button, that one is used instead)
      box(bx, by, bw, bh, 10, 'rgba(14, 14, 14, 0.94)', '#2a2a2a');
      g.strokeStyle = '#ffffff'; g.lineWidth = 2.4; g.beginPath();
      g.moveTo(bx + 11, by + 15); g.lineTo(bx + 35, by + 15);
      g.moveTo(bx + 11, by + 23); g.lineTo(bx + 35, by + 23);
      g.moveTo(bx + 11, by + 31); g.lineTo(bx + 35, by + 31);
      g.stroke();
      hits.push({ id: 'screen-drawer-toggle', x: bx, y: by, w: bw, h: bh });
    }

    if (tab === 0) {
      txt('AboutMe', mx, contentY0 + 44, 38, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });
      wrap(ABOUT, mx, contentY0 + 114, mw, 28, 46, '#b0b0b0', 400);
    } else if (tab === 1) {
      txt('QUALIFICATIONS', mx, contentY0 + 44, 36, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

      const clipTop = contentY0 + 64;
      const clipBottom = y0 + mobH - 24;
      const clipH = clipBottom - clipTop;

      const lineX = mx + 16;
      const textX = lineX + 32;
      const textW = mw - 48;

      const itemGap = 60;
      const itemHeights = TIMELINE.map(t => {
        if (t.img && t.img.naturalWidth) {
          const mwImg = t.mobW || 90;
          const mhImg = t.mobH || 90;
          const infoW = textW - mwImg - 16;
          g.font = `600 27px ${SANS}`;
          let tLines = 1, tLine = '';
          for (const w of t.t.split(' ')) {
            const s = tLine + w + ' ';
            if (g.measureText(s).width > infoW && tLine) { tLines++; tLine = w + ' '; }
            else tLine = s;
          }
          const titleH = 56 + (tLines - 1) * 36;
          const descY = Math.max(mhImg + 40, titleH + 18);
          g.font = `400 24px ${SANS}`;
          let dLines = 1, dLine = '';
          for (const w of t.d.split(' ')) {
            const s = dLine + w + ' ';
            if (g.measureText(s).width > textW && dLine) { dLines++; dLine = w + ' '; }
            else dLine = s;
          }
          return descY + dLines * 36;
        } else {
          g.font = `600 28px ${SANS}`;
          let tLines = 1, tLine = '';
          for (const w of t.t.split(' ')) {
            const s = tLine + w + ' ';
            if (g.measureText(s).width > textW && tLine) { tLines++; tLine = w + ' '; }
            else tLine = s;
          }
          const titleH = 58 + (tLines - 1) * 38;
          g.font = `400 24px ${SANS}`;
          let dLines = 1, dLine = '';
          for (const w of t.d.split(' ')) {
            const s = dLine + w + ' ';
            if (g.measureText(s).width > textW && dLine) { dLines++; dLine = w + ' '; }
            else dLine = s;
          }
          return titleH + 18 + dLines * 36;
        }
      });

      const totalH = itemHeights.reduce((a, b) => a + b, 0) + (TIMELINE.length - 1) * itemGap;
      tlMax = Math.max(0, totalH - clipH + 30);

      g.save();
      g.beginPath();
      g.rect(x0, clipTop, mobW, clipH);
      g.clip();

      g.fillStyle = '#2a2a2a';
      g.fillRect(lineX - 1, clipTop, 2, clipH);

      let curY = clipTop + 16 - tlX;
      TIMELINE.forEach((t, i) => {
        const ih = itemHeights[i];
        if (curY + ih >= clipTop - 40 && curY <= clipBottom + 40) {
          g.beginPath();
          g.arc(lineX, curY + 24, 8, 0, Math.PI * 2);
          g.fillStyle = '#ffffff';
          g.fill();

          if (t.img && t.img.naturalWidth) {
            const mwImg = t.mobW || 90;
            const mhImg = t.mobH || 90;
            renderCardImage(t.img, textX, curY + 4, mwImg, mhImg, {
              bg: t.bg || 'transparent',
              radius: t.radius !== undefined ? t.radius : 8,
              border: t.border || null,
              pad: t.pad || 0,
              fit: 'contain'
            });
            const infoW = textW - mwImg - 16;
            txt(t.when.toUpperCase(), textX + mwImg + 16, curY + 36, 15, '#8a8a8a', { w: 400, font: HEAD_FONT, ls: '0.08em' });
            const titleY = wrap(t.t, textX + mwImg + 16, curY + 74, infoW, 27, 36, '#f2f2f2', 600);
            const descY = Math.max(curY + mhImg + 40, titleY + 18);
            wrap(t.d, textX, descY, textW, 24, 36, '#8a8a8a');
          } else {
            txt(t.when.toUpperCase(), textX, curY + 36, 16, '#8a8a8a', { w: 400, font: HEAD_FONT, ls: '0.08em' });
            const yy = wrap(t.t, textX, curY + 76, textW, 28, 38, '#f2f2f2', 600);
            wrap(t.d, textX, yy + 18, textW, 24, 36, '#8a8a8a');
          }
        }
        curY += ih + itemGap;
      });

      g.restore();

      const topGrad = g.createLinearGradient(0, clipTop, 0, clipTop + 20);
      topGrad.addColorStop(0, '#000000');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = topGrad;
      g.fillRect(x0, clipTop, mobW, 20);

      const botGrad = g.createLinearGradient(0, clipBottom - 24, 0, clipBottom);
      botGrad.addColorStop(0, 'rgba(0,0,0,0)');
      botGrad.addColorStop(1, '#000000');
      g.fillStyle = botGrad;
      g.fillRect(x0, clipBottom - 24, mobW, 24);
    } else if (tab === 2) {
      txt('DOCUMENTATION', mx, contentY0 + 44, 34, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

      const clipTop = contentY0 + 64;
      const clipBottom = y0 + mobH - 24;
      const clipH = clipBottom - clipTop;

      const gap = 18;
      const cardHeights = network_doc.map(doc => {
        g.font = `400 26px ${SANS}`;
        let lines = 1, line = '';
        for (const word of doc.d.split(' ')) {
          const t = line + word + ' ';
          if (g.measureText(t).width > (mw - 48) && line) { lines++; line = word + ' '; }
          else line = t;
        }
        return Math.max(160, 90 + lines * 38);
      });
      const totalH = cardHeights.reduce((a, b) => a + b, 0) + (network_doc.length - 1) * gap;
      docsMax = Math.max(0, totalH - clipH + 20);

      g.save();
      g.beginPath();
      g.rect(x0, clipTop, mobW, clipH);
      g.clip();

      let curY = clipTop + 8 - docsY;
      network_doc.forEach((doc, i) => {
        const ch = cardHeights[i];
        if (curY + ch >= clipTop - 20 && curY <= clipBottom + 20) {
          const docId = 'doc-' + (doc.id || i);
          const hv = hoverId === docId || hoverId === 'docs';
          box(mx, curY, mw, ch, 20, hv ? 'rgba(20,20,20,.95)' : 'rgba(12,12,12,.88)', hv ? '#ffffff' : '#2a2a2a');
          hits.push({ id: docId, x: mx, y: curY, w: mw, h: ch, url: doc.url });

          txt(doc.t, mx + 24, curY + 52, 38, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

          const cx = mx + mw - 46, cy = curY + 44;
          g.beginPath(); g.arc(cx, cy, 22, 0, Math.PI * 2);
          g.fillStyle = hv ? '#ffffff' : 'rgba(255,255,255,.05)';
          g.fill();
          g.strokeStyle = hv ? '#ffffff' : '#2a2a2a'; g.lineWidth = 1.5; g.stroke();
          txt('→', cx, cy + 7, 22, hv ? '#000000' : '#8a8a8a', { font: MONO, align: 'center', w: 600 });

          wrap(doc.d, mx + 24, curY + 104, mw - 48, 26, 40, '#9a9a9a');
        }
        curY += ch + gap;
      });

      g.restore();
    } else if (tab === 3) {
      txt('PROJECTS', mx, contentY0 + 44, 34, '#f2f2f2', { w: 400, font: HEAD_FONT, ls: '0.12em' });

      const clipTop = contentY0 + 64;
      const clipBottom = y0 + mobH - 24;
      const clipH = clipBottom - clipTop;

      const gap = 18;
      const cardHeights = PROJECTS.map(p => {
        g.font = `400 26px ${SANS}`;
        let lines = 1, line = '';
        for (const word of p.d.split(' ')) {
          const t = line + word + ' ';
          if (g.measureText(t).width > (mw - 54) && line) { lines++; line = word + ' '; }
          else line = t;
        }
        const imgH = (p.img && p.img.naturalWidth) ? (p.mobH || 110) + 16 : 0;
        g.font = `600 28px ${SANS}`;
        let tl = 1, tline = '';
        for (const word of p.t.split(' ')) { const t2 = tline + word + ' '; if (g.measureText(t2).width > (mw - 48) && tline) { tl++; tline = word + ' '; } else tline = t2; }
        return 132 + (tl - 1) * 36 + lines * 40 + 28 + imgH;
      });

      const totalH = cardHeights.reduce((a, b) => a + b, 0) + (PROJECTS.length - 1) * gap;
      projMax = Math.max(0, totalH - clipH + 30);

      g.save();
      g.beginPath();
      g.rect(x0, clipTop, mobW, clipH);
      g.clip();

      let curY = clipTop + 8 - projY;
      PROJECTS.forEach((p, i) => {
        const ch = cardHeights[i];
        if (curY + ch >= clipTop - 20 && curY <= clipBottom + 20) {
          box(mx, curY, mw, ch, 18, 'rgba(12,12,12,.92)', '#2a2a2a');
          let textTop = curY;
          if (p.img && p.img.naturalWidth) {
            const pw = p.mobW || (mw - 48), ph = p.mobH || 110;
            renderCardImage(p.img, mx + 24, curY + 20, pw, ph, { bg: p.bg || 'transparent', radius: p.radius || 10, border: p.border, fit: p.fit || 'contain' });
            textTop = curY + ph + 12;
          }
          const tagStr = p.tag.length > 20 ? p.tag.split('·')[0].trim() : p.tag;
          txt(tagStr.toUpperCase(), mx + 24, textTop + 36, 12, '#666666', { w: 400, font: HEAD_FONT, ls: '0.1em' });
          txt(p.y, mx + mw - 24, textTop + 36, 14, '#8a8a8a', { w: 400, font: HEAD_FONT, align: 'right' });
          if ('letterSpacing' in g) g.letterSpacing = '0px';
          const afterTitle = wrap(p.t, mx + 24, textTop + 82, mw - 48, 28, 36, '#f2f2f2', 600);
          wrap(p.d, mx + 24, afterTitle + 10, mw - 48, 26, 40, '#9a9a9a');
        }
        curY += ch + gap;
      });

      g.restore();

      const topGrad = g.createLinearGradient(0, clipTop, 0, clipTop + 20);
      topGrad.addColorStop(0, '#000000');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = topGrad;
      g.fillRect(x0, clipTop, mobW, 20);

      const botGrad = g.createLinearGradient(0, clipBottom - 24, 0, clipBottom);
      botGrad.addColorStop(0, 'rgba(0,0,0,0)');
      botGrad.addColorStop(1, '#000000');
      g.fillStyle = botGrad;
      g.fillRect(x0, clipBottom - 24, mobW, 24);
    }
  }

  function drawScreen() {
    hits = [];
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000000'; g.fillRect(0, 0, sc.width, sc.height);
    const m = getMobileMetrics();
    if (m && m.isMobile) {
      g.setTransform(K, 0, 0, K, 0, 0); g.fillStyle = '#000000'; g.fillRect(0, 0, DW, DH);
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
    // Download CV button excluded from on-screen display per user preference
    g.save(); g.beginPath(); g.rect(0, 142, W, H - 142); g.clip();
    [pageAboutMe, pageQualifications, pageDocumentation, pageProjects][tab]();
    g.restore();
    if (screenTex) screenTex.needsUpdate = true;
  }


  function makeScreenTexture() {
    const old = screenTex;
    screenTex = new THREE.CanvasTexture(sc);
    screenTex.flipY = false; screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 4;
    // phones: the canvas covers only the part of the display the camera sees
    screenTex.repeat.set(1 / crop.fx, 1 / crop.fy); screenTex.offset.set(-(1 - crop.fx) / (2 * crop.fx), -(1 - crop.fy) / (2 * crop.fy));
    if (screenMat) { screenMat.map = screenTex; screenMat.needsUpdate = true; }
    if (old) old.dispose();
  }
  function setScreenMode() {
    const asp = innerWidth / innerHeight, wasCompact = compact, oldW = sc.width, oldH = sc.height;
    compact = asp < COMPACT_BELOW;
    document.body.classList.toggle('compact', compact);
    if (compact) {
      const S = clamp(innerWidth / PHONE_TEXT, .6, 1);          // CSS pixels per design pixel (text scale)
      DW = Math.round(innerWidth / S); DH = Math.round(innerHeight / S);
      K = clamp(innerHeight * Math.min(devicePixelRatio || 1, 2) / DH, .8, 3);
      sc.width = Math.round(DW * K); sc.height = Math.round(DH * K);
      crop.fy = CROP_FY; crop.fx = Math.min(1, screenDim.h * CROP_FY * asp / screenDim.w);
    } else { K = 1; sc.width = W; sc.height = H; crop.fx = crop.fy = 1; }
    if (!screenSetup || wasCompact !== compact || oldW !== sc.width || oldH !== sc.height || compact) makeScreenTexture();
    screenSetup = true; dirtyScreen = true;
  }
  const uvToScreen = uv => compact
    ? { x: (uv.x - (1 - crop.fx) / 2) / crop.fx * DW, y: (uv.y - (1 - crop.fy) / 2) / crop.fy * DH }
    : { x: uv.x * W, y: uv.y * H };

  function screenAction(id) {
    tick(1.1);
    if (id === 'screen-drawer-toggle') {
      openDrawer();
    } else if (id.startsWith('tab')) {
      tab = +id.slice(3);
      updateDrawerActive(tab);
      dirtyScreen = true;
      glide(+id.slice(3));
    } else if (id === 'cv') {
      download();
      toast('Downloading CV…');
    } else if (id === 'docs' || id.startsWith('doc-')) {
      const hit = hits.find(h => h.id === id);
      go((hit && hit.url) || C.docs);
    }
  }

  /* ---------------- 3D Keyboard Setup (real meshes from Server.glb) ---------------- */
  const call = () => { go('tel:' + C.phone); return 'Calling ' + C.phone; };
  const mail = () => { go('mailto:' + C.email); return 'Opening mail app'; };
  const toTab = (n, label) => () => { glide(n); return label; };
  const hero = () => { glide('hero'); return 'Back to the server'; };
  const cv = () => { download(); return 'Downloading CV…'; };
  const cpAll = () => { copy(ALL, 'all contact details'); return null; };

  const KEY_MAP = {
    // Row 1: Esc, F1 - F12, CV
    '005': { label: 'ESC', run: hero },
    '003': { label: 'F1', run: toTab(0, 'AboutMe') },
    '004': { label: 'F2', run: toTab(1, 'Qualifications') },
    '006': { label: 'F3', run: toTab (2, 'Documentations') },
    '007': { label: 'F4', run: toTab(3, 'Projects') },
    '008': { label: 'F5', run: () => {window.location.reload();}},
    '009': { label: 'F6', run: () => 'F6' },
    '010': { label: 'F7', run: () => 'F7' },
    '011': { label: 'F8', run: () => 'F8' },
    '012': { label: 'F9', run: () => 'F9' },
    '013': { label: 'F10', run: () => 'F10' },
    '014': { label: 'F11', run: () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(()=>{}); return 'Fullscreen Toggled';} },
    '015': { label: 'F12', run: () => { soundOn = !soundOn; return soundOn ? 'Key sound on' : 'Key sound off'; } },
    '016': { label: 'CV ↓', run: cv },

    // Row 2: Tab, +201141259125, +201212442281, Email, Enter
    '017': { label: 'TAB', run: () => 'Tab' },
    '019': { label: '+201141259125', run: call },
    '018': { label: '+201212442281', run: call },
    '025': { label: 'EMAIL', run: mail },
    '030': { label: 'ENTER', run: () => 'Enter' },

    // Row 3: Shift, LinkedIn, GitHub, Up, Shift
    '031': { label: 'SHIFT', run: () => 'Shift' },
    '032': { label: 'LINKEDIN', run: () => { go(C.linkedin); return 'Opening LinkedIn'; } },
    '033': { label: 'GITHUB', run: () => { go('https://github.com/youssifelfeshawy'); return 'Opening GitHub'; } },
    '034': { label: '↑', run: () => '↑' },
    '035': { label: 'SHIFT', run: () => 'Shift' },

    // Row 4: Ctrl, Fn, Alt, Get in Touch, Alt, Ctrl, Left, Down, Right, PgUp
    '045': { label: 'CTRL', run: () => 'Ctrl' },
    '047': { label: 'FN', run: () => 'Fn' },
    '048': { label: 'ALT', run: () => 'Alt' },
    '049': { label: 'GET IN TOUCH', run: cpAll },
    '053': { label: 'ALT', run: () => 'Alt' },
    '020': { label: 'CTRL', run: () => 'Ctrl' },
    '055': { label: '←', run: () => '←' },
    '056': { label: '↓', run: () => '↓' },
    '057': { label: '→', run: () => '→' },
    '058': { label: 'PG UP', run: hero }
  };

  const kbMeshes = [];
  let kHoverMesh = null;
  let deckMesh = null;

  function findKeyDef(name) {
    if (!name || !/Laptop.*Computer/i.test(name)) return null;
    if (/002/i.test(name)) return null;
    const m = name.match(/0(\d\d)$/);
    return m ? KEY_MAP['0' + m[1]] : null;
  }

  function pressKeyMesh(mesh) {
    if (!mesh || !mesh.userData.keyDef) return;
    tick(1);
    if (mesh.material && mesh.material.emissive) {
      mesh.material.emissive.setHex(0x888888);
      setTimeout(() => {
        if (mesh.material && mesh.material.emissive) {
          mesh.material.emissive.setHex(mesh === kHoverMesh ? 0x444444 : 0x000000);
          needRender = true;
        }
      }, 150);
    }
    if (mesh.userData.origY !== undefined) {
      gsap.to(mesh.position, {
        y: mesh.userData.origY - 0.008,
        duration: 0.06,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        onUpdate: () => { needRender = true; }
      });
    }
    const msg = mesh.userData.keyDef.run();
    if (msg) toast(msg);
  }

  /* ---------------- 3D scene ---------------- */
  let renderer, camera, scene, model = null, screenMesh = null, needRender = true;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const FOV = 30, TAN = Math.tan(FOV * Math.PI / 360);
  const BASE = V(5.9, 3.7, 11.6), T0 = V(0, 2.7, .5);
  const P0 = V(), P1 = V(), T1 = V(), P2 = V(), T2 = V(), pos = V(), tgt = V();
  const state = { a: 0, q: 0 };   // a: rack -> screen, q: screen -> keyboard

  const stacked = () => innerWidth / innerHeight < COMPACT_BELOW || innerWidth <= 820;   // same rule as the CSS hero layout
  let rotKb = false;
  function layoutCamera() {
    const asp = innerWidth / innerHeight, port = asp < .85;
    P0.copy(T0).add(BASE.clone().sub(T0).multiplyScalar(stacked() ? 1.4 : 1));
    if (!screenMesh) return;
    const s = new THREE.Box3().setFromObject(screenMesh), sc3 = s.getCenter(V());
    screenDim.w = s.max.x - s.min.x; screenDim.h = s.max.y - s.min.y;
    const dS = compact
      ? screenDim.h * CROP_FY / (2 * TAN)
      : Math.max(screenDim.h / (2 * TAN), screenDim.w / (2 * TAN * asp)) * 1.06;
    T1.copy(sc3); P1.set(sc3.x, sc3.y, s.max.z + dS);

    const k = new THREE.Box3();
    if (kbMeshes.length) kbMeshes.forEach(m => k.expandByObject(m));
    else if (deckMesh) k.setFromObject(deckMesh);
    else k.setFromObject(screenMesh);
    const kc = k.getCenter(V());
    const kw = k.max.x - k.min.x, kd = k.max.z - k.min.z, th = 30 * Math.PI / 180;
    rotKb = port && ROTATE_KEYBOARD_ON_PHONE;
    const d = rotKb
      ? Math.max(kw * 1.22 / (2 * TAN), (kd + .14) * 1.28 / (2 * TAN * asp))
      : Math.max(kw * 1.14 / (2 * TAN * asp), (kd + .15) * Math.cos(th) * 1.4 / (2 * TAN));
    T2.copy(kc);
    P2.copy(kc).add(rotKb ? V(Math.sin(th) * d, Math.cos(th) * d, 0) : V(0, Math.cos(th) * d, Math.sin(th) * d));
  }

  function renderFrame() {
    const e = state.a, q = state.q, vw = innerWidth, vh = innerHeight, port = stacked();
    pos.copy(P0).lerp(P1, e).lerp(P2, q); tgt.copy(T0).lerp(T1, e).lerp(T2, q);
    if (q > 0 && !rotKb) pos.z += Math.sin(q * Math.PI) * 0.25;
    camera.up.set(0, 1, 0); camera.position.copy(pos); camera.lookAt(tgt);
    renderer.toneMappingExposure = 1.25 - 0.62 * q;
    camera.setViewOffset(vw, vh, port ? 0 : -vw * .255 * (1 - e), port ? -vh * .17 * (1 - e) : 0, vw, vh);
    renderer.render(scene, camera);
  }

  function fail() { document.body.classList.add('no-webgl'); hideLoader(); }

  // Clean edge-to-edge display quad from screen mesh vertices
  function makeDisplay(mesh) {
    const posAttr = mesh.geometry.attributes.position, uvAttr = mesh.geometry.attributes.uv, want = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const best = want.map(() => ({ d: 9, i: 0 }));
    for (let i = 0; i < uvAttr.count; i++) want.forEach((w, k) => { const d = Math.abs(uvAttr.getX(i) - w[0]) + Math.abs(uvAttr.getY(i) - w[1]); if (d < best[k].d) best[k] = { d, i }; });
    const c = best.map(b => mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(posAttr, b.i)));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(c.flatMap(p => [p.x, p.y, p.z + .002]), 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    geo.setIndex([0, 3, 2, 0, 2, 1]);
    screenMat.side = THREE.DoubleSide;
    return new THREE.Mesh(geo, screenMat);
  }

  function initScene() {
    const canvas = $('webgl-canvas');
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      return fail();
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, .028);
    camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, .05, 120);

    const grid = new THREE.GridHelper(60, 60, 0x2a2a2a, 0x121212);
    grid.position.y = -.002;
    scene.add(grid);

    // Floor shadow blob under the server matching reference folder
    const sh = document.createElement('canvas'); sh.width = sh.height = 128;
    const sx = sh.getContext('2d'), rg = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
    rg.addColorStop(0, 'rgba(0,0,0,.9)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    sx.fillStyle = rg; sx.fillRect(0, 0, 128, 128);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2;
    blob.position.set(0, .001, .6);
    scene.add(blob);

    // Soft studio reflections for the metal, plus key / rim lights
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x151515, side: THREE.BackSide })));
    [[8, 8, 10], [-10, 4, 6], [0, 12, -8]].forEach(([x, y, z]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
      m.material.color.setScalar(9); m.position.set(x, y, z); m.lookAt(0, 2, 0); env.add(m);
    });
    try {
      scene.environment = new THREE.PMREMGenerator(renderer).fromScene(env, 0.04).texture;
    } catch (e) {
      console.warn('PMREM skipped', e);
    }

    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 2.6));
    const key1 = new THREE.DirectionalLight(0xffffff, 4.6);
    key1.position.set(5, 8, 9);
    scene.add(key1);

    const rim = new THREE.DirectionalLight(0xffffff, 3.6);
    rim.position.set(-6, 3, -4);
    scene.add(rim);

    setScreenMode();
    drawScreen();

    const loader = new GLTFLoader();
    loader.load('assets/models/Server.glb', gltf => {
      model = gltf.scene;

      model.traverse(o => {
        if (!o.isMesh) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => {
          if (m && m.isMeshStandardMaterial) {
            m.envMapIntensity = 1.0;
            if (m.normalMap) m.normalScale.set(1.0, 1.0);
          }
        });

        const keyDef = findKeyDef(o.name);
        if (keyDef) {
          o.userData.origY = o.position.y;
          o.userData.keyDef = keyDef;
          if (o.material) {
            o.material = o.material.clone();
            if (o.material.emissive) o.material.emissive.setHex(0x000000);
          }
          kbMeshes.push(o);
        } else if (/Cube[._]*013/i.test(o.name)) {
          deckMesh = o;
        }
      });

      scene.add(model);
      model.updateMatrixWorld(true);

      let bezel = null;
      model.traverse(o => { if (o.isMesh && o.material && /screen/i.test(o.material.name)) bezel = o; });
      if (bezel) {
        screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, fog: false });
        screenMesh = makeDisplay(bezel);
        bezel.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        scene.add(screenMesh);
      }

      window.__model = model;
      window.__scene = scene;
      window.__camera = camera;
      window.__renderer = renderer;
      window.__state = state;
      window.__needRender = () => { needRender = true; };

      layoutCamera(); setScreenMode(); layoutCamera();
      setupScroll();

      const urlParams = new URLSearchParams(location.search);
      if (urlParams.get('cam') === 'keyboard') {
        state.a = 1; state.q = 1;
        if (!urlParams.has('tab')) tab = 3;
        const hc = document.querySelector('.hero-content'); if (hc) hc.style.opacity = '0';
      } else if (urlParams.get('cam') === 'screen') {
        state.a = 1; state.q = 0;
        const hc = document.querySelector('.hero-content'); if (hc) hc.style.opacity = '0';
      }
      if (urlParams.has('tab')) { tab = parseInt(urlParams.get('tab')) || 0; }
      syncPages();
      if (urlParams.has('drawer')) { openDrawer(); }
      needRender = true;
      hideLoader();
    }, xhr => {
      if (xhr.lengthComputable && bar) bar.style.width = (xhr.loaded / xhr.total * 100) + '%';
    }, err => {
      console.warn(err);
      fail();
    });

    layoutCamera();
  }

  /* ---------------- Mobile drawer navigation ---------------- */
  const drawerToggle = $('mobile-drawer-toggle');
  const drawer = $('mobile-drawer');
  const drawerBackdrop = $('mobile-drawer-backdrop');
  const drawerClose = $('mobile-drawer-close');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'false');
  }

  if (drawerToggle) drawerToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.getAttribute('data-nav');
      tab = +nav;
      updateDrawerActive(tab);
      dirtyScreen = true;
      closeDrawer();
      glide(+nav);
    });
  });

  const urlParamsInit = new URLSearchParams(location.search);
  if (urlParamsInit.has('drawer')) {
    openDrawer();
  }

  // The menu button is only shown while the camera is inside the laptop screen (phone layout only)
  function updateDrawerToggle() {
    if (!drawerToggle) return;
    const inScreen = compact && state.a > 0.8 && state.q < 0.2;
    drawerToggle.classList.toggle('visible', inScreen);
    if (!inScreen) closeDrawer();
  }

  function updateDrawerActive(navKey) {
    document.querySelectorAll('.drawer-link[data-nav]').forEach(btn => {
      if (btn.getAttribute('data-nav') === String(navKey)) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  /* ---------------- Scroll choreography ---------------- */
  function syncPages() {
    const urlParams = new URLSearchParams(location.search);
    const sy = scrollY, vh = innerHeight, stops = document.querySelectorAll('.stop');
    if (urlParams.has('tab') && sy === 0) {
      tab = parseInt(urlParams.get('tab')) || 0;
      updateDrawerActive(tab);
      dirtyScreen = true;
      return;
    }
    if (urlParams.get('cam') === 'keyboard' && sy === 0) {
      tab = 3;
      updateDrawerActive(tab);
      dirtyScreen = true;
      return;
    }
    let t = 0; stops.forEach((s, i) => { if (sy >= stopTop(i) - 2) t = i; });
    const long = stops[1], p = long ? clamp((sy - stopTop(1)) / (long.offsetHeight - vh), 0, 1) : 0, x = p * tlMax;
    const longDocs = stops[2], pDocs = (longDocs && longDocs.offsetHeight > vh) ? clamp((sy - stopTop(2)) / (longDocs.offsetHeight - vh), 0, 1) : 0, dy = pDocs * docsMax;
    const longProj = stops[3], pProj = longProj ? clamp((sy - stopTop(3)) / (longProj.offsetHeight - vh), 0, 1) : 0, py = pProj * projMax;
    if (t !== tab || (t === 1 && Math.abs(x - tlX) > .5) || (t === 2 && Math.abs(dy - docsY) > .5) || (t === 3 && Math.abs(py - projY) > .5)) {
      tab = t;
      tlX = x;
      docsY = dy;
      projY = py;
      dirtyScreen = true;
    }

    updateDrawerToggle();
    updateDrawerActive(t);
  }

  // the camera hold time equals the real height of the screen stops, whatever the page markup uses
  const stopsUnits = () => { let h = 0; document.querySelectorAll('.stop').forEach(el => (h += el.offsetHeight)); return h / innerHeight; };

  function setupScroll() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-content', { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 45%', scrub: true } });
    gsap.timeline({ scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true }, onUpdate: () => { needRender = true; updateDrawerToggle(); } })
      .to(state, { a: 1, duration: 1, ease: 'power2.inOut' })
      .to(state, { duration: Math.max(1, stopsUnits()) })
      .to(state, { q: 1, duration: 1, ease: 'power2.inOut' });
    addEventListener('scroll', syncPages, { passive: true });
    syncPages();
  }

  /* ---------------- Pointer: hero click, screen buttons, keyboard keys ---------------- */
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  function pick(e) {
    if (!renderer || !model) return null;
    mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    if (state.a < .5) return ray.intersectObject(model, true).length ? { hero: true } : null;
    if (state.a > .85 && state.q < .15 && screenMesh) {
      const h = ray.intersectObject(screenMesh)[0];
      if (h && h.uv) {
        const { x, y } = uvToScreen(h.uv);
        const b = hits.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
        return { id: b ? b.id : null };
      }
    }
    if (state.q > .65 && kbMeshes.length) {
      const hitsKb = ray.intersectObjects(kbMeshes, false);
      if (hitsKb.length && hitsKb[0].object && hitsKb[0].object.userData && hitsKb[0].object.userData.keyDef) {
        return { keyMesh: hitsKb[0].object };
      }
    }
    return null;
  }

  addEventListener('pointermove', e => {
    const p = pick(e);
    let id = null, targetKey = null, hot = false;
    if (p) {
      if (p.hero) hot = true;
      if (p.id) { id = p.id; hot = true; }
      if (p.keyMesh) { targetKey = p.keyMesh; hot = true; }
    }
    if (id !== hoverId) { hoverId = id; dirtyScreen = true; }
    if (targetKey !== kHoverMesh) {
      if (kHoverMesh && kHoverMesh.material && kHoverMesh.material.emissive) {
        kHoverMesh.material.emissive.setHex(0x000000);
      }
      kHoverMesh = targetKey;
      if (kHoverMesh && kHoverMesh.material && kHoverMesh.material.emissive) {
        kHoverMesh.material.emissive.setHex(0x383838);
      }
      needRender = true;
    }
    document.body.style.cursor = hot ? 'pointer' : '';
  });

  addEventListener('click', e => {
    const p = pick(e);
    if (!p) return;
    if (p.hero) { tick(1.2); glide(0); }
    else if (p.id) screenAction(p.id);
    else if (p.keyMesh) pressKeyMesh(p.keyMesh);
  });

  let resizeTimer, lastW = innerWidth, lastH = innerHeight;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!renderer) return;
      const sameWidth = Math.abs(innerWidth - lastW) < 2, small = Math.abs(innerHeight - lastH) < innerHeight * .12;
      if (sameWidth && small) return; // phone address bar showing / hiding
      lastW = innerWidth; lastH = innerHeight;
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      layoutCamera(); setScreenMode(); layoutCamera();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      dirtyScreen = true;
      needRender = true;
    }, 150);
  });

  /* ---------------- Start ---------------- */
  if (document.fonts) Promise.all(FONTS.map(f => document.fonts.load(f).catch(() => {}))).then(() => (dirtyScreen = true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => (dirtyScreen = true));
  (function loop() {
    requestAnimationFrame(loop);
    if (dirtyScreen) { drawScreen(); dirtyScreen = false; needRender = true; }
    if (needRender && renderer && camera) { needRender = false; renderFrame(); }
  })();
  initScene();
})();
