// Airbnb for Teams — Intake screen
// Single mobile prompt that captures everything the corporate booker needs in one pass.

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Tweakable defaults — user can override via the Tweaks panel.
//   accent:  [main, soft-fill, mid, sun]   — gradient + selected states
//   surface: [bg, bg2, card, border, soft] — warmth/temperature of the surround
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#A04A2C", "#FFE4D2", "#C9633F", "#F2A03F"],
  "surface": ["#FFF6EC", "#F7EADA", "#FFFDF8", "#E4D8CC", "#EFE5D9"],
  "ctaColor": "#FF385C",
  "teamsBadge": "Teams",
  "curatedLabel": "Popular with teams",
  "companyName": "The Feed",
  "firstName": "Matt",
  "showConcierge": true
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────────────────────
// Tokens (Airbnb-flavored — not part of the KN system).
// Tweakable values resolve via CSS variables set on the screen root,
// with concrete fallbacks so static styles still render outside it.
// ─────────────────────────────────────────────────────────────
const T = {
  rausch: '#FF385C',
  ink: '#1F1410',          // warm near-black
  ink2: '#7A6A60',         // warm taupe
  ink3: '#B8A89E',
  border: 'var(--tw-border, #E4D8CC)',
  borderSoft: 'var(--tw-border-soft, #EFE5D9)',
  surface: 'var(--tw-surface, #FFF6EC)',
  surface2: 'var(--tw-surface-2, #F7EADA)',
  surfaceCard: 'var(--tw-card, #FFFDF8)',
  teamsInk: '#2A1A12',
  // accent palette — driven by CSS vars so the Tweaks panel can swap them live
  terracotta: 'var(--tw-accent-mid, #C9633F)',
  terracottaSoft: 'var(--tw-accent-soft, #FFE4D2)',
  clay: 'var(--tw-accent, #A04A2C)',
  sand: '#E8C9A5',
  sun: 'var(--tw-accent-sun, #F2A03F)',
  rose: '#F5C7B0',
  cta: 'var(--tw-cta, #FF385C)',
};

// ─────────────────────────────────────────────────────────────
// Icon: thin wrapper for inline SVGs (Lucide-style)
// ─────────────────────────────────────────────────────────────
const ICONS = {
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'x': 'M18 6L6 18M6 6l12 12',
  'mountain': 'M8 3l4 8 5-5 5 15H2L8 3z',
  'palmtree': 'M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14'
};

function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 2 }) {
  // Most icons are loaded via the Lucide CDN runtime; for the few we use heavily
  // in static contexts, an inline SVG keeps things crisp without flicker.
  if (ICONS[name]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d={ICONS[name]} />
      </svg>
    );
  }
  return <i data-lucide={name} style={{ width: size, height: size, color, flexShrink: 0 }} />;
}

// ─────────────────────────────────────────────────────────────
// "airbnb / Teams" wordmark — typographic only, no bélo
// ─────────────────────────────────────────────────────────────
function Wordmark({ badgeLabel = 'Teams' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: 'Inter', fontWeight: 800, fontSize: 19, letterSpacing: '-0.04em',
        color: T.rausch, fontFeatureSettings: '"ss01"',
      }}>
        airbnb
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px',
        background: T.teamsInk, color: '#fff',
        borderRadius: 6, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        {badgeLabel}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sticky top bar (sits flush under iOS status bar)
// ─────────────────────────────────────────────────────────────
function TopBar({ scrolled, badgeLabel }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(255, 246, 236, 0.92)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      borderBottom: scrolled ? `0.5px solid ${T.border}` : '0.5px solid transparent',
      transition: 'border-color 180ms',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '40px 1fr 40px',
        alignItems: 'center', padding: '8px 16px', minHeight: 56,
      }}>
        <button aria-label="Back" style={iconBtnStyle}>
          <Icon name="chevron-left" size={22} />
        </button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Wordmark badgeLabel={badgeLabel} />
        </div>
        <button aria-label="Close" style={iconBtnStyle}>
          <Icon name="x" size={20} />
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  width: 36, height: 36, borderRadius: 999,
  border: 'none', background: 'transparent', color: T.ink,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
};

