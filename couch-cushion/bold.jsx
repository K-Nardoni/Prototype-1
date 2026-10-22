// bold.jsx — Couch Cushion · Bold variation
// Same 4-stage flow, dark canvas, vibrant bar visualization, data-forward.

function BoldFlow({ surplus, showWorstCase, volatility }) {
  const recommended = React.useMemo(() => aiRecommendation(surplus), [surplus]);
  const F = useFlow({ surplus, recommended });

  return (
    <IOSDevice width={402} height={874} dark>
      <div style={{ height: '100%', background: '#0A1310', position: 'relative', overflow: 'hidden' }}>
        {F.stage === 'notif' && <BoldNotif F={F} surplus={surplus} />}
        {F.stage !== 'notif' && (
          <BoldMain F={F} surplus={surplus} recommended={recommended}
            showWorstCase={showWorstCase} volatility={volatility} />
        )}
      </div>
    </IOSDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: notification
// ─────────────────────────────────────────────────────────────
function BoldNotif({ F, surplus }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0A1310',
      color: '#E5F3EA',
      display: 'flex', flexDirection: 'column',
      padding: '120px 24px 110px',
    }}>
      {/* Glowing lime accent in corner */}
      <div style={{
        position: 'absolute', top: 80, right: -40, width: 200, height: 200,
        borderRadius: 999,
        background: 'radial-gradient(circle, rgba(45,212,191,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: '"JetBrains Mono"', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: KN.lime, marginBottom: 12,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 999, background: KN.lime,
            animation: 'cc-pulse-dot 1.6s ease-in-out infinite',
          }} />
          COUCH CUSHION · LIVE
        </div>

        <div style={{
          fontFamily: '"DM Sans"', fontWeight: 600,
          fontSize: 44, lineHeight: 1.0, letterSpacing: '-0.035em',
          marginBottom: 14,
        }}>
          Your end of May<br />summary.
        </div>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 16, lineHeight: 1.45,
          color: 'rgba(229,243,234,0.65)', marginBottom: 20,
        }}>
          You finished with <span style={{ color: KN.lime, fontWeight: 600 }}>{fmtMoney(surplus)}</span> left over.
          Three options, three different futures.
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => F.setStage('decide')} style={{
          height: 56, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: KN.lime, color: KN.ink,
          fontFamily: '"DM Sans"', fontSize: 16, fontWeight: 600,
          letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 12px 32px -8px rgba(45,212,191,0.5)',
        }}>
          Decide now <KnIcon name="arrow-right" size={18} stroke={2.75} />
        </button>
        <button style={{
          height: 48, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'transparent', color: 'rgba(229,243,234,0.55)',
          fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 500,
        }}>
          Remind me tomorrow
        </button>
      </div>

      <style>{`
        @keyframes cc-pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.6); }
          50% { box-shadow: 0 0 0 6px rgba(45,212,191,0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main wrapper
// ─────────────────────────────────────────────────────────────
function BoldMain({ F, surplus, recommended, showWorstCase, volatility }) {
  const stages = ['decide', 'confirm', 'goal', 'done'];
  const stageIdx = stages.indexOf(F.stage);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#E5F3EA' }}>
      {/* Header */}
      <div style={{ paddingTop: 56, paddingBottom: 8, paddingLeft: 20, paddingRight: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => {
          if (F.stage === 'decide') F.setStage('notif');
          else if (F.stage === 'confirm') F.setStage('decide');
          else if (F.stage === 'goal') F.setStage('confirm');
          else if (F.stage === 'done') F.reset();
        }} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.08)', color: '#E5F3EA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <KnIcon name={F.stage === 'done' ? 'x' : 'arrow-left'} size={18} stroke={2.5} />
        </button>
        {/* Stepper */}
        <div style={{ display: 'flex', gap: 6 }}>
          {stages.map((s, i) => (
            <div key={s} style={{
              width: i === stageIdx ? 22 : 6, height: 4, borderRadius: 999,
              background: i <= stageIdx ? KN.lime : 'rgba(255,255,255,0.15)',
              transition: 'all 220ms cubic-bezier(0.32, 0.72, 0, 1)',
            }} />
          ))}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {F.stage === 'decide' && (
          <BoldDecide F={F} surplus={surplus} recommended={recommended}
            showWorstCase={showWorstCase} volatility={volatility} />
        )}
        {F.stage === 'confirm' && (
          <BoldConfirm F={F} surplus={surplus}
            showWorstCase={showWorstCase} volatility={volatility} />
        )}
        {F.stage === 'goal' && <BoldGoal F={F} />}
        {F.stage === 'done' && <BoldDone F={F} surplus={surplus} />}
      </div>

      {/* Footer CTA */}
      {F.stage !== 'done' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 25,
          padding: '16px 20px 38px',
          background: 'linear-gradient(180deg, rgba(10,19,16,0) 0%, rgba(10,19,16,0.96) 30%)',
        }}>
          <BoldCta F={F} />
        </div>
      )}
    </div>
  );
}

function BoldCta({ F }) {
  const labels = {
    decide:  'Lock it in',
    confirm: F.alloc.cushion > 0 ? 'Route to cushion goal' : 'Send the money',
    goal:    'Move the money',
  };
  const next = {
    decide:  'confirm',
    confirm: F.alloc.cushion > 0 ? 'goal' : 'done',
    goal:    'done',
  };
  return (
    <button onClick={() => F.setStage(next[F.stage])} style={{
      width: '100%', height: 56, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: KN.lime, color: KN.ink,
      fontFamily: '"DM Sans"', fontSize: 16, fontWeight: 600,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: '0 12px 32px -8px rgba(45,212,191,0.45)',
    }}>
      {labels[F.stage]} <KnIcon name="arrow-right" size={18} stroke={2.75} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: DECIDE — three vertical bars, draggable tops
// ─────────────────────────────────────────────────────────────
function BoldDecide({ F, surplus, recommended, showWorstCase, volatility }) {
  return (
    <div style={{ padding: '4px 20px 0' }}>
      <div style={{
        fontFamily: '"JetBrains Mono"', fontSize: 11, fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(229,243,234,0.5)',
      }}>SURPLUS · MAY</div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4,
      }}>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 56, fontWeight: 600,
          letterSpacing: '-0.035em', lineHeight: 1.0,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <span style={{ fontSize: 28, fontWeight: 500, opacity: 0.5, marginRight: 4 }}>$</span>
          {surplus}
        </div>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: 'rgba(229,243,234,0.45)' }}>to allocate</div>
      </div>

      {/* Bars */}
      <div style={{ marginTop: 28 }}>
        <BarAllocator F={F} surplus={surplus} recommended={recommended}
          showWorstCase={showWorstCase} volatility={volatility} />
      </div>

      {/* AI nudge */}
      {!F.hasAcceptedAi && (
        <div onClick={F.acceptAi} style={{
          marginTop: 14, cursor: 'pointer',
          padding: '14px 16px', borderRadius: 16,
          background: 'rgba(45,212,191,0.08)',
          border: '1px solid rgba(45,212,191,0.25)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #0FCC7A, #2DD4BF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: KN.ink,
            flexShrink: 0,
          }}>
            <KnIcon name="sparkles" size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600, color: KN.lime,
              marginBottom: 2,
            }}>My take: cushion-heavy</div>
            <div style={{
              fontFamily: '"DM Sans"', fontSize: 12, color: 'rgba(229,243,234,0.65)',
              lineHeight: 1.4,
            }}>
              {fmtMoney(recommended.checking, { cents: false })}/{fmtMoney(recommended.cushion, { cents: false })}/{fmtMoney(recommended.stocks, { cents: false })} — emergency fund first
            </div>
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono"', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.08em', color: KN.lime,
          }}>TAP</div>
        </div>
      )}

      {/* 6mo returns row */}
      <ReturnsBar F={F} showWorstCase={showWorstCase} volatility={volatility} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BarAllocator — 3 vertical bars, drag handles at the top
// ─────────────────────────────────────────────────────────────
const BAR_MAX_H = 240; // px = surplus
const BAR_MIN_H = 24;  // shown for 0-amount so the bucket is still visible

function BarAllocator({ F, surplus, recommended, showWorstCase, volatility }) {
  const containerRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(null); // key
  const [startY, setStartY] = React.useState(0);
  const [startVal, setStartVal] = React.useState(0);

  const startDrag = (key) => (e) => {
    e.preventDefault();
    setDragging(key);
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    setStartY(y);
    setStartVal(F.alloc[key]);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      const dy = startY - y; // up = positive
      const pxPerDollar = BAR_MAX_H / surplus;
      const newVal = startVal + dy / pxPerDollar;
      F.setAllocFor(dragging, newVal);
    };
    const up = () => setDragging(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging, startY, startVal, surplus, F]);

  const heightFor = (v) => Math.max(BAR_MIN_H, (v / surplus) * BAR_MAX_H);

  const bars = [
    { key: 'checking', amount: F.alloc.checking, color: 'rgba(229,243,234,0.18)', edgeColor: 'rgba(229,243,234,0.45)',
      label: 'Checking', apy: 0, rec: recommended.checking, icon: 'wallet' },
    { key: 'cushion', amount: F.alloc.cushion, color: KN.primary, edgeColor: '#0FCC7A',
      label: 'Cushion', apy: 0.04, rec: recommended.cushion, icon: 'sofa' },
    { key: 'stocks', amount: F.alloc.stocks, color: KN.lime, edgeColor: KN.lime,
      label: 'S&P', apy: 0.087, rec: recommended.stocks, icon: 'trending-up' },
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Bars row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        height: BAR_MAX_H + 40, alignItems: 'end',
        position: 'relative',
      }}>
        {bars.map(b => (
          <BoldBar key={b.key} b={b} surplus={surplus}
            heightFor={heightFor} onStartDrag={startDrag(b.key)} isDragging={dragging === b.key} />
        ))}
      </div>

      {/* Below: labels with $ + % + 6mo return */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        marginTop: 14,
      }}>
        {bars.map(b => {
          const ret = projectedReturn(b.amount, b.apy);
          const pct = surplus > 0 ? (b.amount / surplus) * 100 : 0;
          return (
            <div key={b.key} style={{
              padding: '10px 12px', borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(255,255,255,0.06)`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
                color: b.edgeColor,
              }}>
                <KnIcon name={b.icon} size={12} />
                <span style={{
                  fontFamily: '"JetBrains Mono"', fontSize: 9, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{b.label}</span>
              </div>
              <div style={{
                fontFamily: '"DM Sans"', fontSize: 20, fontWeight: 600,
                letterSpacing: '-0.018em', color: '#fff',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>{fmtMoney(b.amount, { cents: false })}</div>
              <div style={{
                fontFamily: '"JetBrains Mono"', fontSize: 9, color: 'rgba(229,243,234,0.4)',
                marginTop: 4, letterSpacing: '0.05em',
              }}>{Math.round(pct)}% · {b.apy === 0 ? 'NO APY' : (b.apy * 100).toFixed(b.apy < 0.05 ? 0 : 1) + '%'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoldBar({ b, surplus, heightFor, onStartDrag, isDragging }) {
  const h = heightFor(b.amount);
  const recH = heightFor(b.rec);
  const showRec = Math.abs(b.amount - b.rec) > 1;

  return (
    <div style={{ position: 'relative', height: BAR_MAX_H + 40 }}>
      {/* Floor reference line */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0, height: 1,
        background: 'rgba(255,255,255,0.06)',
      }} />

      {/* AI recommendation ghost line */}
      {showRec && (
        <div style={{
          position: 'absolute', left: -2, right: -2,
          bottom: 40 + recH - 1,
          height: 2,
          background: `repeating-linear-gradient(90deg, ${KN.lime} 0 4px, transparent 4px 8px)`,
          opacity: 0.55,
        }}>
          <div style={{
            position: 'absolute', right: 0, top: -16,
            fontFamily: '"JetBrains Mono"', fontSize: 8, fontWeight: 500,
            letterSpacing: '0.08em', color: KN.lime, opacity: 0.7,
          }}>AI</div>
        </div>
      )}

      {/* The bar */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0,
        height: h,
        background: b.color,
        borderRadius: '10px 10px 0 0',
        transition: isDragging ? 'none' : 'height 220ms cubic-bezier(0.32, 0.72, 0, 1)',
        boxShadow: b.key === 'stocks' ? '0 0 24px -4px rgba(45,212,191,0.4)' : 'none',
        overflow: 'hidden',
      }}>
        {/* gradient sheen */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 30%)',
        }} />
        {/* inner amount label, if there's room */}
        {h > 60 && b.amount > 0 && (
          <div style={{
            position: 'absolute', top: 12, left: 0, right: 0,
            textAlign: 'center',
            fontFamily: '"DM Sans"', fontSize: 18, fontWeight: 700,
            color: b.key === 'checking' ? '#E5F3EA' : KN.ink,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
          }}>{fmtMoney(b.amount, { cents: false })}</div>
        )}
      </div>

      {/* Drag handle (grip at top of bar) */}
      <div
        onPointerDown={onStartDrag}
        style={{
          position: 'absolute', bottom: 40 + h - 14, left: 0, right: 0,
          height: 28, cursor: 'ns-resize', touchAction: 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          transition: isDragging ? 'none' : 'bottom 220ms cubic-bezier(0.32, 0.72, 0, 1)',
          zIndex: 2,
        }}>
        <div style={{
          width: '70%', height: 4, borderRadius: 999,
          background: b.key === 'checking' ? 'rgba(229,243,234,0.6)' : KN.ink,
          opacity: 0.65,
        }} />
        <div style={{
          position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 12, borderRadius: 999,
          background: '#fff', border: '2px solid ' + b.edgeColor,
          boxShadow: isDragging
            ? `0 0 0 6px rgba(45,212,191,0.2), 0 4px 12px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.4)',
        }} />
      </div>
    </div>
  );
}

function ReturnsBar({ F, showWorstCase, volatility }) {
  const a = F.alloc;
  const totalRet = projectedReturn(a.cushion, 0.04) + projectedReturn(a.stocks, 0.087);
  const worst = projectedReturn(a.cushion, 0.04) + worstCaseStocks(a.stocks, volatility);
  const best  = projectedReturn(a.cushion, 0.04) + bestCaseStocks(a.stocks, volatility);

  return (
    <div style={{
      marginTop: 16, padding: 16, borderRadius: 18,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          fontFamily: '"JetBrains Mono"', fontSize: 10, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(229,243,234,0.5)',
        }}>6-month projection</div>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 11, color: 'rgba(229,243,234,0.4)',
        }}>expected</div>
      </div>

      <div style={{
        fontFamily: '"DM Sans"', fontSize: 36, fontWeight: 600,
        letterSpacing: '-0.028em', color: KN.lime,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>
        {totalRet > 0 ? '+' : ''}{fmtMoney(totalRet)}
      </div>

      {showWorstCase && a.stocks > 0 && (
        <div style={{
          marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <RangeBar worst={worst} best={best} expected={totalRet} />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: '"DM Sans"', fontSize: 12, marginTop: 8,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ color: '#FFB3A8' }}>
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: 9, letterSpacing: '0.08em',
                textTransform: 'uppercase', display: 'block', opacity: 0.65,
              }}>WORST</span>
              {fmtMoney(worst, { sign: true })}
            </span>
            <span style={{ color: KN.lime, textAlign: 'right' }}>
              <span style={{
                fontFamily: '"JetBrains Mono"', fontSize: 9, letterSpacing: '0.08em',
                textTransform: 'uppercase', display: 'block', opacity: 0.65,
              }}>BEST</span>
              {fmtMoney(best, { sign: true })}
            </span>
          </div>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 11, color: 'rgba(229,243,234,0.4)',
            marginTop: 10, lineHeight: 1.4,
          }}>
            S&P historic 6mo band: −10% to +25%. Cushion is fixed.
          </div>
        </div>
      )}
    </div>
  );
}

function RangeBar({ worst, best, expected }) {
  // Show a horizontal range bar with 0, worst, expected, best markers
  // Range: from min(worst, 0) to best
  const lo = Math.min(worst, 0);
  const hi = Math.max(best, 0.001);
  const span = hi - lo;
  const pct = (v) => ((v - lo) / span) * 100;
  return (
    <div style={{ position: 'relative', height: 10 }}>
      {/* Track */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 4, height: 2,
        background: 'rgba(255,255,255,0.08)', borderRadius: 999,
      }} />
      {/* Range segment (worst → best) */}
      <div style={{
        position: 'absolute', top: 3, height: 4, borderRadius: 999,
        left: `${pct(worst)}%`, width: `${pct(best) - pct(worst)}%`,
        background: `linear-gradient(90deg, #FFB3A8 0%, #FFB547 ${pct(0) - pct(worst) > 0 ? ((pct(0) - pct(worst)) / (pct(best) - pct(worst)) * 100) : 0}%, ${KN.lime} 100%)`,
      }} />
      {/* Zero marker */}
      <div style={{
        position: 'absolute', top: -1, height: 12, width: 1.5,
        left: `${pct(0)}%`, background: 'rgba(229,243,234,0.5)',
      }} />
      {/* Expected marker */}
      <div style={{
        position: 'absolute', top: -2, height: 14, width: 2.5,
        left: `${pct(expected)}%`, background: '#fff',
        borderRadius: 1, transform: 'translateX(-50%)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: CONFIRM
// ─────────────────────────────────────────────────────────────
function BoldConfirm({ F, surplus, showWorstCase, volatility }) {
  const a = F.alloc;
  const total = projectedReturn(a.cushion, 0.04) + projectedReturn(a.stocks, 0.087);
  const worst = projectedReturn(a.cushion, 0.04) + worstCaseStocks(a.stocks, volatility);
  const best  = projectedReturn(a.cushion, 0.04) + bestCaseStocks(a.stocks, volatility);

  const rows = [
    { key: 'checking', label: 'Checking', sub: '0% · spend anytime', amount: a.checking, apy: 0, color: 'rgba(229,243,234,0.45)', icon: 'wallet' },
    { key: 'cushion',  label: 'Cushion',  sub: '4% HYSA · liquid',  amount: a.cushion,  apy: 0.04, color: KN.primary, icon: 'sofa' },
    { key: 'stocks',   label: 'S&P',      sub: '8.7% hist · vol',   amount: a.stocks,   apy: 0.087, color: KN.lime, icon: 'trending-up' },
  ];

  return (
    <div style={{ padding: '4px 20px 0' }}>
      <div style={{
        fontFamily: '"JetBrains Mono"', fontSize: 11, fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(229,243,234,0.5)',
      }}>STEP 02 · CONFIRM</div>

      <div style={{
        fontFamily: '"DM Sans"', fontSize: 32, fontWeight: 600,
        letterSpacing: '-0.028em', marginTop: 6, marginBottom: 22, lineHeight: 1.1,
      }}>
        In 6 months,<br />you'll have
      </div>

      {/* Hero number */}
      <div style={{
        padding: '24px 20px', borderRadius: 22,
        background: 'linear-gradient(135deg, rgba(15,204,122,0.15), rgba(45,212,191,0.05))',
        border: '1px solid rgba(45,212,191,0.25)',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 60, fontWeight: 600,
            letterSpacing: '-0.04em', color: KN.lime, lineHeight: 1.0,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ fontSize: 30, fontWeight: 500, opacity: 0.7, marginRight: 4 }}>+$</span>
            {total.toFixed(2)}
          </div>
        </div>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 13, color: 'rgba(229,243,234,0.6)',
          marginTop: 8,
        }}>
          on your {fmtMoney(surplus)} surplus, after 6 months
        </div>
        {showWorstCase && a.stocks > 0 && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <RangeBar worst={worst} best={best} expected={total} />
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 8,
              fontFamily: '"DM Sans"', fontSize: 12, fontVariantNumeric: 'tabular-nums',
            }}>
              <span style={{ color: '#FFB3A8' }}>Worst {fmtMoney(worst, { sign: true })}</span>
              <span style={{ color: KN.lime }}>Best {fmtMoney(best, { sign: true })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Route rows */}
      <div style={{
        padding: 4, borderRadius: 18,
        background: 'rgba(255,255,255,0.03)',
      }}>
        {rows.map((r, i) => (
          <BoldRow key={r.key} r={r} isLast={i === rows.length - 1} />
        ))}
      </div>
    </div>
  );
}

function BoldRow({ r, isLast }) {
  const ret = projectedReturn(r.amount, r.apy);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px', opacity: r.amount > 0 ? 1 : 0.4,
      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11,
        background: r.color === 'rgba(229,243,234,0.45)' ? 'rgba(255,255,255,0.08)' : `${r.color}22`,
        color: r.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <KnIcon name={r.icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 600,
          color: '#fff', letterSpacing: '-0.005em',
        }}>{r.label}</div>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 11, color: 'rgba(229,243,234,0.45)',
          marginTop: 1,
        }}>{r.sub}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 17, fontWeight: 600,
          fontVariantNumeric: 'tabular-nums', color: '#fff', letterSpacing: '-0.012em',
        }}>{fmtMoney(r.amount, { cents: false })}</div>
        {ret > 0 && (
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 11, color: KN.lime,
            fontVariantNumeric: 'tabular-nums', marginTop: 1, fontWeight: 500,
          }}>+{fmtMoney(ret)} in 6mo</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: GOAL
