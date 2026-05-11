// screens.jsx — Screen components: Dashboard, History, Fuel, Vehicle, AddService.

// ─── DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({ data, onAdd, onNavigate, layout }) {
  const isDesktop = layout === 'desktop';

  const Hero = (
    <div className="hero">
      <div className="hero-top">
        <div>
          <div className="hero-name">{data.vehicle.year} {data.vehicle.make} {data.vehicle.model}</div>
          <div className="hero-name-sub">{data.vehicle.trim} · {data.vehicle.plate}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill kind="info" dot={false}>PHEV</Pill>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div className="col col-gap-8">
          <div className="metric-label">Odometer</div>
          <div className="hero-odo">{fmtMiles(data.vehicle.odometer)}<span className="unit">mi</span></div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>+218 mi this week</div>
        </div>
        <HealthRing score={data.health.score} size={isDesktop ? 110 : 96} stroke={isDesktop ? 10 : 9} label="Score" />
      </div>
      <HybridGauges energy={data.energy} />
    </div>
  );

  const Upcoming = (
    <div>
      <SectionHead title="Up next" action="See all" onAction={() => onNavigate('history')} />
      <div className="card" style={{ padding: 6 }}>
        {data.upcoming.slice(0, isDesktop ? 5 : 4).map((u) => (
          <UpcomingRow key={u.id} item={u} />
        ))}
      </div>
    </div>
  );

  const Recent = (
    <div>
      <SectionHead title="Recent activity" action="History" onAction={() => onNavigate('history')} />
      <div className="card">
        {data.recent.slice(0, isDesktop ? 5 : 3).map((r) => (
          <ServiceRow key={r.id} item={r} />
        ))}
      </div>
    </div>
  );

  const Stats = (
    <div className={isDesktop ? 'stat-grid-4' : 'stat-grid'}>
      <MetricCard label="Avg MPGe" value={data.energy.avgMpge} sub="last 30 days" />
      <MetricCard label="Avg MPG" value={data.energy.avgMpg} sub="gas only" />
      <MetricCard label="$ / mile" value={data.expense.perMile.toFixed(3)} sub={`$${data.expense.ytd.toFixed(0)} YTD`} />
      <MetricCard label="Days since service" value={19} sub="last: oil change" />
    </div>
  );

  if (isDesktop) {
    return (
      <div className="content-desktop">
        <div className="dash-grid">
          <div className="col col-gap-20">
            {Hero}
            {Stats}
          </div>
          <div className="col col-gap-20">
            {Upcoming}
            {Recent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-mobile">
      {Hero}
      {Stats}
      {Upcoming}
      {Recent}
    </div>
  );
}

// ─── SERVICE HISTORY ──────────────────────────────────────────────────────
function HistoryScreen({ data, layout }) {
  const isDesktop = layout === 'desktop';
  const items = [...data.upcoming.map(u => ({ ...u, kind: 'upcoming' })),
                 ...data.recent.map(r => ({ ...r, kind: 'past' }))];

  return (
    <div className={isDesktop ? 'content-desktop' : 'content-mobile'}>
      <SectionHead title="Upcoming" />
      <div className="card" style={{ padding: 6 }}>
        {data.upcoming.map((u) => <UpcomingRow key={u.id} item={u} />)}
      </div>
      <SectionHead title="Past services" action="Filter" />
      <div className="card">
        {data.recent.map((r) => <ServiceRow key={r.id} item={r} />)}
      </div>
    </div>
  );
}

// ─── FUEL LOG ─────────────────────────────────────────────────────────────
function FuelScreen({ data, layout }) {
  const isDesktop = layout === 'desktop';
  const avg = data.energy.avgMpg;

  return (
    <div className={isDesktop ? 'content-desktop' : 'content-mobile'}>
      <div className={isDesktop ? 'stat-grid-4' : 'stat-grid'}>
        <MetricCard label="Avg MPG (gas)" value={avg} sub="last 5 fills" />
        <MetricCard label="Avg MPGe" value={data.energy.avgMpge} sub="combined" />
        <MetricCard label="Cost / fill" value={28.99} sub="avg" />
        <MetricCard label="$ this month" value={84.45} sub="-12% vs last" />
      </div>

      <SectionHead title="Recent fill-ups" action="Add fill-up" />
      <div className="card">
        {data.fuel.map((f) => (
          <div key={f.id} className="svc-row">
            <div className="svc-icon neutral"><Icon.Pump /></div>
            <div className="svc-body">
              <div className="svc-title">{f.station} · {f.gallons.toFixed(1)} gal</div>
              <div className="svc-meta">{relDate(f.date)} · {fmtMiles(f.mileage)} mi</div>
            </div>
            <div className="svc-aside">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 500 }}>
                <span style={{ color: f.mpg >= avg ? 'var(--ok)' : 'var(--muted)' }}>{f.mpg.toFixed(1)}</span>
                <span style={{ color: 'var(--muted)', marginLeft: 4, fontWeight: 400, fontSize: 11 }}>mpg</span>
              </div>
              <div className="svc-meta">{fmtMoney(f.total)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VEHICLE / DOCUMENTS ──────────────────────────────────────────────────
function VehicleScreen({ data, layout }) {
  const isDesktop = layout === 'desktop';
  const v = data.vehicle;
  return (
    <div className={isDesktop ? 'content-desktop' : 'content-mobile'}>
      <div className="card card-padded">
        <div className="col col-gap-16">
          <div className="photo-ph" style={{ aspectRatio: '16 / 9' }}>vehicle photo</div>
          <div className="col col-gap-8">
            <div className="hero-name">{v.year} {v.make} {v.model}</div>
            <div className="hero-name-sub">{v.trim} · {v.color}</div>
          </div>
        </div>
      </div>

      <SectionHead title="Specs" />
      <div className="card">
        {[
          ['VIN', v.vin],
          ['Plate', v.plate],
          ['Trim', v.trim],
          ['Color', v.color],
          ['Drivetrain', 'Plug-in hybrid · FWD'],
          ['Purchased', new Date(v.purchased).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
        ].map(([k, vv], i, arr) => (
          <div key={k} className="card-row">
            <div style={{ fontSize: 13, color: 'var(--muted)', flex: 1 }}>{k}</div>
            <div className="text-mono fw-500" style={{ fontSize: 13 }}>{vv}</div>
          </div>
        ))}
      </div>

      <SectionHead title="Documents" action="Add" />
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr', gap: 10 }}>
        {data.docs.map((d) => (
          <div key={d.id} className="doc-card">
            <div className="doc-icon"><Icon.Doc size={16} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="doc-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
              <div className="doc-meta">{d.issuer}{d.expires ? ` · expires ${new Date(d.expires).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}</div>
            </div>
            <Icon.ChevronRight size={14} style={{ color: 'var(--muted-2)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD SERVICE SHEET ────────────────────────────────────────────────────
function AddServiceForm({ data, onClose, onSave, layout }) {
  const [type, setType] = React.useState('oil');
  const [mileage, setMileage] = React.useState(String(data.vehicle.odometer));
  const [cost, setCost] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const types = [
    { id: 'oil',    label: 'Oil change',  icon: 'Drop' },
    { id: 'tire',   label: 'Tire',        icon: 'Tire' },
    { id: 'fuel',   label: 'Fill-up',     icon: 'Pump' },
    { id: 'filter', label: 'Filter',      icon: 'Filter' },
    { id: 'charge', label: 'Charge',      icon: 'Bolt' },
    { id: 'wash',   label: 'Wash',        icon: 'Sparkle' },
    { id: 'other',  label: 'Other',       icon: 'Wrench' },
  ];

  return (
    <div className="col col-gap-12">
      <div>
        <div className="sheet-title">Quick log</div>
        <div className="sheet-subtitle">Add a service or fill-up. Edit details later.</div>
      </div>

      <div className="field">
        <div className="field-label">Type</div>
        <div className="chip-group">
          {types.map((t) => {
            const I = Icon[t.icon];
            const active = type === t.id;
            return (
              <button key={t.id} className={`chip ${active ? 'active' : ''}`} onClick={() => setType(t.id)}>
                <I size={14} />{t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <div className="field-label">Mileage</div>
          <input className="field-input mono" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </div>
        <div className="field">
          <div className="field-label">Cost</div>
          <input className="field-input mono" placeholder="$0.00" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <div className="field-label">Notes (optional)</div>
        <input className="field-input" placeholder="e.g. Mobil 1 5W-30, full synthetic" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <button className="btn btn-secondary btn-block" style={{ height: 44, fontWeight: 500 }}>
        <Icon.Camera size={16} /> Scan receipt or attach photo
      </button>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1, height: 48 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2, height: 48 }} onClick={onSave}>
          <Icon.Check size={16} /> Save service
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, HistoryScreen, FuelScreen, VehicleScreen, AddServiceForm });
