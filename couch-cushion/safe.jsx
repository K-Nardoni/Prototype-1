// safe.jsx — Couch Cushion · Safe variation
// Full 4-stage flow inside an iOS frame: notification → decide → confirm → goal → done
// Visual: cream surface, white cards, soft sliders, friendly copy.

function SafeFlow({ surplus, showWorstCase, volatility }) {
  const recommended = React.useMemo(() => aiRecommendation(surplus), [surplus]);
  const F = useFlow({ surplus, recommended });

  return (
    <IOSDevice width={402} height={874}>
      <div style={{ height: '100%', background: KN.cream, position: 'relative', overflow: 'hidden' }}>
        {F.stage === 'notif' && <SafeNotif F={F} surplus={surplus} />}
        {F.stage !== 'notif' && (
          <SafeMain F={F} surplus={surplus} recommended={recommended}
            showWorstCase={showWorstCase} volatility={volatility} />
        )}
      </div>
    </IOSDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: notification (lock-screen takeover)
// ─────────────────────────────────────────────────────────────
function SafeNotif({ F, surplus }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #0F1A15 0%, #1F2E27 100%)',
      color: '#E5F3EA',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Lock-screen-y date readout */}
      <div style={{
        paddingTop: 96, textAlign: 'center',
        opacity: 0.9, letterSpacing: '-0.012em',
      }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Monday, May 26</div>
        <div style={{
          fontSize: 92, fontWeight: 200, letterSpacing: '-0.045em',
          lineHeight: 1, marginTop: 4,
          fontFeatureSettings: '"tnum"',
        }}>11:47</div>
      </div>

      {/* The push notification */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 12px 110px' }}>
        <div
          onClick={() => F.setStage('decide')}
          style={{
            background: 'rgba(40, 50, 44, 0.7)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: 22, padding: '14px 16px',
            cursor: 'pointer',
            animation: 'cc-notif-in 600ms cubic-bezier(0.32, 0.72, 0, 1) both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: 'linear-gradient(135deg, #0FCC7A, #2DD4BF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: KN.ink,
            }}>
              <KnIcon name="sparkles" size={13} />
            </div>
            <div style={{
              fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 500,
              flex: 1, color: 'rgba(255,255,255,0.95)',
            }}>Couch Cushion</div>
            <div style={{ fontSize: 12, opacity: 0.55 }}>now</div>
          </div>
          <div style={{ fontFamily: '"DM Sans"', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
            Your end of May summary
          </div>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 14, lineHeight: 1.4,
            opacity: 0.78,
          }}>
            You finished with {fmtMoney(surplus)} left over. Tap to see where it could go.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cc-notif-in {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main stages share a screen frame
// ─────────────────────────────────────────────────────────────
function SafeMain({ F, surplus, recommended, showWorstCase, volatility }) {
  const stages = ['decide', 'confirm', 'goal', 'done'];
  const stageIdx = stages.indexOf(F.stage);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
          background: '#fff', color: KN.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(15,26,21,0.06)',
        }}>
          <KnIcon name={F.stage === 'done' ? 'x' : 'arrow-left'} size={18} stroke={2.5} />
        </button>
        {/* Stepper */}
        <div style={{ display: 'flex', gap: 6 }}>
          {stages.map((s, i) => (
            <div key={s} style={{
              width: i === stageIdx ? 18 : 6, height: 6, borderRadius: 999,
              background: i <= stageIdx ? KN.primary : KN.line,
              transition: 'all 220ms cubic-bezier(0.32, 0.72, 0, 1)',
            }} />
          ))}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {F.stage === 'decide' && (
          <SafeDecide F={F} surplus={surplus} recommended={recommended}
            showWorstCase={showWorstCase} volatility={volatility} />
        )}
        {F.stage === 'confirm' && (
          <SafeConfirm F={F} surplus={surplus}
            showWorstCase={showWorstCase} volatility={volatility} />
        )}
        {F.stage === 'goal' && <SafeGoal F={F} />}
        {F.stage === 'done' && <SafeDone F={F} surplus={surplus} />}
      </div>

      {/* Footer CTA */}
      {F.stage !== 'done' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 25,
          padding: '12px 20px 38px',
          background: 'linear-gradient(180deg, rgba(229,243,234,0) 0%, rgba(229,243,234,0.96) 30%)',
        }}>
          <SafeCta F={F} />
        </div>
      )}
    </div>
  );
}

