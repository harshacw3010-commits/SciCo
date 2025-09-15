import React, { useEffect, useMemo, useRef, useId } from 'react';
import type { ClientLogo, ClientsSectionProps } from '../types/clients';
import { DEFAULT_CLIENTS } from '../types/clients';
import './clients.css';

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener?.('change', on);
    return () => m.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function LogoItem({ item, grayscale, ariaHidden = false }: { item: ClientLogo; grayscale: boolean; ariaHidden?: boolean }) {
  const content = item.src ? (
    <img
      className={classNames('logo-img', grayscale ? undefined : 'no-gray')}
      src={item.src}
      alt={item.name}
      title={item.name}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
    />
  ) : (
    <span className="logo-badge" title={item.name} aria-label={item.name}>
      {item.name}
    </span>
  );

  const node = item.href ? (
    <a className="logo-link" href={item.href} target="_blank" rel="noopener noreferrer" title={item.name}>
      {content}
    </a>
  ) : (
    <div className="logo-link" role="img" aria-label={item.name} title={item.name}>
      {content}
    </div>
  );

  return (
    <li className={classNames('logo-cell', grayscale ? 'is-grayscale' : undefined)} aria-hidden={ariaHidden}>
      {node}
    </li>
  );
}

export const ClientsSection: React.FC<ClientsSectionProps> = ({
  variant = 'grid',
  title = "Clients we have worked with",
  logos = DEFAULT_CLIENTS,
  grayscale = true,
  maxColumns = 5,
}) => {
  const reduced = useReducedMotion();
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  // Animate heading underline when in view (disabled if reduced motion)
  useEffect(() => {
    if (!underlineRef.current) return;
    if (reduced) {
      underlineRef.current.classList.add('in-view');
      return;
    }
    const el = underlineRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('in-view');
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const gridColsClass = useMemo(() => {
    return maxColumns === 6 ? 'cols-6' : maxColumns === 4 ? '' : 'cols-5';
  }, [maxColumns]);

  if (variant === 'grid') {
    return (
      <section className="clients-section" aria-labelledby={titleId}>
        <div className="clients-container">
          <div className="clients-heading-wrap" role="presentation">
            <h2 id={titleId} className="clients-heading">
              {title}
            </h2>
            <div className="clients-heading-divider" />
            <div ref={underlineRef} className="clients-underline" />
          </div>

          <ul className={classNames('clients-grid', gridColsClass)}>
            {logos.map((item) => (
              <LogoItem key={item.name} item={item} grayscale={grayscale} />
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Marquee variant: duplicate once for seamless loop
  const dup = [...logos, ...logos];

  return (
    <section className="clients-section" aria-labelledby={titleId}>
      <div className="clients-container">
        <div className="clients-heading-wrap" role="presentation">
          <h2 id={titleId} className="clients-heading">
            {title}
          </h2>
          <div className="clients-heading-divider" />
          <div ref={underlineRef} className="clients-underline" />
        </div>

        <div className="marquee" aria-label="Client logos marquee">
          <div className="marquee-row">
            <ul className="marquee-track" aria-live="polite">
              {dup.map((item, i) => (
                <LogoItem key={`m1-${item.name}-${i}`} item={item} grayscale={grayscale} ariaHidden={i >= logos.length} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
