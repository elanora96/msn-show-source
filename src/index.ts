interface CanonicalLinkObj {
  href: string;
  domainNameArr: string[];
}

function getCanonicalLink() {
  const canonicalLinkEl = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!canonicalLinkEl) return null;

  const canonicalLinkObj = {
    href: canonicalLinkEl.href,
    domainNameArr: /^(?:https?:\/\/)?(?:www\.)?([^/]+)/i.exec(
      canonicalLinkEl.href,
    ),
  } as CanonicalLinkObj;

  return canonicalLinkObj;
}

function makeBanner(link: CanonicalLinkObj) {
  const bannerHeight = '1.5rem';
  const root = document.body.querySelector<HTMLElement>('#root');
  if (root) root.style.marginTop = `calc(${bannerHeight} + 1rem)`;

  const banner = document.createElement('div');

  Object.assign(banner.style, {
    position: 'fixed',
    top: '0',
    width: '100%',
    height: bannerHeight,
    backgroundColor: 'var(--fill-color)',
    color: 'var(--neutral-foreground-rest)',
    borderBottom: '.1rem solid var(--neutral-foreground-hint)',
    zIndex: '998',
    padding: '.5rem',
    textAlign: 'center',
  });
  banner.innerText = 'Source article: ';

  const anchor = document.createElement('a');
  anchor.href = link.href;
  anchor.style.color = 'var(--accent-foreground-rest)';
  anchor.innerText = link.domainNameArr[1];

  banner.appendChild(anchor);

  document.body.appendChild(banner);
}

(function () {
  const observer = new MutationObserver(() => {
    const canonicalLink = getCanonicalLink();
    if (canonicalLink) {
      observer.disconnect();
      makeBanner(canonicalLink);
    }
  });

  observer.observe(document.head, { childList: true, subtree: true });
})();