function SafeCta({ F }) {
  const labels = {
    decide:  'Continue',
    confirm: F.alloc.cushion > 0 ? 'Confirm & pick goal' : 'Confirm',
    goal:    'Move the money',
  };
  const next = {
    decide:  'confirm',
    confirm: F.alloc.cushion > 0 ? 'goal' : 'done',
    goal:    'done',
  };
  return (
    <KnButton variant="primary" size="md" full onClick={() => F.setStage(next[F.stage])}>
      {labels[F.stage]}
    </KnButton>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: DECIDE — surplus + AI rec + allocator + per-bucket cards
// ─────────────────────────────────────────────────────────────
function SafeDecide({ F, surplus, recommended, showWorstCase, volatility }) {
  return (
    <div style={{ padding: '4px 20px 0' }}>
      <KnEyebrow>END OF MONTH · MAY</KnEyebrow>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 26, fontWeight: 600,
        letterSpacing: '-0.022em', marginTop: 6, marginBottom: 4, lineHeight: 1.15,
      }}>
        You have <span style={{ color: KN.primary }}>{fmtMoney(surplus)}</span> left over.
      </div>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 14, color: KN.mute, marginBottom: 18 }}>
        Split it however you want. I'll show what each part would do in 6 months.
      </div>

      {/* AI recommendation card */}
      {!F.hasAcceptedAi && (
        <SafeAiCard recommended={recommended} surplus={surplus}
          onAccept={F.acceptAi} />
      )}

      {/* Allocator */}
      <div style={{ marginTop: F.hasAcceptedAi ? 8 : 20 }}>
        <KnEyebrow style={{ marginBottom: 12 }}>YOUR SPLIT · DRAG TO ADJUST</KnEyebrow>
        <StackedAllocator
          total={surplus}
          alloc={F.alloc}
          onChange={F.setBoundaries}
          colors={{ checking: KN.mute2, cushion: KN.primary, stocks: KN.lime }}
        />
      </div>

      {/* Per-bucket cards */}
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BucketCard
          tone="checking" amount={F.alloc.checking} total={surplus}
          title="Stay in checking"
          subtitle="Available to spend any time"
          apy={0}
          recommended={recommended.checking}
          isAiPick={recommended.checking > recommended.cushion && recommended.checking > recommended.stocks}
        />
        <BucketCard
          tone="cushion" amount={F.alloc.cushion} total={surplus}
          title="Cushion (HYSA)"
          subtitle="4.00% APY · withdraw any time"
          apy={0.04}
          recommended={recommended.cushion}
          isAiPick={recommended.cushion >= recommended.stocks && recommended.cushion >= recommended.checking}
        />
        <BucketCard
          tone="stocks" amount={F.alloc.stocks} total={surplus}
          title="Invest in S&P"
          subtitle="Historical 8.7%/yr · −10% to +25% range"
          apy={0.087}
          recommended={recommended.stocks}
          isAiPick={false}
          showWorstCase={showWorstCase}
          volatility={volatility}
        />
      </div>
    </div>
  );
}

