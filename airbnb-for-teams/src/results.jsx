// Airbnb for Teams — Results screen
// Renders the property list shown after Continue is tapped on the intake.
//
// This script is a sibling to app.jsx — Babel scripts don't share scope, so we
// pull React hooks and shared tokens off `window` (set by app.jsx) at the top.

const { useState, useEffect } = React;
const T = window.T;
const Wordmark = window.Wordmark;

// ─────────────────────────────────────────────────────────────
// Property data — wellness/team-retreat venues
// ─────────────────────────────────────────────────────────────
const PROPERTIES = [
  {
    id: 'pine-ridge',
    title: 'Pine Ridge Lodge',
    location: 'Aspen, Colorado',
    description: 'Timber-frame lodge on 40 acres with a yoga studio, outdoor sauna, and singletrack cycling trails from the door.',
    capacity: 28,
    price: 540,
    tags: ['Yoga studio', 'Cycling trails', 'Sauna'],
    img: window.__resources.propPineRidge,
    rating: 4.96,
    reviews: 142,
    featured: true,
  },
  {
    id: 'cedar-creek',
    title: 'Cedar Creek Retreat',
    location: 'Bend, Oregon',
    description: 'Modern barnhouse with a chef-equipped kitchen and 14km of gravel routes through high desert.',
    capacity: 22,
    price: 410,
    tags: ['Chef kitchen', 'Cycling', 'Hot tub'],
    img: window.__resources.propCedarCreek,
    rating: 4.91,
    reviews: 88,
  },
  {
    id: 'stone-hollow',
    title: 'Stone Hollow Estate',
    location: 'Sedona, Arizona',
    description: 'Red-rock canyon estate with private hiking, a heated lap pool, and a sunrise meditation deck.',
    capacity: 32,
    price: 620,
    tags: ['Pool', 'Meditation', 'Trails'],
    img: window.__resources.propStoneHollow,
    rating: 4.88,
    reviews: 67,
  },
  {
    id: 'fjord-house',
    title: 'Fjord House',
    location: 'Mount Hood, Oregon',
    description: 'A-frame cabin compound with a glass-walled gym, cold plunge, and trail network behind the property.',
    capacity: 24,
    price: 480,
    tags: ['Gym', 'Cold plunge', 'Trails'],
    img: window.__resources.propFjordHouse,
    rating: 4.94,
    reviews: 104,
  },
  {
    id: 'high-meadow',
    title: 'High Meadow Farm',
    location: 'Sun Valley, Idaho',
    description: 'Working farm with an on-site nutritionist-friendly kitchen garden and 30 miles of cycling routes.',
    capacity: 26,
    price: 395,
    tags: ['Farm', 'Cycling', 'Kitchen garden'],
    img: window.__resources.propHighMeadow,
    rating: 4.85,
    reviews: 53,
  },
  {
    id: 'wolf-creek',
    title: 'Wolf Creek Ranch',
    location: 'Telluride, Colorado',
    description: 'Sprawling ranch with a wood-fired sauna, riverside firepits, and a chef-led nutrition program.',
    capacity: 36,
    price: 695,
    tags: ['Sauna', 'Bonfire', 'Chef kitchen'],
    img: window.__resources.propWolfCreek,
    rating: 4.97,
    reviews: 211,
  },
];

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────
function SummaryChips({ headcount, duration, region, budget }) {
  const regionLabel = {
    mountain: 'Mountain West', pacific: 'Pacific NW', socal: 'SoCal coast',
    northeast: 'Northeast', mexico: 'Baja & Mexico', cr: 'Costa Rica',
    europe: 'Europe', desert: 'Desert SW',
  }[region] || 'Anywhere';
  const durationLabel = {
    weekend: '2 nights', long: '3–4 nights', week: '5–7 nights',
    twoweeks: '10–14 nights', custom: 'Custom dates',
  }[duration] || 'Flexible';
  const chips = [
    `${headcount} guests`,
    durationLabel,
    regionLabel,
    `$${budget[0]}–$${budget[1] === 2000 ? '2k+' : budget[1]}/night`,
  ];

  return (
    <div className="h-scroll" style={{
      display: 'flex', gap: 8, overflowX: 'auto',
      padding: '0 24px 4px', margin: '0 -24px',
    }}>
      {chips.map((c) => (
        <span key={c} style={{
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 999,
          background: T.surfaceCard, border: `1px solid ${T.border}`,
          fontSize: 12, fontWeight: 600, color: T.ink,
          fontVariantNumeric: 'tabular-nums',
        }}>{c}</span>
      ))}
    </div>
  );
}