// ─────────────────────────────────────────────────────────────
function BoldGoal({ F }) {
  return (
    <div style={{ padding: '4px 20px 0' }}>
      <div style={{
        fontFamily: '"JetBrains Mono"', fontSize: 11, fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(229,243,234,0.5)',
      }}>STEP 03 · ROUTE</div>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 32, fontWeight: 600,
        letterSpacing: '-0.028em', marginTop: 6, marginBottom: 4, lineHeight: 1.1,
      }}>
        Where's it going?
      </div>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 14, color: 'rgba(229,243,234,0.55)', marginBottom: 22 }}>
        {fmtMoney(F.alloc.cushion, { cents: false })} into your Cushion.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CC_GOALS.map(g => (
          <BoldGoalCard key={g.id} g={g} selected={F.goalId === g.id}
            onClick={() => F.setGoalId(g.id)}
            extra={F.goalId === g.id ? F.alloc.cushion : 0} />
        ))}
      </div>

      <button style={{
        marginTop: 12, width: '100%', height: 48, borderRadius: 14, border: `1px dashed rgba(255,255,255,0.2)`,
        background: 'transparent', cursor: 'pointer', color: 'rgba(229,243,234,0.55)',
        fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <KnIcon name="plus" size={16} stroke={2.5} /> Create new cushion goal
      </button>
    </div>
  );
}