function SafeAiCard({ recommended, surplus, onAccept }) {
  return (
    <div style={{
      position: 'relative',
      padding: 2, borderRadius: 22,
      background: 'linear-gradient(135deg, #0FCC7A 0%, #2DD4BF 100%)',
      boxShadow: '0 12px 28px -8px rgba(45,212,191,0.4)',
    }}>
      <div style={{
        background: '#0F1A15', color: '#E5F3EA',
        borderRadius: 20, padding: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 999,
            background: 'linear-gradient(135deg, #0FCC7A, #2DD4BF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: KN.ink,
          }}>
            <KnIcon name="sparkles" size={14} />
          </div>
          <KnEyebrow color={KN.lime}>MY SUGGESTION</KnEyebrow>
        </div>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
          Your emergency cushion is 41% full. I'd lean most of it there, leave a small stocks bet for upside.
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14,
        }}>
          <AiPill label="Checking" amount={recommended.checking} color={KN.mute2} />
          <AiPill label="Cushion"  amount={recommended.cushion}  color={KN.primary} />
          <AiPill label="Stocks"   amount={recommended.stocks}   color={KN.lime} />
        </div>
        <button onClick={onAccept} style={{
          background: KN.lime, color: KN.ink, border: 'none', cursor: 'pointer',
          height: 40, borderRadius: 999, width: '100%',
          fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 600,
          letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <KnIcon name="check" size={14} stroke={3} /> Use this split
        </button>
      </div>
    </div>
  );
}

function AiPill({ label, amount, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)', borderRadius: 12,
      padding: '8px 10px',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono"', fontSize: 9, fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: color, marginBottom: 3,
      }}>{label}</div>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 18, fontWeight: 600,
        letterSpacing: '-0.018em', color: '#fff',
        fontVariantNumeric: 'tabular-nums',
      }}>{fmtMoney(amount, { cents: false })}</div>
    </div>
  );
}

