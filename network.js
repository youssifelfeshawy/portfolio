(() => {
  const sideNav = document.querySelector('.side-nav');
  const article = document.querySelector('article.doc-document');
  const drawerToggle = document.getElementById('doc-drawer-toggle');
  const drawerClose = document.getElementById('doc-drawer-close');
  const drawerBackdrop = document.getElementById('doc-drawer-backdrop');
  const sidebar = document.getElementById('network-sidebar') || document.querySelector('.network-sidebar');

  function openDrawer() {
    if (!sidebar) return;
    sidebar.classList.add('drawer-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (!sidebar) return;
    sidebar.classList.remove('drawer-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (drawerToggle) drawerToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  }

  if (drawerToggle) {
    drawerToggle.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('drawer-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('drawer-open')) {
      closeDrawer();
    }
  });

  if (sideNav && article) {
    const headings = [...article.querySelectorAll('h2, h3')];
    const navHTML = ['<p>ON THIS PAGE</p>'];

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = heading.textContent
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-') || `section-${index}`;
      }

      const isH2 = heading.tagName.toLowerCase() === 'h2';
      const className = isH2 ? 'nav-h2' : 'nav-h3';
      let displayText = heading.textContent.replace(/:-$/, '').trim();

      navHTML.push(`<a href="#${heading.id}" class="${className}">${displayText}</a>`);
    });

    sideNav.innerHTML = navHTML.join('\n');
  }

  const links = [...document.querySelectorAll('.side-nav a[href^="#"]')];
  const targets = links
    .map(link => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      return document.getElementById(id);
    })
    .filter(Boolean);

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (history.pushState) {
          history.pushState(null, null, `#${id}`);
        }
      }
    });
  });

  if ('IntersectionObserver' in window && targets.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        links.forEach(link => {
          const linkId = decodeURIComponent(link.getAttribute('href').slice(1));
          link.classList.toggle('active', linkId === currentId);
        });
      });
    }, { rootMargin: '-10% 0px -70% 0px' });

    targets.forEach(target => observer.observe(target));
  }

  document.querySelectorAll('.osi-click-layer').forEach(layer => {
    layer.addEventListener('click', (e) => {
      const href = layer.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          setTimeout(() => target.classList.add('anchor-highlight'), 250);
          setTimeout(() => target.classList.remove('anchor-highlight'), 1500);
        }
      }
    });
  });
})();
