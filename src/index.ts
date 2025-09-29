interface CanonicalLink {
  href: string;
  domainNameArr: string[];
}

class CanonicalLinkObj implements CanonicalLink {
  href: string;
  domainNameArr: string[];

  constructor({ href }: { href: string }) {
    this.href = href;
    this.domainNameArr = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/i.exec(
      href,
    ) as string[];
  }
}

function getCanonicalLink() {
  const canonicalLinkEl = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  return !canonicalLinkEl ? null : new CanonicalLinkObj(canonicalLinkEl);
}

function makeBanner(id: string) {
  const bannerHeight = '1.5rem';
  const root = document.body.querySelector<HTMLElement>('#root');
  if (root) root.style.marginTop = `calc(${bannerHeight} + 1rem)`;

  const banner = document.createElement('div');
  banner.setAttribute('id', id);

  Object.assign(banner.style, {
    position: 'absolute',
    top: '0',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridTemplateRows: '1fr',
    height: bannerHeight,
    backgroundColor: 'var(--fill-color)',
    color: 'var(--neutral-foreground-rest)',
    borderBottom: '.1rem solid var(--neutral-foreground-hint)',
    zIndex: '998',
    padding: '.5rem 0',
    textAlign: 'right',
  });
  banner.innerText = 'Searching for source link';

  document.body.appendChild(banner);

  return banner;
}

function updateBanner(id: string, link: CanonicalLinkObj) {
  const banner = document.getElementById(id) ?? makeBanner(id);

  banner.innerText = '';

  const sourceContainer = document.createElement('span');
  sourceContainer.innerText = 'Source article: ';

  const anchor = document.createElement('a');
  anchor.href = link.href;
  anchor.style.color = 'var(--accent-foreground-rest)';
  anchor.innerText = link.domainNameArr[1];

  sourceContainer.appendChild(anchor);

  banner.appendChild(sourceContainer);
}

(() => {
  const id = 'msnBannerId';
  makeBanner(id);
  const observer = new MutationObserver(() => {
    const canonicalLink = getCanonicalLink();
    if (canonicalLink) {
      observer.disconnect();
      updateBanner(id, canonicalLink);
    }
  });

  observer.observe(document.head, { childList: true, subtree: true });
})();
