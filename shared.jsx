// shared.jsx — Small reusable building blocks shared across screens.

function HealthRing({ score = 86, size = 120, stroke = 10, label = 'Health' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 80 ? 'var(--ok)' : score >= 60 ? 'var(--warn)' : 'var(--bad)';
  return (
    <div className="ring-wrap" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--surface-2)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(.3,.7,.4,1)' }} />
      </svg>
      <div className="ring-center">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: size * 0.27, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em' }}>{score}</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 0.04, textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function Pill({ kind = 'neutral', children, dot = true }) {
  return (
    <span className={`pill ${kind}`}>
      {dot && kind !== 'neutral' && <span className="dot" />}
      {children}
    </span>
  );
}

function MetricCard({ label, value, unit, sub, accent }) {
  return (
    <div className="stat-card">
      <div className="metric">
        <div className="metric-label">{label}</div>
        <div className="metric-value" style={accent ? { color: `var(--${accent})` } : null}>
          {value}{unit && <span className="unit">{unit}</span>}
        </div>
        {sub && <div className="metric-sub">{sub}</div>}
      </div>
    </div>
  );
}

function Bar({ value, max = 100, kind = 'info' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="bar-track">
      <div className={`bar-fill ${kind}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function HybridGauges({ energy }) {
  return (
    <div className="gauges">
      <div className="gauge">
        <div className="gauge-top">
          <div className="gauge-icon ev"><Icon.Bolt /></div>
          <div className="gauge-label">Battery</div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--info)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
            {energy.batteryPercent}%
          </div>
        </div>
        <div className="gauge-value">
          {energy.evRangeMi}<span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4, fontWeight: 400 }}>mi EV</span>
        </div>
        <Bar value={energy.batteryPercent} kind="info" />
        <div className="gauge-sub">{energy.batteryKwh} / {energy.batteryCapacityKwh} kWh</div>
      </div>
      <div className="gauge">
        <div className="gauge-top">
          <div className="gauge-icon fuel"><Icon.Pump /></div>
          <div className="gauge-label">Fuel</div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-2)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
            {energy.fuelPercent}%
          </div>
        </div>
        <div className="gauge-value">
          {energy.fuelRangeMi}<span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4, fontWeight: 400 }}>mi gas</span>
        </div>
        <Bar value={energy.fuelPercent} kind="ok" />
        <div className="gauge-sub">{energy.fuelGallons} / {energy.fuelCapacity} gal</div>
      </div>
    </div>
  );
}

function UpcomingRow({ item, onClick }) {
  const IconC = Icon[item.icon] || Icon.Wrench;
  return (
    <div className="upnext-row" onClick={onClick}>
      <div className={`svc-icon ${item.status}`}><IconC /></div>
      <div className="upnext-body">
        <div className="upnext-title">{item.title}</div>
        <div className="upnext-meta">{item.detail}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Pill kind={item.status}>{item.dueLabel}</Pill>
      </div>
      <Icon.ChevronRight size={14} style={{ color: 'var(--muted-2)' }} />
    </div>
  );
}

function ServiceRow({ item, onClick }) {
  const IconC = Icon[item.icon] || Icon.Wrench;
  return (
    <div className="svc-row" onClick={onClick}>
      <div className={`svc-icon ${item.tag}`}><IconC /></div>
      <div className="svc-body">
        <div className="svc-title">{item.title}</div>
        <div className="svc-meta">{relDate(item.date)} · {item.shop}</div>
      </div>
      <div className="svc-aside">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 500, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{fmtMoney(item.cost)}</div>
        <div className="svc-meta">{fmtMiles(item.mileage)} mi</div>
      </div>
    </div>
  );
}

function SectionHead({ title, action, onAction }) {
  return (
    <div className="section-head">
      <div className="section-title">{title}</div>
      {action && <button className="section-action" onClick={onAction}>{action}</button>}
    </div>
  );
}

Object.assign(window, {
  HealthRing, Pill, MetricCard, Bar, HybridGauges, UpcomingRow, ServiceRow, SectionHead,
});
