// app.jsx — Top-level App component. Handles screen routing + responsive
// shell selection. Mobile shell has bottom tabs, desktop has sidebar nav.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "green",
  "showHero": true
}/*EDITMODE-END*/;

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { id: 'history',   label: 'Service',   icon: 'Wrench' },
  { id: 'fuel',      label: 'Fuel',      icon: 'Pump' },
  { id: 'vehicle',   label: 'Vehicle',   icon: 'Car' },
];

function App({ layout = 'mobile' }) {
  const auth = useAuth();
  const [tab, setTab] = React.useState('dashboard');
  const [sheet, setSheet] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const isDesktop = layout === 'desktop';

  if (!auth.user || !auth.data) {
    return (
      <div className="cmt-app" style={{ height: '100%' }}>
        <AuthScreen auth={auth} layout={layout} />
      </div>
    );
  }
  const data = auth.data;

  const onScroll = (e) => setScrolled(e.target.scrollTop > 4);

  const titleFor = (t) => ({
    dashboard: 'My Garage',
    history: 'Service',
    fuel: 'Fuel log',
    vehicle: 'Vehicle',
  })[t];

  const subFor = (t) => ({
    dashboard: `${data.vehicle.year} ${data.vehicle.model} · ${fmtMiles(data.vehicle.odometer)} mi`,
    history: `${data.upcoming.length} upcoming · ${data.recent.length} past`,
    fuel: `${data.fuel.length} fill-ups · ${data.energy.avgMpg} MPG avg`,
    vehicle: `${data.vehicle.year} ${data.vehicle.model}`,
  })[t];

  const screen = (() => {
    switch (tab) {
      case 'dashboard': return <Dashboard data={data} onAdd={() => setSheet(true)} onNavigate={setTab} layout={layout} />;
      case 'history':   return <HistoryScreen data={data} layout={layout} />;
      case 'fuel':      return <FuelScreen data={data} layout={layout} />;
      case 'vehicle':   return <VehicleScreen data={data} layout={layout} />;
      default:          return null;
    }
  })();

  // ────── Desktop shell ──────
  if (isDesktop) {
    return (
      <div className="cmt-app shell-desktop">
        <aside className="cmt-sidebar">
          <div className="cmt-sidebar-brand">
            <div className="cmt-sidebar-brand-mark">G</div>
            <span>Garage</span>
          </div>
          <div className="cmt-sidebar-section">
            <div className="cmt-sidebar-heading">Navigation</div>
            {NAV.map((n) => {
              const I = Icon[n.icon];
              return (
                <button key={n.id} className={`cmt-sidebar-link ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
                  <I />
                  <span>{n.label}</span>
                  {n.id === 'history' && <span className="badge warn">1</span>}
                </button>
              );
            })}
          </div>
          <div className="cmt-sidebar-section">
            <div className="cmt-sidebar-heading">Tools</div>
            <button className="cmt-sidebar-link">
              <Icon.Receipt /><span>Expenses</span>
            </button>
            <button className="cmt-sidebar-link">
              <Icon.Bell /><span>Reminders</span><span className="badge">3</span>
            </button>
            <button className="cmt-sidebar-link">
              <Icon.Settings /><span>Settings</span>
            </button>
          </div>
          <div className="cmt-sidebar-car">
            <div className="cmt-sidebar-car-row">
              <div className="cmt-sidebar-car-icon"><Icon.Car size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cmt-sidebar-car-name">{data.vehicle.year} {data.vehicle.model}</div>
                <div className="cmt-sidebar-car-meta">{fmtMiles(data.vehicle.odometer)} mi</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="cmt-main" onScroll={onScroll}>
          <div className={`cmt-topbar ${scrolled ? 'scrolled' : ''}`}>
            <div>
              <div className="cmt-page-title-lg">{titleFor(tab)}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{subFor(tab)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary"><Icon.Search size={15} /> Search</button>
              <button className="btn btn-primary" onClick={() => setSheet(true)}>
                <Icon.Plus size={15} /> Log service
              </button>
            </div>
          </div>
          {screen}
        </main>

        {sheet && (
          <div className="modal-backdrop" onClick={() => setSheet(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <AddServiceForm data={data} onClose={() => setSheet(false)} onSave={() => setSheet(false)} layout={layout} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ────── Mobile shell ──────
  return (
    <div className="cmt-app shell-mobile">
      <div className={`cmt-topbar ${scrolled ? 'scrolled' : ''}`}>
        <div>
          <div className="cmt-page-title">{titleFor(tab)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1, fontFamily: 'var(--font-mono)' }}>{subFor(tab)}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" style={{ width: 36, padding: 0 }}><Icon.Search size={16} /></button>
          <button className="btn btn-ghost btn-sm" style={{ width: 36, padding: 0, position: 'relative' }}>
            <Icon.Bell size={16} />
            <span style={{ position: 'absolute', top: 6, right: 7, width: 6, height: 6, borderRadius: 999, background: 'var(--bad)' }} />
          </button>
        </div>
      </div>

      <div className="cmt-main" onScroll={onScroll}>
        {screen}
      </div>

      <div className="cmt-tabs">
        {[NAV[0], NAV[1]].map((n) => {
          const I = Icon[n.icon];
          return (
            <button key={n.id} className={`cmt-tab ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <I size={22} />{n.label}
            </button>
          );
        })}
        <button className="cmt-tab cmt-tab-fab-wrap" onClick={() => setSheet(true)} style={{ flex: 0.7 }}>
          <span className="cmt-tab-fab"><Icon.Plus size={22} /></span>
        </button>
        {[NAV[2], NAV[3]].map((n) => {
          const I = Icon[n.icon];
          return (
            <button key={n.id} className={`cmt-tab ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <I size={22} />{n.label}
            </button>
          );
        })}
      </div>

      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grabber" />
            <AddServiceForm data={data} onClose={() => setSheet(false)} onSave={() => setSheet(false)} layout={layout} />
          </div>
        </div>
      )}
    </div>
  );
}

// ────── Responsive hook: tracks live viewport width ──────
const MOBILE_BREAKPOINT = 900;
function useLayout() {
  const get = () => (typeof window !== 'undefined' && window.innerWidth >= MOBILE_BREAKPOINT) ? 'desktop' : 'mobile';
  const [layout, setLayout] = React.useState(get);
  React.useEffect(() => {
    const onResize = () => setLayout(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return layout;
}

// ────── Root for the real responsive web app ──────
function ResponsiveRoot() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const layout = useLayout();

  React.useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', !!t.dark);
  }, [t.dark]);

  return (
    <>
      <App layout={layout} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakToggle label="Dark mode" value={!!t.dark} onChange={(v) => setTweak('dark', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ────── Root for the side-by-side design preview ──────
function PreviewRoot() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', !!t.dark);
  }, [t.dark]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="frames" title="Garage" subtitle="Same responsive web app, shown at two viewport sizes. Open Car Maintenance Tracker.html to use the live app.">
          <DCArtboard id="mobile" label="Mobile · iOS" width={402} height={874}>
            <div className="in-frame" style={{ width: '100%', height: '100%' }}>
              <IOSDevice dark={!!t.dark} width={402} height={874}>
                <App layout="mobile" />
              </IOSDevice>
            </div>
          </DCArtboard>
          <DCArtboard id="desktop" label="Desktop · Web" width={1280} height={820}>
            <ChromeWindow width={1280} height={820}
              tabs={[{ title: 'Garage' }]}
              activeIndex={0}
              url="garage.app/dashboard">
              <App layout="desktop" />
            </ChromeWindow>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakToggle label="Dark mode" value={!!t.dark} onChange={(v) => setTweak('dark', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const rootEl = document.getElementById('root');
const isPreview = rootEl.dataset.mode === 'preview';
ReactDOM.createRoot(rootEl).render(isPreview ? <PreviewRoot /> : <ResponsiveRoot />);