function PropertyCard({ p }) {
  return (
    <article style={{
      display: 'flex', gap: 14, padding: '16px 0',
      borderBottom: `0.5px solid ${T.borderSoft}`,
      cursor: 'pointer',
    }}>
      <div style={{
        flexShrink: 0, width: 104, height: 104, borderRadius: 14,
        backgroundImage: `url(${p.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundColor: T.sand,
        position: 'relative',
        boxShadow: '0 1px 2px rgba(31,20,16,0.08), 0 4px 10px rgba(31,20,16,0.06)',
      }}>
        {p.featured && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            padding: '3px 7px', borderRadius: 99,
            background: 'rgba(255,255,255,0.95)',
            color: T.clay, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: T.clay }} />
            Top pick
          </span>
        )}
        <button aria-label="Save" style={{
          position: 'absolute', top: 6, right: 6,
          width: 28, height: 28, borderRadius: 99, border: 'none',
          background: 'rgba(255,255,255,0.85)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{
            margin: 0, fontSize: 15, fontWeight: 700, color: T.ink,
            letterSpacing: '-0.01em', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{p.title}</h3>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 12, fontWeight: 600, color: T.ink,
            flexShrink: 0,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={T.ink} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {p.rating} <span style={{ color: T.ink2, fontWeight: 500 }}>({p.reviews})</span>
          </span>
        </div>

        <div style={{ fontSize: 12, color: T.ink2, marginTop: 2 }}>
          {p.location} · sleeps {p.capacity}
        </div>

        <p style={{
          margin: '6px 0 0', fontSize: 13, color: T.ink, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{p.description}</p>

        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginTop: 8, gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.tags.slice(0, 2).map((tag) => (
              <span key={tag} style={{
                fontSize: 10.5, fontWeight: 600, color: T.clay,
                padding: '3px 7px', borderRadius: 99,
                background: T.terracottaSoft,
              }}>{tag}</span>
            ))}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: T.ink,
            letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
          }}>
            ${p.price}<span style={{ fontSize: 11, fontWeight: 500, color: T.ink2 }}>/person</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// Results screen
// ─────────────────────────────────────────────────────────────
function ResultsScreen({ t, intake, onBack }) {
  const [shown, setShown] = useState(4);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      try { window.lucide.createIcons({ attrs: { 'stroke-width': '2.1' } }); }
      catch (e) {}
    }
  });

  const totalMatches = 47; // illustrative — in product would derive from filters
  const visible = PROPERTIES.slice(0, shown);
  const hasMore = shown < PROPERTIES.length || true; // always show load-more affordance

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

  return (
    <div style={{
      ...cssVars,
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: t.surface[0],
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Top bar — back + wordmark + filter */}
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
          <button onClick={onBack} aria-label="Back" style={{
            width: 36, height: 36, borderRadius: 999,
            border: 'none', background: 'transparent', color: T.ink,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Wordmark badgeLabel={t.teamsBadge} />
          </div>
          <button aria-label="Filter" style={{
            width: 36, height: 36, borderRadius: 999,
            border: 'none', background: 'transparent', color: T.ink,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div
        onScroll={(e) => setScrolled(e.target.scrollTop > 4)}
        className="device-scroll"
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Title + match count */}
        <div style={{ padding: '20px 24px 16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, color: T.clay,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: T.terracotta }} />
            Curated for {t.companyName}
          </div>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em',
            color: T.ink, lineHeight: 1.15,
          }}>
            {totalMatches} venues match your team.
          </h1>
          <p style={{
            margin: '6px 0 0', fontSize: 14, color: T.ink2, lineHeight: 1.4,
          }}>
            Sorted by fit. Tap any venue to see availability for your dates.
          </p>
        </div>

        {/* Summary chips */}
        <SummaryChips
          headcount={intake.headcount}
          duration={intake.duration}
          region={intake.region}
          budget={intake.budget}
        />

        {/* Property list */}
        <div style={{ padding: '8px 24px 0' }}>
          {visible.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}

          {/* Load more */}
          <div style={{
            padding: '20px 0 28px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <button
              onClick={() => setShown((s) => Math.min(s + 4, PROPERTIES.length))}
              className="cta"
              style={{
                appearance: 'none', border: `1px solid ${T.ink}`,
                background: 'transparent', color: T.ink,
                fontWeight: 700, fontSize: 14, letterSpacing: '-0.005em',
                padding: '12px 24px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Load more venues
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <span style={{
              fontSize: 11, color: T.ink2, fontVariantNumeric: 'tabular-nums',
            }}>
              Showing {visible.length} of {totalMatches}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Expose to other Babel-transpiled scripts (app.jsx looks for window.ResultsScreen)
window.ResultsScreen = ResultsScreen;
