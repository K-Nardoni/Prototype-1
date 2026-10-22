// shared.jsx — KN banking UI kit · shared primitives
// Brand chrome (no IOSNavBar — we use our own).
// Exports to window: KnTopChrome, KnTabBar, KnButton, KnCard, KnListRow,
//                    KnIconBubble, KnEyebrow, KnSheet, KnSegmented, KnBalance

const KN = {
  ink:    '#0F1A15',
  ink2:   '#1F2E27',
  mute:   '#587066',
  mute2:  '#8AA29A',
  line:   '#D6E2DC',
  line2:  '#E4ECE7',
  cream:  '#E5F3EA',
  card:   '#FFFFFF',
  sunken: '#D5E7DB',
  primary: '#0FCC7A',
  primary600: '#08A861',
  primarySoft: '#D9F5E5',
  lime: '#2DD4BF',
  limeDark: '#0D9488',
  moneyIn: '#1FB87C',
  moneyInSoft: '#DFF6EC',
  warn: '#FFB547',
  warnSoft: '#FFF1D6',
  danger: '#E33B3B',
  dangerSoft: '#FCE4E4',
  coralSoft: '#FFE6E1',
};
window.KN = KN;

// Lucide icon wrapper. Renders <i data-lucide="..."> which the global lucide
// script replaces with an inline <svg>. Width/height passed as attributes
// (not inline style) so Lucide preserves them on the SVG it generates.
// System-wide stroke is 2.75 for the "chunky" look.
function KnIcon({ name, size = 22, color = 'currentColor', stroke = 2.75 }) {
  return (
    <i
      data-lucide={name}
      width={size}
      height={size}
      style={{
        width: size, height: size,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0,
        strokeWidth: stroke,
      }}
    />
  );
}

// Status-bar spacer + chrome (sits above scrolling content)
function KnTopChrome({ title, right, scrolled = false, dark = false }) {
  const bg = dark ? 'rgba(15,26,21,0.78)' : 'rgba(229,243,234,0.78)';
  const fg = dark ? '#E5F3EA' : KN.ink;
  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 10,
        paddingTop: 56,  // below status bar / dynamic island
        background: scrolled ? bg : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? `1px solid ${dark ? 'rgba(255,255,255,0.06)' : KN.line2}` : 'none',
        transition: 'background 220ms cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding: '8px 20px 12px' }}>
        <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 17, fontWeight: 600, letterSpacing: '-0.012em', color: fg }}>
          {title}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: fg }}>{right}</div>
      </div>
    </div>
  );
}

function KnTabBar({ active = 'home', onTab = () => {} }) {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'accounts', icon: 'wallet', label: 'Accounts' },
    { id: 'ai', icon: 'sparkles', label: '' },
    { id: 'goals', icon: 'piggy-bank', label: 'Goals' },
    { id: 'you', icon: 'user', label: 'You' },
  ];
  return (
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        paddingBottom: 24, paddingTop: 8, paddingLeft: 10, paddingRight: 10,
        background: 'rgba(229,243,234,0.86)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        borderTop: `1px solid ${KN.line2}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          const isAi = t.id === 'ai';
          if (isAi) {
            return (
              <button key={t.id} onClick={() => onTab(t.id)}
                style={{
                  width: 50, height: 50, borderRadius: 999,
                  background: KN.ink, color: KN.lime, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 20px -4px rgba(45,212,191,0.45)',
                  marginTop: -8,
                }}>
                <KnIcon name="sparkles" size={22} />
              </button>
            );
          }
          return (
            <button key={t.id} onClick={() => onTab(t.id)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '6px 14px',
                color: isActive ? KN.primary : KN.mute2,
              }}>
              <KnIcon name={t.icon} size={22} stroke={isActive ? 2.4 : 2} />
              <span style={{ fontFamily: '"DM Sans"', fontSize: 10, fontWeight: 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function KnButton({ variant = 'primary', size = 'md', children, onClick, icon, full = false, style = {} }) {
  const h = size === 'sm' ? 40 : 52;
  const fs = size === 'sm' ? 14 : 16;
  const px = size === 'sm' ? 18 : 24;
  const base = {
    height: h, padding: `0 ${px}px`, borderRadius: 999, border: 'none', cursor: 'pointer',
    fontFamily: '"DM Sans", system-ui', fontSize: fs, fontWeight: 500, letterSpacing: '-0.005em',
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    transition: 'transform 120ms cubic-bezier(0.32,0.72,0,1), background 120ms, box-shadow 220ms',
    width: full ? '100%' : 'auto',
  };
  const variants = {
    primary:   { background: KN.primary, color: '#fff', boxShadow: '0 1px 2px rgba(15,26,21,0.05)' },
    secondary: { background: '#fff', color: KN.ink, boxShadow: '0 1px 2px rgba(15,26,21,0.05)' },
    ghost:     { background: 'transparent', color: KN.ink },
    ai:        { background: KN.ink, color: KN.lime, boxShadow: '0 8px 20px -4px rgba(45,212,191,0.45)' },
    danger:    { background: '#fff', color: KN.danger, boxShadow: '0 1px 2px rgba(15,26,21,0.05)' },
    dark:      { background: KN.ink, color: '#fff' },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      {icon && <KnIcon name={icon} size={size === 'sm' ? 16 : 18} stroke={2.75} />}
      {children}
    </button>
  );
}

function KnCard({ children, dark = false, glow = false, style = {}, onClick, padding = 20 }) {
  return (
    <div onClick={onClick} style={{
      background: dark ? KN.ink : KN.card,
      color: dark ? '#E5F3EA' : KN.ink,
      borderRadius: 22, padding,
      boxShadow: glow ? '0 12px 28px -6px rgba(45,212,191,0.35), 0 6px 16px -4px rgba(15,26,21,0.08)'
                       : '0 4px 12px -2px rgba(15,26,21,0.08), 0 2px 4px -1px rgba(15,26,21,0.04)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>
      {children}
    </div>
  );
}

function KnEyebrow({ children, color, style = {} }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 11, fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: color || KN.mute,
      ...style,
    }}>{children}</div>
  );
}

function KnIconBubble({ icon, tone = 'neutral', size = 40 }) {
  const tones = {
    neutral: { bg: KN.sunken, fg: KN.ink },
    primary: { bg: KN.primarySoft, fg: '#036E40' },
    money:   { bg: KN.moneyInSoft, fg: '#036E40' },
    danger:  { bg: KN.dangerSoft, fg: KN.danger },
    warn:    { bg: KN.warnSoft, fg: '#a87000' },
    ai:      { bg: KN.ink, fg: KN.lime },
    coral:   { bg: KN.coralSoft, fg: '#D9483A' },
  }[tone];
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: tones.bg, color: tones.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <KnIcon name={icon} size={size * 0.46} />
    </div>
  );
}

function KnListRow({ icon, iconTone = 'neutral', name, sub, right, rightSub, rightTone = 'ink', onClick, dense = false }) {
  const rightColors = { ink: KN.ink, in: KN.moneyIn, out: KN.ink, mute: KN.mute, primary: KN.primary };
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: dense ? '10px 0' : '14px 0',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {icon && (typeof icon === 'string' ? <KnIconBubble icon={icon} tone={iconTone} /> : icon)}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 15, fontWeight: 500, color: KN.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
        {sub && <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: KN.mute, marginTop: 2 }}>{sub}</div>}
      </div>
      {(right || rightSub) && (
        <div style={{ textAlign: 'right' }}>
          {right && (
            <div style={{
              fontFamily: '"DM Sans"', fontSize: 15, fontWeight: 500,
              fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
              color: rightColors[rightTone],
            }}>{right}</div>
          )}
          {rightSub && <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: KN.mute, marginTop: 2 }}>{rightSub}</div>}
        </div>
      )}
    </div>
  );
}

function KnSegmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: KN.sunken, padding: 4, borderRadius: 999 }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            border: 'none', cursor: 'pointer', borderRadius: 999,
            padding: '8px 16px', fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 500,
            background: active ? '#fff' : 'transparent',
            color: active ? KN.ink : KN.mute,
            boxShadow: active ? '0 1px 2px rgba(15,26,21,0.06)' : 'none',
            transition: 'all 180ms cubic-bezier(0.32,0.72,0,1)',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function KnBalance({ value, currency = '$', sub, size = 64 }) {
  // Splits "1,247.50" into "1,247" + ".50" with the cents shown smaller / muted
  const v = String(value);
  const [whole, cents] = v.split('.');
  return (
    <div>
      <div style={{
        fontFamily: '"DM Sans"', fontWeight: 600,
        fontSize: size, lineHeight: 0.95, letterSpacing: '-0.035em',
        fontVariantNumeric: 'tabular-nums',
        display: 'flex', alignItems: 'baseline', color: 'inherit',
      }}>
        <span style={{ fontSize: size * 0.5, fontWeight: 500, marginRight: 4, opacity: 0.5 }}>{currency}</span>
        <span>{whole}</span>
        {cents !== undefined && <span style={{ fontSize: size * 0.42, opacity: 0.5 }}>.{cents}</span>}
      </div>
      {sub && <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: 'inherit', opacity: 0.65, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function KnSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      display: 'flex', alignItems: 'flex-end',
      background: 'rgba(15,26,21,0.32)',
      animation: 'kn-fade 220ms cubic-bezier(0.32,0.72,0,1)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderRadius: '28px 28px 0 0',
        padding: '12px 20px 28px',
        boxShadow: '0 -12px 32px -8px rgba(15,26,21,0.18)',
        animation: 'kn-slide-up 320ms cubic-bezier(0.32,0.72,0,1)',
      }}>
        <div style={{ width: 36, height: 5, borderRadius: 999, background: KN.line, margin: '0 auto 14px' }} />
        {children}
      </div>
    </div>
  );
}

// Auto-convert <i data-lucide> wherever it lands in the DOM. App-level
// useEffects don't re-run when nested children change state, so without this
// any icon mounted post-initial-render stays blank. Idempotent + cheap.
if (typeof window !== 'undefined' && !window.__knLucideObserver) {
  const run = () => {
    if (window.lucide && document.querySelector('i[data-lucide]')) {
      window.lucide.createIcons({ attrs: { 'stroke-width': '2.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } });
    }
  };
  // Initial pass — handles icons mounted before the observer attaches.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  let scheduled = false;
  window.__knLucideObserver = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; run(); });
  });
  window.__knLucideObserver.observe(document.body, { childList: true, subtree: true });
}

// keyframes injected once
if (!document.getElementById('kn-anim-styles')) {
  const s = document.createElement('style');
  s.id = 'kn-anim-styles';
  s.textContent = `
    @keyframes kn-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes kn-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes kn-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.55); } 50% { box-shadow: 0 0 0 10px rgba(45,212,191,0); } }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  KnTopChrome, KnTabBar, KnButton, KnCard, KnListRow,
  KnIconBubble, KnEyebrow, KnSheet, KnSegmented, KnBalance, KnIcon,
});