function BucketCard({ tone, amount, total, title, subtitle, apy, recommended, isAiPick, showWorstCase, volatility }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  const ret = projectedReturn(amount, apy);
  const retPct = apy === 0 ? 0 : ((Math.pow(1 + apy/12, 6) - 1) * 100);

  const tones = {
    checking: { bg: '#fff', bar: KN.mute2, accent: KN.mute, icon: 'wallet' },
    cushion:  { bg: '#fff', bar: KN.primary, accent: KN.primary, icon: 'sofa' },
    stocks:   { bg: '#fff', bar: KN.lime, accent: KN.limeDark, icon: 'trending-up' },
  }[tone];

  const isActive = amount > 0;

  return (
    <div style={{
      background: tones.bg, borderRadius: 20, padding: 16,
      boxShadow: isAiPick
        ? '0 4px 14px -2px rgba(15,204,122,0.18), 0 2px 4px -1px rgba(15,26,21,0.04)'
        : '0 4px 12px -2px rgba(15,26,21,0.08), 0 2px 4px -1px rgba(15,26,21,0.04)',
      border: isAiPick ? '1.5px solid rgba(15,204,122,0.3)' : 'none',
      opacity: isActive ? 1 : 0.62,
      transition: 'opacity 220ms cubic-bezier(0.32, 0.72, 0, 1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: tone === 'checking' ? KN.sunken : tone === 'cushion' ? KN.primarySoft : KN.accent50 || '#CCFBF1',
          color: tones.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <KnIcon name={tones.icon} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              fontFamily: '"DM Sans"', fontSize: 15, fontWeight: 600,
              letterSpacing: '-0.01em', color: KN.ink,
            }}>{title}</div>
          </div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: KN.mute, marginTop: 2 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 20, fontWeight: 600,
            letterSpacing: '-0.018em', color: KN.ink,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>{fmtMoney(amount, { cents: false })}</div>
          <div style={{
            fontFamily: '"JetBrains Mono"', fontSize: 10, color: KN.mute,
            marginTop: 4, letterSpacing: '0.05em',
          }}>{Math.round(pct)}%</div>
        </div>
      </div>

      {/* fill bar */}
      <div style={{ height: 4, background: KN.line2, borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: tones.bar,
          borderRadius: 999,
          transition: 'width 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        }} />
      </div>

      {/* 6-month return */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '8px 12px', background: KN.sunken, borderRadius: 12,
      }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: KN.mute }}>
          In 6 months
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: '"DM Sans"', fontSize: 15, fontWeight: 600,
            color: ret > 0 ? KN.moneyIn : KN.mute,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {ret > 0 ? '+ ' : ''}{fmtMoney(ret)}
          </span>
          <span style={{
            fontFamily: '"JetBrains Mono"', fontSize: 11,
            color: KN.mute, fontWeight: 500,
          }}>
            {retPct > 0 ? `+${retPct.toFixed(1)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* Risk band for stocks */}
      {tone === 'stocks' && amount > 0 && showWorstCase && (
        <div style={{ marginTop: 8, padding: '10px 12px', background: KN.warnSoft, borderRadius: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
          }}>
            <KnIcon name="alert-triangle" size={12} color={'#a87000'} />
            <div style={{
              fontFamily: '"JetBrains Mono"', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a87000',
            }}>HONEST RANGE · 6MO</div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: '"DM Sans"', fontSize: 13,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ color: KN.danger }}>
              Worst: {fmtMoney(worstCaseStocks(amount, volatility), { sign: true })}
            </span>
            <span style={{ color: KN.moneyIn }}>
              Best: {fmtMoney(bestCaseStocks(amount, volatility), { sign: true })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stacked allocator — horizontal bar with 2 drag handles
// ─────────────────────────────────────────────────────────────
function StackedAllocator({ total, alloc, onChange, colors }) {
  const barRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(null); // 'b1' | 'b2' | null

  const b1 = alloc.checking;
  const b2 = alloc.checking + alloc.cushion;

  const startDrag = (handle) => (e) => {
    e.preventDefault();
    setDragging(handle);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const rect = barRef.current.getBoundingClientRect();
      const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      const value = ratio * total;
      if (dragging === 'b1') {
        onChange(value, Math.max(value, b2));
      } else {
        onChange(Math.min(b1, value), value);
      }
    };
    const up = () => setDragging(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging, b1, b2, total, onChange]);

  const p1 = (b1 / total) * 100;
  const p2 = (b2 / total) * 100;
  const barH = 56;

  return (
    <div>
      <div ref={barRef} style={{
        position: 'relative', height: barH, borderRadius: 16,
        background: KN.line2, overflow: 'visible',
        touchAction: 'none', userSelect: 'none',
      }}>
        {/* Checking segment */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${p1}%`,
          background: colors.checking,
          borderRadius: '16px 0 0 16px',
          transition: dragging ? 'none' : 'width 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        }} />
        {/* Cushion segment */}
        <div style={{
          position: 'absolute', left: `${p1}%`, top: 0, bottom: 0,
          width: `${p2 - p1}%`,
          background: colors.cushion,
          transition: dragging ? 'none' : 'all 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        }} />
        {/* Stocks segment */}
        <div style={{
          position: 'absolute', left: `${p2}%`, top: 0, bottom: 0,
          right: 0,
          background: colors.stocks,
          borderRadius: '0 16px 16px 0',
          transition: dragging ? 'none' : 'all 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        }} />
        {/* Handle 1 */}
        <Handle x={p1} active={dragging === 'b1'} onDown={startDrag('b1')} />
        {/* Handle 2 */}
        <Handle x={p2} active={dragging === 'b2'} onDown={startDrag('b2')} />

        {/* Segment labels */}
        <SegLabel x={p1 / 2} text={fmtMoneyCompact(alloc.checking)} hide={p1 < 12} dark />
        <SegLabel x={(p1 + p2) / 2} text={fmtMoneyCompact(alloc.cushion)} hide={(p2 - p1) < 12} light />
        <SegLabel x={(p2 + 100) / 2} text={fmtMoneyCompact(alloc.stocks)} hide={(100 - p2) < 12} dark />
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        marginTop: 12, gap: 6,
      }}>
        <LegendDot color={colors.checking} label="Checking" />
        <LegendDot color={colors.cushion} label="Cushion" />
        <LegendDot color={colors.stocks} label="Stocks" />
      </div>
    </div>
  );
}

function Handle({ x, active, onDown }) {
  return (
    <div
      onPointerDown={onDown}
      style={{
        position: 'absolute', left: `${x}%`, top: -8, bottom: -8,
        width: 4, transform: 'translateX(-50%)',
        background: '#fff', borderRadius: 999,
        boxShadow: active
          ? '0 0 0 4px rgba(15,204,122,0.25), 0 4px 12px rgba(15,26,21,0.18)'
          : '0 2px 8px rgba(15,26,21,0.18)',
        cursor: 'ew-resize', touchAction: 'none',
        zIndex: 2,
        transition: active ? 'none' : 'box-shadow 200ms',
      }}
    >
      {/* invisible wider hit target */}
      <div style={{ position: 'absolute', inset: '-6px -16px' }} />
    </div>
  );
}

function SegLabel({ x, text, hide, dark, light }) {
  if (hide) return null;
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 600,
      color: light ? '#fff' : dark ? KN.ink : KN.ink,
      fontVariantNumeric: 'tabular-nums',
      pointerEvents: 'none',
      letterSpacing: '-0.01em',
    }}>{text}</div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: '"DM Sans"', fontSize: 12, color: KN.mute }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: CONFIRM — review summary + 6mo total return
// ─────────────────────────────────────────────────────────────
function SafeConfirm({ F, surplus, showWorstCase, volatility }) {
  const a = F.alloc;
  const totalReturn = projectedReturn(a.cushion, 0.04) + projectedReturn(a.stocks, 0.087);
  const worst = projectedReturn(a.cushion, 0.04) + worstCaseStocks(a.stocks, volatility);
  const best  = projectedReturn(a.cushion, 0.04) + bestCaseStocks(a.stocks, volatility);

  return (
    <div style={{ padding: '4px 20px 0' }}>
      <KnEyebrow>STEP 2 OF 3</KnEyebrow>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 26, fontWeight: 600,
        letterSpacing: '-0.022em', marginTop: 6, marginBottom: 18, lineHeight: 1.15,
      }}>
        Here's the plan.
      </div>

      <KnCard padding={0} style={{ overflow: 'hidden' }}>
        <ConfirmRow icon="wallet" iconBg={KN.sunken} iconFg={KN.mute}
          name="Stay in Checking" sub="0.00% APY"
          amount={a.checking} ret={0} />
        <Divider />
        <ConfirmRow icon="sofa" iconBg={KN.primarySoft} iconFg={KN.primary}
          name="Move to Cushion" sub="4.00% APY · withdraw any time"
          amount={a.cushion} ret={projectedReturn(a.cushion, 0.04)} />
        <Divider />
        <ConfirmRow icon="trending-up" iconBg={'#CCFBF1'} iconFg={KN.limeDark}
          name="Invest in S&P" sub="Historical 8.7%/yr"
          amount={a.stocks} ret={projectedReturn(a.stocks, 0.087)} />
      </KnCard>

      <div style={{ marginTop: 16 }}>
        <KnCard padding={16} dark>
          <KnEyebrow color={KN.lime}>IN 6 MONTHS · ESTIMATED</KnEyebrow>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 48, fontWeight: 600,
            letterSpacing: '-0.028em', marginTop: 6,
            fontVariantNumeric: 'tabular-nums', color: KN.lime,
          }}>
            {totalReturn > 0 ? '+' : ''}{fmtMoney(totalReturn)}
          </div>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 13, color: KN.mute2,
            marginTop: 4,
          }}>
            on your {fmtMoney(surplus)} surplus
          </div>

          {showWorstCase && a.stocks > 0 && (
            <div style={{
              marginTop: 16, padding: 12, borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                fontFamily: '"DM Sans"', fontSize: 13, marginBottom: 6,
              }}>
                <span style={{ color: KN.mute2 }}>Worst case</span>
                <span style={{ color: '#FFB3A8', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(worst, { sign: true })}
                </span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                fontFamily: '"DM Sans"', fontSize: 13,
              }}>
                <span style={{ color: KN.mute2 }}>Best case</span>
                <span style={{ color: KN.lime, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(best, { sign: true })}
                </span>
              </div>
              <div style={{
                fontFamily: '"DM Sans"', fontSize: 11, color: KN.mute2,
                marginTop: 8, lineHeight: 1.4,
              }}>
                Historical S&P 6-month range: −10% to +25%. Past performance isn't a guarantee.
              </div>
            </div>
          )}
        </KnCard>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${KN.line2}` }} />;
}

function ConfirmRow({ icon, iconBg, iconFg, name, sub, amount, ret }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', opacity: amount > 0 ? 1 : 0.5,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11, background: iconBg, color: iconFg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <KnIcon name={icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 500, color: KN.ink }}>{name}</div>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: KN.mute, marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: '"DM Sans"', fontSize: 16, fontWeight: 600,
          fontVariantNumeric: 'tabular-nums', color: KN.ink, letterSpacing: '-0.01em',
        }}>{fmtMoney(amount, { cents: false })}</div>
        {ret > 0 && (
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 11, color: KN.moneyIn,
            fontVariantNumeric: 'tabular-nums', marginTop: 1, fontWeight: 500,
          }}>+ {fmtMoney(ret)} in 6mo</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: GOAL — pick a cushion goal
// ─────────────────────────────────────────────────────────────
function SafeGoal({ F }) {
  return (
    <div style={{ padding: '4px 20px 0' }}>
      <KnEyebrow>CUSHION · STEP 3 OF 3</KnEyebrow>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 26, fontWeight: 600,
        letterSpacing: '-0.022em', marginTop: 6, marginBottom: 4, lineHeight: 1.15,
      }}>
        Where in your Cushion?
      </div>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 14, color: KN.mute, marginBottom: 18 }}>
        Routing <strong style={{ color: KN.ink }}>{fmtMoney(F.alloc.cushion, { cents: false })}</strong> to one of your goals.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CC_GOALS.map(g => (
          <GoalCard key={g.id} g={g} selected={F.goalId === g.id}
            onClick={() => F.setGoalId(g.id)}
            extra={F.goalId === g.id ? F.alloc.cushion : 0} />
        ))}
      </div>

      <button style={{
        marginTop: 12, width: '100%', height: 48, borderRadius: 14, border: `1.5px dashed ${KN.line}`,
        background: 'transparent', cursor: 'pointer', color: KN.mute,
        fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <KnIcon name="plus" size={16} stroke={2.5} /> New cushion goal
      </button>
    </div>
  );
}

function GoalCard({ g, selected, onClick, extra = 0 }) {
  const newSaved = g.saved + extra;
  const pct = Math.min(100, (newSaved / g.target) * 100);
  const oldPct = (g.saved / g.target) * 100;

  const tones = {
    primary: { bg: KN.primarySoft, fg: KN.primary, bar: KN.primary },
    coral:   { bg: KN.coralSoft,   fg: KN.coral500 || '#FF7A6B', bar: '#FF7A6B' },
    accent:  { bg: '#CCFBF1',       fg: KN.limeDark, bar: KN.lime },
  }[g.tone] || { bg: KN.sunken, fg: KN.ink, bar: KN.ink };

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 18, padding: 14,
      boxShadow: selected
        ? '0 0 0 2px ' + KN.primary + ', 0 4px 12px -2px rgba(15,26,21,0.08)'
        : '0 4px 12px -2px rgba(15,26,21,0.08), 0 2px 4px -1px rgba(15,26,21,0.04)',
      cursor: 'pointer',
      transition: 'box-shadow 220ms cubic-bezier(0.32, 0.72, 0, 1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11, background: tones.bg, color: tones.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <KnIcon name={g.icon} size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"DM Sans"', fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.005em', color: KN.ink,
          }}>{g.name}</div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: KN.mute, marginTop: 1 }}>
            {g.note} · target {fmtMoney(g.target, { cents: false })}
          </div>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          background: selected ? KN.primary : 'transparent',
          border: selected ? 'none' : `1.5px solid ${KN.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', flexShrink: 0,
        }}>
          {selected && <KnIcon name="check" size={13} stroke={3} />}
        </div>
      </div>

      {/* progress bar */}
      <div style={{ position: 'relative', height: 8, background: KN.line2, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${oldPct}%`,
          background: tones.bar,
          borderRadius: 999,
        }} />
        {extra > 0 && (
          <div style={{
            position: 'absolute', left: `${oldPct}%`, top: 0, bottom: 0,
            width: `${pct - oldPct}%`,
            background: 'repeating-linear-gradient(45deg, ' + tones.bar + ' 0 4px, ' + tones.fg + 'aa 4px 8px)',
            borderRadius: 999,
            animation: 'cc-shine 1.2s ease-in-out infinite',
          }} />
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 6,
        fontFamily: '"DM Sans"', fontSize: 11, fontVariantNumeric: 'tabular-nums',
      }}>
        <span style={{ color: KN.ink, fontWeight: 500 }}>
          {fmtMoney(g.saved, { cents: false })}
          {extra > 0 && <span style={{ color: KN.moneyIn, fontWeight: 600 }}> + {fmtMoney(extra, { cents: false })}</span>}
        </span>
        <span style={{ color: KN.mute }}>by {g.eta}</span>
      </div>

      <style>{`
        @keyframes cc-shine { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stage: DONE
// ─────────────────────────────────────────────────────────────
function SafeDone({ F, surplus }) {
  const a = F.alloc;
  const goal = CC_GOALS.find(g => g.id === F.goalId);

  return (
    <div style={{ padding: '40px 20px 0', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, borderRadius: 999,
        background: 'linear-gradient(135deg, #0FCC7A, #2DD4BF)',
        margin: '0 auto 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        boxShadow: '0 16px 36px -8px rgba(15,204,122,0.4)',
        animation: 'cc-pop 480ms cubic-bezier(0.2, 0.9, 0.1, 1) both',
      }}>
        <KnIcon name="check" size={48} stroke={3} />
      </div>

      <div style={{
        fontFamily: '"DM Sans"', fontSize: 26, fontWeight: 600,
        letterSpacing: '-0.022em', marginBottom: 8,
      }}>
        Routed.
      </div>
      <div style={{
        fontFamily: '"DM Sans"', fontSize: 14, color: KN.mute, lineHeight: 1.5,
        padding: '0 20px', marginBottom: 28,
      }}>
        {a.cushion > 0 && <>{fmtMoney(a.cushion, { cents: false })} to <strong style={{ color: KN.ink }}>{goal?.name}</strong>. </>}
        {a.stocks > 0 && <>{fmtMoney(a.stocks, { cents: false })} buying S&P shares. </>}
        I'll check in with you next month.
      </div>

      <KnCard padding={16} style={{ textAlign: 'left' }}>
        <ConfirmRow icon="wallet" iconBg={KN.sunken} iconFg={KN.mute}
          name="Checking" sub="Available now" amount={a.checking} ret={0} />
        {a.cushion > 0 && <><Divider />
          <ConfirmRow icon="sofa" iconBg={KN.primarySoft} iconFg={KN.primary}
            name="Cushion" sub={goal?.name || 'HYSA'} amount={a.cushion} ret={projectedReturn(a.cushion, 0.04)} />
        </>}
        {a.stocks > 0 && <><Divider />
          <ConfirmRow icon="trending-up" iconBg={'#CCFBF1'} iconFg={KN.limeDark}
            name="S&P investment" sub="Settling in 2 days" amount={a.stocks} ret={projectedReturn(a.stocks, 0.087)} />
        </>}
      </KnCard>

      <button onClick={F.reset} style={{
        marginTop: 24, background: 'transparent', border: 'none', cursor: 'pointer',
        color: KN.mute, fontFamily: '"DM Sans"', fontSize: 13, fontWeight: 500,
      }}>
        ↻ Restart prototype
      </button>

      <style>{`
        @keyframes cc-pop {
          0% { opacity: 0; transform: scale(0.6); }
          60% { transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

window.SafeFlow = SafeFlow;