// ─────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────
function Section({ eyebrow, title, hint, children, noPad }) {
  // When `noPad` is on, the children are full-bleed (e.g. horizontal scroll)
  // but the heading block still needs the 24px gutter.
  const headPad = noPad ? '0 24px' : 0;
  return (
    <section style={{
      padding: noPad ? '28px 0 0' : '28px 24px 0',
    }}>
      {eyebrow && (
        <div style={{
          fontSize: 11, letterSpacing: '0.12em', fontWeight: 600,
          color: T.ink2, textTransform: 'uppercase', marginBottom: 8,
          padding: headPad,
        }}>{eyebrow}</div>
      )}
      {title && (
        <h2 style={{
          margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em',
          color: T.ink, lineHeight: 1.25, padding: headPad,
        }}>{title}</h2>
      )}
      {hint && (
        <p style={{ margin: '4px 0 0', fontSize: 14, color: T.ink2, lineHeight: 1.4, padding: headPad }}>{hint}</p>
      )}
      <div style={{ marginTop: 18 }}>{children}</div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Headcount slider — focal control on this screen
// ─────────────────────────────────────────────────────────────
function HeadcountSlider({ value, onChange, min = 1, max = 300, t }) {
  const pct = (value - min) / (max - min);
  const ticks = [1, 25, 50, 100, 200, 300];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontSize: 56, fontWeight: 700, letterSpacing: '-0.045em',
            lineHeight: 1, color: T.ink,
            fontVariantNumeric: 'tabular-nums',
          }}>{value}</span>
          <span style={{ fontSize: 18, color: T.ink2, fontWeight: 500 }}>
            {value === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        {t.showConcierge && value >= 80 && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            padding: '5px 10px', borderRadius: 999,
            background: T.terracottaSoft, color: T.clay,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: T.clay }} />
            Concierge match
          </span>
        )}
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 28, marginTop: 22 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', height: 4,
          transform: 'translateY(-50%)', background: T.borderSoft, borderRadius: 4,
        }} />
        <div style={{
          position: 'absolute', left: 0, top: '50%', height: 4,
          width: `${pct * 100}%`, transform: 'translateY(-50%)',
          background: `linear-gradient(90deg, ${T.sun} 0%, ${T.terracotta} 60%, ${T.clay} 100%)`,
          borderRadius: 4,
        }} />
        <input
          type="range" className="abnb-range"
          min={min} max={max} step={1}
          value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
      </div>

      {/* Tick labels */}
      <div style={{
        marginTop: 10, position: 'relative', height: 16, fontSize: 11,
        color: T.ink3, fontWeight: 500, fontVariantNumeric: 'tabular-nums',
      }}>
        {ticks.map((t) => {
          const p = (t - min) / (max - min);
          return (
            <span key={t} style={{
              position: 'absolute', left: `${p * 100}%`,
              transform: 'translateX(-50%)',
              color: value === t ? T.ink : T.ink3,
              fontWeight: value === t ? 600 : 500,
            }}>{t}</span>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Duration chips — single select
// ─────────────────────────────────────────────────────────────
const DURATIONS = [
  { id: 'weekend', label: 'Weekend', sub: '2 nights' },
  { id: 'long', label: 'Long weekend', sub: '3–4 nights' },
  { id: 'week', label: 'A week', sub: '5–7 nights' },
  { id: 'twoweeks', label: 'Two weeks', sub: '10–14 nights' },
  { id: 'custom', label: 'Custom dates', sub: 'Pick exact' },
];

function DurationChips({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {DURATIONS.map((d) => {
        const on = value === d.id;
        return (
          <button
            key={d.id} onClick={() => onChange(d.id)} className="chip"
            style={{
              border: on ? `2px solid ${T.clay}` : `1px solid ${T.border}`,
              padding: on ? '11px 15px' : '12px 16px',
              borderRadius: 999,
              background: on ? T.terracottaSoft : T.surfaceCard,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? T.clay : T.ink, lineHeight: 1.1 }}>
              {d.label}
            </span>
            <span style={{ fontSize: 11, color: on ? T.clay : T.ink2, marginTop: 2, fontVariantNumeric: 'tabular-nums', opacity: on ? 0.8 : 1 }}>
              {d.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Region cards — horizontal scroll, single select
// ─────────────────────────────────────────────────────────────
// Region palette — real photography for each destination.
// Image sources lifted to window.__resources at the top of standalone.source.html
// so the bundler can discover + inline them.
const R = window.__resources || {};
const REGIONS = [
  { id: 'mountain', label: 'Mountain West',  stays: '186 stays', img: R.regMountain  },
  { id: 'pacific',  label: 'Pacific NW',     stays: '142 stays', img: R.regPacific   },
  { id: 'socal',    label: 'SoCal coast',    stays: '98 stays',  img: R.regSocal     },
  { id: 'northeast',label: 'Northeast',      stays: '120 stays', img: R.regNortheast },
  { id: 'mexico',   label: 'Baja & Mexico',  stays: '78 stays',  img: R.regMexico    },
  { id: 'cr',       label: 'Costa Rica',     stays: '44 stays',  img: R.regCr        },
  { id: 'europe',   label: 'Europe',         stays: '210 stays', img: R.regEurope    },
  { id: 'desert',   label: 'Desert SW',      stays: '62 stays',  img: R.regDesert    },
];

function RegionCards({ value, onChange }) {
  return (
    <div className="h-scroll" style={{
      display: 'flex', gap: 12,
      overflowX: 'auto', padding: '0 24px',
      margin: '0 -24px', scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
    }}>
      {REGIONS.map((r) => {
        const on = value === r.id;
        return (
          <button
            key={r.id} onClick={() => onChange(r.id)} className="region-card"
            style={{
              flexShrink: 0, width: 144,
              border: 'none', background: 'transparent', padding: 0, textAlign: 'left',
              cursor: 'pointer', scrollSnapAlign: 'start',
            }}
          >
            <div style={{
              width: 144, height: 180, borderRadius: 16, overflow: 'hidden',
              backgroundImage: `url(${r.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: T.sand,
              position: 'relative',
              outline: on ? `2px solid ${T.clay}` : 'none',
              outlineOffset: on ? 2 : 0,
              transition: 'outline 140ms, transform 140ms',
              boxShadow: on
                ? '0 6px 18px rgba(160, 74, 44, 0.28)'
                : '0 1px 3px rgba(31, 20, 16, 0.10), 0 4px 12px rgba(31, 20, 16, 0.06)',
            }}>
              {/* subtle warm gradient overlay so label area reads on any photo */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(31,20,16,0.45) 100%)',
              }} />
              {/* in-photo location label, bottom-left */}
              <div style={{
                position: 'absolute', left: 12, right: 12, bottom: 10,
                color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em',
                textShadow: '0 1px 4px rgba(0,0,0,0.35)',
                lineHeight: 1.15,
              }}>
                {r.label}
              </div>
              {on && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 24, height: 24, borderRadius: 99, background: T.clay,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(160, 74, 44, 0.5)',
                  border: '1.5px solid #fff',
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              )}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: T.ink2, fontVariantNumeric: 'tabular-nums' }}>
              {r.stays}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Tappable search field — the primary entry for region
function RegionSearch({ value, onChange, onClear }) {
  const inputRef = useRef(null);
  return (
    <div style={{ padding: '0 24px', marginBottom: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: T.surfaceCard,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: '14px 14px',
        boxShadow: '0 1px 2px rgba(31, 20, 16, 0.05)',
      }}
      onClick={() => inputRef.current?.focus()}
      >
        <Icon name="search" size={18} color={T.ink2} strokeWidth={2.2} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search city, region, or address"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'inherit', fontSize: 15, color: T.ink,
            padding: 0,
          }}
        />
        {value ? (
          <button onClick={(e) => { e.stopPropagation(); onClear(); }} aria-label="Clear"
            style={{
              border: 'none', background: T.borderSoft, color: T.ink2,
              width: 22, height: 22, borderRadius: 99, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0,
            }}>
            <Icon name="x" size={12} strokeWidth={2.5} />
          </button>
        ) : (
          <button aria-label="Open map"
            style={{
              border: `1px solid ${T.border}`, background: T.surface,
              padding: '5px 10px', borderRadius: 99, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: T.ink,
            }}>
            <Icon name="map" size={13} strokeWidth={2.2} />
            Map
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Budget — dual-handle range with histogram backdrop
// ─────────────────────────────────────────────────────────────
const BMIN = 100, BMAX = 2000;
// pre-baked histogram heights (relative 0..1) — bell curve around ~$500
const HIST = Array.from({ length: 28 }, (_, i) => {
  const x = (i - 14) / 7;
  const v = Math.exp(-x * x);
  // add a little noise for realism
  return v * (0.85 + 0.15 * Math.sin(i * 1.7));
});

function BudgetRange({ value, onChange }) {
  const [lo, hi] = value;
  const pctLo = (lo - BMIN) / (BMAX - BMIN);
  const pctHi = (hi - BMIN) / (BMAX - BMIN);
  const fmt = (n) => '$' + n.toLocaleString();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(lo)} – {fmt(hi)}{hi === BMAX ? '+' : ''}
        </span>
      </div>
      <div style={{ fontSize: 12, color: T.ink2, marginBottom: 16 }}>per person · per night</div>

      {/* Histogram */}
      <div style={{ position: 'relative', height: 72 }}>
        <div style={{
          position: 'absolute', inset: '0 0 14px 0',
          display: 'flex', alignItems: 'flex-end', gap: 2,
        }}>
          {HIST.map((h, i) => {
            const p = i / (HIST.length - 1);
            const inRange = p >= pctLo && p <= pctHi;
            // gradient across the bars when in range — sunset across the histogram
            const grad = `linear-gradient(180deg, ${T.sun} 0%, ${T.terracotta} 70%, ${T.clay} 100%)`;
            return (
              <div key={i} style={{
                flex: 1, height: `${Math.max(8, h * 100)}%`,
                borderRadius: 2,
                background: inRange ? grad : T.borderSoft,
                transition: 'background 120ms, opacity 120ms',
                opacity: inRange ? 1 : 0.85,
              }} />
            );
          })}
        </div>

        {/* Track */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 7, height: 4,
          background: T.borderSoft, borderRadius: 4,
        }} />
        <div style={{
          position: 'absolute', bottom: 7, height: 4, borderRadius: 4,
          left: `${pctLo * 100}%`, right: `${(1 - pctHi) * 100}%`,
          background: `linear-gradient(90deg, ${T.sun}, ${T.terracotta}, ${T.clay})`,
        }} />

        {/* Two stacked inputs */}
        <input
          type="range" className="abnb-range" min={BMIN} max={BMAX} step={25}
          value={lo}
          onChange={(e) => {
            const v = Math.min(parseInt(e.target.value, 10), hi - 25);
            onChange([v, hi]);
          }}
          style={{ top: 'auto', bottom: -8, height: 28 }}
        />
        <input
          type="range" className="abnb-range" min={BMIN} max={BMAX} step={25}
          value={hi}
          onChange={(e) => {
            const v = Math.max(parseInt(e.target.value, 10), lo + 25);
            onChange([lo, v]);
          }}
          style={{ top: 'auto', bottom: -8, height: 28 }}
        />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: T.ink3, marginTop: 12,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span>$100</span>
        <span>$2,000+</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Amenities — multi-select chip cloud, grouped by intent
// ─────────────────────────────────────────────────────────────
const AMENITY_GROUPS = [
  {
    label: 'Wellness',
    items: [
      { id: 'yoga', label: 'Yoga / movement studio', icon: 'flower-2' },
      { id: 'sauna', label: 'Sauna', icon: 'flame' },
      { id: 'hottub', label: 'Hot tub', icon: 'droplets' },
      { id: 'meditation', label: 'Quiet meditation space', icon: 'feather' },
      { id: 'pool', label: 'Pool', icon: 'waves' },
      { id: 'gym', label: 'Gym', icon: 'dumbbell' },
    ],
  },
  {
    label: 'Outdoors',
    items: [
      { id: 'trails', label: 'Hiking trails on-site', icon: 'mountain-snow' },
      { id: 'cycling', label: 'Cycling routes', icon: 'bike' },
      { id: 'lake', label: 'Lake or ocean access', icon: 'sailboat' },
      { id: 'private', label: 'Private grounds', icon: 'trees' },
      { id: 'firepit', label: 'Bonfire pit', icon: 'flame' },
      { id: 'garden', label: 'Garden / farm', icon: 'sprout' },
    ],
  },
  {
    label: 'For working sessions',
    items: [
      { id: 'kitchen', label: "Chef's kitchen", icon: 'chef-hat' },
      { id: 'av', label: 'AV setup', icon: 'monitor' },
      { id: 'workspace', label: 'Workspace nook', icon: 'laptop' },
      { id: 'wifi', label: 'Fiber wifi', icon: 'wifi' },
    ],
  },
];

function AmenityChips({ selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {AMENITY_GROUPS.map((g) => (
        <div key={g.label}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: T.ink2,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 10,
          }}>{g.label}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {g.items.map((a) => {
              const on = selected.has(a.id);
              return (
                <button
                  key={a.id} onClick={() => onToggle(a.id)} className="chip"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: on ? `2px solid ${T.clay}` : `1px solid ${T.border}`,
                    padding: on ? '8px 13px' : '9px 14px',
                    borderRadius: 999,
                    background: on ? T.terracottaSoft : T.surfaceCard,
                    cursor: 'pointer',
                  }}
                >
                  <Icon name={a.icon} size={15} color={on ? T.clay : T.ink} strokeWidth={2.2} />
                  <span style={{
                    fontSize: 13, fontWeight: on ? 600 : 500, color: on ? T.clay : T.ink, letterSpacing: '-0.005em',
                  }}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer — sticky continue
// ─────────────────────────────────────────────────────────────
function Footer({ matchCount, onContinue }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 30,
      background: 'rgba(255, 246, 236, 0.92)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      borderTop: `0.5px solid ${T.border}`,
      padding: '14px 24px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, lineHeight: 1.1 }}>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{matchCount}</span> venues match
          </div>
          <div style={{ fontSize: 11, color: T.ink2, marginTop: 2 }}>
            Updated as you choose
          </div>
        </div>
        <button onClick={onContinue} className="cta" style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          background: T.cta,
          color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.005em',
          padding: '14px 22px', borderRadius: 999,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(0,0,0,0.18), 0 4px 14px rgba(0,0,0,0.12)',
        }}>
          Continue
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// The screen
// ─────────────────────────────────────────────────────────────
function IntakeScreen({ t }) {
  const [screen, setScreen] = useState('intake'); // 'intake' | 'results'
  const [headcount, setHeadcount] = useState(24);
  const [duration, setDuration] = useState('week');
  const [region, setRegion] = useState('mountain');
  const [regionQuery, setRegionQuery] = useState('');
  const [budget, setBudget] = useState([350, 800]);
  const [amenities, setAmenities] = useState(
    new Set(['yoga', 'trails', 'cycling', 'private', 'kitchen'])
  );
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  // Render lucide icons after each render
  useEffect(() => {
    if (window.lucide) {
      try { window.lucide.createIcons({ attrs: { 'stroke-width': '2.1' } }); }
      catch (e) {}
    }
  });

  // Estimate match count from inputs (fake but lively)
  const matchCount = useMemo(() => {
    let base = 480;
    base -= Math.round((headcount - 1) * 1.0);
    if (region !== 'anywhere') base = Math.round(base * 0.45);
    base = Math.round(base * (1 - (amenities.size * 0.04)));
    const budgetSpan = budget[1] - budget[0];
    base = Math.round(base * Math.min(1, 0.4 + budgetSpan / 1200));
    if (duration === 'twoweeks') base = Math.round(base * 0.7);
    return Math.max(8, base);
  }, [headcount, region, budget, amenities, duration]);

  const onScroll = (e) => setScrolled(e.target.scrollTop > 4);
  const toggleAmenity = (id) => {
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // CSS-variable map for tweakable colors. Set on the screen root so every
  // descendant — including those reaching T.clay / T.terracottaSoft / etc —
  // picks up the new values when accent or surface changes.
  const cssVars = {
    '--tw-accent':       t.accent[0],
    '--tw-accent-soft':  t.accent[1],
    '--tw-accent-mid':   t.accent[2],
    '--tw-accent-sun':   t.accent[3],
    '--tw-surface':      t.surface[0],
    '--tw-surface-2':    t.surface[1],
    '--tw-card':         t.surface[2],
    '--tw-border':       t.surface[3],
    '--tw-border-soft':  t.surface[4],
    '--tw-cta':          t.ctaColor,
  };

  const intakeView = (
    <div style={{
      ...cssVars,
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: `radial-gradient(120% 80% at 50% 0%, ${t.surface[1]} 0%, ${t.surface[0]} 55%, ${t.surface[0]} 100%)`,
      fontFamily: 'Inter, sans-serif',
    }}>
      <TopBar scrolled={scrolled} badgeLabel={t.teamsBadge} />

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="device-scroll"
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Title block */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, color: T.clay,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: T.terracotta }} />
            New trip · {t.companyName}
          </div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em',
            color: T.ink, lineHeight: 1.1,
          }}>
            Let's plan your team's stay.
          </h1>
          <p style={{
            margin: '8px 0 0', fontSize: 15, color: T.ink2, lineHeight: 1.4,
          }}>
            Hey {t.firstName} — answer a few quick questions and we'll surface venues that fit how your team works.
          </p>
        </div>

        <Section eyebrow="How many" title="Group size">
          <HeadcountSlider value={headcount} onChange={setHeadcount} t={t} />
        </Section>

        <Section eyebrow="How long" title="Length of stay">
          <DurationChips value={duration} onChange={setDuration} />
        </Section>

        <Section eyebrow="Where to" title="Location" hint="Search for your destination" noPad>
          <RegionSearch
            value={regionQuery}
            onChange={(v) => { setRegionQuery(v); }}
            onClear={() => setRegionQuery('')}
          />
          <div style={{
            padding: '0 24px 10px', fontSize: 11, fontWeight: 600,
            color: T.ink2, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{t.curatedLabel}</div>
          <RegionCards value={region} onChange={setRegion} />
        </Section>

        <Section eyebrow="Per head" title="Budget" hint="Lodging only — meals and travel billed separately.">
          <BudgetRange value={budget} onChange={setBudget} />
        </Section>

        <Section
          eyebrow="The vibe"
          title="Must-haves"
          hint="Pick anything that matters. The more you choose, the more focused your results."
        >
          <AmenityChips selected={amenities} onToggle={toggleAmenity} />
        </Section>

        {/* tail spacer */}
        <div style={{ height: 32 }} />
      </div>

      <Footer matchCount={matchCount} onContinue={() => setScreen('results')} />
    </div>
  );

  // Results screen reuses the same tweakable theme and reads intake state.
  if (screen === 'results') {
    const RS = window.ResultsScreen;
    if (RS) {
      return (
        <RS
          t={t}
          intake={{ headcount, duration, region, budget, amenities }}
          onBack={() => setScreen('intake')}
        />
      );
    }
  }

  return intakeView;
}

// Share things ResultsScreen (separate Babel script) needs.
window.T = T;
window.Wordmark = Wordmark;

// ─────────────────────────────────────────────────────────────
// Workspace shell — device + design notes + tweaks panel
// ─────────────────────────────────────────────────────────────
const ACCENT_PALETTES = [
  ['#A04A2C', '#FFE4D2', '#C9633F', '#F2A03F'],  // Terracotta sunset (default)
  ['#6D3F62', '#F1E0EE', '#8E5A82', '#C896BD'],  // Dusk plum
  ['#3D5F38', '#DCE9D5', '#5F8859', '#A8C99A'],  // Forest
  ['#1F1410', '#EEE7DE', '#3A2A22', '#7A6A60'],  // Classic ink
];

const SURFACE_PALETTES = [
  ['#FFF6EC', '#F7EADA', '#FFFDF8', '#E4D8CC', '#EFE5D9'],  // Warm cream (default)
  ['#FFFFFF', '#F7F7F7', '#FFFFFF', '#DDDDDD', '#EBEBEB'],  // Pure white
  ['#F4ECDF', '#E8D7BD', '#FFFDF8', '#D8C5A8', '#E7D8BD'],  // Sand
  ['#F1ECE8', '#E5DDD3', '#FFFFFF', '#D8CCBE', '#E8DFD2'],  // Stone
];

const CTA_COLORS = ['#FF385C', '#A04A2C', '#1F1410'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <div className="workspace">
      <IOSDevice width={402} height={874}>
        <IntakeScreen t={t} />
      </IOSDevice>

      <aside className="notes">
        <div className="eyebrow">Hi-fi · v3 · tweakable</div>
        <h2>Airbnb for Teams — Intake</h2>
        <p>
          A single mobile prompt that captures everything a corporate booker like {t.firstName} needs in one
          pass: headcount, length, region, budget, and ethos-aligned amenities. The slider is the
          focal control — it's the one input that most reshapes what the team sees next.
        </p>
        <p>
          Tap the Tweaks button in the toolbar to swap accent palette, surface temperature, CTA color,
          and copy specific to {t.companyName}.
        </p>
        <div className="pill-row">
          <div className="pill">Accent: 4 palettes</div>
          <div className="pill">Surface: 4 temperatures</div>
          <div className="pill">CTA: 3 options</div>
          <div className="pill">Editable copy</div>
        </div>
      </aside>

      <TweaksPanel>
        <TweakSection label="Palette" />
        <TweakColor label="Accent" value={t.accent} options={ACCENT_PALETTES}
          onChange={(v) => setTweak('accent', v)} />
        <TweakColor label="Surface" value={t.surface} options={SURFACE_PALETTES}
          onChange={(v) => setTweak('surface', v)} />
        <TweakColor label="CTA" value={t.ctaColor} options={CTA_COLORS}
          onChange={(v) => setTweak('ctaColor', v)} />

        <TweakSection label="Identity" />
        <TweakRadio label="Badge" value={t.teamsBadge}
          options={['Teams', 'Work', 'Crew']}
          onChange={(v) => setTweak('teamsBadge', v)} />
        <TweakSelect label="Curated row" value={t.curatedLabel}
          options={['Popular with teams', 'Top retreats', "Editor's picks"]}
          onChange={(v) => setTweak('curatedLabel', v)} />

        <TweakSection label="Copy" />
        <TweakText label="First name" value={t.firstName}
          onChange={(v) => setTweak('firstName', v)} />
        <TweakText label="Company" value={t.companyName}
          onChange={(v) => setTweak('companyName', v)} />

        <TweakSection label="Behavior" />
        <TweakToggle label="Show concierge badge" value={t.showConcierge}
          onChange={(v) => setTweak('showConcierge', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
