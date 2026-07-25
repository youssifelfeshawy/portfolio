(() => {
  const sideNav = document.querySelector('.side-nav');
  const article = document.querySelector('article.doc-document');

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
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: '-5% 0px -65% 0px' });

    targets.forEach(target => observer.observe(target));
  }

  document.querySelectorAll('.osi-click-layer').forEach(layer => {
    layer.addEventListener('click', () => {
      const href = layer.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        setTimeout(() => target.classList.add('anchor-highlight'), 250);
        setTimeout(() => target.classList.remove('anchor-highlight'), 1500);
      }
    });
  });
})();