function BoldGoalCard({ g, selected, onClick, extra = 0 }) {
  const newSaved = g.saved + extra;
  const pct = Math.min(100, (newSaved / g.target) * 100);
  const oldPct = (g.saved / g.target) * 100;

  const accent = g.tone === 'primary' ? KN.primary
    : g.tone === 'coral' ? '#FF7A6B'
    : KN.lime;

  return (
    <div onClick={onClick} style={{
      background: selected ? 'rgba(45,212,191,0.08)' : 'rgba(255,255,255,0.04)',
      border: selected ? `1.5px solid ${KN.lime}` : '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, padding: 14, cursor: 'pointer',
      transition: 'all 220ms cubic-bezier(0.32, 0.72, 0, 1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11,
          background: `${accent}22`, color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <KnIcon name={g.icon} size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 15, fontWeight: 600,
            color: '#fff', letterSpacing: '-0.005em',
          }}>{g.name}</div>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 12, color: 'rgba(229,243,234,0.5)',
            marginTop: 1, fontVariantNumeric: 'tabular-nums',
          }}>
            {fmtMoney(g.saved, { cents: false })} / {fmtMoney(g.target, { cents: false })} · {g.eta}
          </div>
        </div>
        {selected && (
          <div style={{
            width: 22, height: 22, borderRadius: 999,
            background: KN.lime, color: KN.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <KnIcon name="check" size={13} stroke={3} />
          </div>
        )}
      </div>
      {/* progress */}
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${oldPct}%`, background: accent, borderRadius: 999,
        }} />
        {extra > 0 && (
          <div style={{
            position: 'absolute', left: `${oldPct}%`, top: 0, bottom: 0,
            width: `${pct - oldPct}%`,
            background: KN.lime, borderRadius: 999,
            animation: 'cc-shimmer 1.4s ease-in-out infinite',
          }} />
        )}
      </div>
      <style>{`
        @keyframes cc-shimmer { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: DONE
// ─────────────────────────────────────────────────────────────
function BoldDone({ F, surplus }) {
  const a = F.alloc;
  const total = projectedReturn(a.cushion, 0.04) + projectedReturn(a.stocks, 0.087);
  const goal = CC_GOALS.find(g => g.id === F.goalId);

  return (
    <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
      {/* Big check ring */}
      <div style={{
        width: 120, height: 120, borderRadius: 999,
        margin: '20px auto 28px',
        background: 'radial-gradient(circle, rgba(45,212,191,0.25) 0%, transparent 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 999, background: KN.lime, color: KN.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 16px 36px -8px rgba(45,212,191,0.6)',
          animation: 'cc-pop 480ms cubic-bezier(0.2, 0.9, 0.1, 1) both',
        }}>
          <KnIcon name="check" size={44} stroke={3} />
        </div>
      </div>

      <div style={{
        fontFamily: '"JetBrains Mono"', fontSize: 11, fontWeight: 500,
        letterSpacing: '0.08em', color: KN.lime,
      }}>COMPLETE · MAY ROUTED</div>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 36, fontWeight: 600,
        letterSpacing: '-0.032em', marginTop: 6, marginBottom: 8, lineHeight: 1,
      }}>
        Your {fmtMoney(surplus)}<br />is working.
      </div>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 14, color: 'rgba(229,243,234,0.55)',
        lineHeight: 1.5, marginBottom: 28, padding: '0 12px',
      }}>
        Estimated <span style={{ color: KN.lime, fontWeight: 600 }}>{fmtMoney(total, { sign: true })}</span> in 6 months.
      </div>

      <div style={{
        textAlign: 'left', padding: 4, borderRadius: 18,
        background: 'rgba(255,255,255,0.03)',
      }}>
        <BoldRow r={{ label: 'Checking', sub: 'Available now', amount: a.checking, apy: 0, color: 'rgba(229,243,234,0.45)', icon: 'wallet' }} />
        <BoldRow r={{ label: 'Cushion · ' + (goal?.name || 'HYSA'), sub: 'Routed', amount: a.cushion, apy: 0.04, color: KN.primary, icon: 'sofa' }} />
        <BoldRow r={{ label: 'S&P shares', sub: 'Settles in 2 days', amount: a.stocks, apy: 0.087, color: KN.lime, icon: 'trending-up' }} isLast />
      </div>

      <button onClick={F.reset} style={{
        marginTop: 24, background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'rgba(229,243,234,0.5)', fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 500,
      }}>
        ↻ Restart prototype
      </button>
    </div>
  );
}

window.BoldFlow = BoldFlow;
