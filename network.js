
(() => {
  const links = [...document.querySelectorAll('.side-nav a')];
  const targets = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

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
    }, { rootMargin: '-24% 0px -64% 0px' });

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
