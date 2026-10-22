// flow.jsx — Couch Cushion shared logic
// State machine for the month-end allocation flow + math helpers + AI rec.
// Exports: useFlow, CC_GOALS, fmtMoney, fmtMoneyCompact, projectedReturn,
//          worstCaseStocks, bestCaseStocks, aiRecommendation, RATES

const RATES = {
  checking: { apy: 0.00,  label: 'Checking',  short: 'Spending' },
  cushion:  { apy: 0.04,  label: 'Cushion',   short: 'HYSA' },
  stocks:   { apy: 0.087, label: 'S&P index', short: 'Invest' },
};

// 6-month projection, monthly compounding.
function projectedReturn(principal, apy) {
  if (apy === 0) return 0;
  const r = apy / 12;
  return principal * (Math.pow(1 + r, 6) - 1);
}

// Honest range for S&P 6mo (annual range -10%..+25% → roughly half).
// Volatility multiplier scales the spread.
function worstCaseStocks(principal, vol = 1) {
  // 6mo worst: -10% (matching the brief's annual band as approximate 6mo range)
  return principal * -0.10 * vol;
}
function bestCaseStocks(principal, vol = 1) {
  return principal * 0.25 * vol;
}

// AI recommendation. With a small surplus, lead with cushion (emergency cushion
// is the highest-EV move when you don't have one yet). Small skim to stocks
// for the upside.
function aiRecommendation(surplus, ctx = {}) {
  // ctx.emergencyHealth: 0..1 — how full the emergency cushion is
  const eh = ctx.emergencyHealth ?? 0.41; // matches Emergency goal default
  let cushion, stocks, checking;
  if (eh < 0.6) {
    // build the cushion: 75 / 15 / 10
    cushion  = Math.round(surplus * 0.75);
    stocks   = Math.round(surplus * 0.15);
  } else {
    cushion  = Math.round(surplus * 0.40);
    stocks   = Math.round(surplus * 0.50);
  }
  checking = surplus - cushion - stocks;
  if (checking < 0) { cushion += checking; checking = 0; }
  return { checking, cushion, stocks };
}

// Snap-equal-or-AI helpers
function evenSplit(total) {
  const each = Math.floor(total / 3);
  const rem = total - each * 3;
  return { checking: each + rem, cushion: each, stocks: each };
}

// Money formatting
function fmtMoney(n, { sign = false, cents = 'auto' } = {}) {
  const abs = Math.abs(n);
  const showCents = cents === true || (cents === 'auto' && abs < 100 && abs > 0 && abs % 1 !== 0);
  const opts = showCents
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : { maximumFractionDigits: 2 };
  const s = abs.toLocaleString('en-US', opts);
  const prefix = sign ? (n > 0 ? '+ $' : n < 0 ? '− $' : '$') : (n < 0 ? '− $' : '$');
  return prefix + s;
}

function fmtMoneyCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1000) return '$' + (abs / 1000).toFixed(1) + 'k';
  return '$' + Math.round(abs).toLocaleString('en-US');
}

// Cushion goals — used in goal-setup stage
const CC_GOALS = [
  {
    id: 'emergency',
    name: 'Emergency cushion',
    icon: 'shield',
    saved: 620,
    target: 1500,
    eta: 'Aug 2026',
    tone: 'primary',
    note: 'Recommended — building 3-month runway',
  },
  {
    id: 'vacation',
    name: 'Lisbon trip',
    icon: 'plane',
    saved: 1250,
    target: 2000,
    eta: 'Jul 2026',
    tone: 'coral',
    note: '63% there',
  },
  {
    id: 'laptop',
    name: 'New laptop',
    icon: 'laptop',
    saved: 80,
    target: 1200,
    eta: 'Apr 2027',
    tone: 'accent',
    note: 'Just started',
  },
];

// ──────────────────────────────────────────────────────────────
// useFlow — state machine for one phone
// ──────────────────────────────────────────────────────────────
function useFlow({ surplus, recommended }) {
  const [stage, setStage] = React.useState('notif'); // notif | decide | confirm | goal | done
  const [alloc, setAlloc] = React.useState(recommended);
  const [goalId, setGoalId] = React.useState('emergency');
  const [hasAcceptedAi, setHasAcceptedAi] = React.useState(false);

  // Reset to defaults when surplus changes (tweaks)
  React.useEffect(() => {
    setAlloc(recommended);
    setHasAcceptedAi(false);
  }, [surplus, recommended.checking, recommended.cushion, recommended.stocks]);

  // Constrained allocation setter — keeps sum === surplus.
  // 'pinned' = which key the user just moved; the other two absorb the delta.
  const setAllocFor = (key, value, pinned = null) => {
    const v = Math.max(0, Math.min(surplus, Math.round(value)));
    const others = ['checking', 'cushion', 'stocks'].filter(k => k !== key);
    const remaining = surplus - v;
    const oldSum = alloc[others[0]] + alloc[others[1]];

    let a = { ...alloc, [key]: v };
    if (oldSum === 0) {
      a[others[0]] = Math.floor(remaining / 2);
      a[others[1]] = remaining - a[others[0]];
    } else {
      // proportional
      const r0 = alloc[others[0]] / oldSum;
      a[others[0]] = Math.round(remaining * r0);
      a[others[1]] = remaining - a[others[0]];
    }
    setAlloc(a);
  };

  // Drag-divider variant — set two boundaries in the [0..surplus] strip
  // checking | cushion | stocks → boundaries b1, b2 with 0 <= b1 <= b2 <= surplus.
  const setBoundaries = (b1, b2) => {
    b1 = Math.max(0, Math.min(surplus, Math.round(b1)));
    b2 = Math.max(b1, Math.min(surplus, Math.round(b2)));
    setAlloc({
      checking: b1,
      cushion: b2 - b1,
      stocks: surplus - b2,
    });
  };

  const acceptAi = () => {
    setAlloc(recommended);
    setHasAcceptedAi(true);
  };

  const reset = () => {
    setStage('notif');
    setAlloc(recommended);
    setHasAcceptedAi(false);
  };

  return {
    stage, setStage,
    alloc, setAllocFor, setBoundaries,
    goalId, setGoalId,
    hasAcceptedAi, acceptAi,
    reset,
  };
}

Object.assign(window, {
  RATES, projectedReturn, worstCaseStocks, bestCaseStocks,
  aiRecommendation, evenSplit, fmtMoney, fmtMoneyCompact,
  CC_GOALS, useFlow,
});
